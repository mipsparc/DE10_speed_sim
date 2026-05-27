let rawData = [];
let tractionData = {};
let trainChart = null;

// シミュレーション管理用変数
let currentSpeedFloat = 0.0; // 小数点単位で滑らかに速度を内部管理
let simInterval = null;      // タイマー管理用

// DOM要素の取得
const notchSlider = document.getElementById('notch');
const notchVal = document.getElementById('notchVal');
const notchStatus = document.getElementById('notchStatus');

const passCountSlider = document.getElementById('passCount');
const passCountVal = document.getElementById('passCountVal');
const passWeightSlider = document.getElementById('passWeight');
const passWeightVal = document.getElementById('passWeightVal');

const freightCountSlider = document.getElementById('freightCount');
const freightCountVal = document.getElementById('freightCountVal');
const freightWeightSlider = document.getElementById('freightWeight');
const freightWeightVal = document.getElementById('freightWeightVal');

const currentSpeedSlider = document.getElementById('currentSpeed');
const currentSpeedVal = document.getElementById('currentSpeedVal');
const startBtn = document.getElementById('startBtn'); // 【新設】

// メーター表示要素
const dispCurrentSpeed = document.getElementById('dispCurrentSpeed'); // 【新設】
const dispTotalWeight = document.getElementById('dispTotalWeight');
const dispTotalRes = document.getElementById('dispTotalRes');
const dispTractive = document.getElementById('dispTractive');
const dispTractiveSub = document.getElementById('dispTractiveSub');
const dispStatus = document.getElementById('dispStatus');
const dispStatusSub = document.getElementById('dispStatusSub');
const tractiveCard = document.getElementById('tractiveCard');
const balanceCard = document.getElementById('balanceCard');

// 初期化
async function init() {
    setupListeners();

    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error("data.json 取得失敗");
        rawData = await response.json();

        const tracResponse = await fetch('traction_data.json');
        if (!tracResponse.ok) throw new Error("traction_data.json 取得失敗");
        tractionData = await tracResponse.json();

        updateCalculations();
    } catch (error) {
        console.error("データのフェッチに失敗しました:", error);
        dispTotalRes.innerHTML = '<span style="font-size:12px;color:#dc2626;">データ読込失敗</span>';
        dispStatus.innerText = "エラー";
        dispStatusSub.innerText = "data.json と traction_data.json の配置を確認してください";
    }
}

function setupListeners() {
    // 【新設】スタート / 一時停止ボタンのトグルイベント
    startBtn.addEventListener('click', toggleSimulation);

    notchSlider.addEventListener('input', (e) => {
        const notch = parseInt(e.target.value);
        notchVal.innerText = notch;
        if (notch === 0) {
            notchStatus.innerText = " (惰行)";
        } else {
            notchStatus.innerText = " (力行 " + notch + " 段)";
        }
        updateCalculations();
    });

    passCountSlider.addEventListener('input', (e) => {
        const count = parseInt(e.target.value);
        passCountVal.innerText = count;
        passWeightSlider.value = count * 40;
        passWeightVal.innerText = count * 40;
        updateCalculations();
    });
    passWeightSlider.addEventListener('input', (e) => {
        passWeightVal.innerText = e.target.value;
        updateCalculations();
    });

    freightCountSlider.addEventListener('input', (e) => {
        const count = parseInt(e.target.value);
        freightCountVal.innerText = count;
        freightWeightSlider.value = count * 25;
        freightWeightVal.innerText = count * 25;
        updateCalculations();
    });
    freightWeightSlider.addEventListener('input', (e) => {
        freightWeightVal.innerText = e.target.value;
        updateCalculations();
    });

    // 手動で速度調整バーを動かした時は、自動シミュレーションの内部速度も同期して上書きする
    currentSpeedSlider.addEventListener('input', (e) => {
        currentSpeedFloat = parseFloat(e.target.value);
        currentSpeedVal.innerText = e.target.value;
        updateCalculations();
    });
}

// 【新設】シミュレーションの開始・一時停止制御
function toggleSimulation() {
    if (simInterval) {
        // 一時停止する
        clearInterval(simInterval);
        simInterval = null;
        startBtn.innerText = "運転再開 (スタート)";
        startBtn.classList.remove('running');
    } else {
        // 1秒(1000ms)おきに物理計算ステップを実行する
        simInterval = setInterval(simulationStep, 1000);
        startBtn.innerText = "一時停止";
        startBtn.classList.add('running');
    }
}

// 【新設】毎秒実行される、ニュートンの運動方程式に基づく列車加減速の物理計算
function simulationStep() {
    if (!rawData || !rawData.length || !tractionData || Object.keys(tractionData).length === 0) return;

    const notch = parseInt(notchSlider.value);
    const isPower = notch > 0;
    const passWeight = parseFloat(passWeightSlider.value);
    const freightWeight = parseFloat(freightWeightSlider.value);

    // 列車全体の総重量 [トン]
    const totalWeight = 65 + passWeight + freightWeight;

    // データは1km/h刻みのため、現在の浮動小数点数速度を四捨五入した整数インデックスでその瞬間の抵抗・引張力を特定
    const vIdx = Math.round(currentSpeedFloat);
    const item = rawData[vIdx];
    if (!item) return;

    // 現在の総走行抵抗の計算
    const locoRes = isPower ? item.loco_power : item.loco_coast;
    const passRes = item.passenger_specific * passWeight;
    const freightRes = item.freight_specific * freightWeight;
    const totalRes = locoRes + passRes + freightRes;

    // 現在のノッチ・速度の実車引張力をJSONデータから正確にルックアップ
    const tForce = getTractiveForceFromJSON(vIdx, notch);

    // 列車を加速（または減速）させる正味の力 [kg] (引張力 - 走行抵抗)
    const netForce = tForce - totalRes;

    // 【運動方程式の適用】1秒あたりの速度変化 ΔV [km/h] を算出
    // 公式: a [m/s^2] = F_net[kg]*9.8 / (重量[t]*1000 * 1.1[回転部慣性補正率])
    // km/h換算: ΔV = a * 3.6 ＝ (F_net * 35.28) / (重量 * 1100)
    const deltaV = (netForce * 35.28) / (totalWeight * 1100);

    // 内部速度を更新
    currentSpeedFloat += deltaV;

    // 最高速・停車時のリミッター制限 (0km/h 〜 85km/h)
    if (currentSpeedFloat > 85.0) currentSpeedFloat = 85.0;
    if (currentSpeedFloat < 0.0) currentSpeedFloat = 0.0;

    // 手動調整用バーのつまみの位置、およびテキストも自動で同期して動かす
    const roundedSpeed = Math.round(currentSpeedFloat);
    currentSpeedSlider.value = roundedSpeed;
    currentSpeedVal.innerText = roundedSpeed;

    // 計算と画面表示・グラフを再描画
    updateCalculations();
}

function getTractiveForceFromJSON(speed, notch) {
    if (notch === 0) return 0;
    const notchStr = String(notch);
    const speedStr = speed + ".0";
    if (tractionData[notchStr] && tractionData[notchStr][speedStr] !== undefined) {
        return parseFloat(tractionData[notchStr][speedStr]);
    }
    return 0;
}

// メイン計算＆レンダリング
function updateCalculations() {
    if (!rawData || !rawData.length || !tractionData || Object.keys(tractionData).length === 0) return;

    const notch = parseInt(notchSlider.value);
    const isPower = notch > 0;
    const passWeight = parseFloat(passWeightSlider.value);
    const freightWeight = parseFloat(freightWeightSlider.value);

    // 今回はスライドバーの丸まった整数値ではなく、内部の正確な高精度浮動小数点数（currentSpeedFloat）を元に描画・連動させる
    const currentSpeed = Math.round(currentSpeedFloat);

    const totalWeight = 65 + passWeight + freightWeight;
    dispTotalWeight.innerHTML = totalWeight + ' <span class="m-unit">t</span>';

    // 【新設】デジタルスピードメーターへ、小数点第1桁まで超滑らかにリアルタイム表示！
    dispCurrentSpeed.innerHTML = currentSpeedFloat.toFixed(1) + ' <span class="m-unit">km/h</span>';

    const resistancePoints = [];
    const tractivePoints = [];
    let curTotalRes = 0;
    let curTractive = 0;
    let balancedSpeed = -1;

    rawData.forEach(item => {
        const locoRes = isPower ? item.loco_power : item.loco_coast;
        const passRes = item.passenger_specific * passWeight;
        const freightRes = item.freight_specific * freightWeight;
        const totalRes = locoRes + passRes + freightRes;

        resistancePoints.push({ x: item.speed, y: totalRes });

        const tForce = getTractiveForceFromJSON(item.speed, notch);
        tractivePoints.push({ x: item.speed, y: tForce });

        if (item.speed === currentSpeed) {
            curTotalRes = totalRes;
            curTractive = tForce;
        }

        if (isPower && balancedSpeed === -1 && item.speed > 1) {
            if (tForce < totalRes) {
                balancedSpeed = item.speed;
            }
        }
    });

    dispTotalRes.innerHTML = curTotalRes.toLocaleString(undefined, {maximumFractionDigits:1}) + ' <span class="m-unit">kg</span>';

    if (isPower) {
        dispTractive.innerHTML = curTractive.toLocaleString(undefined, {maximumFractionDigits:1}) + ' <span class="m-unit">kg</span>';
        dispTractiveSub.innerText = "ノッチ " + notch + " 実車特性";
        tractiveCard.style.opacity = "1";

        const netForce = curTractive - curTotalRes;
        if (netForce > 10) {
            dispStatus.innerText = "加速中";
            dispStatus.className = "meter-value text-trac-green";
            dispStatusSub.innerText = "加速余力: +" + Math.round(netForce) + " kg";
        } else if (netForce < -10) {
            dispStatus.innerText = "力不足/減速";
            dispStatus.className = "meter-value text-res-red";
            dispStatusSub.innerText = "減速傾向: " + Math.round(netForce) + " kg";
        } else {
            dispStatus.innerText = "均衡状態";
            dispStatus.className = "meter-value";
            dispStatusSub.innerText = "速度維持";
        }

        if (balancedSpeed !== -1) {
            dispStatusSub.innerText = "加速余力: " + Math.round(netForce) + " kg (均衡速度: 約" + balancedSpeed + "km/h)";
        } else if (getTractiveForceFromJSON(85, notch) > resistancePoints[resistancePoints.length-1].y) {
            dispStatusSub.innerText = "加速余力: " + Math.round(netForce) + " kg (85km/h以上まで加速可能)";
        }
    } else {
        dispTractive.innerHTML = '0 <span class="m-unit">kg</span>';
        dispTractiveSub.innerText = "主幹制御器 0段";
        tractiveCard.style.opacity = "0.5";

        if (currentSpeed === 0) {
            dispStatus.innerText = "停車";
            dispStatus.className = "meter-value text-muted";
            dispStatusSub.innerText = "出発抵抗(静止摩擦): " + Math.round(curTotalRes) + " kg";
        } else {
            dispStatus.innerText = "惰性減速中";
            dispStatus.className = "meter-value text-muted";
            dispStatusSub.innerText = "減速抵抗: -" + Math.round(curTotalRes) + " kg";
        }
    }

    const pinRes = [{ x: currentSpeed, y: curTotalRes }];
    const pinTrac = isPower ? [{ x: currentSpeed, y: curTractive }] : [];

    updateChart(resistancePoints, tractivePoints, pinRes, pinTrac, isPower);
}

function updateChart(resData, tracData, pinRes, pinTrac, isPower) {
    const ctx = document.getElementById('trainChart').getContext('2d');
    const styles = getComputedStyle(document.documentElement);

    const colorRes = styles.getPropertyValue('--accent-res-red').trim();
    const colorTrac = styles.getPropertyValue('--accent-main').trim();
    const colorPin = styles.getPropertyValue('--accent-pin-purple').trim();
    const colorText = styles.getPropertyValue('--text-main').trim();
    const colorGrid = styles.getPropertyValue('--border-color').trim();

    const datasets = [
        {
            label: '列車総走行抵抗 (kg)',
            data: resData,
            borderColor: colorRes,
            backgroundColor: colorRes + '0d',
            borderWidth: 3,
            pointRadius: 0,
            fill: true,
            tension: 0.1
        },
        {
            label: '現在速度の抵抗位置',
            data: pinRes,
            borderColor: colorPin,
            backgroundColor: colorPin,
            pointRadius: 6,
            showLine: false
        }
    ];

    if (isPower) {
        datasets.unshift({
            label: 'DE10形実車引張力 (kg)',
            data: tracData,
            borderColor: colorTrac,
            backgroundColor: colorTrac + '0d',
            borderWidth: 3,
            pointRadius: 0,
            fill: true,
            tension: 0.1
        });
        datasets.push({
            label: '現在速度の引張力位置',
            data: pinTrac,
            borderColor: colorPin,
            backgroundColor: colorPin,
            pointRadius: 6,
            showLine: false
        });
    }

    if (trainChart) {
        trainChart.destroy();
    }

    trainChart = new Chart(ctx, {
        type: 'line',
        data: { datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: { labels: { color: colorText } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label.split('(')[0] + ': ' + context.raw.y.toFixed(1) + ' kg';
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: 85,
                    grid: { color: colorGrid },
                    ticks: {
                        color: styles.getPropertyValue('--text-muted').trim(),
                        stepSize: 10,
                        callback: function(value) { return value + ' km/h'; }
                    },
                    title: { display: true, text: '列車速度', color: colorText }
                },
                y: {
                    grid: { color: colorGrid },
                    ticks: { color: styles.getPropertyValue('--text-muted').trim() },
                    title: { display: true, text: '力 [kg]', color: colorText }
                }
            }
        }
    });
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

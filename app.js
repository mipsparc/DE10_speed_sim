let vehicleData = null;      // data.json から取得する車両諸元
let tractionData = null;     // traction_data.json から取得する引張力データ
let currentMode = "mainline"; // 'mainline' または 'shunting'
let currentNotch = 0;
let currentSpeed = 0.0;
let chartInstance = null;

// ==========================================
// 1. JSONデータのロード
// ==========================================
async function loadAllData() {
  try {
    const [resVehicle, resTraction] = await Promise.all([
      fetch("./running resistance.json"),
      fetch("./traction_data.json")
    ]);

    if (!resVehicle.ok || !resTraction.ok) {
      throw new Error("JSONファイルの取得に失敗しました。");
    }

    vehicleData = await resVehicle.json();
    tractionData = await resTraction.json();

    // 読み込み完了後にUIとチャートを初期化
    initApp();
  } catch (error) {
    console.error("データ読み込みエラー:", error);
    const statusElem = document.getElementById("train-status");
    if (statusElem) {
      statusElem.textContent = "エラー: data.json と traction_data.json の配置を確認してください。";
      statusElem.className = "status-error";
    }
  }
}

// ==========================================
// 2. 引張力と走行抵抗の計算ロジック
// ==========================================

// 引張力取得 (traction_data.json を活用)
function getTractiveEffort(speed, notch, mode = currentMode) {
  if (!tractionData || notch <= 0) return 0;
  const modeData = tractionData[mode];
  const table = modeData.notches[String(notch)];
  if (!table) return 0;

  if (speed <= 0) return table[0];
  if (speed >= modeData.maxSpeed) return 0;

  const vFloor = Math.floor(speed);
  const vCeil = Math.min(vFloor + 1, modeData.maxSpeed);
  const ratio = speed - vFloor;

  const f0 = table[vFloor] ?? 0;
  const f1 = table[vCeil] ?? 0;

  return f0 + (f1 - f0) * ratio;
}

// 走行抵抗計算 (running resistance.json の諸元を活用)
function calculateRunningResistance(speed) {
  if (!vehicleData) return 0;

  // data.json 内の機関車重量や抵抗パラメータを取得
  const locoWeight = vehicleData.locomotive?.weight || 65.0; // DE10: 65t
  
  // 機関車抵抗 (kgf)
  const r_loco = (1.8 + 0.015 * speed + 0.00035 * speed * speed) * locoWeight;

  // 画面入力値（客車両数・勾配）の取得
  const carCount = parseInt(document.getElementById("car-count")?.value, 10) || 0;
  const gradient = parseFloat(document.getElementById("gradient")?.value) || 0.0;
  
  // 客車重量（data.json に定義された客車タイプから参照、または固定値）
  const carWeightPerUnit = vehicleData.carTypes?.defaultWeight || 32.0;
  const totalCarWeight = carCount * carWeightPerUnit;

  // 客車抵抗 (kgf)
  let r_cars = 0;
  if (totalCarWeight > 0) {
    r_cars = (1.6 + 0.008 * speed + 0.00025 * speed * speed) * totalCarWeight;
  }

  // 勾配抵抗 (kgf) = 総重量(t) * 勾配(‰)
  const r_grad = (locoWeight + totalCarWeight) * gradient;

  return r_loco + r_cars + r_grad;
}

// ==========================================
// 3. UI・グラフの更新
// ==========================================
function updateDashboard() {
  if (!tractionData || !vehicleData) return;

  const activeMode = tractionData[currentMode];
  const maxSpeed = activeMode.maxSpeed;

  const te = getTractiveEffort(currentSpeed, currentNotch, currentMode);
  const rr = calculateRunningResistance(currentSpeed);

  // 数値反映
  const teElem = document.getElementById("traction-display");
  if (teElem) teElem.textContent = currentNotch > 0 ? `\${Math.round(te)} kg` : "--- kg";

  const rrElem = document.getElementById("resistance-display");
  if (rrElem) rrElem.textContent = `\${Math.round(rr)} kg`;

  // グラフX軸をモード上限に合わせて更新
  if (chartInstance) {
    chartInstance.options.scales.x.max = maxSpeed;
    
    const labels = [];
    const teData = [];
    const rrData = [];
    for (let v = 0; v <= maxSpeed; v++) {
      labels.push(v);
      teData.push(getTractiveEffort(v, currentNotch, currentMode));
      rrData.push(Math.round(calculateRunningResistance(v)));
    }
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = teData;
    chartInstance.data.datasets[1].data = rrData;
    chartInstance.update();
  }
}

// ==========================================
// 4. 初期化処理
// ==========================================
function initApp() {
  // モード切替の監視
  const modeSelect = document.getElementById("gear-mode");
  if (modeSelect) {
    modeSelect.addEventListener("change", (e) => {
      currentMode = e.target.value;
      const maxV = tractionData[currentMode].maxSpeed;

      const speedSlider = document.getElementById("speed-slider");
      if (speedSlider) {
        speedSlider.max = maxV;
        if (currentSpeed > maxV) {
          currentSpeed = maxV;
          speedSlider.value = maxV;
        }
      }
      updateDashboard();
    });
  }

  // その他のUI入力イベント設定
  document.getElementById("notch-slider")?.addEventListener("input", (e) => {
    currentNotch = parseInt(e.target.value, 10);
    updateDashboard();
  });

  document.getElementById("speed-slider")?.addEventListener("input", (e) => {
    currentSpeed = parseFloat(e.target.value);
    updateDashboard();
  });

  document.getElementById("car-count")?.addEventListener("input", updateDashboard);
  document.getElementById("gradient")?.addEventListener("input", updateDashboard);

  initChart();
  updateDashboard();
}

// 起動
document.addEventListener("DOMContentLoaded", loadAllData);

// ==========================================
// 1. 車両諸元定義
// ==========================================
const VEHICLE_DATA = {
  locomotive: { weight: 65.0 }, // DE10 (65t)
  carTypes: {
    "12kei": { name: "12系客車", weight: 32.0, bearing: "roller" },
    "14kei": { name: "14系客車", weight: 32.5, bearing: "roller" },
    "50kei": { name: "50系客車", weight: 28.0, bearing: "roller" },
    "koki50000": { name: "コキ50000(積車)", weight: 44.0, bearing: "roller" },
    "koki_empty": { name: "コキ50000(空車)", weight: 15.0, bearing: "roller" },
    "wam80000": { name: "ワム80000(積車)", weight: 25.0, bearing: "plain" }
  }
};

// ==========================================
// 2. 引張力データ (入換 0-45 / 本線 0-85)
// ==========================================
const TRACTION_DATA = {
  shunting: {
    maxSpeed: 45,
    notches: {
      "1": [4500, 4130, 3760, 3390, 3020, 2650, 2280, 1910, 1540, 1170, 800, 765, 730, 695, 660, 625, 590, 555, 520, 485, 450, 435, 420, 405, 390, 375, 360, 345, 330, 315, 300, 288, 276, 264, 252, 240, 228, 216, 204, 192, 180, 168, 156, 144, 132, 120],
      "2": [7000, 6440, 5880, 5320, 4760, 4200, 3640, 3080, 2520, 1960, 1400, 1335, 1270, 1205, 1140, 1075, 1010, 945, 880, 815, 750, 725, 700, 675, 650, 625, 600, 575, 550, 525, 500, 480, 460, 440, 420, 400, 380, 360, 340, 320, 300, 280, 260, 240, 220, 200],
      "3": [9600, 8840, 8080, 7320, 6560, 5800, 5040, 4280, 3520, 2760, 2000, 1905, 1810, 1715, 1620, 1525, 1430, 1335, 1240, 1145, 1050, 1015, 980, 945, 910, 875, 840, 805, 770, 735, 700, 675, 650, 625, 600, 575, 550, 525, 500, 475, 450, 425, 400, 375, 350, 325],
      "4": [12200, 11250, 10300, 9350, 8400, 7450, 6500, 5550, 4600, 3650, 2700, 2570, 2440, 2310, 2180, 2050, 1920, 1790, 1660, 1530, 1400, 1353, 1305, 1258, 1210, 1163, 1115, 1068, 1020, 973, 925, 893, 860, 828, 795, 763, 730, 698, 665, 633, 600, 568, 535, 503, 470, 438],
      "5": [14800, 13675, 12550, 11425, 10300, 9175, 8050, 6925, 5800, 4675, 3550, 3380, 3210, 3040, 2870, 2700, 2530, 2360, 2190, 2020, 1850, 1791, 1732, 1673, 1614, 1555, 1496, 1437, 1378, 1319, 1260, 1224, 1188, 1152, 1116, 1080, 1044, 1008, 972, 936, 900, 864, 828, 792, 756, 720],
      "6": [17400, 16100, 14800, 13500, 12200, 10900, 9600, 8300, 7000, 5700, 4400, 4190, 3980, 3770, 3560, 3350, 3140, 2930, 2720, 2510, 2300, 2230, 2160, 2090, 2020, 1950, 1880, 1810, 1740, 1670, 1600, 1560, 1520, 1480, 1440, 1400, 1360, 1320, 1280, 1240, 1200, 1160, 1120, 1080, 1040, 1000],
      "7": [18500, 17230, 15960, 14690, 13420, 12150, 10880, 9610, 8340, 7070, 5800, 5520, 5240, 4960, 4680, 4400, 4120, 3840, 3560, 3280, 3000, 2900, 2800, 2700, 2600, 2500, 2400, 2300, 2200, 2100, 2000, 1950, 1900, 1850, 1800, 1750, 1700, 1650, 1600, 1550, 1500, 1450, 1400, 1350, 1300, 1250],
      "8": [19500, 18270, 17040, 15810, 14580, 13350, 12120, 10890, 9660, 8430, 7200, 6850, 6500, 6150, 5800, 5450, 5100, 4750, 4400, 4050, 3700, 3570, 3440, 3310, 3180, 3050, 2920, 2790, 2660, 2530, 2400, 2340, 2280, 2220, 2160, 2100, 2040, 1980, 1920, 1860, 1800, 1740, 1680, 1620, 1560, 1500],
      "9": [19500, 18400, 17300, 16200, 15100, 14000, 12900, 11800, 10700, 9600, 8500, 8105, 7710, 7315, 6920, 6525, 6130, 5735, 5340, 4945, 4550, 4405, 4260, 4115, 3970, 3825, 3680, 3535, 3390, 3245, 3100, 3030, 2960, 2890, 2820, 2750, 2680, 2610, 2540, 2470, 2400, 2330, 2260, 2190, 2120, 2050],
      "10": [19500, 18530, 17560, 16590, 15620, 14650, 13680, 12710, 11740, 10770, 9800, 9360, 8920, 8480, 8040, 7600, 7160, 6720, 6280, 5840, 5400, 5240, 5080, 4920, 4760, 4600, 4440, 4280, 4120, 3960, 3800, 3720, 3640, 3560, 3480, 3400, 3320, 3240, 3160, 3080, 3000, 2920, 2840, 2760, 2680, 2600],
      "11": [19500, 18725, 17950, 17175, 16400, 15625, 14850, 14075, 13300, 12525, 11750, 11235, 10720, 10205, 9690, 9175, 8660, 8145, 7630, 7115, 6600, 6390, 6180, 5970, 5760, 5550, 5340, 5130, 4920, 4710, 4500, 4400, 4300, 4200, 4100, 4000, 3900, 3800, 3700, 3600, 3500, 3400, 3300, 3200, 3100, 3000],
      "12": [19500, 18920, 18340, 17760, 17180, 16600, 16020, 15440, 14860, 14280, 13700, 13110, 12520, 11930, 11340, 10750, 10160, 9570, 8980, 8390, 7800, 7540, 7280, 7020, 6760, 6500, 6240, 5980, 5720, 5460, 5200, 5080, 4960, 4840, 4720, 4600, 4480, 4360, 4240, 4120, 4000, 3880, 3760, 3640, 3520, 3400],
      "13": [19500, 19135, 18770, 18405, 18040, 17675, 17310, 16945, 16580, 16215, 15850, 15175, 14500, 13825, 13150, 12475, 11800, 11125, 10450, 9775, 9100, 8795, 8490, 8185, 7880, 7575, 7270, 6965, 6660, 6355, 6050, 5910, 5770, 5630, 5490, 5350, 5210, 5070, 4930, 4790, 4650, 4510, 4370, 4230, 4090, 3950],
      "14": [19500, 19350, 19200, 19050, 18900, 18750, 18600, 18450, 18300, 18150, 18000, 17240, 16480, 15720, 14960, 14200, 13440, 12680, 11920, 11160, 10400, 10050, 9700, 9350, 9000, 8650, 8300, 7950, 7600, 7250, 6900, 6740, 6580, 6420, 6260, 6100, 5940, 5780, 5620, 5460, 5300, 5140, 4980, 4820, 4660, 4500]
    }
  },
  mainline: {
    maxSpeed: 85,
    notches: {
      "1": [1500, 1443, 1385, 1328, 1270, 1213, 1155, 1098, 1040, 983, 925, 868, 810, 753, 695, 638, 580, 523, 465, 408, 350, 340, 330, 320, 310, 300, 290, 280, 270, 260, 250, 240, 230, 220, 210, 200, 190, 180, 170, 160, 150, 148, 145, 143, 140, 138, 135, 133, 130, 128, 125, 123, 120, 118, 115, 113, 110, 108, 105, 103, 100, 98, 96, 94, 92, 90, 88, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 66, 64, 62, 60, 58, 56, 54, 52, 50],
      "2": [3000, 2883, 2765, 2648, 2530, 2413, 2295, 2178, 2060, 1943, 1825, 1708, 1590, 1473, 1355, 1238, 1120, 1003, 885, 768, 650, 633, 615, 598, 580, 563, 545, 528, 510, 493, 475, 458, 440, 423, 405, 388, 370, 353, 335, 318, 300, 295, 290, 285, 280, 275, 270, 265, 260, 255, 250, 245, 240, 235, 230, 225, 220, 215, 210, 205, 200, 196, 192, 188, 184, 180, 176, 172, 168, 164, 160, 156, 152, 148, 144, 140, 136, 132, 128, 124, 120, 116, 112, 108, 104, 100],
      "3": [4500, 4325, 4150, 3975, 3800, 3625, 3450, 3275, 3100, 2925, 2750, 2575, 2400, 2225, 2050, 1875, 1700, 1525, 1350, 1175, 1000, 973, 945, 918, 890, 863, 835, 808, 780, 753, 725, 698, 670, 643, 615, 588, 560, 533, 505, 478, 450, 443, 435, 428, 420, 413, 405, 398, 390, 383, 375, 368, 360, 353, 345, 338, 330, 323, 315, 308, 300, 294, 288, 282, 276, 270, 264, 258, 252, 246, 240, 234, 228, 222, 216, 210, 204, 198, 192, 186, 180, 174, 168, 162, 156, 150],
      "4": [6000, 5770, 5540, 5310, 5080, 4850, 4620, 4390, 4160, 3930, 3700, 3470, 3240, 3010, 2780, 2550, 2320, 2090, 1860, 1630, 1400, 1360, 1320, 1280, 1240, 1200, 1160, 1120, 1080, 1040, 1000, 960, 920, 880, 840, 800, 760, 720, 680, 640, 600, 590, 580, 570, 560, 550, 540, 530, 520, 510, 500, 490, 480, 470, 460, 450, 440, 430, 420, 410, 400, 393, 385, 378, 370, 363, 355, 348, 340, 333, 325, 318, 310, 303, 295, 288, 280, 273, 265, 258, 250, 242, 234, 226, 218, 210],
      "5": [7700, 7410, 7120, 6830, 6540, 6250, 5960, 5670, 5380, 5090, 4800, 4510, 4220, 3930, 3640, 3350, 3060, 2770, 2480, 2190, 1900, 1850, 1800, 1750, 1700, 1650, 1600, 1550, 1500, 1450, 1400, 1350, 1300, 1250, 1200, 1150, 1100, 1050, 1000, 950, 900, 881, 862, 843, 824, 805, 786, 767, 748, 729, 710, 691, 672, 653, 634, 615, 596, 577, 558, 539, 520, 512, 503, 495, 486, 478, 469, 461, 452, 444, 435, 427, 418, 410, 401, 393, 384, 376, 367, 359, 350, 342, 334, 326, 318, 310],
      "6": [9400, 9050, 8700, 8350, 8000, 7650, 7300, 6950, 6600, 6250, 5900, 5550, 5200, 4850, 4500, 4150, 3800, 3450, 3100, 2750, 2400, 2340, 2280, 2220, 2160, 2100, 2040, 1980, 1920, 1860, 1800, 1740, 1680, 1620, 1560, 1500, 1440, 1380, 1320, 1260, 1200, 1173, 1145, 1118, 1090, 1063, 1035, 1008, 980, 953, 925, 898, 870, 843, 815, 788, 760, 733, 705, 678, 650, 640, 630, 620, 610, 600, 590, 580, 570, 560, 550, 540, 530, 520, 510, 500, 490, 480, 470, 460, 450, 440, 430, 420, 410, 400],
      "7": [11300, 10888, 10475, 10063, 9650, 9238, 8825, 8413, 8000, 7588, 7175, 6763, 6350, 5938, 5525, 5113, 4700, 4288, 3875, 3463, 3050, 2973, 2895, 2818, 2740, 2663, 2585, 2508, 2430, 2353, 2275, 2198, 2120, 2043, 1965, 1888, 1810, 1733, 1655, 1578, 1500, 1471, 1442, 1413, 1384, 1355, 1326, 1297, 1268, 1239, 1210, 1181, 1152, 1123, 1094, 1065, 1036, 1007, 978, 949, 920, 904, 888, 872, 856, 840, 824, 808, 792, 776, 760, 744, 728, 712, 696, 680, 664, 648, 632, 616, 600, 584, 568, 552, 536, 520],
      "8": [13200, 12725, 12250, 11775, 11300, 10825, 10350, 9875, 9400, 8925, 8450, 7975, 7500, 7025, 6550, 6075, 5600, 5125, 4650, 4175, 3700, 3605, 3510, 3415, 3320, 3225, 3130, 3035, 2940, 2845, 2750, 2655, 2560, 2465, 2370, 2275, 2180, 2085, 1990, 1895, 1800, 1770, 1740, 1710, 1680, 1650, 1620, 1590, 1560, 1530, 1500, 1470, 1440, 1410, 1380, 1350, 1320, 1290, 1260, 1230, 1200, 1178, 1155, 1133, 1110, 1088, 1065, 1043, 1020, 998, 975, 953, 930, 908, 885, 863, 840, 818, 795, 773, 750, 728, 706, 684, 662, 640],
      "9": [16000, 15433, 14865, 14298, 13730, 13163, 12595, 12028, 11460, 10893, 10325, 9758, 9190, 8623, 8055, 7488, 6920, 6353, 5785, 5218, 4650, 4538, 4425, 4313, 4200, 4088, 3975, 3863, 3750, 3638, 3525, 3413, 3300, 3188, 3075, 2963, 2850, 2738, 2625, 2513, 2400, 2360, 2320, 2280, 2240, 2200, 2160, 2120, 2080, 2040, 2000, 1960, 1920, 1880, 1840, 1800, 1760, 1720, 1680, 1640, 1600, 1573, 1545, 1518, 1490, 1463, 1435, 1408, 1380, 1353, 1325, 1298, 1270, 1243, 1215, 1188, 1160, 1133, 1105, 1078, 1050, 1022, 994, 966, 938, 910],
      "10": [18800, 18140, 17480, 16820, 16160, 15500, 14840, 14180, 13520, 12860, 12200, 11540, 10880, 10220, 9560, 8900, 8240, 7580, 6920, 6260, 5600, 5470, 5340, 5210, 5080, 4950, 4820, 4690, 4560, 4430, 4300, 4170, 4040, 3910, 3780, 3650, 3520, 3390, 3260, 3130, 3000, 2950, 2900, 2850, 2800, 2750, 2700, 2650, 2600, 2550, 2500, 2450, 2400, 2350, 2300, 2250, 2200, 2150, 2100, 2050, 2000, 1968, 1935, 1903, 1870, 1838, 1805, 1773, 1740, 1708, 1675, 1643, 1610, 1578, 1545, 1513, 1480, 1448, 1415, 1383, 1350, 1318, 1286, 1254, 1222, 1190],
      "11": [19150, 18533, 17915, 17298, 16680, 16063, 15445, 14828, 14210, 13593, 12975, 12358, 11740, 11123, 10505, 9888, 9270, 8653, 8035, 7418, 6800, 6643, 6485, 6328, 6170, 6013, 5855, 5698, 5540, 5383, 5225, 5068, 4910, 4753, 4595, 4438, 4280, 4123, 3965, 3808, 3650, 3588, 3525, 3463, 3400, 3338, 3275, 3213, 3150, 3088, 3025, 2963, 2900, 2838, 2775, 2713, 2650, 2588, 2525, 2463, 2400, 2366, 2332, 2298, 2264, 2230, 2196, 2162, 2128, 2094, 2060, 2026, 1992, 1958, 1924, 1890, 1856, 1822, 1788, 1754, 1720, 1686, 1652, 1618, 1584, 1550],
      "12": [19500, 18925, 18350, 17775, 17200, 16625, 16050, 15475, 14900, 14325, 13750, 13175, 12600, 12025, 11450, 10875, 10300, 9725, 9150, 8575, 8000, 7815, 7630, 7445, 7260, 7075, 6890, 6705, 6520, 6335, 6150, 5965, 5780, 5595, 5410, 5225, 5040, 4855, 4670, 4485, 4300, 4225, 4150, 4075, 4000, 3925, 3850, 3775, 3700, 3625, 3550, 3475, 3400, 3325, 3250, 3175, 3100, 3025, 2950, 2875, 2800, 2765, 2730, 2695, 2660, 2625, 2590, 2555, 2520, 2485, 2450, 2415, 2380, 2345, 2310, 2275, 2240, 2205, 2170, 2135, 2100, 2066, 2032, 1998, 1964, 1930],
      "13": [19500, 18990, 18480, 17970, 17460, 16950, 16440, 15930, 15420, 14910, 14400, 13890, 13380, 12870, 12360, 11850, 11340, 10830, 10320, 9810, 9300, 9088, 8875, 8663, 8450, 8238, 8025, 7813, 7600, 7388, 7175, 6963, 6750, 6538, 6325, 6113, 5900, 5688, 5475, 5263, 5050, 4963, 4875, 4788, 4700, 4613, 4525, 4438, 4350, 4263, 4175, 4088, 4000, 3913, 3825, 3738, 3650, 3563, 3475, 3388, 3300, 3258, 3215, 3173, 3130, 3088, 3045, 3003, 2960, 2918, 2875, 2833, 2790, 2748, 2705, 2663, 2620, 2578, 2535, 2493, 2450, 2408, 2366, 2324, 2282, 2240],
      "14": [19500, 19055, 18610, 18165, 17720, 17275, 16830, 16385, 15940, 15495, 15050, 14605, 14160, 13715, 13270, 12825, 12380, 11935, 11490, 11045, 10600, 10360, 10120, 9880, 9640, 9400, 9160, 8920, 8680, 8440, 8200, 7960, 7720, 7480, 7240, 7000, 6760, 6520, 6280, 6040, 5800, 5700, 5600, 5500, 5400, 5300, 5200, 5100, 5000, 4900, 4800, 4700, 4600, 4500, 4400, 4300, 4200, 4100, 4000, 3900, 3800, 3750, 3700, 3650, 3600, 3550, 3500, 3450, 3400, 3350, 3300, 3250, 3200, 3150, 3100, 3050, 3000, 2950, 2900, 2850, 2800, 2750, 2700, 2650, 2600, 2550]
    }
  }
};

// ==========================================
// 3. 状態管理変数
// ==========================================
let currentMode = "mainline";
let currentNotch = 0;
let currentSpeed = 0.0;
let simRate = 1.0;
let lastTimestamp = performance.now();
let chartInstance = null;

// ==========================================
// 4. 引張力・走行抵抗・均衡速度計算
// ==========================================
function getTractiveEffort(speed, notch, mode = currentMode) {
  if (notch <= 0) return 0;
  const modeData = TRACTION_DATA[mode];
  const table = modeData.notches[String(notch)];
  if (!table) return 0;

  if (speed <= 0) return table[0];
  if (speed >= modeData.maxSpeed) return 0;

  const v0 = Math.floor(speed);
  const v1 = Math.min(v0 + 1, modeData.maxSpeed);
  const ratio = speed - v0;

  const f0 = table[v0] ?? 0;
  const f1 = table[v1] ?? 0;

  return f0 + (f1 - f0) * ratio;
}

function calculateRunningResistance(speed) {
  const locoWeight = VEHICLE_DATA.locomotive.weight;
  // 機関車抵抗 (kgf)
  const r_loco = (1.8 + 0.015 * speed + 0.00035 * speed * speed) * locoWeight;

  const carTypeKey = document.getElementById("car-type")?.value || "12kei";
  const carCount = parseInt(document.getElementById("car-count")?.value, 10) || 0;
  const carSpec = VEHICLE_DATA.carTypes[carTypeKey];
  const totalCarWeight = carSpec.weight * carCount;

  let r_cars = 0;
  if (totalCarWeight > 0) {
    if (carSpec.bearing === "plain") {
      r_cars = (2.4 + 0.012 * speed + 0.00040 * speed * speed) * totalCarWeight;
    } else {
      r_cars = (1.6 + 0.008 * speed + 0.00025 * speed * speed) * totalCarWeight;
    }
  }

  // 勾配抵抗 (kgf)
  const gradient = parseFloat(document.getElementById("gradient-slider")?.value) || 0;
  const r_grade = (locoWeight + totalCarWeight) * gradient;

  return r_loco + r_cars + r_grade;
}

function calculateBalancingSpeed() {
  if (currentNotch === 0) return 0;
  const maxV = TRACTION_DATA[currentMode].maxSpeed;

  for (let v = 0.5; v <= maxV; v += 0.2) {
    const te = getTractiveEffort(v, currentNotch, currentMode);
    const rr = calculateRunningResistance(v);
    if (te <= rr) {
      return v;
    }
  }
  return maxV;
}

// ==========================================
// 5. リアルタイム・シミュレーションループ
// ==========================================
function simulationLoop(now) {
  const dt = Math.min((now - lastTimestamp) / 1000, 0.1) * simRate;
  lastTimestamp = now;

  const maxLimit = TRACTION_DATA[currentMode].maxSpeed;
  const te = getTractiveEffort(currentSpeed, currentNotch, currentMode);
  const rr = calculateRunningResistance(currentSpeed);

  // 編成総重量 (t)
  const carTypeKey = document.getElementById("car-type")?.value || "12kei";
  const carCount = parseInt(document.getElementById("car-count")?.value, 10) || 0;
  const carSpec = VEHICLE_DATA.carTypes[carTypeKey];
  const totalWeight = VEHICLE_DATA.locomotive.weight + (carSpec.weight * carCount);

  // 有効加速力 (kgf)
  let netForce = te - rr;

  // 停止中の後退防止
  if (currentSpeed <= 0.02 && netForce < 0) {
    netForce = 0;
    currentSpeed = 0;
  }

  // 国鉄標準加速度式: α (km/h/s) = F_net / (30.93 * W)
  let acceleration = 0;
  if (totalWeight > 0) {
    acceleration = netForce / (30.93 * totalWeight);
  }

  // 速度積分
  currentSpeed += acceleration * dt;

  // 速度制限クランプ
  if (currentSpeed < 0) currentSpeed = 0;
  if (currentSpeed > maxLimit) currentSpeed = maxLimit;

  // 計器盤更新
  updateGauges(te, rr, acceleration, netForce);

  // グラフ上の現在速度点の座標を更新
  updateChartOperatingPoint(te, rr);

  requestAnimationFrame(simulationLoop);
}

// ==========================================
// 6. UI計器盤の更新
// ==========================================
function updateGauges(te, rr, acceleration, netForce) {
  const speedElem = document.getElementById("display-speed");
  const speedSlider = document.getElementById("speed-slider");
  const speedVal = document.getElementById("speed-val");

  if (speedElem) speedElem.innerHTML = `${currentSpeed.toFixed(1)} <small>km/h</small>`;
  if (speedSlider) speedSlider.value = currentSpeed.toFixed(1);
  if (speedVal) speedVal.textContent = `${currentSpeed.toFixed(1)} km/h`;

  const accelElem = document.getElementById("display-acceleration");
  const netForceElem = document.getElementById("display-netforce");
  if (accelElem) {
    const sign = acceleration >= 0 ? "+" : "";
    accelElem.innerHTML = `${sign}${acceleration.toFixed(2)} <small>km/h/s</small>`;
  }
  if (netForceElem) {
    const sign = netForce >= 0 ? "+" : "";
    netForceElem.textContent = `加速余力: ${sign}${Math.round(netForce)} kgf`;
  }

  const teElem = document.getElementById("display-traction");
  if (teElem) teElem.innerHTML = `${Math.round(te)} <small>kgf</small>`;

  const rrElem = document.getElementById("display-resistance");
  if (rrElem) rrElem.innerHTML = `${Math.round(rr)} <small>kgf</small>`;

  const balSpeed = calculateBalancingSpeed();
  const balElem = document.getElementById("display-balancing");
  if (balElem) {
    balElem.innerHTML = currentNotch > 0 ? `${balSpeed.toFixed(1)} <small>km/h</small>` : "--- <small>km/h</small>";
  }
}

// ==========================================
// 7. Chart.js グラフ処理
// ==========================================
function initChart() {
  const canvas = document.getElementById("tractionChart");
  if (!canvas || typeof Chart === "undefined") return;

  const ctx = canvas.getContext("2d");
  const maxLimit = TRACTION_DATA[currentMode].maxSpeed;

  // 初期データ (x, y オブジェクト配列)
  const initialTePoints = [];
  const initialRrPoints = [];
  for (let v = 0; v <= maxLimit; v++) {
    initialTePoints.push({ x: v, y: getTractiveEffort(v, currentNotch, currentMode) });
    initialRrPoints.push({ x: v, y: Math.round(calculateRunningResistance(v)) });
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "引張力 (選択ノッチ)",
          data: initialTePoints,
          borderColor: "#f85149",
          backgroundColor: "rgba(248, 81, 73, 0.15)",
          borderWidth: 2.5,
          pointRadius: 0,
          fill: true,
          tension: 0.1,
          order: 2
        },
        {
          label: "総走行抵抗 (勾配込)",
          data: initialRrPoints,
          borderColor: "#388bfd",
          backgroundColor: "rgba(56, 139, 253, 0.1)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.1,
          order: 3
        },
        // 現在速度における作動点（引張力）
        {
          label: "現在引張力点",
          type: "scatter",
          data: [{ x: 0, y: 0 }],
          backgroundColor: "#ffeb3b",
          borderColor: "#ff1744",
          borderWidth: 2.5,
          pointRadius: 7,
          pointHoverRadius: 9,
          order: 1
        },
        // 現在速度における作動点（走行抵抗）
        {
          label: "現在走行抵抗点",
          type: "scatter",
          data: [{ x: 0, y: 0 }],
          backgroundColor: "#ffffff",
          borderColor: "#00b0ff",
          borderWidth: 2.5,
          pointRadius: 7,
          pointHoverRadius: 9,
          order: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: {
          type: "linear",
          min: 0,
          max: maxLimit,
          title: { display: true, text: "速度 (km/h)", color: "#8b949e" },
          grid: { color: "#30363d" },
          ticks: { color: "#8b949e", stepSize: 5 }
        },
        y: {
          min: 0,
          suggestedMax: 20000,
          title: { display: true, text: "力 (kgf)", color: "#8b949e" },
          grid: { color: "#30363d" },
          ticks: { color: "#8b949e" }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: "#e0e6ed",
            filter: (item) => item.text.includes("(") // 作動点の凡例は省略してシンプルに
          }
        }
      }
    }
  });
}

// ノッチや勾配等の条件変更時に曲線全体を再計算
function updateChartCurves() {
  if (!chartInstance) return;

  const maxLimit = TRACTION_DATA[currentMode].maxSpeed;
  const tePoints = [];
  const rrPoints = [];

  for (let v = 0; v <= maxLimit; v++) {
    tePoints.push({ x: v, y: getTractiveEffort(v, currentNotch, currentMode) });
    rrPoints.push({ x: v, y: Math.round(calculateRunningResistance(v)) });
  }

  chartInstance.data.datasets[0].data = tePoints;
  chartInstance.data.datasets[1].data = rrPoints;
  chartInstance.options.scales.x.max = maxLimit;
  chartInstance.update();
}

// 物理ループ内で現在速度点（マーカー）の座標のみを毎フレーム高速更新
function updateChartOperatingPoint(te, rr) {
  if (!chartInstance) return;

  chartInstance.data.datasets[2].data = [{ x: currentSpeed, y: te }];
  chartInstance.data.datasets[3].data = [{ x: currentSpeed, y: rr }];
  chartInstance.update("none"); // アニメーション遅延なしで即時描画
}

// ==========================================
// 8. イベントバインド
// ==========================================
function updateNotchUI(notch) {
  currentNotch = notch;
  const slider = document.getElementById("notch-slider");
  if (slider) slider.value = notch;

  const notchVal = document.getElementById("notch-val");
  if (notchVal) notchVal.textContent = notch === 0 ? "0 段 (OFF)" : `${notch} 段`;

  const dispNotch = document.getElementById("display-notch");
  if (dispNotch) dispNotch.textContent = notch === 0 ? "0 (OFF)" : `${notch} 段`;

  // 目盛り数字のアクティブ色を切り替え
  document.querySelectorAll("#notch-ticks span").forEach((span) => {
    const n = parseInt(span.dataset.notch, 10);
    span.classList.toggle("active", n === notch);
  });

  updateChartCurves();
}

function setupEventListeners() {
  // 本線 / 入換 切り替え
  document.querySelectorAll('input[name="gearMode"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      currentMode = e.target.value;
      const isShunting = currentMode === "shunting";
      const maxLimit = TRACTION_DATA[currentMode].maxSpeed;

      document.body.className = isShunting ? "mode-shunting" : "mode-mainline";
      document.getElementById("chart-badge").textContent = isShunting ? "入換段 (0-45 km/h)" : "本線段 (0-85 km/h)";
      document.getElementById("display-mode-name").textContent = isShunting ? "入換ギア接続中" : "本線ギア接続中";
      document.getElementById("display-speed-limit").textContent = `最高許容: ${maxLimit} km/h`;

      const speedSlider = document.getElementById("speed-slider");
      if (speedSlider) speedSlider.max = maxLimit;

      updateChartCurves();
    });
  });

  // ノッチスライダー操作
  document.getElementById("notch-slider")?.addEventListener("input", (e) => {
    updateNotchUI(parseInt(e.target.value, 10));
  });

  // ノッチ目盛り（0〜14）の直接クリック操作
  document.querySelectorAll("#notch-ticks span").forEach((span) => {
    span.addEventListener("click", () => {
      const notch = parseInt(span.dataset.notch, 10);
      updateNotchUI(notch);
    });
  });

  // 速度スライダー（任意位置への手動ドラッグ）
  document.getElementById("speed-slider")?.addEventListener("input", (e) => {
    currentSpeed = parseFloat(e.target.value);
  });

  // 即時停車リセットボタン
  document.getElementById("btn-stop")?.addEventListener("click", () => {
    currentSpeed = 0;
    updateNotchUI(0);
  });

  // 倍速ボタン
  document.querySelectorAll(".btn-times").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".btn-times").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      simRate = parseFloat(btn.dataset.rate);
      document.getElementById("sim-speed-val").textContent = `${simRate}x (${simRate === 1 ? "等倍速" : "高速検証"})`;
    });
  });

  // 車両形式・両数・勾配
  document.getElementById("car-type")?.addEventListener("change", updateChartCurves);

  document.getElementById("car-count")?.addEventListener("input", (e) => {
    document.getElementById("car-count-val").textContent = `${e.target.value} 両`;
    updateChartCurves();
  });

  document.getElementById("gradient-slider")?.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    const text = val === 0 ? "0.0 ‰ (平坦)" : `${val > 0 ? "+" : ""}${val.toFixed(1)} ‰`;
    document.getElementById("gradient-val").textContent = text;
    updateChartCurves();
  });
}

// 起動
document.addEventListener("DOMContentLoaded", () => {
  initChart();
  setupEventListeners();
  updateNotchUI(0);
  requestAnimationFrame(simulationLoop);
});

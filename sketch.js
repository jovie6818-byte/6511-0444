// 遊戲狀態：0=開始畫面, 1=遊戲中, 2=成功找到, 3=時間到失敗
let gameState = 0; 
let targetX, targetY; 
let startTime;
let timeLimit = 30; // 30秒限制

function setup() {
  createCanvas(windowWidth, windowHeight);
  initGame();
}

function draw() {
  background(20, 24, 36); // 深色科技感背景
  drawGrid(); // 繪製背景網格增加層次

  if (gameState === 0) {
    cursor(ARROW);
    drawStartScreen();
  } else if (gameState === 1) {
    noCursor(); // 遊戲中隱藏預設滑鼠，改用自訂游標
    playGame();
  } else if (gameState === 2) {
    cursor(ARROW);
    drawWinScreen();
  } else if (gameState === 3) {
    cursor(ARROW);
    drawLoseScreen();
  }
}

function initGame() {
  // 確保地雷不會生成在太靠近邊緣的地方
  targetX = random(100, width - 100);
  targetY = random(100, height - 100);
}

// --- 畫面繪製函式 ---

// 繪製背景網格
function drawGrid() {
  stroke(255, 255, 255, 10);
  strokeWeight(1);
  for (let x = 0; x < width; x += 50) { line(x, 0, x, height); }
  for (let y = 0; y < height; y += 50) { line(0, y, width, y); }
}

function drawStartScreen() {
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(48);
  text("🎯 找地雷", width / 2, height / 2 - 40);
  
  textSize(20);
  fill(150, 200, 255);
  text("點擊畫面開始任務！", width / 2, height / 2 + 30);
  fill(150);
  textSize(16);
  text("提示：注意圓圈大小與箭頭方向，你有 30 秒。", width / 2, height / 2 + 70);
}

function playGame() {
  let elapsed = (millis() - startTime) / 1000;
  let timeLeft = max(0, timeLimit - elapsed);

  // 1. 繪製頂部進度條與時間
  drawTimerBar(timeLeft);

  if (timeLeft <= 0) {
    gameState = 3;
    return;
  }

  // 2. 計算距離與角度
  let d = dist(mouseX, mouseY, targetX, targetY);
  let maxD = dist(0, 0, width, height);
  
  // 距離越近，圓圈越大 (限制在 30 到 300 之間)
  let circleSize = map(d, 0, maxD, 300, 30);
  circleSize = constrain(circleSize, 30, 300);

  // 3. 繪製提示圓圈
  noFill();
  stroke(100, 220, 255, map(d, 0, maxD, 200, 50)); // 越近越亮
  strokeWeight(2);
  circle(mouseX, mouseY, circleSize);
  
  // 加上微弱的發光背景
  fill(100, 220, 255, 15);
  noStroke();
  circle(mouseX, mouseY, circleSize);

  // 4. 繪製方向箭頭
  drawDirectionArrow(mouseX, mouseY, targetX, targetY, circleSize);

  // 5. 繪製自訂十字準星游標
  drawCustomCursor(mouseX, mouseY);
}

// 繪製計時條
function drawTimerBar(timeLeft) {
  let barWidth = map(timeLeft, 0, timeLimit, 0, width);
  
  // 時間快到時變紅色，否則為藍綠色
  if (timeLeft < 10) {
    fill(255, 80, 80);
  } else {
    fill(80, 255, 180);
  }
  noStroke();
  rect(0, 0, barWidth, 8); // 頂部進度條

  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("⏳ 剩餘時間: " + ceil(timeLeft) + " 秒", 20, 20);
  
  textAlign(CENTER, TOP);
  textSize(20);
  fill(150, 200, 255);
  text("尋找中...", width / 2, 20);
}

// 繪製指向目標的箭頭
function drawDirectionArrow(cx, cy, tx, ty, radius) {
  // 利用 atan2 算出從滑鼠指向地雷的角度
  let angle = atan2(ty - cy, tx - cx);
  
  push();
  translate(cx, cy);
  rotate(angle);
  
  // 將箭頭放在提示圓圈的邊緣內側
  let arrowDist = radius / 2 - 15;
  if (arrowDist < 15) arrowDist = 15; // 避免圓圈太小時箭頭重疊
  
  // 畫出箭頭圖形
  fill(255, 200, 50);
  noStroke();
  triangle(arrowDist, 0, arrowDist - 12, -6, arrowDist - 12, 6);
  
  stroke(255, 200, 50);
  strokeWeight(2);
  line(10, 0, arrowDist - 5, 0); // 箭頭的尾巴線條
  
  pop();
}

// 繪製科技感自訂游標
function drawCustomCursor(x, y) {
  stroke(255);
  strokeWeight(2);
  line(x - 10, y, x + 10, y);
  line(x, y - 10, x, y + 10);
  noFill();
  stroke(255, 255, 255, 100);
  circle(x, y, 8);
}

function drawWinScreen() {
  // 畫出地雷位置 (慶祝特效)
  fill(100, 255, 100, 50);
  circle(targetX, targetY, 100);
  fill(100, 255, 100);
  circle(targetX, targetY, 20);

  textAlign(CENTER, CENTER);
  fill(100, 255, 100);
  textSize(48);
  text("✨ 任務完成！你找到地雷了！", width / 2, height / 2 - 30);
  
  textSize(20);
  fill(200);
  text("點擊畫面重新開始", width / 2, height / 2 + 40);
}

function drawLoseScreen() {
  // 顯示地雷原本的位置 (失敗特效)
  fill(255, 80, 80, 50);
  circle(targetX, targetY, 100);
  fill(255, 80, 80);
  circle(targetX, targetY, 20);
  fill(255);
  textSize(16);
  text("📍 目標在這裡", targetX, targetY - 60);

  textAlign(CENTER, CENTER);
  fill(255, 80, 80);
  textSize(48);
  text("💥 時間到！任務失敗！", width / 2, height / 2 - 30);
  
  textSize(20);
  fill(200);
  text("點擊畫面重新開始", width / 2, height / 2 + 40);
}

// --- 互動邏輯 ---

function mousePressed() {
  if (gameState === 0) {
    gameState = 1;
    startTime = millis();
  } else if (gameState === 1) {
    // 判定點擊範圍：半徑 30 像素內算成功
    if (dist(mouseX, mouseY, targetX, targetY) < 30) {
      gameState = 2; 
    }
  } else if (gameState === 2 || gameState === 3) {
    initGame();
    gameState = 1;
    startTime = millis();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
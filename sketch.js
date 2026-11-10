let characterSprite; // 儲存角色一的待機精靈圖
let walkSprite; // 儲存角色一的走路精靈圖
let spriteLoaded = false; // 記錄待機精靈圖是否成功載入
let walkSpriteLoaded = false; // 記錄走路精靈圖是否成功載入
let characterCenterX = 0; // 儲存角色目前的水平中心位置
let movementDirection = 0; // 儲存角色移動方向，右為正、左為負
let isWalking = false; // 記錄是否已切換到走路狀態
const idleFrameCount = 1; // 設定待機圖片只有一張影格
const walkFrameCount = 9; // 設定走路精靈圖的影格數
const animationSpeed = 8; // 設定每張影格停留的繪圖影格數

function preload() { // 在畫布開始繪製前載入兩組角色精靈圖
  characterSprite = loadImage('0.png', spriteLoadSucceeded, spriteLoadFailed); // 載入專案根目錄的待機圖片
  walkSprite = loadImage('1/walk/walk.png', walkSpriteLoadSucceeded, walkSpriteLoadFailed); // 載入九格走路精靈圖
} // 結束圖片載入函式

function spriteLoadSucceeded() { // 待機圖片載入成功時設定狀態
  spriteLoaded = true; // 記錄待機圖片已成功載入
} // 結束待機圖片載入成功函式

function spriteLoadFailed() { // 待機圖片載入失敗時設定狀態
  spriteLoaded = false; // 記錄待機圖片載入失敗
} // 結束待機圖片載入失敗函式

function walkSpriteLoadSucceeded() { // 走路圖片載入成功時設定狀態
  walkSpriteLoaded = true; // 記錄走路圖片已成功載入
} // 結束走路圖片載入成功函式

function walkSpriteLoadFailed() { // 走路圖片載入失敗時設定狀態
  walkSpriteLoaded = false; // 記錄走路圖片載入失敗
} // 結束走路圖片載入失敗函式

function setup() { // 設定畫布與繪圖環境
  createCanvas(windowWidth, windowHeight); // 建立符合瀏覽器視窗大小的畫布
  imageMode(CORNER); // 使用圖片左上角作為繪製定位基準
  characterCenterX = width / 2; // 將角色初始位置放在畫布水平中央
} // 結束畫布設定函式

function draw() { // 每個繪圖影格更新背景、角色位置與動畫
  background(135, 206, 235); // 使用天空藍填滿整個畫布背景
  if (!spriteLoaded) { // 在待機精靈圖尚未載入時顯示錯誤提示
    fill(30); // 設定提示文字顏色
    textAlign(CENTER, CENTER); // 將提示文字置中對齊
    textSize(18); // 設定提示文字大小
    text('找不到角色圖片：請確認 0.png', width / 2, height / 2); // 顯示待機圖片路徑提示
    return; // 暫停角色繪製以避免使用未載入的圖片
  } // 結束待機圖片載入狀態判斷
  const usingWalkSprite = isWalking && walkSpriteLoaded; // 僅在走路圖片已載入時切換到走路精靈圖
  const activeSprite = usingWalkSprite ? walkSprite : characterSprite; // 選擇目前要繪製的角色圖片
  const activeFrameCount = usingWalkSprite ? walkFrameCount : idleFrameCount; // 依目前圖片取得正確影格數
  const frameWidth = activeSprite.width / activeFrameCount; // 依圖片寬度計算單格影格寬度
  const frameHeight = activeSprite.height; // 取得單格影格高度
  const scaleFactor = min(width * 0.5 / frameWidth, height * 0.3 / frameHeight); // 依畫布寬高等比例縮放角色
  const displayWidth = frameWidth * scaleFactor; // 計算縮放後角色寬度
  const displayHeight = frameHeight * scaleFactor; // 計算縮放後角色高度
  const moveSpeed = max(2, width * 0.004); // 依畫布寬度設定合適的移動速度
  characterCenterX = constrain(characterCenterX + movementDirection * moveSpeed, displayWidth / 2, width - displayWidth / 2); // 移動角色並限制在畫布左右邊界內
  const currentFrame = floor(frameCount / animationSpeed) % activeFrameCount; // 持續循環播放目前精靈圖的影格
  const characterX = characterCenterX - displayWidth / 2; // 計算角色圖片左側位置
  const characterY = (height - displayHeight) / 2; // 將角色垂直置中於畫布
  if (movementDirection < 0) { // 判斷角色是否朝向左方
    push(); // 暫存目前的繪圖座標狀態
    translate(characterX + displayWidth, characterY); // 將翻轉基準移至角色右上角
    scale(-1, 1); // 水平翻轉圖片使角色朝左
    image(activeSprite, 0, 0, displayWidth, displayHeight, currentFrame * frameWidth, 0, frameWidth, frameHeight); // 繪製朝左的目前動畫影格
    pop(); // 還原繪圖座標狀態
  } else { // 角色朝右或尚未移動時維持原方向
    image(activeSprite, characterX, characterY, displayWidth, displayHeight, currentFrame * frameWidth, 0, frameWidth, frameHeight); // 繪製朝右的目前動畫影格
  } // 結束角色方向判斷
  if (isWalking && !walkSpriteLoaded) { // 走路圖片缺失時顯示提示但保留角色移動
    fill(30); // 設定提示文字顏色
    textAlign(CENTER, TOP); // 將提示文字置中並靠上對齊
    textSize(16); // 設定提示文字大小
    text('找不到走路圖片：請確認 1/walk/walk.png', width / 2, 12); // 顯示走路圖片應放置的路徑
  } // 結束走路圖片缺失提示
} // 結束每影格繪製函式

function keyPressed() { // 按下方向鍵時啟動角色走路並設定方向
  if (keyCode === RIGHT_ARROW) { // 判斷是否按下右方向鍵
    movementDirection = 1; // 設定角色向右移動
    isWalking = true; // 切換到走路動畫狀態
    return false; // 阻止瀏覽器因方向鍵捲動頁面
  } // 結束右方向鍵處理
  if (keyCode === LEFT_ARROW) { // 判斷是否按下左方向鍵
    movementDirection = -1; // 設定角色向左移動
    isWalking = true; // 切換到走路動畫狀態
    return false; // 阻止瀏覽器因方向鍵捲動頁面
  } // 結束左方向鍵處理
} // 結束鍵盤輸入函式

function keyReleased() { // 放開方向鍵時停止移動並切回待機圖片
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) { // 判斷放開的是否為左右方向鍵
    movementDirection = 0; // 停止角色水平移動
    isWalking = false; // 切回單張待機圖片
    return false; // 阻止瀏覽器因方向鍵捲動頁面
  } // 結束方向鍵放開處理
} // 結束鍵盤放開函式

function windowResized() { // 在瀏覽器視窗尺寸改變時更新畫布
  resizeCanvas(windowWidth, windowHeight); // 讓畫布重新符合目前視窗大小
  characterCenterX = constrain(characterCenterX, 0, width); // 將角色位置限制在新畫布範圍內
} // 結束視窗尺寸更新函式
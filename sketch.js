// 変数
var player;
var playerImage;
var itemImage;
var enemy;
var enemyImage;
var itemGroup;
var enemyGroup;
var maxItem = 5;
var itemCount = 0;
var modeFlg = true;
var clearFlg = false;
var endFlg = false;
var scoreFlg = true;
var time = 10000;
var currentTime = 0;
var scoreTime = 300000;
var score = 0;
var bonusScore = 0;
var Text = "";

function preload() {
  // Playerの絵をロード
  playerRightImage = loadImage('player1.png');
  playerLeftImage = loadImage('player2.png');
  // アイテムの絵をロード
  itemImage = loadImage('item.png');
  // 敵の絵をロード
  enemyLeftImage = loadImage('enemy1.png');
  enemyRightImage = loadImage('enemy2.png');
}

function setup() {
  // キャンバスを作る
  createCanvas(windowWidth, windowHeight);

  // Playerの準備
  player = createSprite(50, 50);
  player.addImage('right', playerRightImage);
  player.addImage('left', playerLeftImage);

  // 敵の準備
  enemyGroup = new Group();
  enemy = createSprite(random(width / 2, width), random(height / 2, height));
  enemy.addImage('right', enemyRightImage);
  enemy.addImage('left', enemyLeftImage);
  enemyGroup.add(enemy);

  // アイテムの準備
  itemGroup = new Group();
  for (var i = 0; i < maxItem; i++) {
    var item = createSprite(random(0, width), random(50, height));
    item.addImage(itemImage);
    itemGroup.add(item);
  }
}

function draw() {
  currentTime = millis();
  if (currentTime > time) {
    print("CHANGE MODE");
    time += random(5, 10) * 1000;
    changeFlg();
  }

  // 全てのスプライトを描く
  drawSprites();

  //Playerコントロールの関数を呼ぶ
  playerControl();

  //Enemyコントロールの関数を呼ぶ
  enemyControl();

  //クリアflgがtrueの時
  if (clearFlg == true) {
    //敵を削除
    enemy.remove();
    //CHANGE MODEしないようにする
    time += 500 * 1000;
    //30秒以内にクリアできた時はボーナス加点
    if (scoreTime >= currentTime) {
      if (scoreFlg == true) {
        bonusScore = floor((scoreTime - currentTime) / 1000);
        Text = "TIME BONUS!"
        scoreFlg = false;
      }
    }
    textSize(50);
    fill(255);
    textAlign(CENTER);
    text("CLEAR!", width / 2, height / 2);
    textSize(20);
    text(Text, width / 2, height / 2 + 45);
    textSize(50);
    text(score + bonusScore, width / 2, height / 2 + 100);
  }

  //endFlgがtrueの時
  if (endFlg == true) {
    //CHANGE MODEしないようにする
    time += 500 * 1000;
    //真ん中にゲームオーバーと表示
    textSize(50);
    fill(255);
    textAlign(CENTER);
    text("GAME OVER...", width / 2, height / 2);
    text(score, width / 2, height / 2 + 100);
  }

  textSize(30);
  fill(255);
  textAlign(CENTER);
  text("SCORE: " + score, width - 100, 50);
}

//Playerの動き
function playerControl() {
  // Playerの移動
  var velocityX = 1;
  var velocityY = 1;
  if (modeFlg == true) {
    // 背景色でぬりつぶす
    background(255, 255, 80, 65);
    if (keyDown('up')) {
      player.position.y -= velocityY;
    }
    if (keyDown('down')) {
      player.position.y += velocityY;
    }
    if (keyDown('right')) {
      player.position.x += velocityX;
      player.changeImage('right');
    }
    if (keyDown('left')) {
      player.position.x -= velocityX;
      player.changeImage('left');
    }
  } else {
    // 背景色でぬりつぶす
    background(0, 0, 80, 65);
    if (keyDown('up')) {
      player.position.y += velocityY;
    }
    if (keyDown('down')) {
      player.position.y -= velocityY;
    }
    if (keyDown('right')) {
      player.position.x -= velocityX;
      player.changeImage('left');
    }
    if (keyDown('left')) {
      player.position.x += velocityX;
      player.changeImage('right');
    }
  }

  // アイテムがPlayerに押し出される
  itemGroup.collide(player);

  //Playerがアイテムにぶつかったらpickup関数が呼ばれる
  player.overlap(itemGroup, pickup);
  //Playerが敵にぶつかったらgameover関数が呼ばれる
  player.overlap(enemy, gameover);
}

function enemyControl() {
  // Enemyの移動
  var velocityX = player.position.x - enemy.position.x;
  var velocityY = player.position.y - enemy.position.y;
  if (velocityX * velocityX + velocityY * velocityY > 10000) {
    velocityX *= 0.004;
    velocityY *= 0.004;
  } else {
    velocityX *= 0.008;
    velocityY *= 0.008;
  }
  enemy.position.x += velocityX;
  enemy.position.y += velocityY;
  var distX = enemy.position.x - player.position.x;
  if (distX < 0) {
    enemy.changeImage('right');
  } else {
    enemy.changeImage('left');
  }
}

function pickup(player, item) {
  item.remove();
  itemCount += 1;
  score += 100;
  if (itemCount == maxItem) {
    clearFlg = true;
  }
}

function changeFlg() {
  //modeFlgを変える
  if (modeFlg == true) {
    modeFlg = false;
  } else {
    modeFlg = true;
  }
}

function gameover() {
  if (clearFlg != true) {
    endFlg = true;
  }
}
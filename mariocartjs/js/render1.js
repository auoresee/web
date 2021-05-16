var interval = 0;

var Kart = {
	x: 240.0,
	y: 30.0,
	speed: 0.0,
	rotate: 0.0,
  	rotateSpeed: 0.0,
	height: 0.0,
	isDrifting: false
};

var player = Object.create(Kart);
// キーボードの入力状態を記録する配列
var input_key_buffer = new Array();

// ------------------------------------------------------------
// キーボードを押したときに実行されるイベント
// ------------------------------------------------------------
document.onkeydown = function (e){
	if(!e) e = window.event; // レガシー

	input_key_buffer[e.keyCode] = true;
};

// ------------------------------------------------------------
// キーボードを離したときに実行されるイベント
// ------------------------------------------------------------
document.onkeyup = function (e){
	if(!e) e = window.event; // レガシー

	input_key_buffer[e.keyCode] = false;
};

// ------------------------------------------------------------
// ウィンドウが非アクティブになる瞬間に実行されるイベント
// ------------------------------------------------------------
window.onblur = function (){
	// 配列をクリアする
	input_key_buffer.length = 0;
};

// ------------------------------------------------------------
// キーボードが押されているか調べる関数
// ------------------------------------------------------------
function KeyIsDown(key_code){

	if(input_key_buffer[key_code])	return true;

	return false;
}

function tick() {
	playerAction();
}

function playerAction() {
	var drag = 0.025 * player.speed + 0.004;
	//var acc = 0.0 - drag;
	//if(KeyIsDown(65)) {
		acc = 0.08;// - drag;
	//}
	player.speed = Math.max(0.0, player.speed + acc);
	var tr = 0.0;
	if(KeyIsDown(37)) {
		if(player.speed == 0) {
			tr = 0.0;
		}
		else {
			var rv = -0.0007;
			tr = Math.max(rv * player.speed);
		}
	}
	else if(KeyIsDown(39)) {
		if(player.speed == 0) {
			tr = 0.0;
          	player.rotateSpeed = 0.0;
		}
		else {
			var rv = 0.0007;
			tr = Math.min(rv * player.speed);
		}
	}
  	else {
      player.rotateSpeed *= 0.70;
    }
  
  	//if(player.rotateSpeed < 5 && player.rotatespeed > -5){
		player.rotateSpeed += tr;
    //}
  	player.rotate += player.rotateSpeed;
	player.x += Math.cos(player.rotate) * player.speed;
	player.y += Math.sin(player.rotate) * player.speed;
}

var playerViewRenderer;
var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];  // キャンバス
var charaImage;

function newGame() {
  clearInterval(interval);  // ゲームタイマーをクリア
  playerViewRenderer = new HomographyApp(canvas, stageImage);
  interval = setInterval( tick, 50 );  // 50ミリ秒ごとにtickという関数を呼び出す
  // 30ミリ秒ごとに状態を描画する関数を呼び出す
  setInterval( render, 33 );
}

var imageCounter = 0;
function loadImagesAndStartGame() {
  stageImage = new Image();
  charaImage = new Image();
  stageImage.onload = function () {imageCounter++; if(imageCounter == 2) newGame();}
  charaImage.onload = function () {imageCounter++; if(imageCounter == 2) newGame();}
  stageImage.src = "airpicture.jpg";
  charaImage.src = "chara.png";
}

loadImagesAndStartGame();


/*
 現在の盤面の状態を描画する処理
 */
var ctx = canvas.getContext( '2d' ); // コンテクスト
var W = 640, H = 480;  // キャンバスのサイズ
//var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;  // マスの幅を設定

// 盤面と操作ブロックを描画する
function render() {
  ctx.clearRect( 0, 0, W, H );  // 一度キャンバスを真っさらにする
  ctx.strokeStyle = 'black';  // えんぴつの色を黒にする
  renderUpperScreen();
  renderLowerScreen();
}

function renderUpperScreen() {
    playerViewRenderer.render(player);

  ctx.drawImage(charaImage, 320 - 20, 190);
}

function renderLowerScreen() {
	drawMap();
	drawMapCharacters();
}

function drawMap(){
	/* Imageオブジェクトを生成 */
  /* 画像を描画 */
  ctx.drawImage(stageImage, 20, 270);
}

function drawMapCharacters() {
/* Imageオブジェクトを生成 */

  /* 画像を描画 */
  ctx.drawImage(charaImage, player.x + 20, player.y + 270);
}
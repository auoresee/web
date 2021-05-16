var HomographyApp = (function () {

    var playerViewX = 300;
  var playerViewY = 1500;

  // コンストラクタ
  function HomographyApp(canvas, pstageimage) {
      var _this = this;
      this.offset = new Point(0, 0);
      this.origin = [];
      this.markers = [];
      this.vertexs = [];

      this.width = canvas.width;
      this.height = canvas.height;
      this.context = canvas.getContext("2d");

      this.stageImage = pstageimage;

      _this.stageImageReady(_this);

      // コントローラの高さ
      //this.ctlHeight = document.getElementById('controler').offsetHeight;

      // 描画方法(ラジオボタン)の変更イベントの設定
      //this.drawType = (document.getElementsByName('drawType'));
      //for(var i = 0; i < this.drawType.length; i++) {
      //    this.drawType[i].addEventListener("change", function (e) {
      //        _this.render();
      //    });
      //}

      // 角度(範囲スライダー)の変更イベントの設定
      //this.degrees = document.getElementById('degrees');
      //this.degrees.addEventListener("change", function (e) {
         // var distanceDisp = document.getElementById('degreesDisp');
          //distanceDisp.innerHTML = _this.degrees.value;
          //var degrees = _this.degrees.value;
          //var rad = -degrees / 180 * Math.PI;

          // 回転後のアンカー値をセット
          //for(var i = 0; i < _this.markers.length; i++) {
              //var elm = document.getElementById("p" + (i + 1));
              //var pt = _this.rotate2d(_this.vertexs[i].x - _this.center.x, _this.vertexs[i].y - _this.center.y, rad);
              //Anchor.move(elm, pt.x + _this.offset.x + _this.center.x, pt.y + _this.offset.y + _this.center.y);
          //}
          //_this.render();
      //}	
  this.markers[0][0] = -100;
  this.markers[0][1] = -100;
  this.markers[1][0] = 740;
  this.markers[1][1] = -100;
  this.markers[2][0] = 940;
  this.markers[2][1] = 240;
  this.markers[3][0] = -300;
  this.markers[3][1] = 240;
      // 描画用の射影変換パラメータを取得
  this.min = new Point(0,0);
  this.max = new Point(0,0);
      this.inv_param = this.computeH([[0,0],[playerViewX,0],[playerViewX,playerViewY],[0,playerViewY]], this.markers, this.min, this.max);
  }

  // イメージ読込完了
  HomographyApp.prototype.stageImageReady = function (that) {
      var w = this.stageImage.width;
      var h = this.stageImage.height;
    
        var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = this.stageImage.width;
      canvas.height = this.stageImage.height;
      ctx.drawImage(this.stageImage, 0, 0 );
    
      this.input = ctx.getImageData(this.offset.x, this.offset.y, w, h);

      this.origin = [[0, 0],[w, 0],[w, h],[0, h]];
      this.markers = [[20, 0],[w-20, 0],[w, h],[0, h]]; //初期 台形

      // アンカー初期化
      //this.initAnchor();
  };

  // 回転座標を取得
  HomographyApp.prototype.rotate2d = function (x, y, rad) {
      var pt = new Point();
      pt.x = Math.cos(rad) * x - Math.sin(rad) * y;
      pt.y = Math.sin(rad) * x + Math.cos(rad) * y;
      return pt;
  };

  HomographyApp.prototype.inverse = function (m)
{
  var inv = new Array(16);
  var invOut = new Array(16);
  var det;
  var i;

  inv[0] = m[5]  * m[10] * m[15] - 
           m[5]  * m[11] * m[14] - 
           m[9]  * m[6]  * m[15] + 
           m[9]  * m[7]  * m[14] +
           m[13] * m[6]  * m[11] - 
           m[13] * m[7]  * m[10];

  inv[4] = -m[4]  * m[10] * m[15] + 
            m[4]  * m[11] * m[14] + 
            m[8]  * m[6]  * m[15] - 
            m[8]  * m[7]  * m[14] - 
            m[12] * m[6]  * m[11] + 
            m[12] * m[7]  * m[10];

  inv[8] = m[4]  * m[9] * m[15] - 
           m[4]  * m[11] * m[13] - 
           m[8]  * m[5] * m[15] + 
           m[8]  * m[7] * m[13] + 
           m[12] * m[5] * m[11] - 
           m[12] * m[7] * m[9];

  inv[12] = -m[4]  * m[9] * m[14] + 
             m[4]  * m[10] * m[13] +
             m[8]  * m[5] * m[14] - 
             m[8]  * m[6] * m[13] - 
             m[12] * m[5] * m[10] + 
             m[12] * m[6] * m[9];

  inv[1] = -m[1]  * m[10] * m[15] + 
            m[1]  * m[11] * m[14] + 
            m[9]  * m[2] * m[15] - 
            m[9]  * m[3] * m[14] - 
            m[13] * m[2] * m[11] + 
            m[13] * m[3] * m[10];

  inv[5] = m[0]  * m[10] * m[15] - 
           m[0]  * m[11] * m[14] - 
           m[8]  * m[2] * m[15] + 
           m[8]  * m[3] * m[14] + 
           m[12] * m[2] * m[11] - 
           m[12] * m[3] * m[10];

  inv[9] = -m[0]  * m[9] * m[15] + 
            m[0]  * m[11] * m[13] + 
            m[8]  * m[1] * m[15] - 
            m[8]  * m[3] * m[13] - 
            m[12] * m[1] * m[11] + 
            m[12] * m[3] * m[9];

  inv[13] = m[0]  * m[9] * m[14] - 
            m[0]  * m[10] * m[13] - 
            m[8]  * m[1] * m[14] + 
            m[8]  * m[2] * m[13] + 
            m[12] * m[1] * m[10] - 
            m[12] * m[2] * m[9];

  inv[2] = m[1]  * m[6] * m[15] - 
           m[1]  * m[7] * m[14] - 
           m[5]  * m[2] * m[15] + 
           m[5]  * m[3] * m[14] + 
           m[13] * m[2] * m[7] - 
           m[13] * m[3] * m[6];

  inv[6] = -m[0]  * m[6] * m[15] + 
            m[0]  * m[7] * m[14] + 
            m[4]  * m[2] * m[15] - 
            m[4]  * m[3] * m[14] - 
            m[12] * m[2] * m[7] + 
            m[12] * m[3] * m[6];

  inv[10] = m[0]  * m[5] * m[15] - 
            m[0]  * m[7] * m[13] - 
            m[4]  * m[1] * m[15] + 
            m[4]  * m[3] * m[13] + 
            m[12] * m[1] * m[7] - 
            m[12] * m[3] * m[5];

  inv[14] = -m[0]  * m[5] * m[14] + 
             m[0]  * m[6] * m[13] + 
             m[4]  * m[1] * m[14] - 
             m[4]  * m[2] * m[13] - 
             m[12] * m[1] * m[6] + 
             m[12] * m[2] * m[5];

  inv[3] = -m[1] * m[6] * m[11] + 
            m[1] * m[7] * m[10] + 
            m[5] * m[2] * m[11] - 
            m[5] * m[3] * m[10] - 
            m[9] * m[2] * m[7] + 
            m[9] * m[3] * m[6];

  inv[7] = m[0] * m[6] * m[11] - 
           m[0] * m[7] * m[10] - 
           m[4] * m[2] * m[11] + 
           m[4] * m[3] * m[10] + 
           m[8] * m[2] * m[7] - 
           m[8] * m[3] * m[6];

  inv[11] = -m[0] * m[5] * m[11] + 
             m[0] * m[7] * m[9] + 
             m[4] * m[1] * m[11] - 
             m[4] * m[3] * m[9] - 
             m[8] * m[1] * m[7] + 
             m[8] * m[3] * m[5];

  inv[15] = m[0] * m[5] * m[10] - 
            m[0] * m[6] * m[9] - 
            m[4] * m[1] * m[10] + 
            m[4] * m[2] * m[9] + 
            m[8] * m[1] * m[6] - 
            m[8] * m[2] * m[5];

  det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

  if (det == 0)
      return false;

  det = 1.0 / det;

  for (i = 0; i < 16; i++)
      invOut[i] = inv[i] * det;

  return invOut;

  };

// 射影変換パラメータ取得(8次元連立方程式の8x8行列を4x4行列と2x2行列を組み合わせて解く)
  // http://sourceforge.jp/projects/nyartoolkit/document/tech_document0001/ja/tech_document0001.pdf
  HomographyApp.prototype.getParam = function (src, dest) {
      // X1 Y1 -X1x1 -Y1x1  A   x1 - C
      // X2 Y2 -X2x2 -Y2x2  B = x2 - C
      // X3 Y3 -X3x3 -Y3x3  G   x3 - C
      // X4 Y4 -X4x4 -Y4x4  H   x4 - C

      var Z = function (val) { return val == 0 ? 0.5 : val; };

      var X1 = Z(src[0][0]);
      var X2 = Z(src[1][0]);
      var X3 = Z(src[2][0]);
      var X4 = Z(src[3][0]);
      var Y1 = Z(src[0][1]);
      var Y2 = Z(src[1][1]);
      var Y3 = Z(src[2][1]);
      var Y4 = Z(src[3][1]);

      var x1 = Z(dest[0][0]);
      var x2 = Z(dest[1][0]);
      var x3 = Z(dest[2][0]);
      var x4 = Z(dest[3][0]);
      var y1 = Z(dest[0][1]);
      var y2 = Z(dest[1][1]);
      var y3 = Z(dest[2][1]);
      var y4 = Z(dest[3][1]);

      var tx = [
          X1, Y1, -X1 * x1, -Y1 * x1, // 1st column
          X2, Y2, -X2 * x2, -Y2 * x2, // 2nd column
          X3, Y3, -X3 * x3, -Y3 * x3, // 3rd column
          X4, Y4, -X4 * x4, -Y4 * x4  // 4th column
      ];

      tx = this.inverse(tx);

      // A = tx11x1 + tx12x2 + tx13x3 + tx14x4 " C(tx11 + tx12 + tx13 + tx14)
      // B = tx21x1 + tx22x2 + tx32x3 + tx42x4 " C(tx21 + tx22 + tx23 + tx24)
      // G = tx31x1 + tx23x2 + tx33x3 + tx43x4 " C(tx31 + tx32 + tx33 + tx34)
      // H = tx41x1 + tx24x2 + tx34x3 + tx44x4 " C(tx14 + tx24 + tx34 + tx44)
      var kx1 = tx[0] * x1 + tx[1] * x2 + tx[2] * x3 + tx[3] * x4;
      var kc1 = tx[0] + tx[1] + tx[2] + tx[3];
      var kx2 = tx[4] * x1 + tx[5] * x2 + tx[6] * x3 + tx[7] * x4;
      var kc2 = tx[4] + tx[5] + tx[6] + tx[7];
      var kx3 = tx[8] * x1 + tx[9] * x2 + tx[10] * x3 + tx[11] * x4;
      var kc3 = tx[8] + tx[9] + tx[10] + tx[11];
      var kx4 = tx[12] * x1 + tx[13] * x2 + tx[14] * x3 + tx[15] * x4;
      var kc4 = tx[12] + tx[13] + tx[14] + tx[15];

      //Y point
      var ty = [
          X1, Y1, -X1 * y1, -Y1 * y1, // 1st column
          X2, Y2, -X2 * y2, -Y2 * y2, // 2nd column
          X3, Y3, -X3 * y3, -Y3 * y3, // 3rd column
          X4, Y4, -X4 * y4, -Y4 * y4  // 4th column
      ];

      ty = this.inverse(ty);

      // A = tx11x1 + tx12x2 + tx13x3 + tx14x4 " C(tx11 + tx12 + tx13 + tx14)
      // B = tx21x1 + tx22x2 + tx32x3 + tx42x4 " C(tx21 + tx22 + tx23 + tx24)
      // G = tx31x1 + tx23x2 + tx33x3 + tx43x4 " C(tx31 + tx32 + tx33 + tx34)
      // H = tx41x1 + tx24x2 + tx34x3 + tx44x4 " C(tx14 + tx24 + tx34 + tx44)
      var ky1 = ty[0] * y1 + ty[1] * y2 + ty[2] * y3 + ty[3] * y4;
      var kf1 = ty[0] + ty[1] + ty[2] + ty[3];
      var ky2 = ty[4] * y1 + ty[5] * y2 + ty[6] * y3 + ty[7] * y4;
      var kf2 = ty[4] + ty[5] + ty[6] + ty[7];
      var ky3 = ty[8] * y1 + ty[9] * y2 + ty[10] * y3 + ty[11] * y4;
      var kf3 = ty[8] + ty[9] + ty[10] + ty[11];
      var ky4 = ty[12] * y1 + ty[13] * y2 + ty[14] * y3 + ty[15] * y4;
      var kf4 = ty[12] + ty[13] + ty[14] + ty[15];

      var det_1 = kc3 * (-kf4) - (-kf3) * kc4;
      if(det_1 == 0) { det_1 = 0.0001; }

      det_1 = 1 / det_1;
      var param = new Array(8);
      var C = (-kf4 * det_1) * (kx3 - ky3) + (kf3 * det_1) * (kx4 - ky4);
      var F = (-kc4 * det_1) * (kx3 - ky3) + (kc3 * det_1) * (kx4 - ky4);

      param[2] = C;             // C
      param[5] = F;             // F
      param[6] = kx3 - C * kc3; // G
      param[7] = kx4 - C * kc4; // G
      param[0] = kx1 - C * kc1; // A
      param[1] = kx2 - C * kc2; // B
      param[3] = ky1 - F * kf1; // D
      param[4] = ky2 - F * kf2; // E

      return param;
  };

  // 描画用の射影変換パラメータ取得
  HomographyApp.prototype.computeH = function (src, dest, min, max) {

      // 自由変形のため、画像サイズを取得用に4角から最小値と最大値を求める
      for(var i = 0; i < dest.length; i++) {
          var x = dest[i][0];
          var y = dest[i][1];
          if(x > max.x) { max.x = x; }
          if(y > max.y) { max.y = y; }
          if(x < min.x) { min.x = x; }
          if(y < min.y) { min.y = y; }
      }

      // 左上を原点(0,0)にするため移動(最小値分)
      for(var i = 0; i < dest.length; i++) {
          dest[i][0] -= min.x;
          dest[i][1] -= min.y;
      }

      // 射影変換パラメータ取得
      var param = this.getParam(src, dest);

      // 描画用に射影変換の逆行列パラメータにする
      var mx = [
          param[0], param[1], param[2], 0, // 1st column
          param[3], param[4], param[5], 0, // 2nd column
          param[6], param[7], 1, 0,        // 3rd column
                 0, 0, 0, 1                // 4th column
      ];

      mx = this.inverse(mx);

      var inv_param = new Array(9);
      inv_param[0] = mx[0];
      inv_param[1] = mx[1];
      inv_param[2] = mx[2];
      inv_param[3] = mx[4];
      inv_param[4] = mx[5];
      inv_param[5] = mx[6];
      inv_param[6] = mx[8];
      inv_param[7] = mx[9];
      inv_param[8] = mx[10];

      return inv_param;
  };

  HomographyApp.prototype.rotateByAround = function (point, angle, center) {
  var x2 = point.x - center.x;
  var y2 = point.y - center.y;
  return new Point(x2*Math.cos(angle) - y2*Math.sin(angle) + center.x, x2*Math.sin(angle) + y2*Math.cos(angle) + center.y);
  };
  
  HomographyApp.prototype.getNearestNeighbor = function (x,y) {
  return new Point((x + 0.5) | 0, (y + 0.5) | 0);
  };

  function toRad(deg) {
      return deg / 360 * 2 * Math.PI;
  }

  // 追加
  // 1. プレイヤー座標(px,py)を中心としてangle(rad)回転
  // 2. プレイヤーの少し後ろが下端になるように台形変形
  // 実際は逆に元画像の座標を取得する
  // 最近傍補間（ニアレストネイバー Nearest neighbor)
  /*HomographyApp.prototype.trimPlayerViewFromStageImage = function (ctx, px, py, protate) {
      var imgW = this.stageImage.width;
      var imgH = this.stageImage.height;
  var playerViewX = 100;
  var playerViewY = 500;
  var playerViewXOffset = playerViewX / 2;	//進行方向をX軸とする
  var playerViewYOffset = playerViewY - 30;
  var ret = ctx.createImageData(playerViewX * 4, playerViewY);
  var s = Math.sin(protate + toRad(90));
  var c = Math.cos(protate + toRad(90));
  for(var y = 0; y < playerViewY; y++) {
      //if(y % (Math.floor((600 - y) / 100) + 1) != 0) continue;
      for(var x = 0; x < playerViewX; x += 0.25) {
      //if(x % (Math.floor((600 - y) / 100) + 1) != 0) continue;
      if(y <= 250 && x % 1 != 0)continue;
      var tx1 = x + (px - playerViewXOffset);
      var ty1 = y + (py - playerViewYOffset);

      var x2 = tx1 - px;
      var y2 = ty1 - py;
      var p3 = this.getNearestNeighbor(x2*c - y2*s + px, x2*s + y2*c + py);
      
      var R, G, B;
      if(p3.x >= 0 && p3.x < imgW && p3.y >= 0 && p3.y < imgH) {
                  var pixelData = this.getPixel(this.input, p3.x, p3.y, imgW, imgH);
                  R = pixelData.R;
          G = pixelData.G;
                  B = pixelData.B;
      }
      else {
          R = 220;
          G = 220;
          B = 255;
      }
      if(y <= 200){
          R = (R + 220) / 2;
          G = (G + 220) / 2;
          B = (B + 255) / 2;
      }
      this.setPixel(ret, x * 4, y, R, G, B, 255);
      }
  }
      //ctx.putImageData(ret, 0, -400);
  return ret;
  };*/

  // 最近傍補間（ニアレストネイバー Nearest neighbor)
  HomographyApp.prototype.drawNearest = function (ctx, px, py, protate, param, sx, sy, w, h) {
      var imgW = this.stageImage.width;
      var imgH = this.stageImage.height;
    var playerViewXOffset = playerViewX / 2;	//進行方向をX軸とする
  var playerViewYOffset = playerViewY - 30;
    var scrw = 640;
    var scrh = 240;
      var output = ctx.createImageData(scrw, scrh);
    var s = Math.sin(protate + toRad(90));
  var c = Math.cos(protate + toRad(90));
      for(var y = 0; y < scrh; ++y) {
      //if(sy < 0 && i < -sy) continue;
          for(var x = 0; x < scrw; ++x) {
      //if(sx < 0 && j < -sx) continue;
            j = x - sx;
            i = y - sy;
              // u = (x*a + y*b + c) / (x*g + y*h + 1)
              // v = (x*d + y*e + f) / (x*g + y*h + 1)
              var tmp = j * param[6] + i * param[7] + param[8];
              var tmpX = (j * param[0] + i * param[1] + param[2]) / tmp;
              var tmpY = (j * param[3] + i * param[4] + param[5]) / tmp;

      var tx1 = tmpX + (px - playerViewXOffset);
      var ty1 = tmpY + (py - playerViewYOffset);

      var x2 = tx1 - px;
      var y2 = ty1 - py;
      var p3 = this.getNearestNeighbor(x2*c - y2*s + px, x2*s + y2*c + py);
      
      var R, G, B;
      if(p3.x >= 0 && p3.x < imgW && p3.y >= 0 && p3.y < imgH) {
                  var pixelData = this.getPixel(this.input, p3.x, p3.y, imgW, imgH);
                  R = pixelData.R;
          G = pixelData.G;
                  B = pixelData.B;
      }
      else {
          R = 220;
          G = 220;
          B = 255;
      }
      if(i <= 200){
          R = (R + 220) / 2;
          G = (G + 220) / 2;
          B = (B + 255) / 2;
      }
      this.setPixel(output, x, y, R, G, B, 255);
      
      /*var floorX;
      if(tmpY > 250) floorX = (tmpX * 4 + 0.5) | 0;
      else floorX = ((tmpX + 0.5) | 0) * 4;
              var floorY = (tmpY + 0.5) | 0;

              if(floorX >= 0 && floorX < imgW && floorY >= 0 && floorY < imgH) {
                  var pixelData = this.getPixel(pimage, floorX, floorY, imgW, imgH);
                  var R = pixelData.R;
                  var G = pixelData.G;
                  var B = pixelData.B;
                  this.setPixel(output, j, i, R, G, B, 255);
              }*/
          }
      }

      // ImageDataを描画
      ctx.putImageData(output, 0, 0);
  };

  // 双一次補間（バイリニア補間 Bilinear）
  HomographyApp.prototype.drawBilinear = function (ctx, param, sx, sy, w, h) {
      var imgW = this.stageImage.width;
      var imgH = this.stageImage.height;
      var output = ctx.createImageData(w, h);
      for(var i = 0; i < h; ++i) {
          for(var j = 0; j < w; ++j) {
              //u = (x*a + y*b + c) / (x*g + y*h + 1)
              //v = (x*d + y*e + f) / (x*g + y*h + 1)
              var tmp = j * param[6] + i * param[7] + param[8];
              var tmpX = (j * param[0] + i * param[1] + param[2]) / tmp;
              var tmpY = (j * param[3] + i * param[4] + param[5]) / tmp;

              var floorX = tmpX | 0;
              var floorY = tmpY | 0;

              if(floorX >= 0 && floorX < imgW && floorY >= 0 && floorY < imgH) {
                  // それぞれの方向からどの割合で足し合わせるか計算
                  var dx = tmpX - floorX;
                  var dy = tmpY - floorY;

                  var rgb00 = this.getPixel(this.input, floorX, floorY, imgW, imgH);
                  var rgb10 = this.getPixel(this.input, floorX + 1, floorY, imgW, imgH);
                  var rgb01 = this.getPixel(this.input, floorX, floorY + 1, imgW, imgH);
                  var rgb11 = this.getPixel(this.input, floorX + 1, floorY + 1, imgW, imgH);

                  var r0 = (rgb00.R * (1 - dx)) + (rgb10.R * dx);
                  var r1 = (rgb01.R * (1 - dx)) + (rgb11.R * dx);
                  var R = (r0 * (1 - dy) + r1 * dy) | 0;

                  var g0 = (rgb00.G * (1 - dx)) + (rgb10.G * dx);
                  var g1 = (rgb01.G * (1 - dx)) + (rgb11.G * dx);
                  var G = (g0 * (1 - dy) + g1 * dy) | 0;

                  var b0 = (rgb00.B * (1 - dx)) + (rgb10.B * dx);
                  var b1 = (rgb01.B * (1 - dx)) + (rgb11.B * dx);
                  var B = (b0 * (1 - dy) + b1 * dy) | 0;

                  this.setPixel(output, j, i, R, G, B, 255);
              }
          }
      }

      // ImageDataを描画
      //ctx.putImageData(output, sx, sy);
  };

  // 描画色を取得
  HomographyApp.prototype.getPixel = function (imageData, x, y, w, h) {
      if(x == w) { x = w - 1; }
      if(y == h) { y = h - 1; }

      var pixels = imageData.data;
      var index = (imageData.width * y * 4) + (x * 4);
      if(index < 0 || index + 3 > imageData.data.length) { return null; }

      return { R: imageData.data[index + 0], G: imageData.data[index + 1], B: imageData.data[index + 2], A: imageData.data[index + 3] };
  };

  // 描画色をセット
  HomographyApp.prototype.setPixel = function (imageData, x, y, r, g, b, a) {
      var pixels = imageData.data;
      var index = (imageData.width * y * 4) + (x * 4);
      if(index < 0 || index + 3 > pixels.length) { return false; }

      pixels[index + 0] = r;
      pixels[index + 1] = g;
      pixels[index + 2] = b;
      pixels[index + 3] = a;

      return true;
  };

  // 座標位置を表示
  HomographyApp.prototype.drawInfo = function (pt) {
      for(var i = 0; i < pt.length; i++) {
          var elm = document.getElementById("i" + (i + 1));
          elm.innerText = 'Anchor' + (i + 1) + '(' + pt[i].x + ',' + pt[i].y + ')';
      }
  };

  // アンカー初期化
  //HomographyApp.prototype.initAnchor = function () {
      // 1  2
      // 4  3
      //var _this = this;
      //for(var i = 0; i < this.markers.length; i++) {
     //     new Anchor((i + 1).toString(), this.markers[i][0] + this.offset.x, this.markers[i][1] + this.offset.y, true);
      //}

      // マウスイベント
      //document.addEventListener("mousemove", function (event) { return Anchor.onMouseMove(event); });
      //document.addEventListener("mouseup", function (event) { return Anchor.onMouseUp(event); });

      // マウス移動時のコールバック関数
      //this.render();
      //Anchor.callback = function () { return _this.render(); };
  //};

  // フレーム処理
  HomographyApp.prototype.render = function (player) {
      var ctx = this.context;
      var pt = [];

      // アンカー値をセット
      /*for(var i = 0; i < this.markers.length; i++) {
          pt.push(Anchor.getPoint("p" + (i + 1)));
          this.markers[i][0] = pt[i].x - this.offset.x;
          this.markers[i][1] = pt[i].y - this.offset.y;
      }*/


      // 画像サイズをセット
      var w = this.max.x - this.min.x;
      var h = this.max.y - this.min.y;

      // 角度0の時に形状保存
      /*if(this.degrees.value == "0") {
          // 回転用に各制御点の中心点との差をセット
          this.center = new Point(w / 2, h / 2);
          this.vertexs.length = 0;
          for(var i = 0; i < this.markers.length; i++) {
              this.vertexs.push(new Point(this.markers[i][0], this.markers[i][1]));
          }
      }*/

      // 描画クリア
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // 画像処理
  //tempImage = this.trimPlayerViewFromStageImage(ctx, player.x, player.y, player.rotate);
      // ニアレストネイバー
      this.drawNearest(ctx, player.x, player.y, player.rotate, this.inv_param, this.min.x, this.min.y, w, h);

      // 座標位置表示
      this.drawInfo(pt);
  };

  return HomographyApp;
})();
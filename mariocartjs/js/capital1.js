// Class Point
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
})();

// アンカークラス
var Anchor = (function () {

    // コンストラクタ
    function Anchor(no, x, y, v) {
        var elm = document.getElementById("p" + no);
        Anchor.move(elm, x, y);
        if(v) {
            if(Anchor.target == null) {
                // マウスダウン
                elm.addEventListener('mousedown', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    Anchor.target = elm;
                });
            }
        } else {
            elm.style.visibility = "hidden";
        }
    }

    Anchor.target = null;
    Anchor.target2 = null;
    Anchor.target3 = null;
    Anchor.callback = null;

    // 座標値セット
    Anchor.move = function move(e, xx, yy) {
        e.style.left = xx + "px";
        e.style.top = yy + "px";
    }

    // 座標値取得
    Anchor.getPoint = function getPoint(name) {
        var elm = document.getElementById(name);
        return new Point(elm.offsetLeft, elm.offsetTop);
    }

    // マウス移動処理
    Anchor.onMouseMove = function onMouseMove(e) {
        var elm = Anchor.target;
        if(elm) {
            Anchor.move(elm, e.clientX, e.clientY);
            if(Anchor.callback instanceof Function) {
                Anchor.callback();
            }
        }
    }

    // マウスアップ処理
    Anchor.onMouseUp = function onMouseUp(e) {
        Anchor.target = null;
    }

    return Anchor;
})();


//window.onload = function () {
//    app = new HomographyApp(document.getElementById('ctx'));
//};

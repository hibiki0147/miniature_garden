window.addEventListener('load',function() {

  // コンストラクタでは Canvas の取得ではなく「div」タグを生成しHTMLを勝手に整形している
  // ※同じ Canvas に HTML 整形後もコンストラクタを呼び出せば、関係なく整形するので壊れる可能性がある
  fmainCanvas = new fabric.Canvas('maincnv', { preserveObjectStacking: true });
  fcontentCanvas = new fabric.Canvas('contentcnv', { backgroundColor : 'rgb(255,255,255)' });

  fcontentCanvas.hoverCursor = 'pointer';
  // ブレンドカラーのフィルターもオブジェクトとしてシリアライズ化するよう設定
  fabric.Image.filters.BlendColor.prototype.toObject = function() {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      color: this.color,
      image: this.image,
      mode: this.mode,
      alpha: this.alpha
    });
  }

  // 削除コントロール追加
  let crossIcon = this.document.createElement('img');
  crossIcon.src = '../image/system/false-2061132.svg';
  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetX:16,
    offsetY: -16,
    cursorStyle: 'pointer',
    mouseUpHandler: removeImagesFromMain,
    render: renderIcon(crossIcon),
    cornerSize: 24
  });

  // 色変更コントロール追加
  let colorPicker = this.document.getElementById("colorPicker");
  colorPicker.addEventListener("input", colorPickerInputEvent);
  colorPicker.addEventListener("change", colorPickerChangeEvent);

  fabric.Object.prototype.controls.changeColorControl = new fabric.Control({
    x:-0.5,
    y:-0.5,
    offsetX:-16,
    offsetY: -16,
    cursorStyle: 'pointer',
    mouseUpHandler: colorPickerClick,
    render: renderColorButton(),
    cornerSize: 24
  });

  // 複製コントロール追加
  let copyIcon = this.document.createElement('img');
  copyIcon.src = '../image/system/duplicate-2935434.svg';
  fabric.Object.prototype.controls.copyControl = new fabric.Control({
    x:-0.5,
    y:0.5,
    offsetX:-16,
    offsetY: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: copyControlClick,
    render: renderIcon(copyIcon),
    cornerSize: 24
  });

  // 「前面へ」コントロール追加
  let frontIcon = this.document.createElement('img');
  frontIcon.src = '../image/system/front.svg';
  fabric.Object.prototype.controls.frontButton = new fabric.Control({
    x:0.5,
    y:0.25,
    offsetX:16,
    offsetY: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: bringToForward,
    render: renderIcon(frontIcon),
    cornerSize: 24
  });

  // 「背面へ」コントロール追加
  let backIcon = this.document.createElement('img');
  backIcon.src = '../image/system/back.svg';
  fabric.Object.prototype.controls.backButton = new fabric.Control({
    x:0.25,
    y:0.5,
    offsetX:16,
    offsetY: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: sendToBackWards,
    render: renderIcon(backIcon),
    cornerSize: 24
  });




  // ブラシ作成
  fmainCanvas.freeDrawingBrush = new fabric['PencilBrush'](fmainCanvas);
  fmainCanvas.freeDrawingBrush.color = 'rgba(' + cnvColor + ')';
  fmainCanvas.freeDrawingBrush.width = 10;
  let width = 200;

  // コンテンツに画像配置イベント用ボタン作成
  let cnt = 0;
  let names = ['動物', '鳥', '花', '人', '木'];
  imageFiles.forEach(element => {
    let text = names[cnt];
    let div = this.document.createElement('div');
    div.innerText = text;
    cnt += 1;
    div.addEventListener('click', function() {
      contentsHeight = 0;
      fcontentCanvas.clear();
      element.forEach(image => {
        setImagesToContent(image, width, 200, contentsHeight);
        contentsHeight += 200;
      });
      fcontentCanvas.setHeight(contentsHeight);
      fcontentCanvas.backgroundColor = "#fff";
      fcontentCanvas.requestRenderAll();
    });
    this.document.getElementsByClassName('label-wrapper')[0].appendChild(div);
  });

  // コンテンツに最初の画像配置
  contentsHeight = 0;
  imageFiles[0].forEach(image => {
    setImagesToContent(image, width, 200, contentsHeight);
    contentsHeight += 200;
  });

  // マウスイベント追加
  fmainCanvas.on('mouse:up', option => fmainCanvas_mouseup(option));
  fcontentCanvas.on('mouse:down', option => fcontentCanvas_mousedown(option));

  fcontentCanvas.setWidth(width);
  fcontentCanvas.setHeight(contentsHeight);
  fcontentCanvas.requestRenderAll();

  // サイドボタンにイベント追加
  let slideButton = document.getElementById('slideButton');
  slideButton.addEventListener('click', function() {
    document.getElementById('content-slideWrapper').classList.toggle('show');
  });

  // コンテンツの画像切り替え用ボタンの左右ボタン追加
  let contentChangerLeft = document.getElementsByClassName('content-changer-left')[0];
  let contentChangerRight = document.getElementsByClassName('content-changer-right')[0];
  let labelWrapper = document.getElementsByClassName('label-wrapper')[0];
  let labelWidth = 169 / 2;
  let maxlabelWrapperWidth = (labelWrapper.childElementCount - 3 ) * labelWidth;
  
  contentChangerLeft.style.visibility = "visible";

  contentChangerLeft.addEventListener('click', function() {
    labelWrapper.scrollLeft -= labelWidth;
    contentChangerRight.style.visibility = "visible";
    if(labelWrapper.scrollLeft < labelWidth / 2) {
      contentChangerLeft.style.visibility = "hidden";
      labelWrapper.scrollLeft = 0;
    }
  });

  contentChangerRight.addEventListener('click', function() {
    labelWrapper.scrollLeft += labelWidth;
    contentChangerLeft.style.visibility = "visible";
    
    if(labelWrapper.scrollLeft >= maxlabelWrapperWidth) {
      contentChangerRight.style.visibility = "hidden";
      labelWrapper.scrollLeft = maxlabelWrapperWidth + labelWidth;
    }
  });


  // canvasDraw.js 一応読み込み順を考慮
  canvasDrawOnload();
});

/* ======== 変数 ======== */
// オブジェクト
let fmainCanvas;
let fcontentCanvas;
let target;
let contents = [];
let contentsHeight = 0;


/* ======== 機能 ======== */
function setImageToMain(Img, x, y, scaleX, scaleY) {
  fabric.Image.fromURL(Img.src, function(oImg) {
    oImg.set( {
      scaleX: scaleX,
      scaleY: scaleY,
      left: x,
      top: y,
    } );
    var filter = new fabric.Image.filters.BlendColor({
      color:"#000000",
      mode:"tint",
      alpha:1
    });
    oImg.filters.push(filter);
    oImg.applyFilters();
    fmainCanvas.add(oImg);
  });
  
}

// canvasDraw.jsにてcontents内のオブジェクトすべてを設置する
function setImagesToMain() {
  for(let i = 0; i < contents.length; i++) {
    fmainCanvas.add(contents[i]);
  }
  fmainCanvas.requestRenderAll();
}


// 未使用
function setImagesToContent(url, x, y, width, height) {
  fabric.Image.fromURL(url, function(oImg) {
    oImg.set( {
      left:x,
      top:y,
      hasControls: false,	// 拡大縮小なし
      hasRotatingPoint: false,	// 回転なし
      lockScalingFlip: true,	// 裏返しをロック
      lockScalingFlip: false,
      lockMovementX:true,
      lockMovementY:true
    } );
    oImg.set('scaleX', width / oImg.width);
    oImg.set('scaleY', height / oImg.height);
    fcontentCanvas.add(oImg);
  });
}


function setImagesToContent(url, width, height, top) {
  fabric.Image.fromURL(url, function(oImg){
    // 縦横大きい方に比率を合わせる(200×200に比率を乱さずに張り付ける)
    let radio = oImg.width > oImg.height ? width / oImg.width : height / oImg.height;
    oImg.set({
      scaleX:radio,
      scaleY:radio,
      top: (height - oImg.height * radio) / 2 + top, // 中央寄せ
      left:(width - oImg.width * radio) / 2, // 中央寄せ
      hasControls: false,hasRotatingPoint: false,	lockScalingFlip: true,lockScalingFlip: false,lockMovementX:true,lockMovementY:true
    });
    /*oImg.scaleToHeight(height);*/
    fcontentCanvas.add(oImg);
  });
}


// 画像の色変更
function inputColor(target, color) {
  target.filters[0].color = color;
  target.applyFilters();
  fmainCanvas.requestRenderAll();
}

function changeColor(){
  addUndo();
}

/* ======== 削除イベント ======== */
function removeImagesFromMain(eventData, transform) {
  var target = transform.target;
  var canvas = target.canvas;
  Array.from(canvas.getActiveObjects()).forEach(target => {
    canvas.remove(target);
  });
  // canvas.remove(target);

  // undo：追加、redo：削除 canvasDraw.js
  addUndo();
  canvas.discardActiveObject();
  canvas.requestRenderAll();
}



function renderIcon(icon) {
  return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size/2, -size/2, size, size);
    ctx.restore();
  }
}

/* ======== 画像の色変更イベント ======== */
function colorPickerClick(eventData, transform) {
  let picker = this.document.getElementById("colorPicker");
  picker.value = fmainCanvas.getActiveObjects()[0].filters[0].color;
  picker.focus();// focusしてあげないと ios safari では開かなかった。
  picker.click();
}

function colorPickerInputEvent(){
  // let target = fmainCanvas.getActiveObject();
  let colorPicker = document.getElementById("colorPicker");
  Array.from(fmainCanvas.getActiveObjects()).forEach(target => {
    inputColor(target, colorPicker.value);
    target.applyFilters();
  });
  fmainCanvas.requestRenderAll();
}

function colorPickerChangeEvent(){
  changeColor();
}

function renderColorButton(){
  return function renderColorButton(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.beginPath();
    ctx.arc(0, 0, size/2, 0, 360 * Math.PI / 180, false);
    ctx.fillStyle = fmainCanvas.getActiveObjects()[0].filters[0].color;
    // ctx.fillStyle = fabricObject.filters[0].color;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = size/10;
    ctx.stroke();
    ctx.restore();
  }
}


/* ======== 複製イベント ======== */
function copyControlClick(eventData, transform) {
  transform.target.clone( (cloned => {
    cloned.left += 10;
    cloned.top += 10;
    transform.target.canvas.add(cloned);
  }) );
}



/* ======== 前面背面へイベント ======== */
function bringToForward(eventData, transform) {
  Array.from(fmainCanvas.getActiveObjects()).forEach(target => {
    // target.bringForward(false);
    fmainCanvas.bringForward(target);
  });
  addUndo();
}

function sendToBackWards(eventData, transform) {
  Array.from(fmainCanvas.getActiveObjects()).forEach(target => {
    fmainCanvas.sendBackwards(target);
    // target.sendBackwards(false);
  });
  addUndo();
}



/* ======== イベント ======== */
function fmainCanvas_mouseup(option) {
  if(fmainCanvas.isDrawingMode == false) {
    let mouse = fmainCanvas.getPointer(option.e);
    if(target != null) {
      if(fmainCanvas.size() >= 10) {
        alert('置ける物の上限は10個までです');
        target = null;
        return;
      }
      let x = mouse.x - (target.scaleX * target.width) / 2;
      let y = mouse.y - (target.scaleY * target.height) / 2;
      setImageToMain(target._element, x, y, target.scaleX, target.scaleY);
      target = null;
    }
  }
}


function fcontentCanvas_mousedown(option) {
  if(option.target) {
    target = option.target;
  }
}
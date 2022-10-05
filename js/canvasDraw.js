// canvas
function canvasDrawOnload() {
  
  img1 = this.document.getElementById('img1');
  img2 = this.document.getElementById('img2');

  img1.src = '../image/system/bg_none.png';
  img2.src = '../image/system/none.png';

  // fabric.js -> new fabric.Canvas()で自動生成されたラップクラスを取得
  let elems = document.getElementsByClassName('canvas-container');
  for(let i = 0; i < elems.length; i++) {
    if(elems[i].parentElement.className == 'main-wrapper') {
      fdiv = elems[i];
    }
  }

  resizeMainCanvas();

  this.window.addEventListener('resize', resizeMainCanvas);


  // 初期はコンテンツを置くレイヤー(中間レイヤー)
  fdiv.style.zIndex = 1;
  

  // イベント系
  modeEventSet();
  colorEventSet();
  boldEventSet();
  brushEventSet();
  clearEventSet();
  uiToggleEventSet();
}

/* ======== 変数 ======== */
// オブジェクト
let fdiv;
let img1;
let img2;

let modes;
let colors;
let bolds;
let brushes;

// 設定値
const cnvWidth = 500;
const cnvHeight = 400;
let cnvLayer = '1';
let cnvColor = '0, 0, 255, 1';  // 線の色
let cnvBold = 5;  // 線の太さ
let cnvBrush = 'Pencil';

const fgColor = '255, 240, 190, 1';
const bgColor = '255, 215, 180, 1';
const blueColor ='0, 0, 255, 1';
const transColor = '0, 0, 0, 0';

const optionBorder = "solid 1px #000";
const optionSelectBorder = "solid 3px rgb(0,255,0)";

let cnvProperties = {'0':[1, 0, 0], '1':[0, 0, 0],'2':[0, 0, 0]};

// その他
let undo_history = [];
let redo_history = [];
// fabric.jsのイベントを使うため、undo/redo時のイベント発火で追加されないようにするため
let lockHistoryFlg = false;


/* ======== 機能 ======== */
// モード（レイヤー）を変える
function modeChange(newLayer) {
  // 同じボタンがクリックされたら返す
  if (newLayer == cnvLayer) { 
    return false;
  }

  if(cnvLayer == '1' && newLayer != '1') {
    contents.length = 0;
    fmainCanvas.forEachObject(oImg => {
      contents.push(oImg);
    });
  }
  
  // キャンバスの画像と表示順入れ替え
  fdiv.style.zIndex = newLayer;
  let imgbuf = fmainCanvas.toDataURL({ 
      fomat:'png',
      top:0,
      left:0,
      width:fmainCanvas.width,
      height:fmainCanvas.height
    });
  let newImgsrc;
  
  if(img1.style.zIndex == newLayer) {
    newImgsrc = img1.src;
    img1.src = imgbuf;
    img1.style.zIndex = cnvLayer;
  }
  else if(img2.style.zIndex == newLayer) {
    newImgsrc = img2.src;
    img2.src = imgbuf;
    img2.style.zIndex = cnvLayer;
  }
  
  let flgBuf = lockHistoryFlg;
  lockHistoryFlg = true;
  

  fmainCanvas.clear();
  if(newLayer != '1') {
    fabric.Image.fromURL(newImgsrc, function(img) {
      img.set({
        scaleX:cnvWidth / img.width,
        scaleY:cnvHeight / img.height
      });
      fmainCanvas.setBackgroundImage(img);
      fmainCanvas.requestRenderAll();
      if(flgBuf != true) {
        undo_history.push([cnvLayer, JSON.stringify(fmainCanvas)]);
        lockHistoryFlg = false;
      }
    });
  }
  else {
    setImagesToMain();
    if(flgBuf != true) {
      undo_history.push([cnvLayer, JSON.stringify(fmainCanvas)]);
      lockHistoryFlg = false;
    }
  }
  cnvLayer = newLayer;

  switch(cnvLayer) {
    case '0':
      fmainCanvas.isDrawingMode = true;
      
      // colorChange(cnvColor);
      colors[0].className = "sand";
      colors[0].dataset.color = bgColor;
      colors[1].className = "blue";
      colors[1].dataset.color = blueColor;
      brushes[cnvProperties[newLayer][2]].click();
      bolds[cnvProperties[newLayer][1]].click();
      colors[cnvProperties[newLayer][0]].click();
      break;
    case '1':
      fmainCanvas.isDrawingMode = false;
      
      colorChange(cnvColor);
      break;
    case '2':
      fmainCanvas.isDrawingMode = true;
      
      colors[0].className = "sand2";
      colors[0].dataset.color = fgColor;
      colors[1].className = "transparent";
      colors[1].dataset.color = transColor;
      
      brushes[cnvProperties[newLayer][2]].click();
      bolds[cnvProperties[newLayer][1]].click();
      colors[cnvProperties[newLayer][0]].click();
      break;
    default:
      console.log('何もないよ' + cnvLayer.toString());
      break;
  }
}

// 色を変える
function colorChange(newColor) {
  cnvColor = newColor;
  if(cnvColor == transColor) {
    fmainCanvas.freeDrawingBrush = new fabric.EraserBrush(fmainCanvas);
    fmainCanvas.freeDrawingBrush.width = cnvBold;
  }
  else {
    fmainCanvas.freeDrawingBrush = new fabric[ cnvBrush + 'Brush'](fmainCanvas);
    fmainCanvas.freeDrawingBrush.color = 'rgba(' + cnvColor + ')';
    fmainCanvas.freeDrawingBrush.width = cnvBold;
  }
  fmainCanvas.freeDrawingCursor = getDrawCursor();
}

// 太さ変える
function boldChange(newBold) {
  // 数字に変換しないと盛大にバグる
  // (線を引き終えた時にキャンバスのどこに配置されるか予想できない)
  cnvBold = Number(newBold);
  fmainCanvas.freeDrawingBrush.width = cnvBold;
  // fmainCanvas.setCursor(getDrawCursor());
  fmainCanvas.freeDrawingCursor = getDrawCursor();
  console.log(fmainCanvas.freeDrawingCursor);
}

// ブラシを変える
function brushChange(newBrushName) {
  cnvBrush = newBrushName;
  fmainCanvas.freeDrawingBrush = new fabric[ cnvBrush + 'Brush'](fmainCanvas);
  fmainCanvas.freeDrawingBrush.color = 'rgba(' + cnvColor + ')';
  fmainCanvas.freeDrawingBrush.width = cnvBold;
}

// カーソルをブラシの太さ、色から取得する
function getDrawCursor() {
  let circle = `<svg height="${cnvBold}" viewBox="0 0 ${cnvBold * 2} ${cnvBold * 2}" width="${cnvBold}" xmlns="http://www.w3.org/2000/svg"><circle cx="50%" cy="50%" r="${cnvBold}" stroke="${`rgba(${cnvColor})`}" stroke-width="3" fill="none" /></svg>`;
  return `url("data:image/svg+xml;base64,${window.btoa(circle)}") ${cnvBold / 2} ${cnvBold / 2}, crosshair`;
}


// 初期状態に戻す
function clearCanvas() {
  modes[0].click();
  fmainCanvas.clear();
  contents.length = 0;
  fmainCanvas.requestRenderAll();
  img1.src = '../image/system/bg_none.png';
  img2.src = '../image/system/none.png';
  cnvLayer = 1;
  img1.style.zIndex = 0;
  img2.style.zIndex = 2;
  fdiv.style.zIndex = 1;
  
  undo_history.length = 1;
  redo_history.length = 0;
  console.log("クリア");
}

function undo() {
  if(undo_history.length > 0) {
    if(undo_history.length > 1) { // 最初の白紙は redo に入れない
      redo_history.push(undo_history.pop());
      console.log(`undo${undo_history.length}  redo${redo_history.length}`);
      let content = undo_history[undo_history.length - 1];
      lockHistoryFlg = true;
      console.log("lockHistoryFlg:undo:true");
      
      content = undo_history[undo_history.length - 1];
      
      if(content[0] != cnvLayer) {
        modeChange(content[0]);
      }

      fmainCanvas.loadFromJSON(content[1], function(){
        // fmainCanvas.requestRenderAll();
        if(content[0] != cnvLayer) {
          modeChange(cnvLayer);
        }
        lockHistoryFlg = false;
        console.log("lockHistoryFlg:undo:false");
        fmainCanvas.requestRenderAll();
        console.log(`undo${undo_history.length}`);
        // 次キャンバスに反映する Json が別レイヤーなら 再帰的呼び出し
        if(undo_history.length > 1 && content[0] != undo_history[undo_history.length - 2][0]) {
          undo();
        }
      });
    }else {
      console.log("undo1");
    }
  }
  else {
    console.log("undo0");
  }
}

function redo() {
  if (redo_history.length > 0) {
    const content = redo_history.pop();
    undo_history.push(content);
    console.log(`undo追加:${undo_history.length}`);

    lockHistoryFlg = true;
    console.log("lockHistoryFlg:redo:true");
    
    if(content[0] != cnvLayer) {
      modeChange(content[0]);
    }
    
    
    fmainCanvas.loadFromJSON(content[1], function () {
      // fmainCanvas.requestRenderAll();
      
      if(content[0] != cnvLayer) {
        modeChange(cnvLayer);
      }
      lockHistoryFlg = false;
      console.log("lockHistoryFlg:redo:false");
      
      fmainCanvas.requestRenderAll();
      console.log(`redo${redo_history.length}`);
      // 次キャンバスに反映する Json が別レイヤーなら 再帰的呼び出し
      if(redo_history.length > 0 && content[0] != redo_history[redo_history.length - 1][0]) {
        redo();
      }
    });
  }
  else {
    console.log("redo0");
  }
}

function addUndo(){
  if(lockHistoryFlg != true) {
    undo_history.push([cnvLayer, JSON.stringify(fmainCanvas)]);
    redo_history.length = 0;
  }
}


// キャンバスの大きさを変える
function setMainCanvsHeight(height) {
  fmainCanvas.setHeight(height);
  document.getElementsByClassName('main-wrapper')[0].style.height = `${height}px`;
  img1.style.height = `${height}px`;
  img2.style.height = `${height}px`;
}

function setMainCanvsWidth(width) {
  fmainCanvas.setWidth(width);
  document.getElementsByClassName('main-wrapper')[0].style.width = `${width}px`;
  img1.style.width = `${width}px`;
  img2.style.width = `${width}px`;
}

function resizeMainCanvas() {
  if(this.window.innerWidth < 625) {
    let w = this.window.innerWidth * 0.8;
    setMainCanvsWidth(w);
    setMainCanvsHeight(w * 0.8);
    document.getElementsByClassName('option')[0].style.width = `${w}px`;
    fmainCanvas.setZoom(w / cnvWidth);
  } else {
    if(fmainCanvas.width != 500 || fmainCanvas.height != 400) {
      setMainCanvsWidth(500);
      setMainCanvsHeight(400);
      document.getElementsByClassName('option')[0].style.width = `500px`;
      fmainCanvas.setZoom(1);
    }
  }
}



/* ======== イベント ======== */
function modeEventSet() {
  modes = document.getElementsByClassName('mode')[0].children;
  Array.from(modes).forEach(element => {
    element.addEventListener('click', function(event) {
      
      modeChange(element.dataset.mode);
      
      Array.from(modes).forEach(element => {
        element.style.border = optionBorder;
      });
      element.style.border = optionSelectBorder;
    });
  });
  modes[0].style.border = optionSelectBorder;
}

function colorEventSet() { 
  // 色の変更
  colors = document.getElementsByClassName('color')[0].children;
  Array.from(colors).forEach(element => {
    element.addEventListener('click', function(event){
      colorChange(element.dataset.color);
      Array.from(colors).forEach(element => {
        element.style.border = optionBorder;
      });
      cnvProperties[cnvLayer][0] = Array.from(colors).indexOf(element);
      element.style.border = optionSelectBorder;
    });
  });
  colors[0].style.border = optionSelectBorder;
}


function boldEventSet() {
  // 線の太さ変更
  bolds = document.getElementsByClassName('bold')[0].children;
  Array.from(bolds).forEach(element => {
    element.addEventListener('click', function(event) {
      boldChange(element.dataset.bold);
      cnvProperties[cnvLayer][1] = Array.from(bolds).indexOf(element);

      Array.from(bolds).forEach(element => {
        element.style.border = optionBorder;
      });
      element.style.border = optionSelectBorder;
    });
  });
  bolds[0].style.border = optionSelectBorder;
}

function brushEventSet() {
  brushes = document.getElementsByClassName('brush')[0].children;
  Array.from(brushes).forEach(element => {
    element.addEventListener('click', function(event) {
      brushChange(element.dataset.brush);
      cnvProperties[cnvLayer][2] = Array.from(brushes).indexOf(element);
      Array.from(brushes).forEach(element => {
        element.style.border = optionBorder;
      });
      element.style.border = optionSelectBorder;
    })
  });
  brushes[0].style.border = optionSelectBorder;
}

// UNDO/REDO
function clearEventSet() {
  let clears = document.getElementsByClassName('clear')[0].children;
  clears[0].addEventListener('click', undo);

  clears[1].addEventListener('click', function() {
    let result = confirm('本当にキャンバスを初期化しますか？\r\n(この動作は元に戻せません)');
    if(result) {
      clearCanvas();
    }
    else {
      console.log("キャンセル");
    }
  });

  clears[2].addEventListener('click', redo);

  undo_history.push([cnvLayer, JSON.stringify(fmainCanvas)]);

  // 追加時点＋適応時点＋削除時点
  
  fmainCanvas.on("object:added", function() {
    addUndo();
  });
  
  fmainCanvas.on("object:modified", function() {
    addUndo();
  });
  /*
  fmainCanvas.on("erasing:end", function() {
    if(lockHistoryFlg != true) {
      undo_history.push([cnvLayer, JSON.stringify(fmainCanvas)]);
      redo_history.length = 0;
    }
  });
  */
}


function uiToggleEventSet() {
  document.getElementById("uiToggleButton").addEventListener("click", uiToggleButtonClick);
}

let changerLeftVisibility;
let changerRightVisibility;
let nav_header;
let nav_toggle;

function uiToggleButtonClick() {
  let header = document.getElementsByTagName("header")[0];
  console.log(header);
  let option = document.getElementsByClassName("option")[0];
  let contentWrapper = document.getElementsByClassName("content-slideWrapper")[0];
  let contentChangerLeft = document.getElementsByClassName('content-changer-left')[0];
  let contentChangerRight = document.getElementsByClassName('content-changer-right')[0];
  let button = document.getElementById("uiToggleButton");

  if(button.dataset.uiToggle == "true") {
    header.style.visibility = "visible";
    header.children[0].style.visibility = nav_header;
    header.children[1].style.visibility = nav_toggle;

    option.style.visibility = "visible";
    contentWrapper.style.visibility = "visible";
    contentChangerLeft.style.visibility = changerLeftVisibility;
    contentChangerRight.style.visibility = changerRightVisibility;
    button.style.opacity = "1";
    button.dataset.uiToggle = "false";
    button.innerText = "非表示";
  }
  else {
    nav_header = header.children[0].style.visibility;
    nav_toggle = header.children[1].style.visibility;
    
    header.style.visibility = "hidden";
    Array.from(header.children).forEach((element) => {
      element.style.visibility = "hidden";
    });

    option.style.visibility = "hidden";
    contentWrapper.style.visibility = "hidden";
    changerLeftVisibility = contentChangerLeft.style.visibility;
    changerRightVisibility = contentChangerRight.style.visibility;
    contentChangerLeft.style.visibility = "hidden";
    contentChangerRight.style.visibility = "hidden";

    button.style.opacity = "0.5";
    button.dataset.uiToggle = "true";
    button.innerText = "表示";
  }
}
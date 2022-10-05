<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>SandGarden</title>
    <link rel="stylesheet" type="text/css" media="all" href="../css/main.css">
    <link rel="stylesheet" type="text/css" media="all" href="../css/system.css">
    <link rel="icon" href="../favicon.ico">
    <?php
      $files = glob("../image/content/*");
      foreach($files as $file) {
        $imageFiles[] = glob("$file/*");
      }
    ?>

    <script>
      let imageFiles = <?php echo json_encode($imageFiles); ?>;
    </script>

    <script src="../js/system.js"></script>
    <script src="../js/fabric.js"></script>
    <script src="../js/canvasDraw.js"></script>
    <script src="../js/content.js"></script>
    <script src="../js/toGraph.js"></script>
  </head>
  <body onclick="">
    <header>
      <div class="nav_toggle">
        <i></i>
        <i></i>
        <i></i>
      </div>
      <nav class="nav_header">
        <ul>
          <li>
            <a href="../index.html">ホーム</a>
          </li>
          <li>
            <a href="../index.html#explanation">箱庭とは</a>
          </li>
          <li>
            <a id="download">画像保存</a>
          </li>
          <!--<li>
            <a href="#">その他</a>
          </li>-->
        </ul>
      </nav>
    </header>
    <div id="uiToggleButton"" data-uiToggle="true">
      非表示
    </div>
    <!--<div style="position:absolute; width:20px; height: 500px; top: 45px;background-color:rgb(255,255,0);"></div>-->
    <div id="content-slideWrapper" class="content-slideWrapper">
      <div id="slideButton" class="slideButton">＋</div>
      <div class="content-changer">
        <div class="content-changer-left" style="text-align: center;width: 1.5rem; height: 1.5rem;">＜</div>
        <div class="label-wrapper" style="width: calc(217px - 3rem);pinter-event:none;">
          <!-- <div>を conetnt.js より後生成する -->
        </div>
        <div class="content-changer-right" style="text-align: center;width: 1.5rem; height: 1.5rem;">＞</div>
      </div>
      <div id="content-wrapper" class="content-wrapper">
        <div id="contents" class="contents">
          <canvas id="contentcnv" class="contentcnv"></canvas>
        </div>
      </div>
    </div>
    <main class="main">
      <div class="main-wrapper">
        <input id="colorPicker" type="color">
        <img id="img1" style="z-index: 0;" oncontextmenu="return false;">
        <img id="img2" style="z-index: 2;" oncontextmenu="return false;">
        <canvas id="maincnv" oncontextmenu="return false;"></canvas>
      </div>
      <div class="option">
        <div class="tooltip-wrapper" ontouchstart=””>
          <span>モード</span>
          <div class="tooltip">
            <div class="mode">
              <div class="selectObj" data-mode="1"><img src="../image/system/hand_143006.png" width="100%" height="100%" oncontextmenu="return false;"></div>
              <div class="selectSand" data-mode="0"><img src="../image/system/brush_black_107118.png" width="100%" height="100%" oncontextmenu="return false;"></div>
              <div class="selectSandWrap" data-mode="2"><img src="../image/system/brush_yellow_107118.png" width="100%" height="100%" oncontextmenu="return false;"></div>
            </div>
          </div>
        </div>
        <div class="tooltip-wrapper" ontouchstart=””>
          <span>カラー</span>
          <div class="tooltip">
            <div class="color">
              <div class="sand" data-color="255, 215, 180, 1"></div>
              <div class="blue" data-color="0, 0, 255, 1"></div>
            </div>
          </div>
        </div>
        <div class="tooltip-wrapper" ontouchstart=””>
          <span>太さ</span>
          <div class="tooltip">
            <div class="bold">
              <div class="small" data-bold="1">小</div>
              <div class="middle" data-bold="5">中</div>
              <div class="large" data-bold="10">大</div>
            </div>
          </div>
        </div>
        <div class="tooltip-wrapper" ontouchstart=””>
          <span>ブラシ</span>
          <div class="tooltip">
            <div class="brush">
              <div class="pencil" data-brush="Pencil" style="border"><img src="../image/system/pen.png" width="100%" height="100%" oncontextmenu="return false;"></div>
              <div class="spray" data-brush="Spray"><img src="../image/system/spray.png" width="100%" height="100%" oncontextmenu="return false;"></div>
            </div>
          </div>
        </div>
        <div class="tooltip-wrapper" ontouchstart="">
          <span>その他</span>
          <div class="tooltip" style="left:auto;right:0;">
            <div class="clear">
              <div><img src="../image/system/right-297788.svg" width="100%" height="100%" oncontextmenu="return false;" style="transform: scale(-1, 1);"></div>
              <div style="width:fit-content;">clear</div>
              <div><img src="../image/system/right-297788.svg" width="100%" height="100%" oncontextmenu="return false;" ></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  <footer>
  </footer>
  </body>
</html>
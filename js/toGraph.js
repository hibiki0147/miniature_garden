window.addEventListener('load',function() {
  // canvasを画像で保存
  this.document.getElementById('download').addEventListener('click', async function(){
    let a = document.getElementById("download");
    a.download = `sandCanvas-${getYYYYmmddHHMMSS(new Date())}.png`;
    a.href = await cnvToGraph();
  });
});

async function cnvToGraph() {
  let cnv = this.document.createElement('canvas');
  cnv.width = 500;
  cnv.height = 400;
  let ctx = cnv.getContext('2d');
  
  let promise = new Promise(function(resolve) {
    let cnvImage = new Image();
    cnvImage.style.width = '500px';
    cnvImage.style.height = '400px';
    cnvImage.onload = function() {
      let array = [img1, img2, fdiv];
      array.sort(function(a, b) { return a.style.zIndex - b.style.zIndex });
      array.forEach(element => {
        if(element == fdiv) {
          ctx.drawImage(cnvImage, 0, 0, 500, 400);
        }
        else {
          ctx.drawImage(element, 0, 0, 500, 400);
        }
      });
      resolve();
    };
    cnvImage.src = fmainCanvas.toDataURL({ 
      fomat:'png',
      top:0,
      left:0,
      width:fmainCanvas.width,
      height:fmainCanvas.height
    });
  });
  // 読み込みまで待つ
  await promise;
  return cnv.toDataURL("image/png");
}

function getYYYYmmddHHMMSS(d) {
  let YYYY = d.getFullYear();
  let mm = ('0' + (d.getMonth()+1)).slice(-2);
  let dd = ('0' + d.getDate()).slice(-2);
  let hh = ('0' + d.getHours()).slice(-2);
  let MM = ('0' + d.getMinutes()).slice(-2);
  let SS = ('0' + d.getSeconds()).slice(-2);
  console.log(`${YYYY}${mm}${dd}-${hh}${MM}${SS}`);
  return `${YYYY}${mm}${dd}-${hh}${MM}${SS}`;
}
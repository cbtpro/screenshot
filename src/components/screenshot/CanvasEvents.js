export default class Mosaic {
  constructor() {
      
  }
    
  startMosaic() {
    this.history = this.history.slice(0, this.stepNumber);
    let ev = event || window.event;
    this.dx = ev.clientX - this.canvas.offsetLeft;
    this.dy = ev.clientY - this.canvas.offsetTop;
    document.onmousemove = this.mousemove;
    document.onmouseup = this.stopMosaic;
  }
  mousemove() {
    let ev = event || window.event;
    let mx = ev.clientX - this.canvas.offsetLeft;
    let my = ev.clientY - this.canvas.offsetTop;
    if (
      Math.pow(this.dx - mx, 2) + Math.pow(this.dy - my, 2) >=
      Math.pow(this.mosaicSize * this.mosaicCount, 2)
    ) {
      //(this.mosaicSize*马赛克个数*2)的平方
      this.mosaic(mx, my);
      this.dx = mx;
      this.dy = my;
    }
  }
  stopMosaic() {
    this.history.push(
      this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
    );
    this.stepNumber = this.history.length;
    document.onmousemove = null;
    document.onmouseup = null;
  }
  mosaic(dx, dy) {
    //原始图像
    let originalImgData = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    let originalPxData = originalImgData.data;

    //用于循环修改
    let modifyImgData = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    let modifyPxData = modifyImgData.data;
    for (
      let i = dx - this.mosaicSize * this.mosaicCount;
      i < dx + this.mosaicSize * this.mosaicCount;
      i = i + 2 * this.mosaicSize + 1
    ) {
      for (
        let j = dy - this.mosaicSize * this.mosaicCount;
        j < dy + this.mosaicSize * this.mosaicCount;
        j = j + 2 * this.mosaicSize + 1
      ) {
        //中心点(dx,dy)
        // if(Math.pow(i-dx,2)+Math.pow(j-dy,2) <= Math.pow(this.mosaicSize*this.mosaicCount/2,2)){
        if (
          !(
            (i === dx - this.mosaicSize * this.mosaicCount &&
              j === dy - this.mosaicSize * this.mosaicCount) ||
            (i === dx - this.mosaicSize * this.mosaicCount &&
              j ===
                dy -
                  this.mosaicSize * this.mosaicCount +
                  2 * this.mosaicSize +
                  1) ||
            (i === dx - this.mosaicSize * this.mosaicCount &&
              j ===
                dy -
                  this.mosaicSize * this.mosaicCount +
                  4 * this.mosaicSize +
                  2) ||
            (i === dx - this.mosaicSize * this.mosaicCount &&
              j ===
                dy -
                  this.mosaicSize * this.mosaicCount +
                  12 * this.mosaicSize +
                  6) ||
            (i === dx - this.mosaicSize * this.mosaicCount &&
              j ===
                dy -
                  this.mosaicSize * this.mosaicCount +
                  14 * this.mosaicSize +
                  7) ||
            (i === dx - this.mosaicSize * this.mosaicCount &&
              j ===
                dy -
                  this.mosaicSize * this.mosaicCount +
                  16 * this.mosaicSize +
                  8) ||
            (i ===
              dx -
                this.mosaicSize * this.mosaicCount +
                16 * this.mosaicSize +
                8 &&
              j === dy - this.mosaicSize * this.mosaicCount) ||
            (i ===
              dx -
                this.mosaicSize * this.mosaicCount +
                16 * this.mosaicSize +
                8 &&
              j ===
                dy -
                  this.mosaicSize * this.mosaicCount +
                  2 * this.mosaicSize +
                  1) ||
            (i ===
              dx -
                this.mosaicSize * this.mosaicCount +
                16 * this.mosaicSize +
                8 &&
              j ===
                dy -
                  this.mosaicSize * this.mosaicCount +
                  4 * this.mosaicSize +
                  2) ||
            (i ===
              dx -
                this.mosaicSize * this.mosaicCount +
                16 * this.mosaicSize +
                8 &&
              j ===
                dy -
                  this.mosaicSize * this.mosaicCount +
                  12 * this.mosaicSize +
                  6) ||
            (i ===
              dx -
                this.mosaicSize * this.mosaicCount +
                16 * this.mosaicSize +
                8 &&
              j ===
                dy -
                  this.mosaicSize * this.mosaicCount +
                  14 * this.mosaicSize +
                  7) ||
            (i ===
              dx -
                this.mosaicSize * this.mosaicCount +
                16 * this.mosaicSize +
                8 &&
              j ===
                dy -
                  this.mosaicSize * this.mosaicCount +
                  16 * this.mosaicSize +
                  8) ||
            (i ===
              dx -
                this.mosaicSize * this.mosaicCount +
                2 * this.mosaicSize +
                1 &&
              j === dy - this.mosaicSize * this.mosaicCount) ||
            (i ===
              dx -
                this.mosaicSize * this.mosaicCount +
                4 * this.mosaicSize +
                2 &&
              j === dy - this.mosaicSize * this.mosaicCount) ||
            (i ===
              dx -
                this.mosaicSize * this.mosaicCount +
                12 * this.mosaicSize +
                6 &&
              j === dy - this.mosaicSize * this.mosaicCount) ||
            (i ===
              dx -
                this.mosaicSize * this.mosaicCount +
                14 * this.mosaicSize +
                7 &&
              j === dy - this.mosaicSize * this.mosaicCount) ||
            (i ===
              dx -
                this.mosaicSize * this.mosaicCount +
                2 * this.mosaicSize +
                1 &&
              j ===
                dy -
                  this.mosaicSize * this.mosaicCount +
                  16 * this.mosaicSize +
                  8) ||
            (i ===
              dx -
                this.mosaicSize * this.mosaicCount +
                4 * this.mosaicSize +
                2 &&
              j ===
                dy -
                  this.mosaicSize * this.mosaicCount +
                  16 * this.mosaicSize +
                  8) ||
            (i ===
              dx -
                this.mosaicSize * this.mosaicCount +
                12 * this.mosaicSize +
                6 &&
              j ===
                dy -
                  this.mosaicSize * this.mosaicCount +
                  16 * this.mosaicSize +
                  8) ||
            (i ===
              dx -
                this.mosaicSize * this.mosaicCount +
                14 * this.mosaicSize +
                7 &&
              j ===
                dy -
                  this.mosaicSize * this.mosaicCount +
                  16 * this.mosaicSize +
                  8)
          )
        ) {
          let sumR = 0;
          let sumG = 0;
          let sumB = 0;
          //找他周围的元素
          for (let x = -this.mosaicSize; x <= this.mosaicSize; x++) {
            for (let y = -this.mosaicSize; y <= this.mosaicSize; y++) {
              let xx = i + x;
              let yy = j + y;
              let pp = yy * this.canvas.width + xx; //周围的元素。
              sumR += originalPxData[pp * 4 + 0];
              sumG += originalPxData[pp * 4 + 1];
              sumB += originalPxData[pp * 4 + 2];
            }
          }

          let totlal = (2 * this.mosaicSize + 1) * (2 * this.mosaicSize + 1);
          let avgR = sumR / totlal;
          let avgG = sumG / totlal;
          let avgB = sumB / totlal;

          for (let x = -this.mosaicSize; x <= this.mosaicSize; x++) {
            for (let y = -this.mosaicSize; y <= this.mosaicSize; y++) {
              let xx = i + x;
              let yy = j + y;
              let pp = yy * this.canvas.width + xx; //周围的元素。
              modifyPxData[pp * 4 + 0] = avgR;
              modifyPxData[pp * 4 + 1] = avgG;
              modifyPxData[pp * 4 + 2] = avgB;
            }
          }
        }
      }
    }
    this.context.putImageData(
      modifyImgData,
      0,
      0,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
}

class ProgressCircle {
  constructor({ canvasId }) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.centerX = 100;
    this.centerY = 100;
    this.radius = 60;
    this.lineWidth = 10;
    this.strokeStyle = '#005BFF';
    this.hideClass = 'hide_circle';

    this.currentPercent = 0;
    this.angle = 0;
    this.isRotating = false;
    this.rotationFrame = null;
  }

  drawArc(percent) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (percent / 100) * 2 * Math.PI;

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  drawProgress(targetPercent) {
    if (targetPercent > this.currentPercent) {
      this.currentPercent += 1;
    } else if (targetPercent < this.currentPercent) {
      this.currentPercent -= 1;
    }

    this.drawArc(this.currentPercent);

    if (this.currentPercent !== targetPercent) {
      requestAnimationFrame(() => this.drawProgress(targetPercent));
    }
  }

  rotate() {
    if (!this.isRotating) return;
    this.angle = (this.angle + 1) % 360;
    this.canvas.style.transform = `rotate(${this.angle}deg)`;
    this.rotationFrame = requestAnimationFrame(() => this.rotate());
  }

  setRotation(enable) {
    if (enable) {
      if (this.isRotating) return;
      this.isRotating = true;
      this.rotate();
    } else {
      this.isRotating = false;
      if (this.rotationFrame !== null) {
        cancelAnimationFrame(this.rotationFrame);
        this.rotationFrame = null;
      }
    }
  }

  hide(enable) {
    if (enable) {
      this.canvas.classList.add(this.hideClass);
    } else {
      this.canvas.classList.remove(this.hideClass);
    }
  }

  setPercent(percent) {
    this.drawProgress(percent);
  }
}

const myCircle = new ProgressCircle({ canvasId: 'myCanvas' });

const percentInput = document.getElementById('percentInput');
const rotateToggle = document.getElementById('isRotate');
const hideToggle = document.getElementById('isHide');

percentInput.addEventListener('input', function () {
  const percent = parseInt(this.value, 10);
  myCircle.setPercent(percent);
});

rotateToggle.addEventListener('change', function () {
  myCircle.setRotation(this.checked);
});

hideToggle.addEventListener('change', function () {
  myCircle.hide(this.checked);
});

myCircle.setPercent(parseInt(percentInput.value, 10));

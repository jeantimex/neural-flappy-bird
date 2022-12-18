export class FpsMeter {
  private context: CanvasRenderingContext2D;
  private previousTime: number;
  private maxFps: number;

  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext("2d");
    this.maxFps = 60;
  }

  public update() {
    if (!this.previousTime) {
      this.previousTime = performance.now();
      return;
    }

    const currentTime = performance.now();

    if (currentTime - this.previousTime < 1000 / this.maxFps) return;

    const delta = (currentTime - this.previousTime) / 1000;
    const fps = Math.round(1 / delta);

    this.context.font = "16px Arial";
    this.context.fillText(`FPS: ${fps}`, 10, 30);
    this.previousTime = currentTime;
  }
}

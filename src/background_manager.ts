import { Assets } from "./types";

export class BackgroundManager {
  private assets: Assets;
  private canvas: HTMLCanvasElement;

  constructor(assets: Assets, canvas: HTMLCanvasElement) {
    this.assets = assets;
    this.canvas = canvas;
  }

  public update() {
    const context = this.canvas.getContext("2d");

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.drawImage(this.assets.background, 0, 0);
  }
}

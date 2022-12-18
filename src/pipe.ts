import { Assets } from "./types";
import { Bird } from "./bird";
import { random } from "./util";

export class Pipe {
  private assets: Assets;
  private canvas: HTMLCanvasElement;
  private gap: number;
  private pipeTopY: number;
  private pipeBottomY: number;
  private hasPassed: boolean;

  public width: number;
  public x: number;
  public top: number;
  public bottom: number;

  constructor(assets: Assets, canvas: HTMLCanvasElement, x: number) {
    this.assets = assets;
    this.canvas = canvas;

    this.x = x;
    this.gap = random(120, 150);
    this.width = this.assets.pipeTop.width;

    this.pipeTopY = random(0, -this.assets.pipeTop.height + 50);
    this.pipeBottomY = this.pipeTopY + this.assets.pipeTop.height + this.gap;

    this.top = this.pipeTopY + this.assets.pipeTop.height;
    this.bottom = this.pipeBottomY;

    this.hasPassed = false;
  }

  public update() {
    const context = this.canvas.getContext("2d");

    context.drawImage(this.assets.pipeTop, this.x, this.pipeTopY);
    context.drawImage(this.assets.pipeBottom, this.x, this.pipeBottomY);

    const speed = 1;
    this.x -= speed;
  }

  public isCollidedWithBird(bird: Bird) {
    if (bird.x + bird.width >= this.x && bird.x <= this.x + this.width) {
      if (bird.y <= this.top || bird.y + bird.height >= this.bottom) {
        return true;
      }
    }
    return false;
  }

  public isPassedByBird(bird: Bird): boolean {
    if (this.x + this.width < bird.x && !this.hasPassed) {
      this.hasPassed = true;
      return true;
    }
    return false;
  }
}

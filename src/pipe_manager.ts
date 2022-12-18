import { Assets } from "./types";
import { Pipe } from "./pipe";
import { random } from "./util";

export class PipeManager {
  private assets: Assets;
  private canvas: HTMLCanvasElement;
  private pipes: Array<Pipe>;

  constructor(assets: Assets, canvas: HTMLCanvasElement) {
    this.assets = assets;
    this.canvas = canvas;
    this.reset();
  }

  public reset() {
    this.pipes = [];
  }

  private addPipe() {
    const { width } = this.assets.background;
    const pipe = new Pipe(this.assets, this.canvas, width);

    this.pipes.push(pipe);
  }

  public update(): Array<Pipe> {
    if (this.pipes.length <= 0) {
      this.addPipe();
      return this.pipes;
    }

    for (const pipe of this.pipes) {
      pipe.update();
    }

    const lastPipe = this.pipes[this.pipes.length - 1];
    if (lastPipe.x < random(0, 10)) {
      this.addPipe();
    }

    const firstPipe = this.pipes[0];
    if (firstPipe.x < -this.assets.pipeTop.width) {
      this.pipes.shift();
    }

    return this.pipes;
  }

  public getClosestPipe(x: number) {
    let closest = null;
    let minimum = Infinity;

    for (let i = 0; i < this.pipes.length; i++) {
      const pipe = this.pipes[i];
      const dist = Math.min(
        Math.abs(x - pipe.x),
        Math.abs(x - pipe.x - pipe.width)
      );

      if (dist < minimum) {
        minimum = dist;
        closest = pipe;
      }
    }

    return closest;
  }
}

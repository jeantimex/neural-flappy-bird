import { Assets } from "./types";
import { BackgroundManager } from "./background_manager";
import { BirdManager } from "./bird_manager";
import { FpsMeter } from "./fps_meter";
import { PipeManager } from "./pipe_manager";
import { createCanvas, loadImage, map } from "./util";

export class App {
  private backgroundManager: BackgroundManager;
  private pipeManager: PipeManager;
  private birdManager: BirdManager;
  private fpsMeter: FpsMeter;

  public async run() {
    const assets = await this.loadAssets();
    const canvas = this.setupCanvas(assets);

    this.backgroundManager = new BackgroundManager(assets, canvas);
    this.pipeManager = new PipeManager(assets, canvas);
    this.birdManager = new BirdManager(assets, canvas, 300);
    this.fpsMeter = new FpsMeter(canvas);

    this.loop(assets, canvas);
  }

  private async loadAssets() {
    return {
      background: await loadImage("/assets/background.png"),
      bird: await loadImage("/assets/bird.png"),
      ground: await loadImage("/assets/ground.png"),
      pipeBottom: await loadImage("/assets/pipe-bottom.png"),
      pipeTop: await loadImage("/assets/pipe-top.png"),
    };
  }

  private setupCanvas(assets: Assets): HTMLCanvasElement {
    const canvas = createCanvas({
      width: assets.background.width,
      height: assets.background.height,
    });
    document.body.append(canvas);
    return canvas;
  }

  private loop(assets: Assets, canvas: HTMLCanvasElement) {
    const { width, height } = assets.background;

    this.backgroundManager.update();
    const pipes = this.pipeManager.update();
    const aliveBirds = this.birdManager.update();

    for (let i = aliveBirds.length - 1; i >= 0; i--) {
      const bird = aliveBirds[i];
      const closestPipe = this.pipeManager.getClosestPipe(
        bird.x + bird.width / 2
      );

      if (!closestPipe) continue;

      // Collect the neural network inputs and normalize them between 0 and 1.
      const inputs = [];
      // The 5 inpputs I have chosen for the network are:
      // 1. The horizontal distance of the pipe from the bird
      inputs[0] = map(closestPipe.x, bird.x, width, 0, 1);

      // 2. top of the closest pipe
      inputs[1] = map(closestPipe.top, 0, height, 0, 1);

      // 3. bottom of the closest pipe
      inputs[2] = map(closestPipe.bottom, 0, height, 0, 1);

      // 4. bird's y position
      inputs[3] = map(bird.y, 0, height, 0, 1);

      // 5. bird's velocity
      inputs[4] = map(bird.velocity, -12, 12, 0, 1);

      const shouldJump = bird.predict(inputs);
      if (shouldJump) {
        bird.jump();
      }

      const hasCollidedPipe = this.pipeManager.hasCollidedPipe(bird);
      if (hasCollidedPipe) {
        aliveBirds.splice(i, 1);
        continue;
      }

      const hasPassedPipe = this.pipeManager.hasPassedPipe(bird);
      if (hasPassedPipe) {
        bird.score++;
      }
    }

    if (aliveBirds.length === 0) {
      this.pipeManager.reset();
      this.birdManager.createNewGeneration();
    }

    this.fpsMeter.update();

    requestAnimationFrame(() => {
      this.loop(assets, canvas);
    });
  }
}

import { Assets } from "./types";
import { Bird } from "./bird";

export class BirdManager {
  private assets: Assets;
  private canvas: HTMLCanvasElement;
  private allBirds: Array<Bird>;
  private aliveBirds: Array<Bird>;
  private totalPopulation: number;
  private generation: number;

  constructor(
    assets: Assets,
    canvas: HTMLCanvasElement,
    totalPopulation: number
  ) {
    this.assets = assets;
    this.canvas = canvas;
    this.totalPopulation = totalPopulation;
    this.generation = 0;

    this.createNewGeneration();

    // Listen for keyboard strokes
    window.addEventListener("keydown", (event: KeyboardEvent) => {
      this.handleKeyDown(event);
    });
  }

  public createNewGeneration() {
    this.allBirds = [];
    this.aliveBirds = [];

    for (let i = 0; i < this.totalPopulation; i++) {
      const x = 50;
      const canvasHeight = this.assets.background.height;
      const y = canvasHeight / 2;
      const bird = new Bird(this.assets, this.canvas, x, y);

      this.aliveBirds.push(bird);
      this.allBirds.push(bird);
    }

    this.generation++;
  }

  public update(): Array<Bird> {
    for (let i = this.aliveBirds.length - 1; i >= 0; i--) {
      const bird = this.aliveBirds[i];
      bird.update();

      if (bird.isOutOfScreen()) {
        this.aliveBirds.splice(i, 1);
        continue;
      }

      //for (const pipe of pipes) {
      //  if (pipe.isCollidedWithBird(bird)) {
      //    this.aliveBirds.splice(i, 1);
      //  } else if (pipe.pass(bird.x)) {
      //    bird.score++;
      //  }
      //}
    }

    return this.aliveBirds;
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.code !== "Space") return;

    for (const bird of this.aliveBirds) {
      bird.jump();
    }
  }
}

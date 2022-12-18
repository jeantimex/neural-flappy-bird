import { Assets } from "./types";
import { NeuralNetwork } from "./neural_network";

export class Bird {
  private assets: Assets;
  private canvas: HTMLCanvasElement;
  private gravity: number;
  private upLift: number;
  private brain: NeuralNetwork;

  public width: number;
  public height: number;
  public x: number;
  public y: number;
  public score: number;
  public velocity: number;

  constructor(assets: Assets, canvas: HTMLCanvasElement, x: number, y: number) {
    this.assets = assets;
    this.canvas = canvas;

    this.width = this.assets.bird.width;
    this.height = this.assets.bird.height;

    this.gravity = 0.1;
    this.upLift = -12;
    this.velocity = 0;

    this.x = x;
    this.y = y;

    this.score = 0;

    this.brain = new NeuralNetwork(5, 8, 1);
  }

  public jump() {
    this.velocity += this.upLift;
    this.velocity *= 0.9;
  }

  public update() {
    const context = this.canvas.getContext("2d");
    context.drawImage(this.assets.bird, this.x, this.y);

    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;
  }

  public isOutOfScreen() {
    return this.y < 0 || this.y > this.assets.background.height - this.height;
  }

  public predict(inputs: Array<number>): boolean {
    const actions = this.brain.predict(inputs);
    return actions[0] > 0.5;
  }
}

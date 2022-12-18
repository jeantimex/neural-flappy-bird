import * as tf from "@tensorflow/tfjs";
import { GaussianRandom } from "./gaussian_random";
import { random } from "./util";

export class NeuralNetwork {
  private inputNodes: number;
  private hiddenNodes: number;
  private outputNodes: number;
  private model: tf.Sequential;
  private gaussianRandom: GaussianRandom;

  constructor(
    inputs: number,
    hiddenUnits: number,
    outputs: number,
    model = {}
  ) {
    this.inputNodes = inputs;
    this.hiddenNodes = hiddenUnits;
    this.outputNodes = outputs;

    this.gaussianRandom = new GaussianRandom();

    if (model instanceof tf.Sequential) {
      this.model = model;
    } else {
      this.model = this.createModel();
    }
  }

  // Copy a model
  copy(): NeuralNetwork {
    // @ts-ignore
    return tf.tidy(() => {
      const modelCopy = this.createModel();
      const weights = this.model.getWeights();
      const weightCopies = [];

      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }

      modelCopy.setWeights(weightCopies);

      return new NeuralNetwork(
        this.inputNodes,
        this.hiddenNodes,
        this.outputNodes,
        modelCopy
      );
    });
  }

  mutate(rate: number) {
    tf.tidy(() => {
      const weights = this.model.getWeights();
      const mutatedWeights = [];

      for (let i = 0; i < weights.length; i++) {
        const tensor = weights[i];
        const shape = weights[i].shape;
        const values = tensor.dataSync().slice();

        for (let j = 0; j < values.length; j++) {
          if (random(0, 1) < rate) {
            const w = values[j];
            values[j] = w + this.gaussianRandom.random();
          }
        }

        const newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }

      this.model.setWeights(mutatedWeights);
    });
  }

  dispose() {
    this.model.dispose();
  }

  predict(inputs: Array<number>) {
    return tf.tidy(() => {
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs) as tf.Tensor;
      const output = ys.dataSync();
      return output;
    });
  }

  createModel(): tf.Sequential {
    const model = tf.sequential();
    const hiddenLayer = tf.layers.dense({
      units: this.hiddenNodes,
      inputShape: [this.inputNodes],
      activation: "relu",
    });

    model.add(hiddenLayer);

    const outputLayer = tf.layers.dense({
      units: this.outputNodes,
      activation: "sigmoid",
    });
    model.add(outputLayer);

    return model;
  }
}

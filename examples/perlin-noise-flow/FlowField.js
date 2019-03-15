import {Vector} from 'p5';

export default class FlowField {
  constructor(scale, cols, rows) {
    this.vectors = new Array(cols * rows);
    this.scale = scale;
    this.cols = cols;
    this.rows = rows;
    this.zoff = 0;
    this.inc = 0.1;
  }

  generateField(p5) {
    let yoff = 0;
    for (let y = 0; y < this.rows; y++) {
      let xoff = 0;
      for (let x = 0; x < this.cols; x++) {
        const index = x + y * this.cols;
        const angle = p5.noise(xoff, yoff, this.zoff) * p5.TWO_PI * 4;
        const v = Vector.fromAngle(angle);
        v.setMag(1);
        this.vectors[index] = v;
        xoff += this.inc;
      }
      yoff += this.inc;

      this.zoff += 0.0003;
    }
  }

  getForce(x, y) {
    const xIdx = Math.floor(x / this.scale);
    const yIdx = Math.floor(y / this.scale);
    const index = xIdx + yIdx * this.cols;
    return this.vectors[index];
  }

  applyForceToParticle(particle) {
    const force = this.getForce(particle.pos.x, particle.pos.y);
    if (force instanceof Vector) {
      particle.applyForce(force);
    }
  }
}

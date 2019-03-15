import {Vector} from 'p5';

export default class Particle {
  constructor(p5) {
    this.pos = new Vector(p5.random(p5.width), p5.random(p5.height));
    this.vel = new Vector(1, 0);
    this.acc = new Vector(0, 0);
    this.prevPos = this.pos.copy();
    this.maxSpeed = 4;
    this.p5 = p5;
    this.radius = 1;
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.wrapEdges();
  }

  applyForce(force) {
    this.acc.add(force);
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  wrapEdges() {
    if (this.pos.x > this.p5.width) {
      this.pos.x = 0;
      this.prevPos.x = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = this.p5.width;
      this.prevPos.x = this.p5.width;
    }
    if (this.pos.y > this.p5.height) {
      this.pos.y = 0;
      this.prevPos.y = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = this.p5.height;
      this.prevPos.y = this.p5.height;
    }
  }
}

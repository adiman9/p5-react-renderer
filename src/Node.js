import {isFunction} from './utils';

const CONTEXTS = [
  'noFill',
  'noStroke',
  'stroke',
  'fill',
  'shearX',
  'applyMatrix',
  'resetMatrix',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'shearX',
  'shearY',
  'translate',
  'textAlign',
  'textLeading',
  'textSize',
  'textStyle',
  'angleMode',
];

export class Container {
  constructor(p5Instance = null, context = {}) {
    this.p5 = p5Instance;
    this.context = context;
    this._waitingForDraw = false;
    this.children = [];
  }

  _applyArgs(key, prop) {
    let obj = prop;
    if (typeof prop === 'string') {
      obj = this[prop];
    }
    if (Array.isArray(obj[key])) {
      this.p5[key](...obj[key]);
    } else if (isFunction(obj[key])) {
      const res = obj[key](this.p5);
      this.p5[key](res);
    } else {
      this.p5[key](obj[key]);
    }
  }

  _applyContext() {
    Object.keys(this.context).forEach(key => {
      if (this.p5[key] && isFunction(this.p5[key])) {
        this._applyArgs(key, 'context');
      }
    });
  }

  setContext(context) {
    this.context = context;
  }

  draw() {
    this._applyContext();

    this.children.forEach(child => {
      child.draw([]);
    });
  }

  queueDraw() {
    if (!this._waitingForDraw) {
      this._waitingForDraw = true;
      requestAnimationFrame(() => {
        this.draw();
        this._waitingForDraw = false;
      });
    }
  }

  add(child) {
    this.children.push(child);
  }

  remove(child) {
    this.children = this.children.filter(ch => ch !== child);
  }
}

export class Node extends Container {
  constructor(type, {args = [], ...props}, container) {
    super(container.p5);
    this.type = type;
    this.args = args;
    this.props = props;
    this.container = container;
  }

  applyPropsContext(context) {
    context.forEach(con => {
      Object.keys(con).forEach(key => {
        if (this.p5[key] && isFunction(this.p5[key])) {
          this._applyArgs(key, con);
        }
      });
    });

    // apply props
    Object.keys(this.props).forEach(key => {
      if (this.p5[key] && isFunction(this.p5[key])) {
        this._applyArgs(key, 'props');
      }
    });
  }

  queueDraw() {
    this.container.queueDraw();
  }

  draw(context) {
    const {p5} = this.container;
    if (p5[this.type] && isFunction(p5[this.type])) {
      if (CONTEXTS.includes(this.type)) {
        context.push({
          [this.type]: this.args,
          ...this.props,
        });
      }
      // save current drawing style
      p5.push();
      // Update drawing style based on props and context
      this.applyPropsContext(context);

      this._applyArgs(this.type, {[this.type]: this.args});

      // reset drawing style
      p5.pop();
    }

    this.children.forEach(child => {
      child.draw([...context]);
    });
  }
}

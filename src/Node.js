import {isFunction} from './utils';

const CONTEXTS = ['noFill', 'noStroke', 'stroke', 'fill'];

export class Container {
  constructor(p5Instance = null, context = {}) {
    this.p5 = p5Instance;
    this.context = context;
    this._waitingForDraw = false;
    this.children = [];
  }

  _applyContext() {
    Object.keys(this.context).forEach(key => {
      if (this.p5[key] && isFunction(this.p5[key])) {
        if (Array.isArray(this.context[key])) {
          this.p5[key](...this.context[key]);
        } else {
          this.p5[key](this.context[key]);
        }
      }
    });
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
          if (Array.isArray(con[key])) {
            this.p5[key](...con[key]);
          } else {
            this.p5[key](con[key]);
          }
        }
      });
    });

    // apply props
    Object.keys(this.props).forEach(key => {
      if (this.p5[key] && isFunction(this.p5[key])) {
        if (Array.isArray(this.props[key])) {
          this.p5[key](...this.props[key]);
        } else {
          this.p5[key](this.props[key]);
        }
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

      if (Array.isArray(this.args)) {
        p5[this.type](...this.args);
      } else {
        p5[this.type](this.args);
      }
      // reset drawing style
      p5.pop();
    }

    this.children.forEach(child => {
      child.draw([...context]);
    });
  }
}

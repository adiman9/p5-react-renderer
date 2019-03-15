# p5 React Renderer

This library allows you to use p5.js as a render target for React. This means
you can write interactive p5 code while leveraging the power of React's
declarative style.

Writing p5 sketches this way opens up the door for reusable components and
cleaner code, even when the sketches grow in complexity.

## Usage

At its core all p5 methods can now be used as jsx elements and props to jsx
elements. The arguments to a p5 method now become an array passed to the jsx
element in an `args` prop.

Eg.

```jsx
// This p5 code
circle(100, 100, 10);

// Becomes this jsx
<circle args={[100, 100, 10]} />;
```

For methods that only take one argument you don't need to supply it as an array.

### Passing functions as props

Any prop given to a p5 jsx element can also accept a function that will return
the arguments. The difference being that the function will be given the p5
object as an argument. This allows you access to the p5 constants and methods
etc.

```jsx
// These are equivalent
<circle args={[100, 100, 10]} />

<circle args={p5 => {
  // do work using p5.TWO_PI and other methods and constants etc
  return [100, 100, 10];
}} />
```

### P5 methods as props

P5 methods can also be given as props to elements.

Eg.

```jsx
<circle args={[100, 100, 10]} fill="white" />

// or
<circle args={[100, 100, 10]} fill={255} />

// or
<circle args={[100, 100, 10]} fill={p5 => {
  p5.colorMode(p5.HSB);
  return [255, 255, 255, 25];
}} />
```

You can also use most "settings" methods like `fill`, `stroke`, `noFill`,
`colorMode` etc as components and nest other elements inside. All these children
elements will inherit the behaviour.

Eg.

```jsx
<fill args="red" colorMode={p5 => p5.RGB}>
  // Everything in here will have a red fill and any color // work in components
  will use RGB color mode
  <circle args={[100, 100, 10]} />
  <noStroke>
    // Everthing in here will have red fill and no stroke
    <rect args={[200, 150, 10, 20]} />
    // This rect will have a stroke as its stroke // takes priority over the
    parent
    <rect args={[500, 350, 10, 20]} stroke={150} />
  </noStroke>
  <colorMode args={p5 => p5.HSB}>// Anything in here will override the RBG colorMode and // will instead use HSB</colorMode>
</fill>
```

## Code example

Here is a minimal example:

```jsx
import React from 'react';
import ReactDom from 'react-dom';
import { Canvas } from 'p5-react-renderer';

function App() {
  return (
    <Canvas size={[800, 800]} background={0}>
      <stroke args{255} strokeWeight={2}>
        <circle args={[300, 300, 20]} />
        <rect args={[700, 400, 100, 100]} noFill />
      </stroke>
      <noStroke>
        <rect args={[700, 400, 100, 100]} fill="red" />
      </noStroke>
    </Canvas>
  );
}
ReactDom.render(<App />, document.getElementById('app'));
```

## Hooks

P5 provides a lot of "event" type functions such as `mousePressed` and
`keyTyped` etc. All of these are available inside components as
`useMousePressed` and `useKeyTyped` etc

_Note_: Something to note about the use of these custom hooks. They only work
inside components that are nested inside the `Canvas` component. This means they
are not available in the `App` component that uses the `Canvas` in its render.

A few more convenience hooks are provided:

- `useP5` - Simply returns the active p5 object. This contains all the methods
  and constants you are accustomed to using as globals in normal p5.
- `useDraw` - Takes a function that will be called on every draw loop. Useful
  for updating object state on each draw loop. The function passed to `useDraw`
  will also be passed the p5 object every time it is called.
- `useP5Effect` - Exactly the same as `useEffect` except you are given the p5
  object as an argument to the callback function.
- `useP5LayoutEffect` - Exactly the same as `useLayoutEffect` except you are
  given the p5 object as an argument to the callback.

## Clear the canvas on every loop

The default behaviour of the `Canvas` component is that it will clear and redraw
the canvas every time something changes. If you do not want to clear the canvas
on every draw loop you should provide the `Canvas` component with a `noClear`
prop:

```jsx
// This will clear and redraw the canvas on every loop
<Canvas>
  // components
</Canvas>

// This will draw new changes on top of existing drawings
<Canvas noClear>
  // components
</Canvas>
```

## Usage notes

While all react features are available to you it is not advisable to manage
state the needs to update on every draw with react, especially if there are many
instances of a given object on the canvas all with their own state that updates
on every draw cycle.

### Not advisable to do the following:

```jsx
import React, {useState} from 'react';
import {Vector} from 'p5';
import {useDraw} from 'p5-react-renderer';

function Particle() {
  const [pos, setPos] = useState(new Vector(0, 0));
  const [vel, setVel] = useState(new Vector(1, 0));

  useDraw(p5 => {
    pos.add(vel);
    setPos(pos);
  });

  return <circle args={[pos.x, pos.y, 2]} fill="white" />;
}

function App() {
  // 1000 particles all setting state and each triggering
  // react to recalc the tree every draw loop!!!! YIKES!!!
  const particles = new Array(1000)
    .fill(null)
    .map((p, i) => <Particle key={i} />);

  return <Canvas size={[800, 800]}>{particles}</Canvas>;
}
```

Instead it is much more advisable to manage state by using a ref to vanilla
javascript objects and call the `useDraw` hook only once in the top level of
your app and recalculate state of the raw javascript objects there and use those
raw javascript objects to pass props to components.

### Do this instead

```jsx
import React, {useRef, useEffect} from 'react';
import {Vector} from 'p5';
import {useDraw} from 'p5-react-renderer';

class Particle {
  constructor() {
    this.pos = Vector(0, 0);
    this.vel = Vector(0, 0);
  }
  update() {
    this.pos.add(this.val);
  }
}

function App() {
  const particles = useRef([]);

  useEffect(() => {
    particles.current = new Array(1000)
      .fill(null)
      .map((p, i) => new Particle());
  }, []);

  const particleEls = particles.current.map((p, i) => {
    p.update();
    return <circle args={[p.pos.x, p.pos.y, 2]} fill="white" />;
  });

  return <Canvas size={[800, 800]}>{particlesEls}</Canvas>;
}
```

Doing it this way keeps react from doing too much recalculations of the render
tree and speeds things up considerably. It also keeps react as the presentation
layer and raw javascript objects as the logic layer.

You can see a full example of this in [/examples/perline-noise-flow].

## Why make this library?

The reason is twofold. Firstly I wanted to learn more about React by
implementing my own custom renderer. Secondly, I am a big fan of the p5.js
library and html canvas more generally. However, complexity quickly get's out of
hand with p5, especially as the library itself encourages globals and code is
necessarily imperative.

By using React you get all the advantages of declarative code with clean,
reusable and reactive components. All the while still maintaining the easy to
use abstractions exposed by p5.

## Word of warning

This is super super alpha right now, so use at your own discretion.

## Contributing

Contributors are welcomed and encouraged. Submit a PR and let's get started.

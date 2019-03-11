import React, {useState, useEffect} from 'react';
import ReactDom from 'react-dom';
import {
  Canvas,
  useDraw,
  useP5,
  useP5Effect,
  useP5LayoutEffect,
  useKeyTyped,
} from '../../src';

function Stuff() {
  const [state, setState] = useState([300, 300, 20]);
  const [img, setImg] = useState(null);
  const [color, setColor] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setState([500, 500, 50]);
    }, 2000);
  }, []);

  useKeyTyped(key => {
    console.log(key);
  });

  useDraw(() => {
    // setState(s => {
    //   s[0] += 1;
    //   return [...s];
    // });
  });

  const {width, height, mouseX} = useP5();
  console.log(width, height, mouseX);

  useP5Effect(p5 => {
    const p5img = p5.loadImage(
      'https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png',
    );
    setImg(p5img);
  }, []);

  useP5LayoutEffect(p5 => {
    const c = p5.color(100, 50, 150);
    c.setAlpha(50);
    setColor(c);
  }, []);

  return (
    <>
      {img && <image args={[img, 0, 0]} />}
      <stroke args={'red'} strokeWeight={2}>
        <stroke args={255} strokeWeight={1}>
          <circle args={state} />
          <noFill>
            <rect args={[30, 20, 55, 55, 20, 15, 10, 5]} />
            <rect
              args={[400, 200, 100, 100]}
              stroke={p5 => {
                p5.colorMode(p5.HSB);
                return p5.color(255, 100, 100);
              }}
              fill={color}
            />
          </noFill>
        </stroke>
        <rect args={[700, 400, 100, 100]} />
      </stroke>
    </>
  );
}

function App() {
  const [ready, setReady] = useState(true);
  const [size, setSize] = useState([400, 400]);
  const [properties, setProperties] = useState({
    background: 100,
    fill: '#f539de',
  });

  useEffect(() => {
    setTimeout(() => {
      setSize([800, 800]);
    }, 5000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setProperties({
        background: 'red',
        fill: 'white',
      });
    }, 9000);
  }, []);

  return (
    <>
      {ready && (
        <Canvas
          size={size}
          {...properties}
          onClick={() => {
            console.log('clicked canvas');
          }}
        >
          <Stuff />
        </Canvas>
      )}
      <button
        onClick={() => {
          setReady(r => !r);
        }}
      >
        Click
      </button>
    </>
  );
}

ReactDom.render(<App />, document.getElementById('app'));

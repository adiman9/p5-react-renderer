import React, {useState, useEffect} from 'react';
import ReactDom from 'react-dom';
import {Canvas, useDraw, useP5} from '../src';

function Stuff() {
  const [state, setState] = useState([300, 300, 20]);

  useEffect(() => {
    setTimeout(() => {
      setState([500, 500, 50]);
    }, 2000);
  }, []);

  // TODO more hooks to use p5 lifecycle functions like mouseMove etc Mon 11 Mar 2019 01:04:49 GMT

  useDraw(() => {});

  const {width, height, mouseX} = useP5();
  console.log(width, height, mouseX);

  return (
    <>
      <noFill>
        <circle args={state} />
        <rect args={[30, 20, 55, 55, 20, 15, 10, 5]} />
        <rect args={[400, 200, 100, 100]} />
      </noFill>
      <rect args={[700, 400, 100, 100]} />
    </>
  );
}

function App() {
  return (
    <Canvas
      size={[800, 800]}
      background={100}
      fill={'#f539de'}
      onClick={() => {
        console.log('clicked canvas');
      }}
    >
      <Stuff />
    </Canvas>
  );
}

ReactDom.render(<App />, document.getElementById('app'));

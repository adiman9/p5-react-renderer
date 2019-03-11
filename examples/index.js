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

  useDraw(() => {
    // setState(s => {
    //   s[0] += 1;
    //   return [...s];
    // });
  });

  const {width, height, mouseX} = useP5();
  console.log(width, height, mouseX);

  return (
    <>
      <stroke args={'red'} strokeWeight={2}>
        <stroke args={255} strokeWeight={1}>
          <circle args={state} />
          <noFill>
            <rect args={[30, 20, 55, 55, 20, 15, 10, 5]} />
            <rect args={[400, 200, 100, 100]} stroke={'yellow'} />
          </noFill>
        </stroke>
        <rect args={[700, 400, 100, 100]} />
      </stroke>
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
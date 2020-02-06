import React from 'react';
import ReactDom from 'react-dom';
import {Canvas} from 'p5-react-renderer';
import ParticleSystem from './ParticleSystem';

function App() {
  return (
    <Canvas size={[800, 800]} background={50} noStroke noClear>
      <colorMode args={p5 => [p5.HSB, 255]}>
        <ParticleSystem num={300} />
      </colorMode>
    </Canvas>
  );
}

ReactDom.render(<App />, document.getElementById('app'));

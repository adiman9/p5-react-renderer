import {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {StateContext} from './canvas';

export function useP5Event(event, fn) {
  const {subscribe, unsubscribe} = useContext(StateContext);
  useEffect(() => {
    subscribe(event, fn);
    return () => unsubscribe(event, fn);
  }, []);
}

export function useDraw(fn) {
  const [frame, setFrames] = useState(0); // eslint-disable-line no-unused-vars
  useP5Event('draw', p5 => {
    fn(p5);
    setFrames(f => f + 1);
  });
}

// TODO anyway of getting useP5 etc to work in the top level app component Tue 12 Mar 2019 01:11:31 GMT

export function useP5() {
  const {canvas} = useContext(StateContext);
  return canvas;
}

export function useP5Effect(fn, deps) {
  const p5 = useP5();
  useEffect(() => fn(p5), deps);
}

export function useP5LayoutEffect(fn, deps) {
  const p5 = useP5();
  useLayoutEffect(() => fn(p5), deps);
}

export function useKeyPressed(fn) {
  useP5Event('keyPressed', fn);
}

export function useKeyReleased(fn) {
  useP5Event('keyReleased', fn);
}

export function useKeyTyped(fn) {
  useP5Event('keyTyped', fn);
}

export function useMouseMoved(fn) {
  useP5Event('mouseMoved', fn);
}

export function useMouseDragged(fn) {
  useP5Event('mouseDragged', fn);
}

export function useMousePressed(fn) {
  useP5Event('mousePressed', fn);
}

export function useMouseReleased(fn) {
  useP5Event('mouseReleased', fn);
}

export function useMouseClicked(fn) {
  useP5Event('mouseClicked', fn);
}

export function useDoubleClicked(fn) {
  useP5Event('doubleClicked', fn);
}

export function useMouseWheel(fn) {
  useP5Event('mouseWheel', fn);
}

export function useTouchStarted(fn) {
  useP5Event('touchStarted', fn);
}

export function useTouchMoved(fn) {
  useP5Event('touchMoved', fn);
}

export function useTouchEnded(fn) {
  useP5Event('touchEnded', fn);
}

export function useDeviceMoved(fn) {
  useP5Event('deviceMoved', fn);
}

export function useDeviceTurned(fn) {
  useP5Event('deviceTurned', fn);
}

export function useDeviceShaken(fn) {
  useP5Event('deviceShaken', fn);
}

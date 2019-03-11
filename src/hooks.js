import {useContext, useEffect, useLayoutEffect} from 'react';
import {StateContext} from './canvas';

export function useDraw(fn) {
  const {subscribe} = useContext(StateContext);
  useEffect(() => subscribe(fn), []);
}

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

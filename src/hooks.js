import {useContext, useEffect} from 'react';
import {StateContext} from './canvas';

export function useDraw(fn) {
  const {subscribe} = useContext(StateContext);
  useEffect(() => subscribe(fn), []);
}

export function useP5() {
  const {canvas} = useContext(StateContext);
  return canvas;
}

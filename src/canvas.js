import React, {useRef, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import P5 from 'p5';
import {render} from './reconciler';
import {Container} from './Node';
import {isFunction} from './utils';

export const StateContext = React.createContext();

const Canvas = ({children, size: [x, y] = [100, 100], ...props}) => {
  const wrapper = useRef(null);
  const [newProps, setNewProps] = useState({});
  const state = useRef({
    canvas: null,
    container: null,
    active: false,
    subscribers: [],
    subscribe: fn => {
      state.current.subscribers.push(fn);
      return () => {
        state.current.subscribers = state.current.subscribers.filter(
          s => s === fn,
        );
      };
    },
  });

  useEffect(() => {
    // TODO allow canvas props to change and recreation of canvas accordingly Sun 10 Mar 2019 02:16:18 GMT
    state.current.active = true;
    state.current.canvas = new P5(sketch => {
      sketch.setup = () => {
        sketch.createCanvas(x, y);
        const propsCopy = {
          ...props,
        };

        Object.keys(props).forEach(key => {
          if (!isFunction(sketch[key])) return;

          if (Array.isArray(props[key])) {
            sketch[key](...props[key]);
          } else {
            sketch[key](props[key]);
          }
          delete propsCopy[key];
        });
        setNewProps(propsCopy);
        sketch.noLoop();
      };
    }, wrapper.current);
    state.current.container = new Container(state.current.canvas, props);
  }, []);

  useEffect(() => {
    const drawLoop = () => {
      if (!state.current.active) return;
      requestAnimationFrame(drawLoop);

      state.current.subscribers.forEach(fn => fn(state.current));
    };

    requestAnimationFrame(drawLoop);

    return () => {
      state.current.active = false;
      state.current.canvas.remove();
      state.current.canvas = null;
      state.current.container = null;
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      render(
        <StateContext.Provider value={{...state.current}}>
          <renderWrapper>{children}</renderWrapper>
        </StateContext.Provider>,
        state.current.container,
      );
    });
  });

  return <div ref={wrapper} {...newProps} />;
};

Canvas.propTypes = {
  children: PropTypes.element,
  size: PropTypes.arrayOf(PropTypes.number),
};

export default Canvas;

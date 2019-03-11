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
    subscribers: {
      draw: [],
      keyPressed: [],
      keyReleased: [],
      keyTyped: [],
      mouseMoved: [],
      mouseDragged: [],
      mousePressed: [],
      mouseReleased: [],
      mouseClicked: [],
      doubleClicked: [],
      mouseWheel: [],
      touchStarted: [],
      touchMoved: [],
      touchEnded: [],
      deviceMoved: [],
      deviceTurned: [],
      deviceShaken: [],
    },
    subscribe: (event, fn) => {
      if (!state.current.subscribers[event]) {
        console.error('Attempting to subscribe to an unknown event:', event);
        return () => {};
      }
      state.current.subscribers[event].push(fn);
      if (event === 'draw') {
        state.current.canvas.loop();
      }
      return () => {
        state.current.subscribers[event] = state.current.subscribers[
          event
        ].filter(s => s === fn);
        if (state.current.subscribers.draw.length === 0) {
          state.current.canvas.noLoop();
        }
      };
    },
  });

  useEffect(() => {
    if (state.current.canvas) {
      state.current.canvas.resizeCanvas(x, y);
    }
  }, [x, y]);

  useEffect(() => {
    if (state.current.container) {
      state.current.container.setContext(props);
    }
  }, [props]);

  useEffect(() => {
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
        delete propsCopy.noClear;
        setNewProps(propsCopy);
        sketch.noLoop();
      };

      sketch.draw = () => {
        state.current.subscribers.draw.forEach(fn => fn(state.current.canvas));
      };
      sketch.keyPressed = () => {
        state.current.subscribers.keyPressed.forEach(fn =>
          fn(state.current.canvas.keyCode),
        );
      };
      sketch.keyReleased = () => {
        state.current.subscribers.keyReleased.forEach(fn =>
          fn(state.current.canvas.key, state.current.canvas.keyCode),
        );
      };
      sketch.keyTyped = () => {
        state.current.subscribers.keyTyped.forEach(fn =>
          fn(state.current.canvas.key),
        );
      };
      sketch.mouseMoved = e => {
        state.current.subscribers.mouseMoved.forEach(fn => fn(e));
      };
      sketch.mouseDragged = e => {
        state.current.subscribers.mouseDragged.forEach(fn => fn(e));
      };
      sketch.mousePressed = e => {
        state.current.subscribers.mousePressed.forEach(fn => fn(e));
      };
      sketch.mouseReleased = e => {
        state.current.subscribers.mouseReleased.forEach(fn => fn(e));
      };
      sketch.mouseClicked = e => {
        state.current.subscribers.mouseClicked.forEach(fn => fn(e));
      };
      sketch.doubleClicked = e => {
        state.current.subscribers.doubleClicked.forEach(fn => fn(e));
      };
      sketch.mouseWheel = e => {
        state.current.subscribers.mouseWheel.forEach(fn => fn(e));
      };
      sketch.touchStarted = e => {
        state.current.subscribers.touchStarted.forEach(fn => fn(e));
      };
      sketch.touchMoved = e => {
        state.current.subscribers.touchMoved.forEach(fn => fn(e));
      };
      sketch.touchEnded = e => {
        state.current.subscribers.touchEnded.forEach(fn => fn(e));
      };
      sketch.deviceMoved = () => {
        state.current.subscribers.deviceMoved.forEach(fn => fn());
      };
      sketch.deviceTurned = () => {
        state.current.subscribers.deviceTurned.forEach(fn => fn());
      };
      sketch.deviceShaken = () => {
        state.current.subscribers.deviceShaken.forEach(fn => fn());
      };
    }, wrapper.current);
    state.current.container = new Container(state.current.canvas, props);
  }, []);

  useEffect(() => {
    // Unmounting the p5 canvas
    return () => {
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

  return <div ref={wrapper} {...newProps} style={{display: 'inline-block'}} />;
};

Canvas.propTypes = {
  children: PropTypes.element,
  size: PropTypes.arrayOf(PropTypes.number),
};

export default Canvas;

import Reconciler from 'react-reconciler';
import {
  unstable_scheduleCallback as schedulePassiveEffects,
  unstable_cancelCallback as cancelPassiveEffects,
  unstable_now as now,
} from 'scheduler';
import {Node} from './Node';

const roots = new Map();

function appendInitialChild(parent, child) {
  parent.add(child);
}

function appendChild(parent, child) {
  parent.add(child);
}

function appendChildToContainer(parent, child) {
  parent.add(child);
}

function removeChild(parent, child) {
  parent.remove(child);
}

function createInstance(type, props, container, hostContext, fiber) {
  // TODO take into account context Sun 10 Mar 2019 21:01:27 GMT
  const instance = new Node(type, props, hostContext, container);

  return instance;
}

function commitUpdate(
  instance,
  updatePayload,
  type,
  oldProps,
  newProps,
  fiber,
) {
  // this is only called if prepareUpdate returns a payload. That payload is passed
  // into here as updatePayload.
  instance.queueDraw();
}

function prepareUpdate(
  instance,
  type,
  oldProps,
  newProps,
  rootContainerInstance,
  hostContext,
) {
  const {args, ...props} = newProps;

  instance.args = args;
  instance.props = props;
  instance.context = hostContext;

  // if something is returned here then commitUpdate will be called for this instance.
  // If nothing if returned then it will not be called
  return {...hostContext};
}

function getChildHostContext(parentHostContext, type) {
  return {
    ...parentHostContext,
    [type]: true,
  };
}

const Renderer = Reconciler({
  now,
  supportsMutation: true,
  isPrimaryRenderer: false,
  createInstance,
  removeChild,
  appendChild,
  appendInitialChild,
  appendChildToContainer,
  removeChildFromContainer: removeChild,
  schedulePassiveEffects,
  cancelPassiveEffects,
  commitUpdate,
  prepareUpdate,
  getChildHostContext,

  insertBefore: () => {},

  getPublicRootInstance: () => {},
  getPublicInstance: instance => instance,
  getRootHostContext: rootContainerInstance => ({}), // Context to pass down from root
  createTextInstance: () => {},
  finalizeInitialChildren: (instance, type, props, rootContainerInstance) =>
    false,
  shouldDeprioritizeSubtree: (type, props) => false,
  prepareForCommit: rootContainerInstance => {},
  resetAfterCommit: () => {},
  shouldSetTextContent: props => false,
});

export function render(el, container) {
  let root = roots.get(container);
  if (!root) {
    root = Renderer.createContainer(container);
    roots.set(container, root);
  }
  Renderer.updateContainer(el, root, null, undefined);
  return Renderer.getPublicRootInstance(root);
}

export default {};

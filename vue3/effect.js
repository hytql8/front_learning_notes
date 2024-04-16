let activeEffect;

export const effect = (fn, options = {}) => {
  let _effect = () => {
    activeEffect = _effect;
    const res = fn();
    return res;
  };
  _effect.options = options;
  if (!options.lazy) {
    _effect();
  }
  return _effect;
};

const weakMap = new WeakMap();

export const track = (target, key) => {
  let map = weakMap.get(target);
  if (!map) {
    map = new Map();
    weakMap.set(target, map);
  }
  let effectSet = map.get(key);
  if (!effectSet) {
    effectSet = new Set();
    map.set(key, effectSet);
  }
  effectSet.add(activeEffect);
};

export const trigger = (target, key) => {
  const map = weakMap.get(target);
  if (!map) return;
  const effectSet = map.get(key);
  if (!effectSet) return;
  effectSet.forEach((effectFn) => {
    if (activeEffect?.options?.scheduler) {
      activeEffect.options.scheduler(effectFn);
    } else {
      // 开启lazy之后,effectFn第一次没有,所以用?.
      effectFn?.();
    }
  });
};

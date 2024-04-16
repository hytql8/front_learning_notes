import { track, trigger } from "./effect.js";
import { isObject } from "./common.js";

export const reactive = (obj) => {
  const handler = {
    get: (target, key, receiver) => {
      const res = Reflect.get(target, key, receiver);
      track(target, key);
      return isObject(res) ? reactive(res) : res;
    },
    set: (target, key, value, receiver) => {
      const res = Reflect.set(target, key, value, receiver);
      trigger(target, key);
      return res;
    },
  };
  return new Proxy(obj, handler);
};

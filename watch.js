import { effect } from "./effect.js";
import { isObject, isFunction } from "./common.js";

export const watch = (obj, cb) => {
  let getter;
  if (isFunction(obj)) {
    getter = obj;
  } else {
    getter = () => traverse(obj);
  }
  console.log(getter);

  let newValue, oldValue;
  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: () => {
      newValue = effectFn();
      // 传递
      cb(newValue, oldValue);
      // 更新旧值
      oldValue = newValue;
    },
  });

  oldValue = effectFn();
};

const traverse = (value, seen = new Set()) => {
  // 如果读取的值是原始值，或者已经被读取过了，那就什么都不做
  if (!isObject(value) || seen.has(value)) return;
  // 将当前值加入 seen，表示已经读取过了，避免循环引用
  seen.add(value);
  for (const k in value) {
    traverse(value[k], seen);
  }
  return value;
};

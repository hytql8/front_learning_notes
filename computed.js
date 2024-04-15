import { effect } from "./effect.js";

export const computed = (getter) => {
  let _value = effect(getter, {
    lazy: true,
    scheduler: () => {
      _dirty = true;
    },
  });
  let cacheValue;
  let _dirty = true;
  class ComputedRefImpl {
    get value() {
      if (_dirty) {
        cacheValue = _value();
        _dirty = false;
      }
      return cacheValue;
    }
    set value(val) {
      console.error(
        `设置 computed.value 为 ${val}失败! computed 是只读的,不可被更改!!`
      );
    }
  }

  return new ComputedRefImpl();
};

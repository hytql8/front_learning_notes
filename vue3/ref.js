import { isObject } from "./common.js";
import { reactive } from "./reactive.js";

export const ref = (obj) => {
  return isObject(obj)
    ? reactive(obj)
    : reactive({
        value: obj,
      });
};

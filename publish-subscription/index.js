const Pulisher = function () {};

const pulisher = () => {
  const pub = new Pulisher();
  pub.__proto__.events = new Map();
  // 订阅事件
  pub.__proto__.on = function (event, callback) {
    const weakSet = this.events.get(event);
    if (!weakSet) {
      const effectSet = new Set();
      effectSet.add(callback);
      this.events.set(event, effectSet);
    } else {
      effectSet.add(callback);
      this.events.set(event, effectSet);
    }
  };
  // 只订阅一次
  pub.__proto__.once = function (event, callback) {
    const fn = (...args) => {
      callback(...args);
      this.off(event, fn);
    };
    this.on(event, fn);
  };
  // 发布事件
  pub.__proto__.emit = function (event, ...args) {
    const weakSet = this.events.get(event);
    if (!weakSet) return;
    weakSet.forEach((event) => event(...args));
  };
  // 取消订阅
  pub.__proto__.off = function (event, callback) {
    const weakSet = this.events.get(event);
    if (!weakSet) return;
    if (callback) {
      weakSet.delete(callback);
    } else {
      weakSet.clear();
    }
  };
  return pub;
};

export const run = () => {
  const res = pulisher();
  res.on("event", (...args) => {
    console.log("监听到event的消息:", ...args);
  });

  setInterval(() => {
    res.emit("event", "hello world", new Date());
  }, 1000);

  setInterval(() => {
    res.off("event");
  }, 3000);
};

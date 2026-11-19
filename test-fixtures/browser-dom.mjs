export class BrowserElement {
  constructor(tagName = "div") {
    this.tagName = tagName;
    this.children = [];
    this.attributes = {};
    this.listeners = new Map();
    this.dataset = {};
    this.className = "";
    this.classList = {
      toggle: (name, active) => {
        const classes = new Set(this.className.split(/\s+/).filter(Boolean));
        if (active) classes.add(name);
        else classes.delete(name);
        this.className = [...classes].join(" ");
      },
      add: (name) => this.classList.toggle(name, true),
      remove: (name) => this.classList.toggle(name, false),
      contains: (name) => this.className.split(/\s+/).includes(name),
    };
    this.options = [];
    this.value = "";
    this.hidden = false;
    this.textContent = "";
    this.innerHTML = "";
    this.style = {};
  }
  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }
  getAttribute(name) {
    return this.attributes[name] ?? null;
  }
  appendChild(child) {
    this.children.push(child);
    child.parentElement = this;
    if (this.tagName === "select" && child.tagName === "option") this.options.push(child);
    return child;
  }
  append(...children) {
    children.forEach((child) => this.appendChild(child));
  }
  replaceChildren(...children) {
    this.children = [];
    this.options = [];
    this.append(...children);
  }
  addEventListener(name, callback) {
    const callbacks = this.listeners.get(name) || [];
    callbacks.push(callback);
    this.listeners.set(name, callbacks);
  }
  dispatch(name, event = {}) {
    return (this.listeners.get(name) || []).map((callback) => callback({ target: this, ...event }));
  }
  scrollIntoView() {}
  focus() {}
  select() {}
  querySelector(selector) {
    return (
      this.children.find(
        (child) => selector.startsWith(".") && child.classList.contains(selector.slice(1)),
      ) || null
    );
  }
  querySelectorAll(selector) {
    return this.children.filter((child) =>
      selector === "tr"
        ? child.tagName === "tr"
        : selector === "thead th"
          ? child.tagName === "th"
          : false,
    );
  }
  closest(selector) {
    return selector === "th" && this.parentElement?.tagName === "th" ? this.parentElement : null;
  }
}

export function installBrowserDom({ ids = [], groups = {} } = {}) {
  const selects = new Set([
    "target-channel",
    "target-version",
    "target-release",
    "compare-from",
    "compare-to",
  ]);
  const elements = new Map(
    ids.map((id) => [id, new BrowserElement(selects.has(id) ? "select" : "div")]),
  );
  const selectorGroups = new Map(Object.entries(groups));
  const listeners = new Map();
  const document = {
    getElementById: (id) => elements.get(id) || null,
    querySelectorAll: (selector) => selectorGroups.get(selector) || [],
    createElement: (tag) => new BrowserElement(tag),
    addEventListener(name, callback) {
      const callbacks = listeners.get(name) || [];
      callbacks.push(callback);
      listeners.set(name, callbacks);
    },
    dispatchEvent(event) {
      for (const callback of listeners.get(event.type) || []) callback(event);
    },
  };
  globalThis.document = document;
  globalThis.window = {};
  return { document, elements, listeners, get: (id) => elements.get(id) };
}

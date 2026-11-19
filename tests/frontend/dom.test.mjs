import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../src/frontend/dom.mjs";
const { getElement, queryAll, whenVisible } = __moduleApi0();
import { BrowserElement, installBrowserDom } from "../../test-fixtures/browser-dom.mjs";

test("looks up elements and selector groups", () => {
  const button = new BrowserElement("button");
  const state = installBrowserDom({ ids: ["target"], groups: { ".item": [button] } });
  expect(getElement("target")).toBe(state.get("target"));
  expect(getElement("missing")).toBeNull();
  expect(queryAll(".item")).toEqual([button]);
});

test("does not call a visibility callback without an element", async () => {
  const callback = jest.fn();
  installBrowserDom();
  await expect(whenVisible("missing", callback)).resolves.toBeUndefined();
  expect(callback).not.toHaveBeenCalled();
});

test("calls a visibility callback when observers are unavailable", async () => {
  const callback = jest.fn(() => "visible");
  const { get } = installBrowserDom({ ids: ["target"] });
  await expect(whenVisible(get("target"), callback)).resolves.toBe("visible");
  expect(callback).toHaveBeenCalledTimes(1);
});

test("starts once after an observer sees the element", async () => {
  const callback = jest.fn(async () => "visible");
  const disconnect = jest.fn();
  let observer;
  globalThis.IntersectionObserver = class {
    constructor(onChange, options) {
      this.onChange = onChange;
      this.options = options;
      observer = this;
    }
    observe(element) {
      this.element = element;
    }
    disconnect() {
      disconnect();
    }
  };
  const { get } = installBrowserDom({ ids: ["target"] });
  globalThis.window = { IntersectionObserver: true };
  const result = whenVisible("target", callback, "100px");
  observer.onChange([{ isIntersecting: false }]);
  observer.onChange([{ isIntersecting: true }]);
  observer.onChange([{ isIntersecting: true }]);
  await expect(result).resolves.toBe("visible");
  expect(observer.options).toEqual({ rootMargin: "100px" });
  expect(observer.element).toBe(get("target"));
  expect(callback).toHaveBeenCalledTimes(1);
  expect(disconnect).toHaveBeenCalledTimes(1);
});

test("rejects when the visible callback rejects", async () => {
  const failure = new Error("callback failed");
  globalThis.window = {};
  await expect(whenVisible(new BrowserElement(), () => Promise.reject(failure))).rejects.toBe(
    failure,
  );
});

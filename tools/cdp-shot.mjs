// Screenshot a demo route with REAL timers, via the Chrome DevTools Protocol.
//
// Why this exists: `chrome --headless --screenshot --virtual-time-budget=N` does
// NOT advance requestAnimationFrame, so every Framer Motion element captures at
// its `initial` state (opacity 0) and the page looks empty. That is a capture
// artifact, not a bug in the demo. Demos that play a timed sequence can only be
// verified by waiting real wall-clock time, which is what this does.
//
// Usage:
//   1) start Chrome once:
//      chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
//             --remote-debugging-port=9222 --user-data-dir=<tmp> about:blank
//   2) node tools/cdp-shot.mjs <url> <out.png> [waitMs] [width] [height]
//
// Then READ the png and critique it before pushing. See memory
// feedback_demo_screenshot_verify.
import { writeFileSync } from "node:fs";

const [, , url, out, waitMsRaw, wRaw, hRaw] = process.argv;
if (!url || !out) {
  console.error("usage: node tools/cdp-shot.mjs <url> <out.png> [waitMs] [w] [h]");
  process.exit(1);
}
const waitMs = Number(waitMsRaw ?? 8000);
const width = Number(wRaw ?? 1200);
const height = Number(hRaw ?? 1200);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const list = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const target = list.find((t) => t.type === "page");
if (!target) throw new Error("no page target — is Chrome running with --remote-debugging-port=9222?");

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});

let id = 0;
const pending = new Map();
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result);
    pending.delete(msg.id);
  }
};
const send = (method, params = {}) =>
  new Promise((res) => {
    const n = ++id;
    pending.set(n, res);
    ws.send(JSON.stringify({ id: n, method, params }));
  });

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.navigate", { url });
await sleep(waitMs);

const shot = await send("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: true,
});
writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log(`saved ${out}`);
ws.close();
process.exit(0);

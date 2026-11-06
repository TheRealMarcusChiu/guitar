// Guards the published defaults: the name and the real track. Playback itself needs a browser.
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { MEDIA_SOURCE } from "../config.js";
import { resolveMediaSource } from "../signal.js";

const read = (path) => readFile(new URL(path, import.meta.url));

test("the default source is the committed track, under the Pages subdirectory too", async () => {
  assert.equal(MEDIA_SOURCE, "./media/guitar.m4a");
  const resolved = resolveMediaSource(MEDIA_SOURCE, "https://therealmarcuschiu.github.io/guitar/");
  assert.equal(resolved.url, "https://therealmarcuschiu.github.io/guitar/media/guitar.m4a");
  const track = await read(`../${MEDIA_SOURCE}`);
  assert.equal(track.length, 3357097);
  assert.equal(track.toString("latin1", 4, 8), "ftyp");
});

test("the page and package are named Guitar", async () => {
  const html = String(await read("../index.html"));
  assert.match(html, /<title>Guitar<\/title>/);
  assert.match(html, /<h1>Guitar<\/h1>/);
  assert.doesNotMatch(html, /Afterimage/);
  assert.equal(JSON.parse(await read("../package.json")).name, "guitar");
});

test("the name, file name and chooser sit at the foot of the play bar, leaving the art clear", async () => {
  const html = String(await read("../index.html"));
  const strip = html.indexOf('class="strip"');
  const marks = ['id="canvas-wrap"', 'class="strip"', 'id="play"', 'id="status"', "<h1>", 'id="note-title"', 'id="choose"', 'id="file"', 'id="note-privacy"', 'class="about"'];
  const places = marks.map((mark) => html.indexOf(mark));
  assert.ok(places.every((place) => place !== -1));
  assert.deepEqual(places, [...places].sort((a, b) => a - b));
  assert.equal(html.indexOf("<h1>", strip), html.lastIndexOf("<h1>"), "one heading, moved rather than copied");
  assert.doesNotMatch(html, /masthead/);
});

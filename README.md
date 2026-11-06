# Guitar

A static audiovisual artwork. A string and a fold of silk hold one pose until a guitar recording plays, then move with its sound.

Derived from https://github.com/TheRealMarcusChiu/afterimage, preserving its artwork and style.

No frameworks, dependencies or build step. The only outside request is for the Google Fonts stylesheet and font files. There is no analytics.

**Current state: the guitar recording is published.** The site opens with `./media/guitar.m4a` loaded, so Play is ready without choosing a file. Playback starts only when a visitor presses Play. Visitors can also play their own video or audio through **Choose recording**.

## The default recording

`media/guitar.m4a` is the audio track of the original guitar video: AAC, 44.1 kHz, mono, 184.7 seconds and 3,357,097 bytes. It was copied out without re-encoding and with metadata removed:

```sh
ffmpeg -i original.mp4 -map 0:a:0 -vn -c:a copy -map_metadata -1 -movflags +faststart media/guitar.m4a
```

**This audio is public.** Anyone can download it from this repository or the site. The original video is private and is not in this repository or on the site.

## Preview

```sh
python3 -m http.server 8000
```

Open http://localhost:8000/. The site uses ES modules, so opening `index.html` directly from disk won't work.

## Test

```sh
npm test
```

This runs `node --test` with no dependencies. It covers signal extraction, smoothing and clamping, time and URL handling, the audio graph, sculpture geometry and rest pose, the wiring of `app.js` through a small DOM stand-in, and the default track's path and file. It doesn't run a browser or produce real audio. There is no browser test script in this repository.

## Change the recording

`MEDIA_SOURCE` in `config.js` is the one place the source is configured:

```js
export const MEDIA_SOURCE = "./media/guitar.m4a";
```

- **Format:** M4A with AAC audio, or MP4 with H.264 video and AAC audio, is recommended, because AAC is the most widely compatible, including with Safari.
- **Same origin is best.** Relative paths resolve correctly under a GitHub Pages subdirectory.
- **Another host** must use HTTPS and send CORS headers that allow this site's origin. Without them the video won't load, and the page says so. The analysis isn't bypassed or faked. Plain `http://` is accepted only for `localhost`, `127.0.0.1` and `[::1]`.
- **Range requests** are recommended, because seeking depends on them.

### Privacy

- **A file chosen with Choose recording stays in the browser.** It's never uploaded or saved, and it's forgotten when the page closes.
- **A recording added to this public repository is public.** Anyone can download it, and it stays in git history after you delete it.

### Size limits

GitHub blocks files over 100 MiB and warns above 50 MiB. Published Pages sites are limited to about 1 GB, with a soft limit of 100 GB of bandwidth a month. Git LFS doesn't help, because Pages doesn't serve LFS media as a normal file.

Extract the audio or compress the file first. For anything still too large, use a host with CORS and range support. Check the actual file before uploading it.

## Deployment

To publish the site with GitHub Pages from https://github.com/TheRealMarcusChiu/guitar, follow these steps. There are no build steps or dependencies, and `.nojekyll` is already included.

The expected Pages URL is https://therealmarcuschiu.github.io/guitar/. This is where the site should appear once published. It isn't a claim that the site is live.

1. Commit your changes and push them to `main`.
2. In the repository, go to **Settings > Pages**.
3. Under **Source**, choose **Deploy from a branch**.
4. Choose branch `main` and folder `/ (root)`, then select **Save**.

Later pushes to `main` deploy automatically.

## Controls

| Action | Control |
| --- | --- |
| Load your own file | Choose recording |
| Play or pause | Play button, or Space or K |
| Seek | Slider, or Left and Right for five seconds |
| Mute | Mute button, or M |
| Volume | Slider |

Shortcuts apply only when no control has focus and no modifier is held, so a focused button or slider keeps its own native keys.

## How it's built

| File | Role |
| --- | --- |
| `config.js` | `MEDIA_SOURCE` |
| `index.html`, `styles.css` | Page and layout |
| `app.js` | Controls, media state, render loop |
| `audio.js` | The single audio route |
| `signal.js` | Band energy, RMS, envelopes, time and URL helpers |
| `sculpture.js` | Canvas geometry and drawing |
| `design-notes.md` | Reference provenance, tokens, how sound maps to form |

Audio runs through one `AudioContext` and one `createMediaElementSource`, created in the first play press and kept across file changes. The route is source to analyser to gain to destination. `video.volume` stays at 1 because it's read-only on iOS, so volume and mute act on the gain. If Web Audio or the analyser isn't available, sound still plays and the page says the form can't follow it.

## Known limits

- `npm test` uses Node stand-ins only, with no browser or real audio.
- Separately, before this was cloned from Afterimage, a browser suite that isn't part of this repository passed on Chromium and on Linux Playwright WebKit with iPhone 13 emulation. It chose temporary black H.264/AAC diagnostic tones through the file picker, which were never published. It covered band isolation, silence and rest, playback, seeking, volume, keyboard, source replacement, reduced motion, invalid media and small-screen layouts. It didn't cover `media/guitar.m4a`.
- The track's length isn't assumed in the page; duration comes only from the file's metadata.
- Not verified on a physical iPhone or in Safari itself. Emulation in Linux WebKit doesn't prove either one.
- Nobody has checked the audio output by ear.
- A video's picture is never shown, whatever it contains.

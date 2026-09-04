# Starchart — a star-map portfolio template

A lightweight WebGL portfolio where your projects are waypoints on a navigable
star map. No build step, no framework — plain Three.js loaded from a CDN via
an import map, so it deploys to GitHub Pages as-is.

This particular project serves as a portfolio map: 16 projects grouped into
four spatial clusters that mirror the skills each project uses (Software,
Electrical, Research, Misc), plus the About and Contact panels.

- A few project links still point to `charlotteramiro.com/documents/`
  directly (Huffman/trees paper, diff-amp paper, OCR paper).
- Drag to orbit, scroll to zoom, click a glowing waypoint to fly to it
- A visor-style overlay (vignette, scanline texture, corner brackets, a
  breathing center reticle) frames the whole scene like you're looking
  through a HUD
- A persistent ID card top-left shows your name and role at a glance
- A "sector" readout appears when the camera is looking toward a project
  cluster (Software / Electrical / Research / Misc), so recruiters get the
  category before they even click a waypoint
- Each waypoint opens a side panel with an optional image & project details
- One boot/uplink sequence plays on load; everything else is direct response
  to your input (no scroll-jacking, no per-section fade-ins)
- ~3,500 points of starfield + a handful of sprites — no postprocessing
  pipeline, so it stays smooth on integrated graphics and most phones

## Quick start

1. **Edit your projects.** Open `js/projects.js` and replace the sample
   entries with your own. Each project needs:
   - `name`, `tag`, `role`, `description`
   - `stack` — array of short strings shown as tags
   - `links` — array of `{ label, url, primary }` (mark one `primary: true`
     to make it the highlighted button)
   - `position` — `{ x, y, z }` roughly in the range -12 to 12 on each axis
   - `color` — a hex string for that waypoint's glow

2. **Edit About / Contact.** Same file, `siteContent.about` and
   `siteContent.contact` — plain HTML strings.

3. **Rename the site.** In `index.html`, change the `<title>`, the meta
   description, and the `#site-name` text.

4. **Preview locally.** Because this uses ES modules, you need to serve the
   files over HTTP (opening `index.html` directly won't load the modules).
   From this directory, run any static server, e.g.:
   ```
   python3 -m http.server 8000
   ```
   then open `http://localhost:8000`.

## Deploying to GitHub Pages

1. Create a new GitHub repository and push this folder's contents to it
   (keep `index.html` at the repo root).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   pick your default branch (e.g. `main`) and the `/ (root)` folder, then
   save.
4. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/`
   within a minute or two.

If you're deploying to a **project page** (the URL above, not a custom
domain or a `<username>.github.io` root repo), no path changes are needed —
every asset in this template is linked with a relative path.

## File structure

```
index.html           Page shell, HUD markup, boot screen, panels
css/style.css        All styling — design tokens are CSS variables at the top
js/main.js           Three.js scene: starfield, waypoints, camera flight, interaction
js/projects.js       Your content — projects, about, contact
js/audio.js          Generative ambient audio bed + on/off toggle
documents/           PDFs linked from panels (resume, papers)
assets/projects/     Project hero images shown in panels
```

## Customization notes

- **Colors** live as CSS variables at the top of `css/style.css`
  (`--void`, `--nebula`, `--star`, `--signal`, etc.) and are reused as
  waypoint glow colors in `js/projects.js`. Change the variables to re-theme
  the whole site.
- **Name / role card**: edit `#vitals-name` and `#vitals-role` in
  `index.html`.
- **Sector detection**: cluster centers in `js/projects.js` (`clusters`
  export) are computed automatically from each project's `category` and
  `position` — no manual coordinates to maintain. Add a `category` to a new
  project and it's folded into its cluster automatically. The angle/threshold
  that decides "looking at" a cluster (`SECTOR_DOT_THRESHOLD`) and how long
  it must hold before the label updates (`SECTOR_DEBOUNCE_MS`) are both near
  the top of the sector-detection block in `js/main.js`.
- **Camera framing**: `OVERVIEW_POS` and `OVERVIEW_TARGET` near the top of
  `js/main.js` control the default overview shot. If you add many more
  projects spread further apart, move the camera back.
- **Project images**: set or remove the `image` field per project in
  `js/projects.js`. Images render 16:9 at the top of the panel — a roughly
  960×540 JPG or PNG works well; larger images just cost more load time.
- **Ambient audio**: `js/audio.js` plays a looping track from
  `audio/theme.mp3` through a gain node, so it can fade in/out instead of
  hard-cutting. Swap in a different track by replacing that file (same
  filename, or update the path in `buildGraph()`).
- **Performance**: the two `buildStarfield()` calls in `main.js` control star
  count. Lower the counts if you're targeting low-end mobile devices.
- **Fonts** are loaded from Google Fonts (Space Grotesk + IBM Plex Mono). To
  drop the external request, self-host the two font files and update the
  `<link>` tags in `index.html`.

## Browser support

Uses ES module import maps and WebGL — supported in all current major
browsers (Chrome, Firefox, Safari, Edge). No Internet Explorer support.

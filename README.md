# Please Touch! — Designing Tactile Communication

Website for the Designing Tactile Communication research project at Lehigh University (Creative Inquiry Impact Fellowship).

Plain HTML, CSS, and JavaScript. No build step.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Files

- `index.html`: all page content, in order: Home, Process, Research, Gallery, Partners, Footer
- `styles.css`: palette, fonts, and layout. Colors are defined once at the top under `:root`.
- `script.js`: text-size and dark-mode buttons, scroll reveal, and the gallery detail view

## Accessibility

- Fonts: Atkinson Hyperlegible Next for body text, Fraunces for display headings
- Navy, lavender, and butter palette (colorblind-safe). Text is always navy on light or cream on navy.
- Text-size button (3 steps) and a high-contrast dark mode, both remembered per visitor
- Skip link, visible keyboard focus, semantic landmarks, and a native `<dialog>` for gallery details
- Animations turn off when the visitor's system asks for reduced motion

## Adding artwork

- **Gallery cards:** in `index.html`, replace each `<span class="card-art">` with an `<img>` that has alt text. Add descriptions to the `items` list in `script.js`.
- **Hero photo:** replace `.img-placeholder` with an `<img>`.
- **Process stamps / blog thumbnails:** replace `.stamp-art` / `.post-thumb` divs with images.

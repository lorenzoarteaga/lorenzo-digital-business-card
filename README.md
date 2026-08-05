# Lorenzo Arteaga Digital Business Card

A premium, mobile-first digital business card for Lorenzo Arteaga, Community & Business Banker at First Interstate Bank. The site gives visitors fast access to contact details, appointment booking, directions, banking services, and a downloadable vCard.

## Technology

- Semantic HTML5
- Responsive CSS with light and dark themes
- Vanilla JavaScript for QR generation, copy actions, scroll reveals, theme preference, loading state, and toast feedback
- Font Awesome icons and the Inter typeface loaded from public CDNs
- Netlify static hosting with security and cache headers

## Local Use

No build step or package installation is required. Open `index.html` directly in a browser, or serve the repository root with any static file server.

For the most accurate QR code and clipboard behavior, use an HTTP server instead of the `file://` protocol.

## Deployment

Deploy the repository root directly to Netlify. The included `netlify.toml` publishes the root directory and adds baseline security and asset-caching headers.

## Content Updates

- Replace `assets/portrait.svg` with Lorenzo's approved professional headshot while keeping the same filename, or update the image paths and Open Graph image in `index.html`.
- Update the canonical and Open Graph URLs in `index.html` if the production domain changes.
- Edit contact details in `index.html`, `contact.vcf`, the JSON-LD block in `index.html`, and `assets/og-card.png` so the visible card, downloadable contact, structured metadata, and social preview stay synchronized.

## Files

- `index.html` — page content, metadata, and external resources
- `style.css` — responsive design system, themes, and animation
- `script.js` — interaction and QR logic
- `contact.vcf` — downloadable contact card
- `netlify.toml` — publish directory plus security and asset-caching headers
- `assets/portrait.svg` — professional portrait placeholder
- `assets/qrcode.min.js` — vendored QR code generator used by `script.js`
- `assets/favicon.svg`, `assets/apple-touch-icon.png`, and `assets/og-card.png` — browser, mobile, and social preview assets

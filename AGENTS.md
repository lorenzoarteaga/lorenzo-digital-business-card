# Project Guide

## Architecture

This is a dependency-free static site designed for direct Netlify deployment. There is no package manager, compilation step, framework, backend, or persistent data layer.

## Key Files

- `index.html` contains all semantic page sections, contact links, SEO metadata, and CDN references.
- `style.css` contains the design tokens, responsive layouts, dark mode, motion, accessibility states, and print adjustments.
- `script.js` contains theme persistence, QR creation, clipboard fallbacks, toast notifications, page loading, and scroll-reveal behavior.
- `contact.vcf` is the downloadable contact and must stay synchronized with visible contact details.
- `assets/` contains local identity and favicon assets.
- `netlify.toml` defines the publish directory and response headers.

## Conventions

- Keep the implementation in plain HTML, CSS, and JavaScript.
- Preserve semantic HTML, keyboard focus states, minimum touch-target sizes, reduced-motion support, and sufficient color contrast.
- Use CSS custom properties for palette or theme changes rather than repeating color literals.
- Prefer local assets for business-critical visuals. CDN resources are limited to Inter, Font Awesome, and QRCode.js.
- Keep JavaScript progressive: essential contact links and the vCard must work without JavaScript.
- Add `rel="noopener noreferrer"` to external links that open a new tab.

## Content Decisions

The current portrait is an explicit illustrated placeholder because no approved photograph was provided. Replace it with an approved headshot before launch rather than using an unrelated stock person. Testimonials are visibly labeled as samples to avoid representing fictional statements as real endorsements.

The QR code is generated from the current origin and pathname, so deploy previews and a final custom domain each point back to their own live page automatically.

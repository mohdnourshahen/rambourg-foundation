# Roycelysian — website

Static site (HTML/CSS/JS, Lenis smooth scroll). No build step.

Preview: `python3 -m http.server 8796` inside this folder → http://localhost:8796

- Content and projects: `js/data.js` (contact details, hero slides, projects, expertise)
- Shared header, menu, footer and motion: `js/main.js`
- Styles and palette: `css/style.css` (Midnight Navy #17232D, Deep Forest #243A32, Warm Ivory #F3F0E8, Stone #B9B0A2)
- Type: Cormorant Garamond (display) + Jost (text), Google Fonts
- Images: `assets/img/` (pulled from the previous roycelysian.com, resized; `-sm` = 1100px versions)
- Brand: `assets/brand/` (wordmark and R monogram extracted from the old logo, without "Luxury Solutions")

Pages: index, work, project (template: `project.html?p=<slug>`), expertise, publications, studio, contact, 404.

## To confirm before launch
- Email, Instagram, Behance and LinkedIn links (`RY.contact` in `js/data.js`) are placeholders.
- Exact scope ("Our role") for each project.
- The library interior (`riad-library.jpg`) was named "Zeryab" on the old server but captioned "Riad Elhob" on the old site; it is currently shown under Riad Elhob.
- The Signature Book on the home and Publications pages is a CSS concept render, not a produced book.
- Contact form opens the visitor's email app (mailto); connect a form service if needed.

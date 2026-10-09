# Gilevo & Co.

## Search engine metadata

Page titles, descriptions, canonical paths and crawlable introductory content are maintained in `src/lib/seo-pages.json`. The production build uses this data to generate route-specific HTML pages and `dist/sitemap.xml`; keep the page routes in `vercel.json` aligned with the routes in `src/App.tsx`.

After deploying a metadata or route change, submit `https://gilevo.co.uk/sitemap.xml` in Google Search Console and use URL Inspection to request crawling of the updated pages. Search Console and a verified, accurate Google Business Profile are managed outside this repository.

## Contact form

The contact form posts to the Vercel serverless function at `/api/contact`. Configure these environment variables in Vercel for each environment that should send email:

- `RESEND_API_KEY`: secret API key from Resend. Keep it server-side; do not prefix it with `VITE_`.
- `CONTACT_FROM_EMAIL`: sender address on a domain verified with Resend.
- `CONTACT_TO_EMAIL`: inbox that should receive contact messages.

Redeploy after changing environment variables. The function validates submissions server-side and sends plain-text email through Resend; the form also includes a honeypot field. Add Vercel Firewall or a shared rate-limit store such as Upstash before relying on this endpoint against sustained automated abuse.

## Image assets

Large hero, portfolio, contact-card, and logo images are served as optimized WebP files from `src/assets/optimized/`; keep page imports pointed at these smaller versions. Original assets remain in `src/assets/` as source files. Portfolio screenshots are lazy-loaded where they appear in previews.

# SkillUp AI site
Static site + one serverless function. Deploy on Vercel: `vercel` (or import the folder).

- **Prices, programmes, Calendly URL, contact email:** edit `config.js`.
- **SMTP:** set the variables from `.env.example` in Vercel > Settings > Environment Variables (server-side only).
- **Local test:** `npm i && npx vercel dev` with a `.env` file.
- Replace the privacy contact and company details in the Privacy section of `index.html` before launch.

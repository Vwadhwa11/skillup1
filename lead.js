// Vercel serverless function: POST /api/lead. SMTP credentials come only from environment variables.
const nodemailer = require("nodemailer");

const hits = new Map(); // best-effort, per-instance rate limit
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clean = (v, max) => String(v ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 5) return res.status(429).json({ ok: false, error: "Too many requests. Please try again later." });
  hits.set(ip, [...recent, now]);

  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot: silently accept bots

  const d = {
    name: clean(b.name, 100), email: clean(b.email, 150), company: clean(b.company, 150),
    programme: clean(b.programme, 80),
    goal: String(b.goal ?? "").trim().slice(0, 2000),
  };
  if (!d.name || !d.company || !d.goal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
    return res.status(400).json({ ok: false, error: "Please complete all required fields with a valid work email." });

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_TO) {
    console.error("SMTP environment variables are missing");
    return res.status(500).json({ ok: false, error: "Email is not configured." });
  }

  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST, port: Number(SMTP_PORT) || 587, secure: SMTP_SECURE === "true",
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transport.sendMail({
      from: MAIL_FROM || SMTP_USER, to: MAIL_TO, replyTo: `${d.name} <${d.email}>`,
      subject: `New SkillUp AI enquiry: ${d.company} (${d.programme || "not sure yet"})`,
      text: `Name: ${d.name}\nEmail: ${d.email}\nCompany: ${d.company}\nProgramme: ${d.programme}\n\n${d.goal}`,
      html: `<p><b>Name:</b> ${esc(d.name)}<br><b>Email:</b> ${esc(d.email)}<br><b>Company:</b> ${esc(d.company)}<br><b>Programme:</b> ${esc(d.programme)}</p><p>${esc(d.goal).replace(/\n/g, "<br>")}</p>`,
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("SMTP send failed:", e.message);
    return res.status(502).json({ ok: false, error: "We couldn't send your message. Please try again or book a call." });
  }
};

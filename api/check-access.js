export default async function handler(req, res) {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ ok: false, error: "Email missing" });
    }

    // Vercel provides process.env automatically
    const N8N_URL = process.env.N8N_CHECK_URL;
    if (!N8N_URL) {
      return res.status(500).json({ ok: false, error: "Missing N8N_CHECK_URL env" });
    }

    // Call your n8n workflow
    const response = await fetch(`${N8N_URL}?email=${email}`);
    const data = await response.json();

    return res.status(200).json({
      ok: true,
      email,
      plan: data.plan || null,
      hasAccess: data.hasAccess === true || data.hasAccess === "active",
    });

  } catch (err) {
    console.error("CHECK-ACCESS ERROR:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}

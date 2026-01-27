export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: true, message: "Method not allowed" });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};

    const { email, session_id, device_id } = body;

    if (!device_id) {
      return res.status(400).json({ error: true, message: "Missing device_id" });
    }

    if (!email && !session_id) {
      return res.status(400).json({
        error: true,
        message: "Missing email or session_id",
      });
    }

    const n8nRes = await fetch(
      "https://n8n.eazyterp.com/webhook/claim-device",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, session_id, device_id }),
      }
    );

    const text = await n8nRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return res.status(n8nRes.status).json(data);
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Server error in claim-device",
      detail: err?.message || String(err),
    });
  }
}

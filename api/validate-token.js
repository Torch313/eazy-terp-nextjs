export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: true, message: "Method not allowed" });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    const { token, device_id } = body;

    if (!token || !device_id) {
      return res.status(400).json({
        error: true,
        message: "Missing token or device_id",
      });
    }

    const n8nRes = await fetch(
      "https://n8n.eazyterp.com/webhook/ee138a4f-f14a-452c-88b3-352753c40725",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, device_id }),
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
      message: "Server error in validate-token",
      detail: err?.message || String(err),
    });
  }
}

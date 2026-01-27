module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ 
      error: true, 
      message: "Method not allowed" 
    });
  }

  try {
    // Parse body (Vercel sometimes gives string, sometimes object)
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : (req.body || {});

    const { email, session_id, device_id } = body;

    // Validate required fields
    if (!device_id) {
      return res.status(400).json({ 
        error: true, 
        message: "Missing device_id" 
      });
    }

    if (!email && !session_id) {
      return res.status(400).json({
        error: true,
        message: "Missing email or session_id",
      });
    }

    // Call your n8n claim-device webhook
    const n8nRes = await fetch(
      "https://n8n.eazyterp.com/webhook/claim-device",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, session_id, device_id }),
      }
    );

    // Get response text (don't assume JSON)
    const text = await n8nRes.text();

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // If n8n returns non-JSON, wrap it
      data = { raw: text };
    }

    // Return n8n's status and response
    return res.status(n8nRes.status).json(data);

  } catch (err) {
    // Catch any errors and return them
    return res.status(500).json({
      error: true,
      message: "Server error in claim-device",
      detail: err?.message || String(err),
    });
  }
};
import { useEffect, useState } from "react";

const API_URL = "https://n8n.eazyterp.com/webhook/webhook/check-premium";
const GUMROAD_URL = "https://torrey54.gumroad.com/l/fiztp"; // <-- put your real Gumroad product link

export default function PremiumGate({ children }) {
  const [email, setEmail] = useState(() => localStorage.getItem("et_email") || "");
  const [result, setResult] = useState(null); // { isPremium, status, plan, email, message, reason, ... }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-check if we already have an email saved
  useEffect(() => {
    if (email) checkPremium(email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkPremium(rawEmail) {
    setError("");
    setLoading(true);

    try {
      const cleanEmail = String(rawEmail || "").trim().toLowerCase();
      if (!cleanEmail) throw new Error("Enter the email you used at checkout.");

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      if (!res.ok) throw new Error(`Server error (${res.status}).`);

      const data = await res.json();

      // Clean up any weird whitespace coming back
      const cleaned = {
        ...data,
        email: String(data.email || cleanEmail).trim(),
        plan: String(data.plan || "").trim(),
        status: String(data.status || "").trim(),
        message: String(data.message || "").trim(),
        reason: String(data.reason || "").trim(),
        isPremium: Boolean(data.isPremium),
      };

      setResult(cleaned);
      localStorage.setItem("et_email", cleaned.email);
    } catch (e) {
      setError(e.message || "Something went wrong.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function resetAccess() {
    localStorage.removeItem("et_email");
    setEmail("");
    setResult(null);
    setError("");
  }

  const isUnlocked = result?.isPremium === true;

  // ✅ If unlocked, show the entire app
  if (isUnlocked) return <>{children}</>;

  // 🔒 Otherwise, show ONLY the paywall
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl border bg-white/80 shadow-sm p-6">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold">Eazy Terp</h1>
          <p className="text-sm opacity-80 mt-2">
            Unlock the full app for <span className="font-semibold">$4.99</span>.
          </p>
        </div>

        {/* Demo / Hype section */}
        <div className="mt-5 rounded-2xl border p-4 bg-white">
          <h2 className="text-lg font-semibold">What you get</h2>
          <ul className="mt-2 text-sm opacity-90 list-disc pl-5 space-y-1">
            <li>Mood → terpene recommendation</li>
            <li>Personalized vibe + quick guidance</li>
            <li>Daily “reset” style affirmations</li>
            <li>Strain matching suggestions</li>
          </ul>

          {/* Optional: drop a demo link/video later */}
          {/* <div className="mt-3 text-sm">
            <a className="underline" href="https://YOUR-DEMO-LINK" target="_blank" rel="noreferrer">
              Watch a 30-sec demo
            </a>
          </div> */}
        </div>

        {/* Buy */}
        <button
          className="mt-5 w-full rounded-2xl px-5 py-4 border font-semibold text-lg"
          onClick={() => window.open(GUMROAD_URL, "_blank")}
        >
          Buy for $4.99 on Gumroad
        </button>

        {/* Unlock section */}
        <div className="mt-5 rounded-2xl border p-4 bg-white">
          <h3 className="text-base font-semibold">Already bought?</h3>
          <p className="text-sm opacity-80 mt-1">
            Enter the email you used at checkout to unlock instantly.
          </p>

          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 rounded-xl border p-3"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="rounded-xl px-4 py-3 border font-semibold"
              onClick={() => checkPremium(email)}
              disabled={loading}
            >
              {loading ? "Checking..." : "Unlock"}
            </button>
          </div>

          {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}

          {result ? (
            <div className="mt-4 rounded-xl border p-3 text-sm">
              <div>
                <span className="font-semibold">Email:</span> {result.email}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                {result.status || (result.isPremium ? "active" : "inactive")}
              </div>

              {!!result.message && (
                <div className="mt-2 opacity-80">{result.message}</div>
              )}

              <div className="mt-2 font-semibold">
                {isUnlocked ? "✅ Unlocked — refreshing..." : "❌ Not found yet"}
              </div>

              <button
                className="mt-3 text-xs underline opacity-70"
                onClick={resetAccess}
              >
                Reset / Use a different email
              </button>
            </div>
          ) : (
            <button
              className="mt-3 text-xs underline opacity-70"
              onClick={resetAccess}
              type="button"
            >
              Reset / Clear saved email
            </button>
          )}
        </div>

        <div className="mt-5 text-center text-xs opacity-60">
          Trouble unlocking? Double-check the email you used on Gumroad.
        </div>
      </div>
    </div>
  );
}

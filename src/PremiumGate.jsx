import { useState, useEffect } from "react";

// ============================================================================
// API ENDPOINTS
// ============================================================================
const API_VALIDATE_TOKEN = "https://n8n.eazyterp.com/webhook/ee138a4f-f14a-452c-88b3-352753c40725";
const API_CLAIM_DEVICE = "https://n8n.eazyterp.com/webhook/claim-device";
const STRIPE_URL = "https://buy.stripe.com/cNibJ39h64Xv4a5flx8EM00";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate or retrieve device ID from localStorage
 * This ID uniquely identifies this device/browser
 */
function getDeviceId() {
  let deviceId = localStorage.getItem("et_device_id");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("et_device_id", deviceId);
  }
  return deviceId;
}

/**
 * Get stored token from localStorage
 */
function getStoredToken() {
  return localStorage.getItem("et_token");
}

/**
 * Save token to localStorage
 */
function saveToken(token) {
  localStorage.setItem("et_token", token);
}

/**
 * Clear all authentication data
 */
function clearAuth() {
  localStorage.removeItem("et_token");
  localStorage.removeItem("et_email");
  // Note: We keep et_device_id - it identifies the hardware
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PremiumGate({ children }) {
  const [email, setEmail] = useState(() => localStorage.getItem("et_email") || "");
  const [isPremium, setIsPremium] = useState(false);
  const [bootLoading, setBootLoading] = useState(true); // Only for initial load/auto-unlock
  const [actionLoading, setActionLoading] = useState(false); // Only for button clicks
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // ============================================================================
  // VALIDATE TOKEN (for returning users)
  // ============================================================================
  async function validateToken(token, deviceId) {
    try {
      const res = await fetch(API_VALIDATE_TOKEN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, device_id: deviceId }),
      });

      if (!res.ok) throw new Error(`Validation failed (${res.status})`);

      const data = await res.json();

      if (data.isPremium === true) {
        // Token is valid - unlock the app
        setIsPremium(true);
        if (data.email) {
          localStorage.setItem("et_email", data.email);
        }
      } else {
        // Token invalid - clear and show paywall
        clearAuth();
        setIsPremium(false);
      }
    } catch (err) {
      // Validation error - clear and show paywall
      console.error("Token validation error:", err);
      clearAuth();
      setIsPremium(false);
    } finally {
      setBootLoading(false);
    }
  }

  // ============================================================================
  // CLAIM DEVICE BY SESSION (auto-unlock after Stripe purchase)
  // ============================================================================
  async function claimDeviceBySession(sessionId) {
    setError("");
    setResult(null);

    try {
      const cleanSession = String(sessionId || "").trim();
      if (!cleanSession) throw new Error("Missing session_id from Stripe redirect.");

      const deviceId = getDeviceId();

      const res = await fetch(API_CLAIM_DEVICE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: cleanSession, device_id: deviceId }),
      });

      if (!res.ok) throw new Error(`Server error (${res.status})`);

      const data = await res.json();

      if (data.isPremium === true && data.token) {
        saveToken(data.token);
        if (data.email) localStorage.setItem("et_email", data.email);

        // IMPORTANT: Remove session_id from URL so refresh doesn't re-claim
        window.history.replaceState({}, document.title, window.location.pathname);

        setIsPremium(true);
      } else {
        throw new Error(data.message || "Purchase found but could not unlock. Try Restore Access.");
      }
    } catch (e) {
      setError(e?.message || "Auto-unlock failed. Try Restore Access below.");
    } finally {
      setBootLoading(false);
    }
  }

  // ============================================================================
  // CLAIM DEVICE (for email recovery / new device)
  // ============================================================================
  async function claimDevice(rawEmail) {
    setError("");
    setActionLoading(true);
    setResult(null);

    try {
      const cleanEmail = String(rawEmail || "").trim().toLowerCase();
      if (!cleanEmail) throw new Error("Enter the email you used at checkout.");

      const deviceId = getDeviceId();

      const res = await fetch(API_CLAIM_DEVICE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: cleanEmail,
          device_id: deviceId 
        }),
      });

      if (!res.ok) throw new Error(`Server error (${res.status})`);

      const data = await res.json();

      if (data.isPremium === true && data.token) {
        // Success! Save token and unlock
        saveToken(data.token);
        localStorage.setItem("et_email", data.email || cleanEmail);
        
        setResult({
          email: data.email || cleanEmail,
          status: data.status || "active",
          plan: data.plan || "Premium",
          isPremium: true,
        });

        // Unlock app after brief delay to show success message
        setTimeout(() => {
          setIsPremium(true);
        }, 1500);
      } else {
        // Not found or inactive
        throw new Error(data.message || "Email not found. Please check your email or purchase a subscription.");
      }
    } catch (e) {
      setError(e?.message || "Something went wrong. Please try again.");
      setResult(null);
    } finally {
      setActionLoading(false);
    }
  }

  // ============================================================================
  // RESET ACCESS (clear auth and try different email)
  // ============================================================================
  function resetAccess() {
    clearAuth();
    setEmail("");
    setResult(null);
    setError("");
    setIsPremium(false);
  }

  // ============================================================================
  // AUTO-UNLOCK ON APP LOAD
  // ============================================================================
  useEffect(() => {
    const deviceId = getDeviceId();
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    // Priority 1: Check if Stripe redirected with session_id (post-purchase)
    if (sessionId) {
      claimDeviceBySession(sessionId);
      return;
    }

    // Priority 2: Check if we have an existing token
    const token = getStoredToken();
    if (token) {
      validateToken(token, deviceId);
    } else {
      // No session, no token - show paywall
      setBootLoading(false);
    }
  }, []);

  // ============================================================================
  // STYLES (unchanged from your original)
  // ============================================================================
  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(circle at 20% 10%, #5b21b6 0%, transparent 55%), " +
        "radial-gradient(circle at 80% 90%, #7c3aed 0%, transparent 60%), " +
        "linear-gradient(135deg, #6b21a8 0%, #8b5cf6 50%, #7c3aed 100%)",
      padding: "1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    container: {
      width: "100%",
      maxWidth: "56rem",
      position: "relative",
    },
    card: {
      backgroundColor: "rgba(255, 255, 255, 0.10)",
      backdropFilter: "blur(18px)",
      borderRadius: "1.75rem",
      padding: "2.5rem",
      boxShadow:
        "0 0 0 3px rgba(250, 204, 21, 0.50), " +
        "0 0 50px rgba(250, 204, 21, 0.25), " +
        "0 25px 50px -12px rgba(0, 0, 0, 0.65)",
      border: "3px solid rgba(250, 204, 21, 0.60)",
      position: "relative",
      overflow: "hidden",
    },
    glow: {
      position: "absolute",
      inset: "-50%",
      background:
        "radial-gradient(circle at 50% 50%, rgba(250, 204, 21, 0.16), transparent 65%), " +
        "radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.12), transparent 65%), " +
        "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.10), transparent 65%)",
      pointerEvents: "none",
      animation: "pulse 8s ease-in-out infinite",
    },
    watermark: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "600px",
      opacity: 0.08,
      filter: "saturate(1.2) contrast(1.1) drop-shadow(0 30px 40px rgba(0,0,0,0.4))",
      pointerEvents: "none",
      zIndex: 0,
    },
    header: { textAlign: "center", position: "relative", zIndex: 2 },
    title: {
      fontSize: "4.5rem",
      fontWeight: "900",
      color: "#fbbf24",
      fontFamily: "Impact, system-ui, sans-serif",
      letterSpacing: "0.02em",
      margin: 0,
      textShadow: "0 4px 16px rgba(251, 191, 36, 0.6), 0 2px 8px rgba(251, 191, 36, 0.4)",
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.7rem 1.4rem",
      borderRadius: "999px",
      background: "rgba(251, 191, 36, 0.15)",
      border: "2px solid #fbbf24",
      color: "#fbbf24",
      fontWeight: 800,
      marginTop: "1rem",
      fontSize: "1.1rem",
      boxShadow: "0 6px 16px rgba(251, 191, 36, 0.20)",
    },
    mascotSection: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "1.5rem",
      marginTop: "2rem",
      padding: "1.75rem",
      background: "rgba(255, 255, 255, 0.08)",
      borderRadius: "1.25rem",
      border: "1px solid rgba(255, 255, 255, 0.16)",
      position: "relative",
      zIndex: 2,
      flexWrap: "wrap",
    },
    mascot: {
      width: "120px",
      height: "auto",
      filter: "drop-shadow(0 12px 20px rgba(0, 0, 0, 0.5))",
      flexShrink: 0,
    },
    quote: {
      color: "#fbbf24",
      fontWeight: 900,
      fontSize: "1.35rem",
      marginBottom: "0.5rem",
      fontStyle: "italic",
      textShadow: "0 2px 8px rgba(251, 191, 36, 0.4)",
    },
    quoteSubtext: {
      color: "rgba(255, 255, 255, 0.94)",
      fontSize: "1rem",
      lineHeight: 1.65,
      wordWrap: "break-word",
      overflowWrap: "break-word",
    },
    sectionTitle: {
      marginTop: "2.25rem",
      color: "#fbbf24",
      fontWeight: 900,
      fontSize: "1.5rem",
      letterSpacing: "0.01em",
      position: "relative",
      zIndex: 2,
      textShadow: "0 2px 8px rgba(251, 191, 36, 0.4)",
    },
    sectionSub: {
      marginTop: "0.5rem",
      color: "rgba(255,255,255,0.85)",
      fontSize: "1.05rem",
      lineHeight: 1.6,
      position: "relative",
      zIndex: 2,
    },
    featuresList: {
      marginTop: "1.25rem",
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "1rem",
      position: "relative",
      zIndex: 2,
    },
    featureItem: {
      display: "flex",
      gap: "1.25rem",
      padding: "1.25rem 1.5rem",
      background: "rgba(255, 255, 255, 0.09)",
      borderRadius: "1.1rem",
      border: "1px solid rgba(255, 255, 255, 0.14)",
      transition: "all 0.2s ease",
    },
    featureIcon: { 
      fontSize: "2rem", 
      flexShrink: 0, 
      marginTop: "0.1rem",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
    },
    featureTextWrap: { display: "flex", flexDirection: "column", gap: "0.25rem" },
    featureTitle: {
      color: "rgba(255,255,255,0.97)",
      fontSize: "1.15rem",
      fontWeight: 900,
    },
    featureDesc: {
      color: "rgba(255,255,255,0.82)",
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    pricingSection: {
      marginTop: "2.5rem",
      textAlign: "center",
      padding: "2.25rem",
      background: "rgba(251, 191, 36, 0.08)",
      borderRadius: "1.25rem",
      border: "2px solid rgba(251, 191, 36, 0.35)",
      position: "relative",
      zIndex: 2,
      boxShadow: "0 8px 24px rgba(251, 191, 36, 0.12)",
    },
    priceRow: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "center",
      gap: "1rem",
      marginBottom: "0.75rem",
    },
    price: {
      fontSize: "3.75rem",
      fontWeight: 900,
      color: "#fbbf24",
      textShadow: "0 4px 16px rgba(251, 191, 36, 0.6)",
    },
    priceDetail: { 
      color: "rgba(255, 255, 255, 0.90)", 
      fontSize: "1.2rem", 
      fontWeight: 700 
    },
    buyButton: {
      marginTop: "1.5rem",
      width: "100%",
      padding: "1.6rem 2.5rem",
      fontSize: "1.85rem",
      fontWeight: 900,
      background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #f97316 100%)",
      color: "#1f2937",
      border: "none",
      borderRadius: "1.25rem",
      cursor: "pointer",
      boxShadow:
        "0 0 40px rgba(251, 191, 36, 0.55), " +
        "0 12px 45px rgba(0, 0, 0, 0.45)",
      transition: "all 0.2s ease",
      textShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
      letterSpacing: "0.02em",
      position: "relative",
      overflow: "hidden",
    },
    divider: {
      marginTop: "2.5rem",
      marginBottom: "2rem",
      height: "2px",
      background: "linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.35), transparent)",
      position: "relative",
      zIndex: 2,
    },
    unlockSection: {
      background: "rgba(255, 255, 255, 0.07)",
      borderRadius: "1.25rem",
      padding: "2.25rem",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      position: "relative",
      zIndex: 2,
    },
    unlockTitle: {
      color: "#fbbf24",
      fontWeight: 900,
      fontSize: "1.65rem",
      margin: 0,
      marginBottom: "1.25rem",
      textAlign: "center",
      textShadow: "0 2px 8px rgba(251, 191, 36, 0.4)",
    },
    inputRow: { 
      display: "flex", 
      flexDirection: "column",
      gap: "0.85rem",
      width: "100%"
    },
    input: {
      width: "100%",
      padding: "1.1rem 1.4rem",
      borderRadius: "1rem",
      border: "2px solid rgba(251, 191, 36, 0.35)",
      background: "rgba(255, 255, 255, 0.96)",
      color: "#111827",
      fontSize: "1.08rem",
      fontWeight: 650,
      outline: "none",
      transition: "all 0.2s ease",
      boxSizing: "border-box",
    },
    unlockButton: {
      width: "100%",
      padding: "1.1rem 2.25rem",
      borderRadius: "1rem",
      border: "2px solid #fbbf24",
      background: "rgba(251, 191, 36, 0.20)",
      color: "#fbbf24",
      fontSize: "1.15rem",
      fontWeight: 900,
      cursor: "pointer",
      transition: "all 0.2s ease",
      boxShadow: "0 6px 16px rgba(251, 191, 36, 0.20)",
    },
    error: {
      marginTop: "1.15rem",
      padding: "1.1rem",
      borderRadius: "1rem",
      background: "rgba(239, 68, 68, 0.18)",
      border: "2px solid rgba(239, 68, 68, 0.45)",
      color: "#fecaca",
      fontWeight: 750,
      fontSize: "1.05rem",
      textAlign: "center",
    },
    resultBox: {
      marginTop: "1.15rem",
      padding: "1.4rem",
      borderRadius: "1rem",
      background: "rgba(255, 255, 255, 0.09)",
      border: "2px solid rgba(251, 191, 36, 0.30)",
      color: "rgba(255, 255, 255, 0.96)",
      fontSize: "1.05rem",
      lineHeight: 1.75,
    },
    resultStatus: {
      marginTop: "1.15rem",
      padding: "1.1rem",
      borderRadius: "0.85rem",
      background: "rgba(251, 191, 36, 0.18)",
      fontWeight: 900,
      fontSize: "1.1rem",
      textAlign: "center",
      color: "#fbbf24",
    },
    resetButton: {
      marginTop: "1.15rem",
      padding: "0.85rem 1.4rem",
      borderRadius: "0.85rem",
      border: "1px solid rgba(255, 255, 255, 0.30)",
      background: "transparent",
      color: "rgba(255, 255, 255, 0.92)",
      fontSize: "1rem",
      fontWeight: 750,
      cursor: "pointer",
      width: "100%",
      transition: "all 0.2s ease",
    },
    trustSignals: {
      marginTop: "1.5rem",
      textAlign: "center",
      color: "rgba(255, 255, 255, 0.80)",
      fontSize: "1rem",
      fontWeight: 650,
    },
  };

  // ============================================================================
  // RENDER: Show loading while checking token on initial load
  // ============================================================================
  if (bootLoading && !result) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.card, maxWidth: "400px", textAlign: "center" }}>
          <h2 style={{ color: "#fbbf24", fontSize: "2rem", marginBottom: "1rem" }}>
            ⏳ Checking access...
          </h2>
          <p style={{ color: "rgba(255,255,255,0.9)" }}>
            Hold tight, we're verifying your premium status.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: User is premium - show the app!
  // ============================================================================
  if (isPremium) return <>{children}</>;

  // ============================================================================
  // RENDER: Paywall
  // ============================================================================

  const features = [
    {
      icon: "🎯",
      title: "Terpene Matching",
      desc: "Let Eazy Terp use your mood as your guide — then match you with the terpene that fits.",
    },
    {
      icon: "✨",
      title: "Vibe Guidance",
      desc: "Quick, friendly direction on how to steer your session based on what you want to feel.",
    },
    {
      icon: "💭",
      title: "Daily Affirmations",
      desc: "A smooth reset message that keeps your mindset and intention on point.",
    },
    {
      icon: "🌿",
      title: "Strain Suggestions",
      desc: "Recommendations that pair well with your terpene match so you can shop smarter.",
    },
    {
      icon: "🎴",
      title: "Beautiful Budtender Card",
      desc: "A clean, gold-styled reference card you can show when picking strains.",
    },
  ];

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.02); }
        }
        button:hover {
          transform: translateY(-3px) !important;
          filter: brightness(1.10) !important;
        }
        input:focus {
          border-color: #fbbf24 !important;
          box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.20) !important;
        }
        .feature-item:hover {
          background: rgba(255, 255, 255, 0.14) !important;
          transform: translateX(10px);
          border-color: rgba(251, 191, 36, 0.25) !important;
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.glow} />

          <img
            src="/eazy-terp-peace.png"
            alt=""
            aria-hidden="true"
            style={styles.watermark}
          />

          <div style={styles.header}>
            <h1 style={styles.title}>Eazy Terp</h1>
            <div style={styles.badge}>🎷 Your AI Terpene Mood Matchmaker • Full Access</div>
          </div>

          <div style={styles.mascotSection}>
            <img src="/eazy-terp-peace.png" alt="Eazy Terp" style={styles.mascot} />
            <div style={styles.quoteBlock}>
              <div style={styles.quote}>"Keep it smooth, keep it jazzy." 🌿</div>
              <div style={styles.quoteSubtext}>
                Your daily companion for matching moods to terpenes — clean guidance,
                strain suggestions, and a budtender-ready card that makes choices effortless.
              </div>
            </div>
          </div>

          <div style={styles.sectionTitle}>What's Included</div>
          <div style={styles.sectionSub}>
            Everything below unlocks the full experience — built to feel premium, fast, and easy.
          </div>

          <div style={styles.featuresList}>
            {features.map((f, i) => (
              <div key={i} className="feature-item" style={styles.featureItem}>
                <div style={styles.featureIcon}>{f.icon}</div>
                <div style={styles.featureTextWrap}>
                  <div style={styles.featureTitle}>{f.title}</div>
                  <div style={styles.featureDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "2.5rem",
              padding: "2rem",
              borderRadius: "1.25rem",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              textAlign: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 900,
                color: "#fbbf24",
                marginBottom: "0.75rem",
                textShadow: "0 2px 8px rgba(251, 191, 36, 0.4)",
              }}
            >
              Built to Make Cannabis Simpler
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "1.05rem",
                marginBottom: "1.75rem",
                lineHeight: 1.6,
              }}
            >
              Eazy Terp helps you understand what you're choosing — before you light up or
              step into the dispensary.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1rem",
                textAlign: "left",
                maxWidth: "520px",
                margin: "0 auto",
                color: "rgba(255,255,255,0.92)",
                fontSize: "1.02rem",
                lineHeight: 1.65,
              }}
            >
              <div>🌿 <strong style={{ color: "rgba(255,255,255,0.97)" }}>Reduces Dispensary Anxiety</strong><br />Know what to ask for before you walk in.</div>
              <div>🎯 <strong style={{ color: "rgba(255,255,255,0.97)" }}>Learn What Terpenes Actually Do</strong><br />Understand effects — not just strain names.</div>
              <div>😌 <strong style={{ color: "rgba(255,255,255,0.97)" }}>Shop With Confidence</strong><br />Guidance based on how you want to feel.</div>
            </div>
          </div>

          <div style={styles.pricingSection}>
            <div style={styles.priceRow}>
              <div style={styles.price}>$4.99</div>
              <div style={styles.priceDetail}>/month</div>
            </div>

            <div style={{ color: "rgba(255, 255, 255, 0.87)", marginBottom: "0.65rem", fontSize: "1.05rem" }}>
              Secure via Stripe • Cancel anytime
            </div>

            <button
              style={styles.buyButton}
              onClick={() => window.location.href = STRIPE_URL}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = 
                  "0 0 50px rgba(251, 191, 36, 0.65), 0 15px 55px rgba(0, 0, 0, 0.50)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = 
                  "0 0 40px rgba(251, 191, 36, 0.55), 0 12px 45px rgba(0, 0, 0, 0.45)";
              }}
            >
              🔓 Unlock Eazy Terp Now
            </button>

            <div style={{ 
              marginTop: "1rem", 
              fontSize: "0.9rem", 
              color: "rgba(255,255,255,0.7)",
              fontStyle: "italic"
            }}>
              🔐 One-device premium access • Switch phones anytime via Restore Access
            </div>
          </div>

          <div style={styles.divider} />

          {/* VIDEO DEMO SECTION */}
          <div
            style={{
              marginTop: "3rem",
              marginBottom: "3rem",
              padding: "2.5rem 2rem",
              borderRadius: "1.5rem",
              background: "linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
              border: "3px solid #fbbf24",
              boxShadow: "0 10px 40px rgba(251, 191, 36, 0.3)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "#fbbf24",
                  margin: "0 0 0.5rem 0",
                  textShadow: "0 2px 10px rgba(251, 191, 36, 0.5)",
                }}
              >
                🎬 See It In Action
              </h2>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "1.1rem",
                  margin: 0,
                }}
              >
                Watch how Eazy Terp matches your mood to the perfect terpene in seconds
              </p>
            </div>

            <div
              style={{
                maxWidth: "600px",
                margin: "0 auto",
                borderRadius: "1rem",
                overflow: "hidden",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
                border: "2px solid rgba(251, 191, 36, 0.3)",
              }}
            >
              <video
                controls
                preload="metadata"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  backgroundColor: "#000",
                }}
                poster="/eazy-terp-full.png"
                onEnded={(e) => {
                  e.target.load(); // Resets video to show poster
                }}
                onError={(e) => {
                  console.error("Video failed to load:", e);
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              >
                <source src="/demo-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div
                style={{
                  display: "none",
                  padding: "2rem",
                  textAlign: "center",
                  backgroundColor: "rgba(251, 191, 36, 0.1)",
                  color: "#fbbf24",
                }}
              >
                <p style={{ margin: 0, fontSize: "1.1rem" }}>
                  Video not found. Please add <code>demo-video.mp4</code> to your <code>/public</code> folder.
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: "2rem",
                textAlign: "center",
                padding: "1.5rem",
                borderRadius: "1rem",
                background: "rgba(251, 191, 36, 0.15)",
              }}
            >
              <p
                style={{
                  color: "#fbbf24",
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                ✨ Ready to match YOUR mood? Unlock full access below! ✨
              </p>
            </div>
          </div>

          <div style={styles.unlockSection}>
            <h2 style={styles.unlockTitle}>Restore Access 🔄</h2>

            <div style={{ 
              textAlign: "center", 
              marginBottom: "1.5rem",
              color: "rgba(255,255,255,0.85)",
              fontSize: "1rem"
            }}>
              Got a new device? Enter your email to restore premium access here.
            </div>

            <div style={styles.inputRow}>
              <input
                style={styles.input}
                placeholder="Enter your email from checkout"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && claimDevice(email)}
                autoComplete="email"
              />
              <button
                style={styles.unlockButton}
                onClick={() => claimDevice(email)}
                disabled={actionLoading}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(251, 191, 36, 0.30)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(251, 191, 36, 0.20)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {actionLoading ? "⏳ Claiming Device..." : "Restore Access"}
              </button>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            {result && (
              <div style={styles.resultBox}>
                <div><strong>Email:</strong> {result.email}</div>
                <div><strong>Status:</strong> {result.status || "—"}</div>
                <div><strong>Plan:</strong> {result.plan || "—"}</div>

                <div style={styles.resultStatus}>
                  {result.isPremium
                    ? "✅ Access Restored! Unlocking app..."
                    : "❌ Not found — double-check your email"}
                </div>

                <button style={styles.resetButton} onClick={resetAccess}>
                  Try a Different Email
                </button>
              </div>
            )}

            <div style={styles.trustSignals}>
              🔒 Secure • 💳 Cancel anytime • ⚡ Instant access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
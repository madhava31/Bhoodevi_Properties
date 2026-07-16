import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

// ─── Hardcoded Admin Credentials ────────────────────────────────────────────
const ADMIN_CREDENTIALS = {
  id: "bhoodevi_admin",
  password: "Bhoodevi@2026"
};
const ADMIN_SESSION_KEY = "bhoodevi_admin_session";

export function setAdminSession() {
  sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminAuthenticated() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}
// ────────────────────────────────────────────────────────────────────────────

export default function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network latency for realism
    await new Promise((r) => setTimeout(r, 700));

    if (
      adminId.trim() === ADMIN_CREDENTIALS.id &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setAdminSession();
      navigate("/admin", { replace: true });
    } else {
      setLoading(false);
      setError("Invalid Admin ID or Password. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
        {/* Topo grid pattern */}
        <div className="absolute inset-0 topo-bg opacity-5" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-3xl shadow-2xl shadow-primary/5 overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="p-8 md:p-10">
            {/* Logo / Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="grid place-items-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent border-2 border-card" />
              </div>
              <h1 className="font-display text-3xl text-foreground tracking-wide">Admin Access</h1>
              <p className="text-sm text-muted-foreground mt-1.5 text-center">
                Bhoodevi Properties · Estate Control Center
              </p>
            </div>

            {/* Error alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Admin ID */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Admin ID
                </label>
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="Enter your Admin ID"
                  autoComplete="username"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 placeholder:text-muted-foreground/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold text-sm mt-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Access Dashboard
                  </>
                )}
              </button>
            </form>


          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/50 mt-5">
          Bhoodevi Properties © 2026 · Restricted Access
        </p>
      </motion.div>
    </div>
  );
}

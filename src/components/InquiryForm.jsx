const db = globalThis.__BHOODEVI_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InquiryForm({ propertyTitle, propertyId, compact = false }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: propertyTitle ? `I'm interested in ${propertyTitle}.` : "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) { setError("Name and phone are required."); return; }
    setStatus("loading"); setError("");
    try {
      await db.entities.Inquiry.create({
        name: form.name, email: form.email, phone: form.phone,
        message: form.message, property_id: propertyId || null,
        property_title: propertyTitle, type: "Inquiry"
      });
      setStatus("success");
    } catch (err) {
      setStatus("error"); setError("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center py-10"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }} className="grid place-items-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </motion.div>
        <h3 className="font-display text-2xl">Inquiry received</h3>
        <p className="text-muted-foreground mt-2 max-w-xs">Our estate director will reach out within 24 hours.</p>
        <button onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", message: "" }); }} className="mt-5 text-sm text-accent hover:underline">
          Send another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full Name *">
          <input value={form.name} onChange={set("name")} className="bhoodevi-input" placeholder="Your name" required />
        </Field>
        <Field label="Phone *">
          <input value={form.phone} onChange={set("phone")} type="tel" className="bhoodevi-input" placeholder="+91 ..." required />
        </Field>
      </div>
      {!compact && (
        <Field label="Email">
          <input value={form.email} onChange={set("email")} type="email" className="bhoodevi-input" placeholder="you@email.com" />
        </Field>
      )}
      <Field label="Message">
        <textarea value={form.message} onChange={set("message")} rows={compact ? 3 : 4} className="bhoodevi-input resize-none" placeholder="Tell us what you're looking for..." />
      </Field>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={status === "loading"} className="w-full rounded-full bg-primary hover:bg-accent hover:text-accent-foreground h-12">
        {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
        Send Inquiry
      </Button>
      <style>{`.bhoodevi-input{width:100%;border-radius:0.6rem;border:1px solid hsl(var(--border));background:hsl(var(--background));padding:0.7rem 0.9rem;font-size:0.95rem;outline:none;transition:border-color .2s}.bhoodevi-input:focus{border-color:hsl(var(--accent))}`}</style>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="label-tech mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
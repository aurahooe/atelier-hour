"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Enter() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("in");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const fn =
      mode === "in"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });
    const { error } = await fn;
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.push("/studio");
    router.refresh();
  }

  return (
    <div className="wrap">
      <header className="top">
        <Link className="mark" href="/">atelier <span>hour</span></Link>
      </header>
      <section className="hero">
        <h1>{mode === "in" ? "Come in." : "Take a key."}</h1>
        <p>Email and a password. That is the whole lock.</p>
      </section>
      <form className="card" onSubmit={onSubmit} style={{ maxWidth: 420 }}>
        <input type="email" required placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required minLength={6} placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <p className="err">{err}</p>}
        <button className="btn" disabled={busy} type="submit">{busy ? "..." : mode === "in" ? "Enter" : "Create account"}</button>
        <button type="button" className="btn ghost" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "Need a key?" : "Already have one?"}
        </button>
      </form>
    </div>
  );
}

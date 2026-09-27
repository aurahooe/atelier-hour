"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function StudioForm() {
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setErr("Sign in first.");
      setBusy(false);
      return;
    }
    const { error } = await supabase.from("glasspress_pieces").insert({
      author_id: user.id,
      title,
      body,
      is_public: isPublic,
    });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setTitle("");
    setBody("");
    setIsPublic(false);
    router.refresh();
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <input required placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea required placeholder="the piece itself" value={body} onChange={(e) => setBody(e.target.value)} />
      <label>
        <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
        Put it on the public wall
      </label>
      {err && <p className="err">{err}</p>}
      <button className="btn" disabled={busy} type="submit">{busy ? "Saving" : "Save"}</button>
    </form>
  );
}

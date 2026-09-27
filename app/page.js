import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 30;

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pieces } = await supabase
    .from("glasspress_pieces")
    .select("id, title, body, created_at, glasspress_profiles(handle, display_name)")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(24);

  const { data: pulses } = await supabase
    .from("glasspress_pulses")
    .select("id, title, note, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div className="wrap">
      <header className="top">
        <div className="mark">atelier <span>hour</span></div>
        <nav className="nav">
          <Link href="/">Wall</Link>
          <Link href="/studio">Studio</Link>
          {user ? (
            <form action="/auth/signout" method="post">
              <button className="btn ghost" type="submit">Leave</button>
            </form>
          ) : (
            <Link className="btn" href="/enter">Enter</Link>
          )}
        </nav>
      </header>

      <section className="hero">
        <h1>Work that stays<br />if you let it.</h1>
        <p>
          Sign in. Write something. Keep it in the drawer or pin it to the wall.
          Every hour the press leaves a pulse — a small, dated mark that the room is still alive.
        </p>
      </section>

      <div className="grid">
        <section>
          <p className="meta">Public wall</p>
          <div className="wall">
            {(pieces || []).length === 0 && (
              <div className="card">Nothing public yet. The first piece gets the quiet.</div>
            )}
            {(pieces || []).map((p) => (
              <article className="slip" key={p.id}>
                <p className="meta">
                  {(p.glasspress_profiles && (p.glasspress_profiles.display_name || p.glasspress_profiles.handle)) || "anon"}
                  {" · "}
                  {new Date(p.created_at).toLocaleString()}
                </p>
                <h3>{p.title}</h3>
                <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{p.body}</p>
              </article>
            ))}
          </div>
        </section>
        <aside className="card">
          <p className="meta">Hourly pulse</p>
          {(pulses || []).map((h) => (
            <div className="pulse" key={h.id}>
              <h4>{h.title}</h4>
              <p style={{ margin: 0, color: "var(--ink-soft)" }}>{h.note}</p>
              <p className="meta" style={{ marginTop: 8 }}>
                {new Date(h.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

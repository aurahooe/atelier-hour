import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StudioForm from "./form";

export default async function Studio() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/enter");

  await supabase.from("glasspress_profiles").upsert(
    {
      id: user.id,
      handle: `${(user.email || "guest").split("@")[0]}-${user.id.slice(0, 6)}`,
      display_name: (user.email || "guest").split("@")[0],
    },
    { onConflict: "id", ignoreDuplicates: true }
  );

  const { data: mine } = await supabase
    .from("glasspress_pieces")
    .select("id, title, body, is_public, created_at")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="wrap">
      <header className="top">
        <Link className="mark" href="/">atelier <span>hour</span></Link>
        <nav className="nav">
          <Link href="/">Wall</Link>
          <form action="/auth/signout" method="post">
            <button className="btn ghost" type="submit">Leave</button>
          </form>
        </nav>
      </header>
      <section className="hero">
        <h1>Your drawer.</h1>
        <p>Public pieces land on the wall. The rest stay here, saved.</p>
      </section>
      <div className="grid">
        <StudioForm />
        <div className="wall">
          {(mine || []).map((p) => (
            <article className="slip" key={p.id}>
              <p className="meta">{p.is_public ? "public" : "private"} · {new Date(p.created_at).toLocaleString()}</p>
              <h3>{p.title}</h3>
              <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

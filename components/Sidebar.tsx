"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "./Icons";

const nav = [
  ["Home", "/dashboard", "home"],
  ["My Rotation", "/rotation", "rotation"],
  ["Communities", "/communities", "communities"],
  ["Projects", "/projects", "projects"],
  ["Toolkit", "/toolkit", "toolkit"],
  ["Directory", "/directory", "directory"],
  ["Administration", "/admin", "admin"],
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">UP</div>
        <div>
          <strong>Community Health Toolkit</strong>
          <span>UPM-SHS · Community Clerkship & Internship</span>
        </div>
      </div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {nav.map(([label, href, icon]) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link className={active ? "nav-item active" : "nav-item"} href={href} key={href}>
              <Icon name={icon} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <button className="sidebar-signout" type="button" onClick={signOut}>Sign out</button>
      <div className="sidebar-note">
        <strong>Community sites</strong>
        <span>Palo · Alangalang · Dagami · Tolosa · Tanauan · Dulag</span>
      </div>
    </aside>
  );
}

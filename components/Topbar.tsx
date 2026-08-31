"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "./Icons";

type DisplayUser = {
  name: string;
  detail: string;
};

export function Topbar() {
  const router = useRouter();
  const [user, setUser] = useState<DisplayUser>({ name: "Signed in user", detail: "Community Health Toolkit" });
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    let active = true;

    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      const authUser = data.user;
      if (!authUser || !active) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role, batch")
        .eq("id", authUser.id)
        .maybeSingle();

      if (!active) return;
      const role = profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "User";
      setUser({
        name: profile?.full_name || authUser.email || "Signed in user",
        detail: [profile?.batch, role].filter(Boolean).join(" · ") || role,
      });
    }

    loadUser();
    return () => { active = false; };
  }, []);

  const initials = useMemo(() => {
    return user.name
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "UP";
  }, [user.name]);

  async function handleSignOut() {
    const supabase = createClient();
    if (!supabase) {
      router.replace("/login");
      return;
    }
    setSigningOut(true);
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="topbar">
      <div className="search-box">
        <Icon name="search" />
        <input aria-label="Search Community Health Toolkit" placeholder="Search communities, projects, people, resources…" />
      </div>
      <div className="topbar-account">
        <div className="user-chip">
          <div className="avatar">{initials}</div>
          <div>
            <strong>{user.name}</strong>
            <span>{user.detail}</span>
          </div>
        </div>
        <button className="signout-button" type="button" onClick={handleSignOut} disabled={signingOut}>
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </header>
  );
}

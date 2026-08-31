(() => {
  const cfg = window.APP_CONFIG || {};
  const url = cfg.SUPABASE_URL || "";
  const key = cfg.SUPABASE_ANON_KEY || "";
  const app = document.getElementById("portal-app");
  const loading = document.getElementById("portal-loading");

  function configMissing() {
    return (
      !url ||
      !key ||
      url.includes("PASTE_YOUR") ||
      key.includes("PASTE_YOUR")
    );
  }

  if (configMissing() || !window.supabase?.createClient) {
    if (loading) {
      loading.innerHTML = `
        <strong>Supabase setup required.</strong>
        <span>Edit <code>supabase-config.js</code> and add your Supabase project URL and publishable/anon key.</span>
        <a href="index.html">Return to login</a>
      `;
      loading.classList.add("portal-error");
    }
    return;
  }

  const client = window.supabase.createClient(url, key);

  function setLoadingCard({title, text, detail = "", action = ""}) {
    if (!loading) return;
    loading.hidden = false;
    loading.innerHTML = `
      <img src="assets/shs-logo.png" alt="UPM-SHS">
      <strong>${title}</strong>
      <span>${text}</span>
      ${detail ? `<small class="portal-status-detail">${detail}</small>` : ""}
      ${action}
    `;
  }

  async function signOut() {
    await client.auth.signOut();
    window.location.replace("index.html");
  }

  async function start() {
    const { data: userData, error: userError } = await client.auth.getUser();
    const user = userData?.user;

    if (userError || !user) {
      window.location.replace("index.html");
      return;
    }

    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("id,email,full_name,student_number,year_level,batch,role,status")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      setLoadingCard({
        title: "Profile setup incomplete",
        text: "Your authenticated account exists, but the Toolkit profile could not be loaded.",
        detail: "Ask the program coordinator to verify that supabase-schema.sql was run successfully.",
        action: `<button id="status-signout" class="button button-maroon" type="button">Sign out</button>`
      });
      document.getElementById("status-signout")?.addEventListener("click", signOut);
      return;
    }

    if (profile.status === "pending") {
      setLoadingCard({
        title: "Registration received",
        text: "Your account is verified but is still Pending Approval.",
        detail: `${profile.full_name} · ${profile.email}${profile.batch ? ` · ${profile.batch}` : ""}`,
        action: `
          <div class="pending-actions">
            <a class="button button-green" href="index.html">Return to public site</a>
            <button id="status-signout" class="button button-outline-maroon" type="button">Sign out</button>
          </div>
        `
      });
      document.getElementById("status-signout")?.addEventListener("click", signOut);
      return;
    }

    if (profile.status === "suspended") {
      setLoadingCard({
        title: "Account suspended",
        text: "Your Toolkit access has been temporarily suspended.",
        detail: "Please contact the program coordinator if you believe this is an error.",
        action: `<button id="status-signout" class="button button-maroon" type="button">Sign out</button>`
      });
      document.getElementById("status-signout")?.addEventListener("click", signOut);
      return;
    }

    if (profile.status === "archived") {
      setLoadingCard({
        title: "Account archived",
        text: "This Toolkit account is archived and no longer has active access.",
        action: `<button id="status-signout" class="button button-maroon" type="button">Sign out</button>`
      });
      document.getElementById("status-signout")?.addEventListener("click", signOut);
      return;
    }

    if (profile.status !== "active") {
      setLoadingCard({
        title: "Access unavailable",
        text: "Your account does not currently have active Toolkit access.",
        action: `<button id="status-signout" class="button button-maroon" type="button">Sign out</button>`
      });
      document.getElementById("status-signout")?.addEventListener("click", signOut);
      return;
    }

    const fullName = profile.full_name || user.email || "Authorized user";
    const email = profile.email || user.email || "";
    const role = profile.role || "student";

    document.querySelectorAll("[data-user-name]").forEach(el => {
      el.textContent = fullName;
    });

    document.querySelectorAll("[data-user-email]").forEach(el => {
      el.textContent = email;
    });

    document.querySelectorAll("[data-user-role]").forEach(el => {
      el.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    });

    document.querySelectorAll("[data-user-batch]").forEach(el => {
      el.textContent = profile.batch || "—";
    });

    document.querySelectorAll("[data-user-year]").forEach(el => {
      el.textContent = profile.year_level || "—";
    });

    const initials = fullName
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join("") || "UP";

    document.querySelectorAll("[data-user-initials]").forEach(el => {
      el.textContent = initials;
    });

    if (loading) loading.hidden = true;
    if (app) app.hidden = false;
  }

  document.querySelectorAll("[data-sign-out]").forEach(button => {
    button.addEventListener("click", async () => {
      button.disabled = true;
      button.textContent = "Signing out…";
      await signOut();
    });
  });

  client.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") {
      window.location.replace("index.html");
    }
  });

  start();
})();

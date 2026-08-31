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
        <span>Edit <code>supabase-config.js</code> and add your Supabase project URL and anon key.</span>
        <a href="index.html#portal">Return to login</a>
      `;
      loading.classList.add("portal-error");
    }
    return;
  }

  const client = window.supabase.createClient(url, key);

  async function start() {
    const { data, error } = await client.auth.getUser();
    const user = data?.user;

    if (error || !user) {
      window.location.replace("index.html#portal");
      return;
    }

    const email = user.email || "Authorized user";
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      email.split("@")[0];

    document.querySelectorAll("[data-user-name]").forEach(el => {
      el.textContent = fullName;
    });

    document.querySelectorAll("[data-user-email]").forEach(el => {
      el.textContent = email;
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
      await client.auth.signOut();
      window.location.replace("index.html#portal");
    });
  });

  client.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") {
      window.location.replace("index.html#portal");
    }
  });

  start();
})();

(() => {
  const cfg = window.APP_CONFIG || {};
  const url = cfg.SUPABASE_URL || "";
  const key = cfg.SUPABASE_ANON_KEY || "";
  const loading = document.getElementById("admin-loading");
  const app = document.getElementById("admin-app");

  const roles = ["student", "faculty", "preceptor", "coordinator", "admin"];
  const statuses = ["pending", "active", "suspended", "archived"];

  let client;
  let currentUser;
  let currentProfile;
  let users = [];
  let communities = [];
  let rotations = [];

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function configMissing() {
    return (
      !url ||
      !key ||
      url.includes("PASTE_YOUR") ||
      key.includes("PASTE_YOUR")
    );
  }

  function showFatal(title, text) {
    loading.hidden = false;
    loading.innerHTML = `
      <img src="assets/shs-logo.png" alt="UPM-SHS">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(text)}</span>
      <a href="portal.html">Return to portal</a>
    `;
  }

  function setMessage(id, message = "", type = "") {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.className = "admin-message";
    if (type) el.classList.add(type);
  }

  function formatDate(value) {
    if (!value) return "—";
    const d = new Date(value + "T00:00:00");
    return d.toLocaleDateString(undefined, { year:"numeric", month:"short", day:"numeric" });
  }

  async function bootstrap() {
    if (configMissing() || !window.supabase?.createClient) {
      showFatal("Supabase setup required", "Check supabase-config.js.");
      return;
    }

    client = window.supabase.createClient(url, key);

    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData?.user) {
      window.location.replace("index.html");
      return;
    }

    currentUser = userData.user;

    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("id,email,full_name,role,status")
      .eq("id", currentUser.id)
      .single();

    if (profileError || !profile) {
      showFatal("Profile unavailable", "Your Toolkit profile could not be loaded.");
      return;
    }

    currentProfile = profile;

    if (profile.status !== "active" || !["admin","coordinator"].includes(profile.role)) {
      showFatal("Administrator access required", "This page is limited to active admins and coordinators.");
      return;
    }

    const name = profile.full_name || profile.email;
    document.querySelectorAll("[data-user-name]").forEach(el => el.textContent = name);
    document.querySelectorAll("[data-user-email]").forEach(el => el.textContent = profile.email || "");
    const initials = name.split(/\s+/).filter(Boolean).slice(0,2).map(x => x[0].toUpperCase()).join("") || "UP";
    document.querySelectorAll("[data-user-initials]").forEach(el => el.textContent = initials);

    loading.hidden = true;
    app.hidden = false;

    bindEvents();

    await Promise.all([
      loadUsers(),
      loadCommunities(),
      loadRotations()
    ]);
    refreshStats();
  }

  function bindEvents() {
    document.querySelectorAll("[data-sign-out]").forEach(button => {
      button.addEventListener("click", async () => {
        await client.auth.signOut();
        window.location.replace("index.html");
      });
    });

    document.getElementById("user-search")?.addEventListener("input", renderUsers);
    document.getElementById("user-status-filter")?.addEventListener("change", renderUsers);

    document.getElementById("open-community-form")?.addEventListener("click", () => {
      resetCommunityForm();
      document.getElementById("community-form").hidden = false;
      document.getElementById("community-name").focus();
    });

    document.getElementById("cancel-community")?.addEventListener("click", () => {
      resetCommunityForm();
      document.getElementById("community-form").hidden = true;
    });

    document.getElementById("community-form")?.addEventListener("submit", saveCommunity);
    document.getElementById("rotation-form")?.addEventListener("submit", saveRotation);
  }

  async function loadUsers() {
    const { data, error } = await client
      .from("profiles")
      .select("id,email,full_name,student_number,year_level,batch,role,status,created_at,approved_at")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("user-message", error.message, "error");
      return;
    }

    users = data || [];
    renderUsers();
    populateRotationUsers();
    refreshStats();
  }

  function renderUsers() {
    const body = document.getElementById("users-body");
    if (!body) return;

    const q = (document.getElementById("user-search")?.value || "").trim().toLowerCase();
    const statusFilter = document.getElementById("user-status-filter")?.value || "all";

    const filtered = users.filter(user => {
      const haystack = [
        user.full_name,
        user.email,
        user.student_number,
        user.year_level,
        user.batch,
        user.role,
        user.status
      ].filter(Boolean).join(" ").toLowerCase();

      return (!q || haystack.includes(q))
        && (statusFilter === "all" || user.status === statusFilter);
    });

    if (!filtered.length) {
      body.innerHTML = `<tr><td colspan="5" class="table-empty">No matching users.</td></tr>`;
      return;
    }

    body.innerHTML = filtered.map(user => {
      const isSelf = user.id === currentUser.id;

      const roleOptions = roles.map(role =>
        `<option value="${role}" ${user.role === role ? "selected" : ""}>${role}</option>`
      ).join("");

      const statusOptions = statuses.map(status =>
        `<option value="${status}" ${user.status === status ? "selected" : ""}>${status}</option>`
      ).join("");

      const approveButton = user.status === "pending"
        ? `<button class="mini-action approve" data-action="approve" data-user-id="${user.id}">Approve</button>`
        : "";

      return `
        <tr>
          <td>
            <div class="table-user">
              <strong>${escapeHtml(user.full_name || "Unnamed user")}</strong>
              <span>${escapeHtml(user.email || "")}</span>
              ${isSelf ? `<small>You</small>` : ""}
            </div>
          </td>
          <td>
            <div class="table-stack">
              <span>${escapeHtml(user.student_number || "—")}</span>
              <small>${escapeHtml([user.year_level, user.batch].filter(Boolean).join(" · ") || "No academic details")}</small>
            </div>
          </td>
          <td>
            <select class="table-select role-select" data-user-id="${user.id}" ${currentProfile.role !== "admin" ? "disabled" : ""}>
              ${roleOptions}
            </select>
          </td>
          <td>
            <select class="table-select status-select" data-user-id="${user.id}" ${currentProfile.role !== "admin" ? "disabled" : ""}>
              ${statusOptions}
            </select>
          </td>
          <td>
            <div class="table-actions">
              ${approveButton}
              ${currentProfile.role === "admin" ? `<button class="mini-action save" data-action="save-user" data-user-id="${user.id}">Save</button>` : ""}
            </div>
          </td>
        </tr>
      `;
    }).join("");

    body.querySelectorAll("[data-action='approve']").forEach(button => {
      button.addEventListener("click", () => approveUser(button.dataset.userId));
    });

    body.querySelectorAll("[data-action='save-user']").forEach(button => {
      button.addEventListener("click", () => saveUser(button.dataset.userId));
    });
  }

  async function approveUser(userId) {
    setMessage("user-message", "Approving account…");

    const { error } = await client.rpc("approve_profile", {
      target_user: userId
    });

    if (error) {
      setMessage("user-message", error.message, "error");
      return;
    }

    setMessage("user-message", "Account approved.", "success");
    await loadUsers();
  }

  async function saveUser(userId) {
    const role = document.querySelector(`.role-select[data-user-id="${userId}"]`)?.value;
    const status = document.querySelector(`.status-select[data-user-id="${userId}"]`)?.value;

    if (!role || !status) return;

    setMessage("user-message", "Saving user…");

    const { error } = await client.rpc("admin_update_profile", {
      target_user: userId,
      new_role: role,
      new_status: status
    });

    if (error) {
      setMessage("user-message", error.message, "error");
      return;
    }

    setMessage("user-message", "User updated.", "success");
    await loadUsers();
  }

  async function loadCommunities() {
    const { data, error } = await client
      .from("communities")
      .select("id,name,province,municipality,description,preceptor_name,is_active,created_at")
      .order("name");

    if (error) {
      setMessage("community-message", error.message, "error");
      return;
    }

    communities = data || [];
    renderCommunities();
    populateRotationCommunities();
    refreshStats();
  }

  function renderCommunities() {
    const grid = document.getElementById("admin-community-grid");
    if (!grid) return;

    if (!communities.length) {
      grid.innerHTML = `<div class="table-empty">No communities yet.</div>`;
      return;
    }

    grid.innerHTML = communities.map(c => `
      <article class="admin-community-card ${c.is_active ? "" : "inactive"}">
        <span class="community-card-status">${c.is_active ? "Active" : "Inactive"}</span>
        <h3>${escapeHtml(c.name)}</h3>
        <p>${escapeHtml(c.municipality || c.name)}, ${escapeHtml(c.province || "")}</p>
        <small>${escapeHtml(c.preceptor_name || "No preceptor recorded")}</small>
        <div class="community-card-actions">
          <button class="mini-action save" data-community-action="edit" data-community-id="${c.id}">Edit</button>
          <button class="mini-action ${c.is_active ? "suspend" : "approve"}" data-community-action="toggle" data-community-id="${c.id}">
            ${c.is_active ? "Deactivate" : "Activate"}
          </button>
        </div>
      </article>
    `).join("");

    grid.querySelectorAll("[data-community-action='edit']").forEach(button => {
      button.addEventListener("click", () => editCommunity(button.dataset.communityId));
    });

    grid.querySelectorAll("[data-community-action='toggle']").forEach(button => {
      button.addEventListener("click", () => toggleCommunity(button.dataset.communityId));
    });
  }

  function resetCommunityForm() {
    document.getElementById("community-form")?.reset();
    document.getElementById("community-id").value = "";
    document.getElementById("community-province").value = "Leyte";
    document.getElementById("save-community").textContent = "Save Community";
  }

  function editCommunity(id) {
    const c = communities.find(x => x.id === id);
    if (!c) return;

    document.getElementById("community-form").hidden = false;
    document.getElementById("community-id").value = c.id;
    document.getElementById("community-name").value = c.name || "";
    document.getElementById("community-province").value = c.province || "Leyte";
    document.getElementById("community-municipality").value = c.municipality || "";
    document.getElementById("community-preceptor").value = c.preceptor_name || "";
    document.getElementById("community-description").value = c.description || "";
    document.getElementById("save-community").textContent = "Update Community";
    document.getElementById("community-name").focus();
  }

  async function saveCommunity(event) {
    event.preventDefault();

    const id = document.getElementById("community-id").value;
    const payload = {
      name: document.getElementById("community-name").value.trim(),
      province: document.getElementById("community-province").value.trim() || "Leyte",
      municipality: document.getElementById("community-municipality").value.trim() || null,
      preceptor_name: document.getElementById("community-preceptor").value.trim() || null,
      description: document.getElementById("community-description").value.trim() || null
    };

    if (!payload.name) return;

    setMessage("community-message", id ? "Updating community…" : "Adding community…");

    let result;
    if (id) {
      result = await client.from("communities").update(payload).eq("id", id);
    } else {
      payload.created_by = currentUser.id;
      result = await client.from("communities").insert(payload);
    }

    if (result.error) {
      setMessage("community-message", result.error.message, "error");
      return;
    }

    setMessage("community-message", id ? "Community updated." : "Community added.", "success");
    resetCommunityForm();
    document.getElementById("community-form").hidden = true;
    await loadCommunities();
  }

  async function toggleCommunity(id) {
    const c = communities.find(x => x.id === id);
    if (!c) return;

    const { error } = await client
      .from("communities")
      .update({ is_active: !c.is_active })
      .eq("id", id);

    if (error) {
      setMessage("community-message", error.message, "error");
      return;
    }

    setMessage("community-message", c.is_active ? "Community deactivated." : "Community activated.", "success");
    await loadCommunities();
  }

  function populateRotationUsers() {
    const select = document.getElementById("rotation-user");
    if (!select) return;

    const students = users
      .filter(u => u.status === "active" && u.role === "student")
      .sort((a,b) => (a.full_name || "").localeCompare(b.full_name || ""));

    select.innerHTML = `<option value="">Select active student</option>` +
      students.map(u =>
        `<option value="${u.id}">${escapeHtml(u.full_name || u.email)}${u.batch ? ` · ${escapeHtml(u.batch)}` : ""}</option>`
      ).join("");
  }

  function populateRotationCommunities() {
    const select = document.getElementById("rotation-community");
    if (!select) return;

    select.innerHTML = `<option value="">Select community</option>` +
      communities
        .filter(c => c.is_active)
        .map(c => `<option value="${c.id}">${escapeHtml(c.name)}, ${escapeHtml(c.province || "")}</option>`)
        .join("");
  }

  async function saveRotation(event) {
    event.preventDefault();

    const payload = {
      user_id: document.getElementById("rotation-user").value,
      community_id: document.getElementById("rotation-community").value,
      rotation_type: document.getElementById("rotation-type").value,
      course_code: document.getElementById("rotation-course").value.trim() || "Community Medicine",
      batch: document.getElementById("rotation-batch").value.trim() || null,
      start_date: document.getElementById("rotation-start").value || null,
      end_date: document.getElementById("rotation-end").value || null,
      notes: document.getElementById("rotation-notes").value.trim() || null,
      status: "active",
      created_by: currentUser.id
    };

    if (!payload.user_id || !payload.community_id) {
      setMessage("rotation-message", "Select both a student and community.", "error");
      return;
    }

    setMessage("rotation-message", "Assigning rotation…");

    const { error } = await client
      .from("rotation_assignments")
      .insert(payload);

    if (error) {
      setMessage("rotation-message", error.message, "error");
      return;
    }

    setMessage("rotation-message", "Rotation assigned.", "success");
    document.getElementById("rotation-form").reset();
    document.getElementById("rotation-course").value = "Community Medicine";
    await loadRotations();
  }

  async function loadRotations() {
    const { data, error } = await client
      .from("rotation_assignments")
      .select(`
        id,user_id,community_id,course_code,rotation_type,batch,start_date,end_date,status,notes,created_at,
        communities(name,province)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("rotation-message", error.message, "error");
      return;
    }

    rotations = data || [];
    renderRotations();
    refreshStats();
  }

  function renderRotations() {
    const body = document.getElementById("rotations-body");
    if (!body) return;

    if (!rotations.length) {
      body.innerHTML = `<tr><td colspan="6" class="table-empty">No rotation assignments yet.</td></tr>`;
      return;
    }

    body.innerHTML = rotations.map(r => {
      const student = users.find(u => u.id === r.user_id);
      const studentName = student?.full_name || student?.email || r.user_id;
      const community = r.communities?.name || "Unknown community";

      return `
        <tr>
          <td><div class="table-user"><strong>${escapeHtml(studentName)}</strong><span>${escapeHtml(student?.email || "")}</span></div></td>
          <td><div class="table-stack"><strong>${escapeHtml(community)}</strong><small>${escapeHtml(r.communities?.province || "")}</small></div></td>
          <td><div class="table-stack"><span>${escapeHtml(r.course_code || "")}</span><small>${escapeHtml(r.rotation_type || "")}${r.batch ? ` · ${escapeHtml(r.batch)}` : ""}</small></div></td>
          <td><div class="table-stack"><span>${formatDate(r.start_date)}</span><small>to ${formatDate(r.end_date)}</small></div></td>
          <td>
            <select class="table-select rotation-status-select" data-rotation-id="${r.id}">
              ${["planned","active","completed","cancelled"].map(s => `<option value="${s}" ${r.status === s ? "selected" : ""}>${s}</option>`).join("")}
            </select>
          </td>
          <td><button class="mini-action save" data-rotation-action="save" data-rotation-id="${r.id}">Save</button></td>
        </tr>
      `;
    }).join("");

    body.querySelectorAll("[data-rotation-action='save']").forEach(button => {
      button.addEventListener("click", () => saveRotationStatus(button.dataset.rotationId));
    });
  }

  async function saveRotationStatus(id) {
    const status = document.querySelector(`.rotation-status-select[data-rotation-id="${id}"]`)?.value;
    if (!status) return;

    const { error } = await client
      .from("rotation_assignments")
      .update({ status })
      .eq("id", id);

    if (error) {
      setMessage("rotation-message", error.message, "error");
      return;
    }

    setMessage("rotation-message", "Rotation updated.", "success");
    await loadRotations();
  }

  function refreshStats() {
    document.getElementById("stat-pending").textContent = users.filter(u => u.status === "pending").length;
    document.getElementById("stat-active").textContent = users.filter(u => u.status === "active").length;
    document.getElementById("stat-communities").textContent = communities.filter(c => c.is_active).length;
    document.getElementById("stat-rotations").textContent = rotations.filter(r => r.status === "active").length;
  }

  bootstrap();
})();

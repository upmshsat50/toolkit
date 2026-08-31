import { Icon } from "./Icons";

export function Topbar() {
  return (
    <header className="topbar">
      <div className="search-box">
        <Icon name="search" />
        <input aria-label="Search PADAYON" placeholder="Search communities, projects, people, resources…" />
      </div>
      <div className="user-chip">
        <div className="avatar">GD</div>
        <div>
          <strong>MD24 Student</strong>
          <span>Community Clerkship</span>
        </div>
      </div>
    </header>
  );
}

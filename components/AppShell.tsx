import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-shell">
        <Topbar />
        <main className="page-wrap">{children}</main>
      </div>
    </div>
  );
}

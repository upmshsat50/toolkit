import { PageHeader, StatCard } from "@/components/UI";

export default function AdminPage(){
 return <>
  <PageHeader eyebrow="Program administration" title="Administration" description="Starter admin workspace for maintaining sites, users, projects, resources, and data quality."/>
  <div className="stats-grid"><StatCard label="Communities" value="6" icon="communities" tone="maroon"/><StatCard label="Directory records" value="6" icon="directory" tone="green"/><StatCard label="Project records" value="4" icon="projects" tone="gold"/><StatCard label="Resources" value="6" icon="toolkit"/></div>
  <div className="community-grid">{[
   ["Academic setup","Manage batches, courses, rotations, and site assignments."],
   ["Community records","Edit community profiles, RHUs, contacts, and verification status."],
   ["Health personnel","Maintain time-bounded MHO/DTTB/preceptor assignment records."],
   ["Project registry","Approve projects, handovers, indicators, and archival status."],
   ["Resource library","Version manuals, forms, templates, and sample outputs."],
   ["Audit & data quality","Track who changed official records, when, and based on which source."],
  ].map(([t,d])=><div className="community-card" key={t}><span className="kicker">Admin module</span><h3>{t}</h3><p>{d}</p><button className="button button-outline" disabled>Connect Supabase</button></div>)}</div>
 </>;
}

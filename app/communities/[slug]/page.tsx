import { notFound } from "next/navigation";
import { communities, projects } from "@/lib/data";
import { PageHeader, StatusBadge } from "@/components/UI";

export function generateStaticParams(){ return communities.map(c=>({slug:c.slug})); }

export default async function CommunityPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const c=communities.find(x=>x.slug===slug);
  if(!c) return notFound();
  const localProjects=projects.filter(p=>p.community===c.name);
  return <>
    <PageHeader eyebrow={`${c.province} · Community profile`} title={c.name} description={c.summary} action={<StatusBadge status={c.verification}/>}/>
    <div className="tabs"><span className="tab active">Overview</span><span className="tab">Health System</span><span className="tab">Priorities</span><span className="tab">Projects</span><span className="tab">Assessments</span><span className="tab">Documents</span></div>
    <div className="grid-2">
      <section className="panel panel-pad">
        <h2>Health system</h2>
        <div className="detail-grid" style={{marginTop:16}}>
          <div className="detail-card"><label>RHU</label><strong>{c.rhus.join(", ")}</strong></div>
          <div className="detail-card"><label>SHS preceptor</label><strong>{c.preceptor}</strong></div>
          <div className="detail-card"><label>Municipal Health Officer</label><strong>{c.mho}</strong></div>
          <div className="detail-card"><label>Doctor to the Barrios</label><strong>{c.dttb}</strong></div>
          <div className="detail-card"><label>Current batch</label><strong>{c.currentBatch}</strong></div>
          <div className="detail-card"><label>Verification</label><strong><StatusBadge status={c.verification}/></strong></div>
        </div>
        <div className="callout" style={{marginTop:16}}>MHO/DTTB fields are intentionally not guessed. Replace them only with officially verified DOH/PHO/RHU records and keep the source + last verified date.</div>
      </section>
      <aside className="panel panel-pad">
        <h2>Community priorities</h2>
        <h3 style={{marginTop:18}}>Community-identified</h3>
        <ul>{c.priorities.map(x=><li key={x}>{x}</li>)}</ul>
        <h3 style={{marginTop:18}}>RHU / program priorities</h3>
        <ul>{c.rhuPriorities.map(x=><li key={x}>{x}</li>)}</ul>
      </aside>
    </div>
    <section className="panel panel-pad" style={{marginTop:20}}>
      <div className="section-title"><h2>Projects in {c.name}</h2><span className="status-badge active">{localProjects.length} records</span></div>
      {localProjects.length ? <div className="table-wrap"><table><thead><tr><th>Project</th><th>Batch</th><th>Health issue</th><th>Status</th></tr></thead><tbody>{localProjects.map(p=><tr key={p.id}><td><strong>{p.title}</strong></td><td>{p.batch}</td><td>{p.healthIssue}</td><td><StatusBadge status={p.status}/></td></tr>)}</tbody></table></div> : <p style={{color:"var(--muted)"}}>No seeded projects yet. Add historical and current project records through the admin workspace.</p>}
    </section>
  </>;
}

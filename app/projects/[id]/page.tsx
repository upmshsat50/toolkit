import { notFound } from "next/navigation";
import { projects } from "@/lib/data";
import { PageHeader, StatusBadge } from "@/components/UI";

export function generateStaticParams(){ return projects.map(p=>({id:p.id})); }

export default async function ProjectPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params; const p=projects.find(x=>x.id===id); if(!p)return notFound();
  return <>
    <PageHeader eyebrow={`${p.community} · ${p.batch}`} title={p.title} description={p.summary} action={<StatusBadge status={p.status}/>}/>
    <div className="tabs"><span className="tab active">Overview</span><span className="tab">Activities</span><span className="tab">Indicators</span><span className="tab">Stakeholders</span><span className="tab">Documents</span><span className="tab">Updates</span><span className="tab">Handover</span></div>
    <div className="grid-2">
      <section className="panel panel-pad">
        <h2>Project overview</h2>
        <div className="detail-grid" style={{marginTop:16}}>
          <div className="detail-card"><label>Community</label><strong>{p.community}</strong></div>
          <div className="detail-card"><label>Batch lineage</label><strong>{p.batch}</strong></div>
          <div className="detail-card"><label>Health issue</label><strong>{p.healthIssue}</strong></div>
          <div className="detail-card"><label>Local owner</label><strong>{p.localOwner}</strong></div>
        </div>
        <h3 style={{marginTop:22}}>Implementation progress</h3>
        <div className="progress" style={{marginTop:10}}><span style={{width:`${p.progress}%`}}/></div>
      </section>
      <aside className="panel panel-pad">
        <h2>Mandatory handover</h2>
        <p style={{color:"var(--muted)",fontSize:14}}>Every continuing project should leave a structured record before the rotation ends.</p>
        <div className="list">
          {["Accomplishments","Unfinished tasks","Monitoring indicators","Local owner","Funding source","Next-batch recommendations","Community/preceptor sign-off"].map(x=><div className="list-row" key={x}><strong>{x}</strong><span className="status-badge needs-verification">Pending</span></div>)}
        </div>
      </aside>
    </div>
    <section className="panel panel-pad" style={{marginTop:20}}><h2>Project lineage</h2><div style={{marginTop:10}}><div className="milestone"><div className="milestone-year">Previous batch</div><p>Baseline assessment / initial implementation retained in the project history.</p></div><div className="milestone"><div className="milestone-year">Current batch</div><p>Continue a manageable set of monitoring indicators and agreed project responsibilities.</p></div><div className="milestone"><div className="milestone-year">Next batch</div><p>Receives the approved handover instead of reconstructing project history from scattered files.</p></div></div></section>
  </>;
}

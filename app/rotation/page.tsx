import { orientationTasks } from "@/lib/data";
import { Icon } from "@/components/Icons";
import { PageHeader } from "@/components/UI";

const stages = [
  ["1", "Predeployment", "Orientation, site profile, previous projects, scope, referral and emergency pathways."],
  ["2", "Community entry", "Meet stakeholders, understand local governance, and validate working relationships."],
  ["3", "Assessment", "Review existing records and collect only the data needed for community diagnosis."],
  ["4", "Diagnosis & planning", "Reconcile community priorities, RHU priorities, evidence, equity, and feasibility."],
  ["5", "Implementation", "Deliver the agreed intervention with documented roles, timelines, and local ownership."],
  ["6", "Monitoring", "Track indicators, outcomes, barriers, and course corrections."],
  ["7", "Handover", "Document accomplishments, unfinished tasks, local owner, funding, indicators, and next steps."],
];

export default function RotationPage(){
  const done = orientationTasks.filter(([,d])=>d).length;
  return <>
    <PageHeader eyebrow="Student workflow" title="My Rotation" description="A guided workflow from predeployment to project turnover and continuity."/>
    <div className="grid-2">
      <section className="panel panel-pad">
        <div className="section-title"><h2>Predeployment checklist</h2><span className="status-badge verified">{done}/{orientationTasks.length} complete</span></div>
        <div className="progress" aria-label="Orientation progress"><span style={{width:`${done/orientationTasks.length*100}%`}}/></div>
        <div style={{marginTop:14}}>{orientationTasks.map(([task,isDone])=><div className="check-row" key={task}><span className={isDone?"check done":"check"}><Icon name={isDone?"check":"rotation"}/></span>{task}</div>)}</div>
      </section>
      <aside className="panel panel-pad">
        <h2>Current assignment</h2>
        <div className="detail-grid" style={{gridTemplateColumns:"1fr",marginTop:16}}>
          <div className="detail-card"><label>Community</label><strong>Alangalang, Leyte</strong></div>
          <div className="detail-card"><label>Course</label><strong>CH205 Community Clerkship</strong></div>
          <div className="detail-card"><label>Batch</label><strong>MD24</strong></div>
          <div className="detail-card"><label>Preceptor</label><strong>Dr. Angelita Jaya</strong></div>
        </div>
      </aside>
    </div>
    <section className="panel panel-pad" style={{marginTop:20}}>
      <h2>Rotation pathway</h2>
      <div style={{marginTop:10}}>{stages.map(([n,title,text])=><div className="milestone" key={n}><div className="milestone-year">Stage {n}</div><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
    </section>
  </>;
}

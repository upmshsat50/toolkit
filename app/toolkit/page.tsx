import { resources } from "@/lib/data";
import { Icon } from "@/components/Icons";
import { PageHeader } from "@/components/UI";

export default function ToolkitPage(){
 return <>
  <PageHeader eyebrow="Manual + forms + resources" title="Community Health Toolkit" description="A versioned resource hub for community clerkship and internship. Replace sample records with approved CH205/CH240 content and official forms."/>
  <div className="tabs"><span className="tab active">All resources</span><span className="tab">Manual</span><span className="tab">Forms</span><span className="tab">Learning resources</span><span className="tab">Sample outputs</span></div>
  <div className="resource-grid">{resources.map(r=><div className="resource-card" key={r.title}><div><span className="kicker">{r.type}</span><strong style={{marginTop:10}}>{r.title}</strong><span>{r.module} · {r.version}</span></div><button className="button button-outline" aria-label={`Download ${r.title}`}><Icon name="download"/></button></div>)}</div>
  <section className="panel panel-pad" style={{marginTop:20}}><h2>Recommended manual structure</h2><div className="detail-grid" style={{marginTop:16}}>{["Community Entry & Social Preparation","Local Health System & Governance","Stakeholder & Power Mapping","Community Health Assessment","Community Diagnosis","MHDP & Planning","Implementation","Monitoring & Evaluation","Sustainability & Handover","Community Internship"].map((x,i)=><div className="detail-card" key={x}><label>Module {String(i+1).padStart(2,"0")}</label><strong>{x}</strong></div>)}</div></section>
 </>;
}

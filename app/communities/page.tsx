import Link from "next/link";
import { communities } from "@/lib/data";
import { Icon } from "@/components/Icons";
import { PageHeader, StatusBadge } from "@/components/UI";

export default function CommunitiesPage(){
  return <>
    <PageHeader eyebrow="Community directory" title="Current SHS Communities" description="Browse current community sites, health-system information, project history, assessments, and verified coordination details." action={<button className="button button-outline"><Icon name="map"/> Map view</button>}/>
    <div className="community-grid">
      {communities.map(c=><Link href={`/communities/${c.slug}`} className="community-card" key={c.slug}>
        <div className="card-top"><span className="kicker">{c.course}</span><StatusBadge status={c.verification}/></div>
        <h3>{c.name}</h3><p>{c.province}</p>
        <div className="meta">
          <div><span>Preceptor</span><strong>{c.preceptor}</strong></div>
          <div><span>Active projects</span><strong>{c.activeProjects}</strong></div>
          <div><span>Monitoring</span><strong>{c.monitoringProjects}</strong></div>
          <div><span>For turnover</span><strong>{c.handovers}</strong></div>
        </div>
      </Link>)}
    </div>
  </>;
}

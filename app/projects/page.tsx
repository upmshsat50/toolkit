import Link from "next/link";
import { projects } from "@/lib/data";
import { PageHeader, StatusBadge } from "@/components/UI";

export default function ProjectsPage(){
  return <>
    <PageHeader eyebrow="Institutional memory" title="Project Registry" description="Search and follow community projects across batches instead of restarting from zero each rotation."/>
    <div className="panel">
      <div className="table-wrap"><table><thead><tr><th>Project</th><th>Community</th><th>Batch</th><th>Health issue</th><th>Status</th><th>Progress</th></tr></thead><tbody>{projects.map(p=><tr key={p.id}><td><Link href={`/projects/${p.id}`}><strong style={{color:"var(--up-maroon)"}}>{p.title}</strong></Link></td><td>{p.community}</td><td>{p.batch}</td><td>{p.healthIssue}</td><td><StatusBadge status={p.status}/></td><td style={{minWidth:150}}><div className="progress"><span style={{width:`${p.progress}%`}}/></div><small>{p.progress}%</small></td></tr>)}</tbody></table></div>
    </div>
  </>;
}

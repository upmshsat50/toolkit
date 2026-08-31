import Link from "next/link";
import { communities, orientationTasks, projects } from "@/lib/data";
import { Icon } from "@/components/Icons";
import { SectionTitle, StatCard, StatusBadge } from "@/components/UI";

export default function Dashboard() {
  const done = orientationTasks.filter(([,d]) => d).length;
  const active = projects.filter(p => p.status === "Active").length;
  const turnovers = projects.filter(p => p.status === "For Turnover").length;
  return <>
    <section className="hero">
      <span className="eyebrow">UP Manila School of Health Sciences</span>
      <h1>Continue the work.<br/>Strengthen the community.</h1>
      <p>The Community Health Toolkit is a living digital resource for community clerks, interns, faculty, and preceptors—bringing together community profiles, projects, handovers, forms, learning resources, and institutional memory.</p>
      <div className="hero-actions">
        <Link className="button button-primary" href="/rotation">Open my rotation <Icon name="arrow"/></Link>
        <Link className="button button-secondary" href="/communities">Browse communities</Link>
      </div>
    </section>

    <div className="stats-grid">
      <StatCard label="Orientation" value={`${done}/${orientationTasks.length}`} note="Predeployment tasks completed" icon="check" tone="green"/>
      <StatCard label="Current sites" value={communities.length} note="UPM-SHS partner communities" icon="communities" tone="maroon"/>
      <StatCard label="Active projects" value={active} note="Sample seeded registry" icon="projects" tone="gold"/>
      <StatCard label="For turnover" value={turnovers} note="Needs structured handover" icon="alert" tone="neutral"/>
    </div>

    <div className="grid-2">
      <section className="panel panel-pad">
        <SectionTitle title="My rotation" actionHref="/rotation" actionLabel="View workflow" />
        <div className="callout">Current demo assignment: <strong>Alangalang, Leyte</strong> · MD24 Community Clerkship · Preceptor: <strong>Dr. Angelita Jaya</strong></div>
        <div className="list" style={{marginTop:14}}>
          {orientationTasks.slice(0,6).map(([task,isDone]) => <div className="check-row" key={task}><span className={isDone ? "check done":"check"}><Icon name={isDone ? "check":"rotation"}/></span><span>{task}</span></div>)}
        </div>
      </section>
      <section className="panel panel-pad">
        <SectionTitle title="Projects needing attention" actionHref="/projects" />
        <div className="list">
          {projects.slice(0,3).map(project => <Link href={`/projects/${project.id}`} className="list-row" key={project.id}><div className="list-main"><div><strong>{project.title}</strong><span>{project.community} · {project.batch}</span></div></div><StatusBadge status={project.status}/></Link>)}
        </div>
      </section>
    </div>
  </>;
}

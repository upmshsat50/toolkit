import { communities } from "@/lib/data";
import { PageHeader, StatusBadge } from "@/components/UI";

export default function DirectoryPage(){
 return <>
  <PageHeader eyebrow="Health workforce & coordination" title="Directory" description="Institutional coordination directory for RHUs, MHO/DTTB assignments, and SHS preceptors. Public/institutional contacts only."/>
  <div className="panel"><div className="table-wrap"><table><thead><tr><th>Community</th><th>RHU</th><th>SHS Preceptor</th><th>MHO</th><th>DTTB</th><th>Status</th></tr></thead><tbody>{communities.map(c=><tr key={c.slug}><td><strong>{c.name}</strong></td><td>{c.rhus[0]}</td><td>{c.preceptor}</td><td>{c.mho}</td><td>{c.dttb}</td><td><StatusBadge status={c.verification}/></td></tr>)}</tbody></table></div></div>
  <div className="callout" style={{marginTop:18}}>Recommended data rule: store personnel as time-bounded assignment records with source, source date, start/end dates, and “last verified” instead of overwriting a municipality’s MHO/DTTB field.</div>
 </>;
}

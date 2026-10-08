import Link from "next/link";
import type { WorkItem } from "@/lib/types";
import { ProjectPreview } from "./project-preview";
export function StudioWork({ items }: { items: WorkItem[] }) {
  return <div className="studio-work-list">{items.map(item => <article className={`studio-project ${item.demo ? "studio-project-demo" : ""}`} key={item.slug} id={`project-${item.slug}`}>
    {item.demo ? <ProjectPreview item={item} /> : <Link href={`/work/${item.slug}`} aria-label={`Explore ${item.title}`}><ProjectPreview item={item} /></Link>}
    <div className="project-description"><div><p className="studio-label">{item.context} / {item.subtitle}</p><h3><Link href={`/work/${item.slug}`}>{item.title} ↗</Link></h3></div><p>{item.summary}</p><Link href={`/work/${item.slug}`} className="studio-text-link project-detail-link">Read the project notes ↗</Link></div>
  </article>)}</div>;
}

import Link from "next/link";
import { getLab } from "@/lib/content";
export function PlaygroundLinks() {
 return <div className="play-links">{getLab().map((item,i) => <Link className={`play-link play-link-${i}`} href={`/lab/${item.slug}`} key={item.slug}><div className="play-art" aria-hidden="true">{i===0 ? <div className="field-art" /> : <div className="entropy-art"><span /><span /><span /><span /></div>}<span className="play-arrow">↗</span></div><div className="play-caption"><h3>{item.title}</h3><span>{i===0 ? "Push. Pull. Disturb." : "Let the layout loose."}</span></div></Link>)}</div>;
}

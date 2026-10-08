import { WorkingNotes } from "@/components/about/working-notes";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { ExperienceList } from "@/components/about/experience-list";
import { profile } from "@/data/profile";
export const metadata: Metadata = { title:"About", alternates:{canonical:"/about"} };
export default function AboutPage() {
 return <div data-page><PageHeader code="002" section="About" title={<>Builder.<br />Question asker.</>} intro={profile.role + " · Turin, Italy"} />
 <section className="studio-about"><WorkingNotes /><div className="about-copy"><h2>{profile.about.lead}</h2>{profile.about.paragraphs.map(p=><p key={p}>{p}</p>)}</div></section>
 <section className="frame pb-16" aria-labelledby="experience-heading"><h2 id="experience-heading" className="t-h2 mb-10">In practice.</h2><ExperienceList /><Link href="/now" className="studio-text-link mt-8">What I’m exploring now ↗</Link></section></div>;
}

import { WorkingNotes } from "@/components/about/working-notes";
import Link from "next/link";
import { PersonJsonLd } from "@/components/seo/json-ld";
import { MorphStudio } from "@/components/home/morph-studio";
import { StudioWork } from "@/components/work/studio-work";
import { PlaygroundLinks } from "@/components/lab/playground-links";
import { studio } from "@/data/studio";
import { getWork } from "@/lib/content";
export default function HomePage() {
 return <div className="studio-home" data-page><PersonJsonLd />
 <section className="studio-hero"><div className="studio-intro"><p className="studio-label">{studio.eyebrow}</p>
 <h1>{studio.headline[0]}<br /><span>{studio.headline[1]}</span></h1><p className="studio-introduction">{studio.introduction}</p>
 <div className="studio-actions"><a className="studio-button" href="#work">Explore my work <span aria-hidden="true">↘</span></a><a className="studio-text-link" href="#about">Meet the person ↗</a></div></div><MorphStudio />
 <div className="hero-signoff"><span>FARAZ HAGHGOO</span><span>Built with intention. Open to exploration.</span><a href="#work" aria-label="Scroll to selected work">↓</a></div></section>
 <section className="studio-work" id="work" aria-labelledby="studio-work-title"><div className="studio-section-top"><p className="studio-label">Out in the world</p><Link href="/archive">The archive ↗</Link></div>
 <h2 id="studio-work-title">Ideas are good.<br /><em>Working things are better.</em></h2><StudioWork items={getWork()} />
 <p className="work-postscript">More happens behind the scenes: production applications, AI-enabled tools and experiments with collaborators. Public work appears here when it’s ready.</p></section>
 <section className="studio-about" id="about" aria-labelledby="studio-about-title"><WorkingNotes />
 <div className="about-copy"><p className="studio-label">The person behind the pixels</p><h2 id="studio-about-title">{studio.aboutTitle}</h2><p>{studio.about}</p><Link className="studio-text-link" href="/about">A little more about me ↗</Link><div className="about-footnote"><span>Professional work at <strong>inRebus</strong></span><Link href="/now">What I’m exploring now ↗</Link></div></div></section>
 <section className="studio-play" aria-labelledby="studio-play-title"><div className="studio-section-top"><p className="studio-label">Playground / Lab</p><span>Curiosity encouraged.</span></div><h2 id="studio-play-title">{studio.playgroundTitle}</h2><p className="play-intro">{studio.playgroundNote}</p>
 <PlaygroundLinks /></section></div>;
}

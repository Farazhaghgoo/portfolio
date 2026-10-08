import Link from "next/link";
import { social } from "@/data/social";
import { SignalCount, InspectGlyph } from "@/components/chrome/footer-controls";
export function SiteFooter() {
 return <footer id="contact" className="studio-footer" aria-labelledby="contact-title">
 <div className="studio-section-top"><p className="studio-label">Good things start with a conversation.</p><span aria-hidden="true">↙</span></div>
 <h2 id="contact-title">Have something<br />in mind<span className="footer-star" aria-hidden="true">✳</span>?</h2>
 <div className="footer-contact"><a href={`mailto:${social.email}`}>{social.email} ↗</a><a href={social.linkedin.href} target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
 <div className="footer-bottom"><Link href="/">Faraz Haghgoo</Link><span>Turin, Italy</span><div><Link href="/archive">Archive</Link><Link href="/now">Now</Link><SignalCount /><InspectGlyph /></div></div></footer>;
}

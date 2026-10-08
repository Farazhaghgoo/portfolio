import type { Metadata } from "next";
import { PlaygroundLinks } from "@/components/lab/playground-links";
import { SignalOnMount } from "@/components/system/signal-on-mount";
import { PageHeader } from "@/components/ui/page-header";
import { studio } from "@/data/studio";
export const metadata: Metadata = { title:"Playground", description:"Interactive experiments by Faraz Haghgoo.", alternates:{canonical:"/lab"} };
export default function LabPage() {
 return <div data-page><SignalOnMount id="lab" /><PageHeader code="005" section="Playground" title="A little less predictable." intro={studio.playgroundNote} /><section className="studio-play" aria-label="Interactive experiments"><p className="studio-label">Pick an experiment. See what happens.</p><PlaygroundLinks /></section></div>;
}

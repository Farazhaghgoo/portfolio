import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { StudioWork } from "@/components/work/studio-work";
import { getWork } from "@/lib/content";
export const metadata: Metadata = { title:"Work", alternates:{ canonical:"/work" } };
export default function WorkPage() {
 return <div data-page><PageHeader code="001" section="Work" title="Built for the real world." intro="Professional digital work. More appears here as it becomes public." /><section className="studio-work" aria-label="Selected work"><StudioWork items={getWork()} /></section></div>;
}

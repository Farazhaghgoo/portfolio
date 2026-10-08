import type { Metadata } from "next";
import { ArchiveTable } from "@/components/archive/archive-table";
import { PageHeader } from "@/components/ui/page-header";
import { getArchive, pad } from "@/lib/content";

export const metadata: Metadata = {
  title: "Archive",
  description: "The chronological index of things Faraz Haghgoo has made, explored or shipped.",
  alternates: { canonical: "/archive" },
};

export default function ArchivePage() {
  const records = getArchive();
  return (
    <div data-page>
      <PageHeader
        code="003"
        section="Archive"
        title="Archive"
        aside={`${pad(records.length, 2)} records`}
        intro="The chronological index of things I’ve made, explored or shipped. Small for now. It only grows."
      />
      <section aria-label="Records" className="frame mt-[clamp(48px,7vw,112px)]">
        <ArchiveTable records={records} />
      </section>
    </div>
  );
}

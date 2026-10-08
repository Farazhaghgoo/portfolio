import Link from "next/link";
import { notes } from "@/data/notes";
export function WorkingNotes() {
  return <aside className="working-notes" aria-labelledby="working-notes-title"><h2 id="working-notes-title">Things I’m figuring out.</h2>{notes.map((note, i) => <details key={note.title} open={i === 0}><summary><span>0{i + 1}</span>{note.title}<span aria-hidden="true">+</span></summary><p>{note.body}</p><Link href={note.href}>{note.label} ↗</Link></details>)}</aside>;
}

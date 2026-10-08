import { ViewTransition } from "react";
import Image from "next/image";
import type { WorkItem } from "@/lib/types";
import { ProductDemo } from "./product-demo";
export function ProjectPreview({ item }: { item: WorkItem }) {
  return <ViewTransition name={`project-${item.slug}`} share="project-morph" default="none"><div className="project-preview interlock-frame">
    {item.demo ? <ProductDemo kind={item.demo} /> : item.cover ? <Image src={item.cover.src} alt={item.cover.alt} width={item.cover.width} height={item.cover.height} sizes="(max-width: 700px) 92vw, 820px" /> : null}
  </div></ViewTransition>;
}

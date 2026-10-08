export interface NavItem { label: string; href: string; count?: number; }
export function getNav(): NavItem[] {
 return [{ label: "Work", href: "/work" }, { label: "About", href: "/about" }, { label: "Playground", href: "/lab" }];
}

export const social = {
 email: "farazhaghgoo1@gmail.com",
 linkedin: { label: "LinkedIn", handle: "faraz-haghgoo", href: "https://www.linkedin.com/in/faraz-haghgoo-6b4a64252" },
} as const;
export function contactHref(): { href: string; label: string; external: boolean } {
 return { href: `mailto:${social.email}`, label: social.email, external: false };
}

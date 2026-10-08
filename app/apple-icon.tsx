import { ImageResponse } from "next/og";
export const size = { width:180, height:180 };
export const contentType = "image/png";
export default function AppleIcon() {
 return new ImageResponse(<div style={{width:"100%",height:"100%",display:"flex",background:"#254bff",alignItems:"center",justifyContent:"center"}}><svg width="150" height="140" viewBox="0 0 160 140" fill="none"><path d="M27 111V29H70M27 68H125M84 29V111M125 29V111" stroke="#f4f0e8" strokeWidth="16"/></svg></div>,size);
}

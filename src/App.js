import { useState, useEffect, useRef } from "react";
import AIAssistant from "./components/AIAssistant";

/* ═══════════════════════════════ FONTS ═══════════════════════════════ */
const Fonts = () => (
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;600;700;900&family=Syne:wght@400;600;700;800&family=Lora:wght@400;500;600;700&family=DM+Serif+Display&family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
);

/* ═══════════════════════════ VALIDATION ══════════════════════════════ */
const V = {
  name: v => !v.trim() ? "Name is required" : v.trim().length < 2 ? "Min 2 characters" : !/^[a-zA-Z\s'.,-]+$/.test(v) ? "Only letters allowed" : "",
  email: v => !v.trim() ? "Email is required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Invalid email" : "",
  password: v => !v ? "Password is required" : v.length < 8 ? "Min 8 characters" : !/[A-Z]/.test(v) ? "Need 1 uppercase" : !/[0-9]/.test(v) ? "Need 1 number" : "",
};

/* ════════════════════════ 30 TEMPLATES ════════════════════════════════ */
const T = {
  // ── ORIGINAL 30 ──
  midnight:  { name:"Midnight",       cat:"Corporate",  accent:"#3b82f6", sidebar:"#0f172a", sidebarTxt:"#e2e8f0", main:"#fff",     layout:"sl", font:"DM Sans" },
  crimson:   { name:"Crimson Elite",  cat:"Executive",  accent:"#dc2626", sidebar:"#7f1d1d", sidebarTxt:"#fee2e2", main:"#fff",     layout:"sl", font:"Playfair Display" },
  emerald:   { name:"Emerald Grove",  cat:"Modern",     accent:"#059669", sidebar:"#064e3b", sidebarTxt:"#d1fae5", main:"#f0fdf4",  layout:"sl", font:"DM Sans" },
  golden:    { name:"Golden Age",     cat:"Luxury",     accent:"#d97706", sidebar:"#1c1710", sidebarTxt:"#fef3c7", main:"#fffbeb",  layout:"sl", font:"Playfair Display" },
  royal:     { name:"Royal Purple",   cat:"Luxury",     accent:"#7c3aed", sidebar:"#2e1065", sidebarTxt:"#ede9fe", main:"#faf5ff",  layout:"sl", font:"Lora" },
  noir:      { name:"Noir",           cat:"Luxury",     accent:"#f59e0b", sidebar:"#000",    sidebarTxt:"#f3f4f6", main:"#111",     layout:"sl", font:"Syne" },
  neon:      { name:"Tokyo Neon",     cat:"Creative",   accent:"#06b6d4", sidebar:"#0c0c1d", sidebarTxt:"#a5f3fc", main:"#0f0f1e",  layout:"sl", font:"Syne" },
  coral:     { name:"Coral Pop",      cat:"Creative",   accent:"#f43f5e", sidebar:"#881337", sidebarTxt:"#fecdd3", main:"#fff",     layout:"sl", font:"DM Sans" },
  silicon:   { name:"Silicon Pro",    cat:"Tech",       accent:"#38bdf8", sidebar:"#0f172a", sidebarTxt:"#94a3b8", main:"#f8fafc",  layout:"sl", font:"Space Grotesk" },
  forest:    { name:"Forest Sage",    cat:"Natural",    accent:"#4ade80", sidebar:"#14532d", sidebarTxt:"#bbf7d0", main:"#f0fdf4",  layout:"sl", font:"DM Sans" },
  ocean:     { name:"Ocean Deep",     cat:"Modern",     accent:"#0e7490", sidebar:"#164e63", sidebarTxt:"#cffafe", main:"#fff",     layout:"sr", font:"DM Sans" },
  bamboo:    { name:"Bamboo Zen",     cat:"Natural",    accent:"#15803d", sidebar:"#166534", sidebarTxt:"#bbf7d0", main:"#f7fef7",  layout:"sr", font:"Lora" },
  indigo:    { name:"Indigo Night",   cat:"Modern",     accent:"#4f46e5", sidebar:"#1e1b4b", sidebarTxt:"#c7d2fe", main:"#eef2ff",  layout:"sr", font:"Space Grotesk" },
  sky:       { name:"Sky Blue",       cat:"Corporate",  accent:"#0284c7", sidebar:"#075985", sidebarTxt:"#bae6fd", main:"#f0f9ff",  layout:"sr", font:"DM Sans" },
  charcoal:  { name:"Charcoal",       cat:"Tech",       accent:"#10b981", sidebar:"#111827", sidebarTxt:"#d1d5db", main:"#1f2937",  layout:"sr", font:"Space Grotesk" },
  pure:      { name:"Pure Minimal",   cat:"Minimal",    accent:"#111",    hdr:"#111",        hdrTxt:"#fff",        main:"#fff",     layout:"th", font:"DM Sans" },
  pastel:    { name:"Pastel Dream",   cat:"Creative",   accent:"#ec4899", hdr:"#fce7f3",     hdrTxt:"#831843",     main:"#fdf2f8",  layout:"th", font:"Lora" },
  vintage:   { name:"Vintage",        cat:"Classic",    accent:"#92400e", hdr:"#fef3c7",     hdrTxt:"#78350f",     main:"#fef9f0",  layout:"th", font:"Cormorant Garamond" },
  steel:     { name:"Corporate Steel",cat:"Corporate",  accent:"#475569", hdr:"#334155",     hdrTxt:"#f1f5f9",     main:"#f8fafc",  layout:"th", font:"DM Sans" },
  bronze:    { name:"Bronze Classic", cat:"Classic",    accent:"#b45309", hdr:"#78350f",     hdrTxt:"#fef3c7",     main:"#fffbeb",  layout:"th", font:"Playfair Display" },
  slate:     { name:"Slate Modern",   cat:"Modern",     accent:"#0284c7", hdr:"#075985",     hdrTxt:"#e0f2fe",     main:"#f0f9ff",  layout:"th", font:"Space Grotesk" },
  terra:     { name:"Terra Cotta",    cat:"Natural",    accent:"#c2410c", hdr:"#9a3412",     hdrTxt:"#fed7aa",     main:"#fff7ed",  layout:"th", font:"DM Sans" },
  mint:      { name:"Mint Fresh",     cat:"Natural",    accent:"#0d9488", hdr:"#0f766e",     hdrTxt:"#ccfbf1",     main:"#f0fdfa",  layout:"th", font:"DM Sans" },
  lavender:  { name:"Lavender",       cat:"Creative",   accent:"#7c3aed", hdr:"#6d28d9",     hdrTxt:"#ede9fe",     main:"#f5f3ff",  layout:"th", font:"Lora" },
  ruby:      { name:"Ruby Power",     cat:"Executive",  accent:"#be123c", hdr:"#9f1239",     hdrTxt:"#fce7f3",     main:"#fff1f2",  layout:"th", font:"Playfair Display" },
  mono:      { name:"Monochrome",     cat:"Minimal",    accent:"#000",    hdr:"#000",        hdrTxt:"#fff",        main:"#fff",     layout:"line", font:"Syne" },
  arctic:    { name:"Arctic",         cat:"Corporate",  accent:"#2563eb", hdr:"#dbeafe",     hdrTxt:"#1e3a8a",     main:"#f8fafc",  layout:"line", font:"Space Grotesk" },
  sunset:    { name:"Sunset Warm",    cat:"Creative",   accent:"#ea580c", hdr:"#7c2d12",     hdrTxt:"#ffedd5",     main:"#fff",     layout:"bold", font:"Bebas Neue" },
  bordeaux:  { name:"Bordeaux",       cat:"Luxury",     accent:"#9f1239", hdr:"#4c0519",     hdrTxt:"#fce7f3",     main:"#fff1f2",  layout:"bold", font:"Cormorant Garamond" },
  graphite:  { name:"Graphite",       cat:"Tech",       accent:"#6b7280", hdr:"#1f2937",     hdrTxt:"#e5e7eb",     main:"#f9fafb",  layout:"bold", font:"Space Grotesk" },
  sky2:      { name:"Cloud White",    cat:"Minimal",    accent:"#3b82f6", hdr:"#eff6ff",     hdrTxt:"#1d4ed8",     main:"#fff",     layout:"line", font:"DM Sans" },
 
  // ── 20 NEW TEMPLATES ──
  navy:      { name:"Navy Executive", cat:"Executive",  accent:"#1e40af", sidebar:"#1e3a8a", sidebarTxt:"#bfdbfe", main:"#f0f4ff",  layout:"sl", font:"Raleway" },
  rosegold:  { name:"Rose Gold",      cat:"Luxury",     accent:"#be185d", hdr:"#fdf2f8",     hdrTxt:"#831843",     main:"#fff",     layout:"line", font:"Cormorant Garamond" },
  plum:      { name:"Deep Plum",      cat:"Luxury",     accent:"#7e22ce", sidebar:"#3b0764", sidebarTxt:"#e9d5ff", main:"#faf5ff",  layout:"sl", font:"Nunito" },
  carbon:    { name:"Carbon Dark",    cat:"Tech",       accent:"#22d3ee", sidebar:"#18181b", sidebarTxt:"#a1a1aa", main:"#09090b",  layout:"sl", font:"Space Grotesk" },
  olive:     { name:"Olive Press",    cat:"Natural",    accent:"#65a30d", hdr:"#365314",     hdrTxt:"#ecfccb",     main:"#f7fee7",  layout:"th", font:"Lora" },
  copper:    { name:"Copper Works",   cat:"Classic",    accent:"#c2410c", hdr:"#431407",     hdrTxt:"#fed7aa",     main:"#fff7ed",  layout:"bold", font:"Raleway" },
  teal:      { name:"Teal Breeze",    cat:"Modern",     accent:"#0f766e", sidebar:"#134e4a", sidebarTxt:"#99f6e4", main:"#f0fdfa",  layout:"sr", font:"Nunito" },
  sand:      { name:"Warm Sand",      cat:"Natural",    accent:"#b45309", hdr:"#fef3c7",     hdrTxt:"#78350f",     main:"#fffbeb",  layout:"line", font:"Lora" },
  electric:  { name:"Electric",       cat:"Creative",   accent:"#a855f7", sidebar:"#1e1b4b", sidebarTxt:"#e9d5ff", main:"#0f0e17",  layout:"sl", font:"Syne" },
  jade:      { name:"Jade Stone",     cat:"Natural",    accent:"#047857", sidebar:"#022c22", sidebarTxt:"#a7f3d0", main:"#ecfdf5",  layout:"sr", font:"Josefin Sans" },
  mahogany:  { name:"Mahogany",       cat:"Classic",    accent:"#991b1b", hdr:"#450a0a",     hdrTxt:"#fee2e2",     main:"#fff",     layout:"bold", font:"Playfair Display" },
  cobalt:    { name:"Cobalt Blue",    cat:"Corporate",  accent:"#1d4ed8", hdr:"#1e3a8a",     hdrTxt:"#dbeafe",     main:"#eff6ff",  layout:"th", font:"Montserrat" },
  dusty:     { name:"Dusty Rose",     cat:"Creative",   accent:"#db2777", sidebar:"#500724", sidebarTxt:"#fbcfe8", main:"#fff",     layout:"sl", font:"Nunito" },
  glacier:   { name:"Glacier",        cat:"Minimal",    accent:"#0891b2", hdr:"#ecfeff",     hdrTxt:"#164e63",     main:"#fff",     layout:"line", font:"Josefin Sans" },
  ember:     { name:"Ember",          cat:"Creative",   accent:"#f97316", hdr:"#431407",     hdrTxt:"#ffedd5",     main:"#fff",     layout:"bold", font:"Raleway" },
  pearl:     { name:"Pearl White",    cat:"Minimal",    accent:"#475569", hdr:"#f8fafc",     hdrTxt:"#0f172a",     main:"#fff",     layout:"th", font:"Montserrat" },
  sage:      { name:"Sage Garden",    cat:"Natural",    accent:"#4d7c0f", sidebar:"#1a2e05", sidebarTxt:"#d9f99d", main:"#f7fee7",  layout:"sr", font:"Lora" },
  denim:     { name:"Denim Blue",     cat:"Corporate",  accent:"#1e40af", hdr:"#1e3a8a",     hdrTxt:"#e0e7ff",     main:"#f5f3ff",  layout:"bold", font:"Montserrat" },
  blush:     { name:"Blush Pink",     cat:"Creative",   accent:"#e11d48", hdr:"#fff1f2",     hdrTxt:"#9f1239",     main:"#fff",     layout:"line", font:"Nunito" },
  onyx:      { name:"Onyx",           cat:"Executive",  accent:"#d4af37", sidebar:"#111",    sidebarTxt:"#e5e7eb", main:"#1a1a1a",  layout:"sl", font:"Cormorant Garamond" },
};
 
const CATS = ["All","Corporate","Executive","Modern","Minimal","Creative","Luxury","Natural","Classic","Tech"];
/* ══════════════════════ SECTION DEFINITIONS ══════════════════════════ */
const ALL_SECTIONS = [
  { id:"experience",     label:"💼 Work Experience",      color:"#3b82f6" },
  { id:"education",      label:"🎓 Education",            color:"#059669" },
  { id:"projects",       label:"🚀 Projects",             color:"#7c3aed" },
  { id:"skills",         label:"⚡ Skills",               color:"#d97706" },
  { id:"certifications", label:"🏆 Certifications",       color:"#dc2626" },
  { id:"extracurricular",label:"🏅 Extracurricular",      color:"#0e7490" },
  { id:"languages",      label:"🌐 Languages",            color:"#15803d" },
  { id:"awards",         label:"🥇 Awards & Honors",      color:"#b45309" },
  { id:"volunteer",      label:"❤️ Volunteer Work",       color:"#be123c" },
];

/* ═══════════════════════ DEFAULT RESUME DATA ═════════════════════════ */
const uid = () => Math.random().toString(36).slice(2,9);
const blankExp  = () => ({ id:uid(), company:"", role:"", start:"", end:"", current:false, location:"", points:[""] });
const blankEdu  = () => ({ id:uid(), school:"", degree:"", year:"", gpa:"" });
const blankProj = () => ({ id:uid(), name:"", tech:"", desc:"", link:"", github:"" });
const blankCert = () => ({ id:uid(), name:"", issuer:"", year:"", link:"" });
const blankEC   = () => ({ id:uid(), title:"", org:"", year:"", desc:"" });
const blankLang = () => ({ id:uid(), lang:"", level:"" });
const blankAward= () => ({ id:uid(), title:"", org:"", year:"", desc:"" });
const blankVol  = () => ({ id:uid(), role:"", org:"", duration:"", desc:"" });

const defaultResume = () => ({
  personal: { name:"", title:"", email:"", phone:"", location:"", linkedin:"", github:"", website:"" },
  summary:"",
  experience:[], education:[], projects:[], skills:[],
  certifications:[], extracurricular:[], languages:[], awards:[], volunteer:[],
  template:"midnight",
  sectionOrder:["experience","education","projects","skills","certifications","extracurricular","languages","awards","volunteer"],
  hiddenSections:[],
});

/* ═══════════════════════════ ICONS ══════════════════════════════════ */
const Ico = ({d,size=14,col="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {Array.isArray(d) ? d.map((p,i)=><path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const Icons = {
  mail:    (s,c) => <Ico size={s} col={c} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22,6 12,13 2,6"/>,
  phone:   (s,c) => <Ico size={s} col={c} d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>,
  map:     (s,c) => <Ico size={s} col={c} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7 A3 3 0 1 1 12 6.99"/>,
  linkedin:(s,c) => <Ico size={s} col={c} d={["M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z","M2 9h4v12H2z","M4 2 A2 2 0 1 1 4 1.99"]}/>,
  github:  (s,c) => <Ico size={s} col={c} d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>,
  globe:   (s,c) => <Ico size={s} col={c} d={["M12 2a10 10 0 100 20A10 10 0 0012 2z","M2 12h20","M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"]}/>,
  trash:   (s,c) => <Ico size={s} col={c} d={["M3 6h18","M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"]}/>,
  plus:    (s,c) => <Ico size={s} col={c} d={["M12 5v14","M5 12h14"]}/>,
  grip:    (s,c) => <Ico size={s} col={c} d={["M9 3h.01M9 12h.01M9 21h.01M15 3h.01M15 12h.01M15 21h.01"]}/>,
  eye:     (s,c) => <Ico size={s} col={c} d={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9 A3 3 0 1 1 12 8.99"]}/>,
  eyeoff:  (s,c) => <Ico size={s} col={c} d={["M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24","M1 1l22 22"]}/>,
  save:    (s,c) => <Ico size={s} col={c} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8 M7 3v5h8"/>,
  check:   (s,c) => <Ico size={s} col={c} d="M20 6L9 17l-5-5"/>,
  up:      (s,c) => <Ico size={s} col={c} d="M18 15l-6-6-6 6"/>,
  down:    (s,c) => <Ico size={s} col={c} d="M6 9l6 6 6-6"/>,
  x:       (s,c) => <Ico size={s} col={c} d={["M18 6L6 18","M6 6l12 12"]}/>,
};

/* ═══════════════════════ CONTACT LINK ═══════════════════════════════ */
const CLink = ({href, children, col="#fff"}) => {
  const url = !href ? null : href.startsWith("http") ? href : `https://${href}`;
  return url
    ? <a href={url} target="_blank" rel="noreferrer" style={{color:col, textDecoration:"none", display:"inline-flex", alignItems:"center"}}>{children}</a>
    : <span style={{color:col, display:"inline-flex", alignItems:"center"}}>{children}</span>;
};

/* ═══════════════════════ RESUME SECTIONS ════════════════════════════ */
const SecHead = ({title, accent, style={}}) => (
  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,marginTop:16,...style}}>
    <h3 style={{margin:0,fontSize:10,fontWeight:800,color:accent,textTransform:"uppercase",letterSpacing:1.8,whiteSpace:"nowrap"}}>{title}</h3>
    <div style={{flex:1,height:1.5,background:`${accent}35`}}/>
  </div>
);

const renderSection = (id, data, t, textCol, accentCol) => {
  const ac = accentCol || t.accent;
  const tx = textCol || "#1e293b";
  const sub = "#6b7280";

  if (id === "experience" && data.experience?.length) return (
    <div key="experience">
      <SecHead title="Work Experience" accent={ac}/>
      {data.experience.map(e => (
        <div key={e.id} style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
            <div><p style={{margin:0,fontWeight:700,fontSize:13,color:tx}}>{e.role}</p><p style={{margin:"2px 0 4px",fontSize:11.5,color:ac,fontWeight:600}}>{e.company}{e.location?` · ${e.location}`:""}</p></div>
            <span style={{fontSize:10.5,color:sub,background:`${ac}12`,padding:"2px 8px",borderRadius:12,height:"fit-content",fontWeight:500}}>{e.start}{e.start&&(e.end||e.current)?" – ":""}{e.current?"Present":e.end}</span>
          </div>
          <ul style={{margin:"4px 0 0",paddingLeft:15}}>{e.points.filter(Boolean).map((pt,i)=><li key={i} style={{color:tx,fontSize:11.5,marginBottom:2.5,lineHeight:1.55,opacity:0.9}}>{pt}</li>)}</ul>
        </div>
      ))}
    </div>
  );

  if (id === "education" && data.education?.length) return (
    <div key="education">
      <SecHead title="Education" accent={ac}/>
      {data.education.map(e => (
        <div key={e.id} style={{marginBottom:10,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
          <div><p style={{margin:0,fontWeight:700,fontSize:13,color:tx}}>{e.degree}</p><p style={{margin:"2px 0",fontSize:11.5,color:ac,fontWeight:500}}>{e.school}{e.gpa?` — GPA: ${e.gpa}`:""}</p></div>
          <span style={{fontSize:10.5,color:sub}}>{e.year}</span>
        </div>
      ))}
    </div>
  );

  if (id === "projects" && data.projects?.length) return (
    <div key="projects">
      <SecHead title="Projects" accent={ac}/>
      {data.projects.map(p => (
        <div key={p.id} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:4}}>
            <p style={{margin:0,fontWeight:700,fontSize:13,color:tx}}>{p.name}{p.tech?<span style={{fontSize:10.5,color:ac,fontWeight:500,marginLeft:6}}>[{p.tech}]</span>:null}</p>
            <div style={{display:"flex",gap:8}}>
              {p.github&&<CLink href={p.github} col={ac}><span style={{fontSize:10}}>GitHub ↗</span></CLink>}
              {p.link&&<CLink href={p.link} col={ac}><span style={{fontSize:10}}>Live ↗</span></CLink>}
            </div>
          </div>
          {p.desc&&<p style={{margin:"3px 0 0",fontSize:11.5,color:tx,opacity:0.8,lineHeight:1.5}}>{p.desc}</p>}
        </div>
      ))}
    </div>
  );

  if (id === "skills" && data.skills?.length) return (
    <div key="skills">
      <SecHead title="Skills" accent={ac}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {data.skills.map((s,i)=><span key={i} style={{background:`${ac}18`,color:ac,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:500}}>{s}</span>)}
      </div>
    </div>
  );

  if (id === "certifications" && data.certifications?.length) return (
    <div key="certifications">
      <SecHead title="Certifications" accent={ac}/>
      {data.certifications.map(c => (
        <div key={c.id} style={{marginBottom:9,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
          <div>
            <p style={{margin:0,fontWeight:700,fontSize:12.5,color:tx}}>{c.name}{c.link&&<CLink href={c.link} col={ac}><span style={{fontSize:10,marginLeft:6}}>↗</span></CLink>}</p>
            <p style={{margin:"2px 0",fontSize:11.5,color:ac,fontWeight:500}}>{c.issuer}</p>
          </div>
          <span style={{fontSize:10.5,color:sub}}>{c.year}</span>
        </div>
      ))}
    </div>
  );

  if (id === "extracurricular" && data.extracurricular?.length) return (
    <div key="extracurricular">
      <SecHead title="Extracurricular" accent={ac}/>
      {data.extracurricular.map(e => (
        <div key={e.id} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
            <div><p style={{margin:0,fontWeight:700,fontSize:12.5,color:tx}}>{e.title}</p><p style={{margin:"2px 0",fontSize:11.5,color:ac,fontWeight:500}}>{e.org}</p></div>
            <span style={{fontSize:10.5,color:sub}}>{e.year}</span>
          </div>
          {e.desc&&<p style={{margin:"3px 0 0",fontSize:11,color:tx,opacity:0.75,lineHeight:1.5}}>{e.desc}</p>}
        </div>
      ))}
    </div>
  );

  if (id === "languages" && data.languages?.length) return (
    <div key="languages">
      <SecHead title="Languages" accent={ac}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {data.languages.map((l,i)=>(
          <div key={i} style={{background:`${ac}10`,border:`1px solid ${ac}30`,borderRadius:8,padding:"5px 12px",textAlign:"center"}}>
            <p style={{margin:0,fontSize:12,fontWeight:700,color:tx}}>{l.lang}</p>
            <p style={{margin:0,fontSize:10,color:ac}}>{l.level}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (id === "awards" && data.awards?.length) return (
    <div key="awards">
      <SecHead title="Awards & Honors" accent={ac}/>
      {data.awards.map(a => (
        <div key={a.id} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
            <div><p style={{margin:0,fontWeight:700,fontSize:12.5,color:tx}}>{a.title}</p><p style={{margin:"2px 0",fontSize:11.5,color:ac,fontWeight:500}}>{a.org}</p></div>
            <span style={{fontSize:10.5,color:sub}}>{a.year}</span>
          </div>
          {a.desc&&<p style={{margin:"3px 0 0",fontSize:11,color:tx,opacity:0.75,lineHeight:1.5}}>{a.desc}</p>}
        </div>
      ))}
    </div>
  );

  if (id === "volunteer" && data.volunteer?.length) return (
    <div key="volunteer">
      <SecHead title="Volunteer Work" accent={ac}/>
      {data.volunteer.map(v => (
        <div key={v.id} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
            <div><p style={{margin:0,fontWeight:700,fontSize:12.5,color:tx}}>{v.role}</p><p style={{margin:"2px 0",fontSize:11.5,color:ac,fontWeight:500}}>{v.org}</p></div>
            <span style={{fontSize:10.5,color:sub}}>{v.duration}</span>
          </div>
          {v.desc&&<p style={{margin:"3px 0 0",fontSize:11,color:tx,opacity:0.75,lineHeight:1.5}}>{v.desc}</p>}
        </div>
      ))}
    </div>
  );

  return null;
};

const renderSidebarSkills = (data, ac, sidebarTxt) => {
  if (!data.skills?.length && !data.languages?.length) return null;
  return (
    <>
      {data.skills?.length > 0 && <>
        <div style={{borderTop:`1px solid ${ac}25`,paddingTop:12,marginTop:12}}>
          <p style={{margin:"0 0 8px",fontSize:8,fontWeight:800,textTransform:"uppercase",letterSpacing:1.8,color:`${sidebarTxt}55`}}>Skills</p>
          {data.skills.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:ac,flexShrink:0}}/>
              <span style={{fontSize:11,color:sidebarTxt,opacity:0.85,lineHeight:1.3}}>{s}</span>
            </div>
          ))}
        </div>
      </>}
      {data.languages?.length > 0 && <>
        <div style={{borderTop:`1px solid ${ac}25`,paddingTop:12,marginTop:12}}>
          <p style={{margin:"0 0 8px",fontSize:8,fontWeight:800,textTransform:"uppercase",letterSpacing:1.8,color:`${sidebarTxt}55`}}>Languages</p>
          {data.languages.map((l,i)=>(
            <div key={i} style={{marginBottom:5}}>
              <span style={{fontSize:11,color:sidebarTxt,opacity:0.85,fontWeight:600}}>{l.lang}</span>
              {l.level&&<span style={{fontSize:10,color:ac,marginLeft:4,opacity:0.8}}>· {l.level}</span>}
            </div>
          ))}
        </div>
      </>}
    </>
  );
};

/* ═══════════════════════ RESUME PREVIEW ════════════════════════════ */
function ResumePreview({ data, tKey }) {
  const t = T[tKey] || T.midnight;
  const p = data.personal;
  const order = (data.sectionOrder || []).filter(id => !(data.hiddenSections||[]).includes(id));
  const mainSections = order.filter(id => !["skills","languages"].includes(id));
  const font = t.font || "DM Sans";

  const ContactRow = ({col="#fff", size=11}) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:4,alignItems:"center"}}>
      {p.email&&<CLink href={`mailto:${p.email}`} col={col}><span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:size,marginRight:10,opacity:0.9}}>{Icons.mail(11,col)}{p.email}</span></CLink>}
      {p.phone&&<span style={{display:"inline-flex",alignItems:"center",gap:4,color:col,fontSize:size,marginRight:10,opacity:0.85}}>{Icons.phone(11,col)}{p.phone}</span>}
      {p.location&&<span style={{display:"inline-flex",alignItems:"center",gap:4,color:col,fontSize:size,marginRight:10,opacity:0.85}}>{Icons.map(11,col)}{p.location}</span>}
      {p.linkedin&&<CLink href={p.linkedin} col={col}><span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:size,marginRight:10,opacity:0.9}}>{Icons.linkedin(11,col)}</span></CLink>}
      {p.github&&<CLink href={p.github} col={col}><span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:size,marginRight:10,opacity:0.9}}>{Icons.github(11,col)}</span></CLink>}
      {p.website&&<CLink href={p.website} col={col}><span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:size,marginRight:10,opacity:0.9}}>{Icons.globe(11,col)}</span></CLink>}
    </div>
  );

  const SideContact = ({col}) => (
    <div style={{marginBottom:14}}>
      <p style={{margin:"0 0 8px",fontSize:8,fontWeight:800,textTransform:"uppercase",letterSpacing:1.8,color:`${t.sidebarTxt||"#fff"}55`}}>Contact</p>
      {p.email&&<CLink href={`mailto:${p.email}`} col={col}><div style={{display:"flex",alignItems:"flex-start",gap:7,marginBottom:6}}>{Icons.mail(11,col)}<span style={{fontSize:10.5,wordBreak:"break-all",lineHeight:1.3,opacity:0.85}}>{p.email}</span></div></CLink>}
      {p.phone&&<div style={{display:"flex",alignItems:"flex-start",gap:7,marginBottom:6}}>{Icons.phone(11,col)}<span style={{fontSize:10.5,color:col,opacity:0.85}}>{p.phone}</span></div>}
      {p.location&&<div style={{display:"flex",alignItems:"flex-start",gap:7,marginBottom:6}}>{Icons.map(11,col)}<span style={{fontSize:10.5,color:col,opacity:0.85}}>{p.location}</span></div>}
      {p.linkedin&&<CLink href={p.linkedin} col={col}><div style={{display:"flex",alignItems:"flex-start",gap:7,marginBottom:6}}>{Icons.linkedin(11,col)}<span style={{fontSize:10.5,opacity:0.85}}>LinkedIn</span></div></CLink>}
      {p.github&&<CLink href={p.github} col={col}><div style={{display:"flex",alignItems:"flex-start",gap:7,marginBottom:6}}>{Icons.github(11,col)}<span style={{fontSize:10.5,opacity:0.85}}>GitHub</span></div></CLink>}
      {p.website&&<CLink href={p.website} col={col}><div style={{display:"flex",alignItems:"flex-start",gap:7,marginBottom:6}}>{Icons.globe(11,col)}<span style={{fontSize:10.5,opacity:0.85}}>Portfolio</span></div></CLink>}
    </div>
  );

  if (t.layout === "sl") {
    const isDark = ["neon","noir","charcoal"].includes(tKey);
    const mainBg = t.main;
    const mainTxt = isDark ? "#e2e8f0" : "#1e293b";
    return (
      <div style={{display:"flex",minHeight:"100%",fontFamily:`'${font}',sans-serif`,background:mainBg}}>
        <div style={{width:195,background:t.sidebar,padding:"26px 16px",flexShrink:0,minHeight:"297mm"}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:`${t.accent}30`,border:`2.5px solid ${t.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:14,color:t.accent,fontWeight:800}}>
            {(p.name||"U")[0]?.toUpperCase()}
          </div>
          <h1 style={{margin:"0 0 3px",fontSize:15,fontWeight:800,color:t.sidebarTxt,lineHeight:1.2}}>{p.name||"Your Name"}</h1>
          <p style={{margin:"0 0 16px",fontSize:10,color:t.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,lineHeight:1.3}}>{p.title}</p>
          <SideContact col={t.sidebarTxt}/>
        
        </div>
        <div style={{flex:1,padding:"24px 22px",overflowY:"auto"}}>
          {data.summary&&<><SecHead title="Profile" accent={t.accent}/><p style={{margin:"0 0 4px",fontSize:12,color:isDark?"#94a3b8":"#374151",lineHeight:1.75}}>{data.summary}</p></>}
          {order.map(id=>renderSection(id,data,t,mainTxt,t.accent))}  
        </div>
      </div>
    );
  }

  if (t.layout === "sr") {
    const isDark = ["charcoal"].includes(tKey);
    const mainBg = t.main;
    const mainTxt = isDark ? "#e2e8f0" : "#1e293b";
    return (
      <div style={{fontFamily:`'${font}',sans-serif`,background:mainBg}}>
        <div style={{background:t.accent,padding:"22px 26px"}}>
          <h1 style={{margin:0,fontSize:24,fontWeight:800,color:"#fff"}}>{p.name||"Your Name"}</h1>
          <p style={{margin:"4px 0 10px",fontSize:12,color:"rgba(255,255,255,0.75)",fontWeight:500}}>{p.title}</p>
          <ContactRow col="#fff"/>
        </div>
        <div style={{display:"flex"}}>
          <div style={{flex:1,padding:"18px 22px"}}>
            {data.summary&&<><SecHead title="Profile" accent={t.accent}/><p style={{margin:"0 0 4px",fontSize:12,color:"#374151",lineHeight:1.75}}>{data.summary}</p></>}
            {order.map(id=>renderSection(id,data,t,mainTxt,t.accent))}
          </div>
         
        </div>
      </div>
    );
  }

  if (t.layout === "th") {
    const hdrBg = t.hdr || t.accent;
    const hdrTxt = t.headerText || t.hdrTxt || "#fff";
    return (
      <div style={{fontFamily:`'${font}',sans-serif`,background:t.main}}>
        <div style={{background:hdrBg,padding:"26px 32px 20px",borderBottom:`3px solid ${t.accent}`}}>
          <h1 style={{margin:0,fontSize:26,fontWeight:800,color:hdrTxt,letterSpacing:-0.3}}>{p.name||"Your Name"}</h1>
          <p style={{margin:"4px 0 12px",fontSize:12,color:hdrTxt,opacity:0.75,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>{p.title}</p>
          <ContactRow col={hdrTxt}/>
        </div>
        <div style={{padding:"16px 24px 24px"}}>
          {data.summary&&<><SecHead title="Summary" accent={t.accent}/><p style={{margin:"0 0 4px",fontSize:12,color:"#374151",lineHeight:1.75}}>{data.summary}</p></>}
          {order.map(id=>renderSection(id,data,t,"#1e293b",t.accent))}
        </div>
      </div>
    );
  }

  if (t.layout === "line") {
    const hdrBg = t.hdr || "#fff";
    const hdrTxt = t.hdrTxt || "#111";
    return (
      <div style={{fontFamily:`'${font}',sans-serif`,background:t.main||"#fff",padding:"30px 34px"}}>
        <div style={{borderBottom:`3px solid ${t.accent}`,paddingBottom:16,marginBottom:6}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
            <div>
              <h1 style={{margin:0,fontSize:28,fontWeight:900,color:hdrBg==="#fff"?"#111":hdrTxt,letterSpacing:-0.5}}>{p.name||"Your Name"}</h1>
              <p style={{margin:"5px 0 0",fontSize:12,color:t.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{p.title}</p>
            </div>
            <div style={{textAlign:"right"}}><ContactRow col="#374151" size={10.5}/></div>
          </div>
        </div>
        <div>
          {data.summary&&<><SecHead title="Summary" accent={t.accent}/><p style={{margin:"0 0 4px",fontSize:12,color:"#374151",lineHeight:1.75}}>{data.summary}</p></>}
          {order.map(id=>renderSection(id,data,t,"#1e293b",t.accent))}
        </div>
      </div>
    );
  }

  if (t.layout === "bold") {
    const hdrBg = t.hdr || t.dark || "#111";
    const hdrTxt = t.hdrTxt || "#fff";
    const isBebas = font === "Bebas Neue";
    return (
      <div style={{fontFamily:`'${font}',sans-serif`,background:t.main||"#fff"}}>
        <div style={{background:`linear-gradient(135deg,${hdrBg},${t.accent}88)`,padding:"30px 34px 24px"}}>
          <h1 style={{margin:"0 0 6px",fontSize:isBebas?42:30,fontWeight:isBebas?400:900,color:hdrTxt,letterSpacing:isBebas?2:-0.5,lineHeight:1}}>{p.name||"Your Name"}</h1>
          <p style={{margin:"0 0 14px",fontSize:12,color:hdrTxt,opacity:0.7,fontWeight:500,letterSpacing:isBebas?2:1,textTransform:"uppercase"}}>{p.title}</p>
          <ContactRow col={hdrTxt}/>
        </div>
        <div style={{padding:"20px 30px 28px"}}>
          {data.summary&&<><SecHead title="About" accent={t.accent}/><p style={{margin:"0 0 4px",fontSize:12,color:"#374151",lineHeight:1.75,borderLeft:`3px solid ${t.accent}`,paddingLeft:12}}>{data.summary}</p></>}
          <div>
            {order.map(id=>renderSection(id,data,t,"#1e293b",t.accent))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ══════════════════ TEMPLATE THUMBNAIL ═════════════════════════════ */
function TmplThumb({ tKey, selected, onClick }) {
  const t = T[tKey];
  const sl = t.layout==="sl", sr=t.layout==="sr";
  const hdr = t.hdr||t.sidebar||t.accent;
  const sW = 38;
  return (
    <div onClick={onClick} style={{cursor:"pointer",borderRadius:10,overflow:"hidden",border:`2px solid ${selected?t.accent:"#e5e7eb"}`,boxShadow:selected?`0 0 0 3px ${t.accent}30`:"0 1px 4px rgba(0,0,0,0.08)",transition:"all 0.18s",transform:selected?"scale(1.04)":"scale(1)"}}>
      <div style={{height:76,overflow:"hidden",position:"relative",background:t.main||"#fff"}}>
        {(sl||sr) && (
          <div style={{display:"flex",height:"100%",flexDirection:sr?"row-reverse":"row"}}>
            <div style={{width:sW,background:t.sidebar||t.accent,padding:4}}>
              <div style={{width:14,height:14,borderRadius:"50%",background:`${t.accent}60`,margin:"0 auto 3px"}}/>
              {[65,45,55,35].map((w,i)=><div key={i} style={{height:1.8,background:`${t.sidebarTxt||"#fff"}40`,borderRadius:2,width:`${w}%`,margin:"2.5px auto"}}/>)}
            </div>
            <div style={{flex:1,padding:5}}>
              {[90,55,80,45,70,50,60].map((w,i)=><div key={i} style={{height:2,background:i%3===0?t.accent:"#e5e7eb",borderRadius:2,width:`${w}%`,margin:"2.5px 0"}}/>)}
            </div>
          </div>
        )}
        {!sl&&!sr&&["th","bold"].includes(t.layout) && (
          <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
            <div style={{background:hdr,height:24,padding:"4px 7px",display:"flex",alignItems:"center",gap:3}}>
              {[50,30].map((w,i)=><div key={i} style={{height:2.5,background:`${t.hdrTxt||"#fff"}80`,borderRadius:2,width:w}}/>)}
            </div>
            <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 30px",gap:2,padding:"4px 6px"}}>
              <div>{[85,55,75,45,65,50].map((w,i)=><div key={i} style={{height:2,background:i%3===0?t.accent:"#e5e7eb",borderRadius:2,width:`${w}%`,margin:"2.5px 0"}}/>)}</div>
              <div>{[60,80,50].map((w,i)=><div key={i} style={{height:2,background:`${t.accent}50`,borderRadius:2,width:`${w}%`,margin:"3px 0"}}/>)}</div>
            </div>
          </div>
        )}
        {!sl&&!sr&&t.layout==="line" && (
          <div style={{padding:"6px 8px",height:"100%",background:t.main||"#fff"}}>
            <div style={{borderBottom:`2.5px solid ${t.accent}`,paddingBottom:4,marginBottom:4,display:"flex",justifyContent:"space-between"}}>
              <div style={{width:60,height:5,background:t.dark||"#111",borderRadius:2}}/>
              <div style={{width:30,height:5,background:`${t.accent}50`,borderRadius:2}}/>
            </div>
            {[90,60,80,45,70,50].map((w,i)=><div key={i} style={{height:2,background:i%3===0?t.accent:"#e5e7eb",borderRadius:2,width:`${w}%`,margin:"2.5px 0"}}/>)}
          </div>
        )}
      </div>
      <div style={{padding:"5px 8px",background:"#fafafa",borderTop:"1px solid #f0f0f0"}}>
        <p style={{margin:0,fontSize:9.5,fontWeight:700,color:selected?t.accent:"#374151",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.name}</p>
        <p style={{margin:0,fontSize:8.5,color:"#94a3b8"}}>{t.cat}</p>
      </div>
    </div>
  );
}

/* ══════════════════ AUTH SCREEN ════════════════════════════════════ */
function AuthScreen({ onLogin }) {
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({name:"",email:"",password:""});
  const [errors,setErrors]=useState({});
  const [showPass,setShowPass]=useState(false);
  const [loading,setLoading]=useState(false);

  const submit = async () => {
    const errs={};
    if(mode==="signup") errs.name=V.name(form.name);
    errs.email=V.email(form.email); errs.password=V.password(form.password);
    if(Object.values(errs).some(Boolean)){setErrors(errs);return;}
    setLoading(true);
    await new Promise(r=>setTimeout(r,700));
    try {
      const users=JSON.parse(localStorage.getItem("rf_users")||"[]");
      if(mode==="signup"){
        if(users.find(u=>u.email===form.email)){setErrors({email:"Email already registered"});setLoading(false);return;}
        users.push({name:form.name,email:form.email,password:form.password});
        localStorage.setItem("rf_users",JSON.stringify(users));
        const u={name:form.name,email:form.email};
        localStorage.setItem("rf_session",JSON.stringify(u)); onLogin(u);
      } else {
        const user=users.find(u=>u.email===form.email&&u.password===form.password);
        if(!user){setErrors({email:"Invalid email or password"});setLoading(false);return;}
        const u={name:user.name,email:user.email};
        localStorage.setItem("rf_session",JSON.stringify(u)); onLogin(u);
      }
    }catch{}
    setLoading(false);
  };

  const inpStyle = (field) => ({
    width:"100%", padding:"11px 14px", border:`1.5px solid ${errors[field]?"#ef4444":"#e2e8f0"}`,
    borderRadius:10, fontSize:14, outline:"none", fontFamily:"'DM Sans',sans-serif",
    boxSizing:"border-box", background:errors[field]?"#fef2f2":"#fff", transition:"border 0.2s",
  });
  const lblStyle = {display:"block",fontSize:11,fontWeight:700,color:"#64748b",marginBottom:5,textTransform:"uppercase",letterSpacing:0.5};

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:20}}>
      <Fonts/>
      <div style={{background:"#fff",borderRadius:22,width:"100%",maxWidth:420,boxShadow:"0 30px 80px rgba(0,0,0,0.35)",overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#0f172a,#1e3a5f)",padding:"32px 36px 28px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:10}}>📄</div>
          <h1 style={{margin:0,color:"#fff",fontSize:24,fontWeight:800,fontFamily:"'Playfair Display',serif"}}>Smart Resume Builder With AI</h1>
          <p style={{margin:"6px 0 0",color:"rgba(255,255,255,0.5)",fontSize:13}}>30 templates · All sections · Drag to reorder</p>
        </div>
        <div style={{padding:"28px 32px 32px"}}>
          <div style={{display:"flex",background:"#f1f5f9",borderRadius:10,padding:4,marginBottom:24}}>
            {["login","signup"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setErrors({});}} style={{flex:1,padding:"9px",background:mode===m?"#fff":"none",border:"none",borderRadius:7,fontSize:13,fontWeight:700,cursor:"pointer",color:mode===m?"#0f172a":"#64748b",boxShadow:mode===m?"0 2px 6px rgba(0,0,0,0.1)":"none",fontFamily:"'DM Sans',sans-serif"}}>
                {m==="login"?"Sign In":"Sign Up"}
              </button>
            ))}
          </div>
          {mode==="signup"&&(
            <div style={{marginBottom:16}}>
              <label style={lblStyle}>Full Name</label>
              <input type="text" value={form.name} placeholder="xyz"
                onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                onKeyDown={e=>e.key==="Enter"&&submit()}
                style={inpStyle("name")}/>
              {errors.name&&<p style={{color:"#ef4444",fontSize:12,margin:"4px 0 0"}}>⚠ {errors.name}</p>}
            </div>
          )}
          <div style={{marginBottom:16}}>
            <label style={lblStyle}>Email Address</label>
            <input type="email" value={form.email} placeholder="you@example.com"
              onChange={e=>setForm(f=>({...f,email:e.target.value}))}
              onKeyDown={e=>e.key==="Enter"&&submit()}
              style={inpStyle("email")}/>
            {errors.email&&<p style={{color:"#ef4444",fontSize:12,margin:"4px 0 0"}}>⚠ {errors.email}</p>}
          </div>
          <div style={{marginBottom:16}}>
            <label style={lblStyle}>Password</label>
            <div style={{position:"relative"}}>
              <input type={showPass?"text":"password"} value={form.password}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                onChange={e=>setForm(f=>({...f,password:e.target.value}))}
                onKeyDown={e=>e.key==="Enter"&&submit()}
                style={{...inpStyle("password"), paddingRight:60}}/>
              <button onClick={()=>setShowPass(s=>!s)} type="button"
                style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:11,fontWeight:700,color:"#6b7280"}}>
                {showPass?"HIDE":"SHOW"}
              </button>
            </div>
            {errors.password&&<p style={{color:"#ef4444",fontSize:12,margin:"4px 0 0"}}>⚠ {errors.password}</p>}
          </div>
          <button onClick={submit} disabled={loading} style={{width:"100%",padding:13,background:loading?"#94a3b8":"linear-gradient(135deg,#2563eb,#7c3aed)",color:"#fff",border:"none",borderRadius:11,fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:4}}>
            {loading?"⏳ Please wait...":mode==="login"?"Sign In →":"Create Account →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ DRAG-REORDER SECTIONS ═══════════════════════════ */
function SectionReorder({ sectionOrder, hiddenSections, onChange, onToggle }) {
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);

  const onDragStart = (i) => setDragIdx(i);
  const onDragOver = (e, i) => { e.preventDefault(); setOverIdx(i); };
  const onDrop = (i) => {
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); setOverIdx(null); return; }
    const arr = [...sectionOrder];
    const [removed] = arr.splice(dragIdx, 1);
    arr.splice(i, 0, removed);
    onChange(arr);
    setDragIdx(null); setOverIdx(null);
  };
  const moveUp = (i) => { if (i === 0) return; const arr = [...sectionOrder]; [arr[i-1], arr[i]] = [arr[i], arr[i-1]]; onChange(arr); };
  const moveDown = (i) => { if (i === sectionOrder.length-1) return; const arr = [...sectionOrder]; [arr[i], arr[i+1]] = [arr[i+1], arr[i]]; onChange(arr); };

  return (
    <div>
      <p style={{fontSize:12,color:"#64748b",margin:"0 0 12px",lineHeight:1.5}}>Drag sections to reorder them in your resume. Toggle visibility with the eye icon.</p>
      {sectionOrder.map((id, i) => {
        const sec = ALL_SECTIONS.find(s => s.id === id);
        if (!sec) return null;
        const hidden = hiddenSections.includes(id);
        return (
          <div key={id} draggable onDragStart={()=>onDragStart(i)} onDragOver={e=>onDragOver(e,i)} onDrop={()=>onDrop(i)} onDragEnd={()=>{setDragIdx(null);setOverIdx(null);}}
            style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:overIdx===i&&dragIdx!==i?"#eff6ff":hidden?"#fafafa":"#fff",border:`1.5px solid ${overIdx===i&&dragIdx!==i?"#3b82f6":hidden?"#e2e8f0":"#e2e8f0"}`,borderRadius:10,marginBottom:8,cursor:"grab",transition:"all 0.15s",opacity:hidden?0.5:1}}>
            <span style={{color:"#94a3b8",cursor:"grab",fontSize:16}}>⠿</span>
            <div style={{width:8,height:8,borderRadius:"50%",background:sec.color,flexShrink:0}}/>
            <span style={{flex:1,fontSize:13,fontWeight:600,color:"#374151"}}>{sec.label}</span>
            <div style={{display:"flex",gap:4}}>
              <button onClick={()=>moveUp(i)} disabled={i===0} style={{background:"none",border:"1px solid #e2e8f0",borderRadius:6,padding:"2px 7px",cursor:i===0?"not-allowed":"pointer",color:i===0?"#cbd5e1":"#6b7280",fontSize:12}}>{Icons.up(11,"currentColor")}</button>
              <button onClick={()=>moveDown(i)} disabled={i===sectionOrder.length-1} style={{background:"none",border:"1px solid #e2e8f0",borderRadius:6,padding:"2px 7px",cursor:i===sectionOrder.length-1?"not-allowed":"pointer",color:i===sectionOrder.length-1?"#cbd5e1":"#6b7280",fontSize:12}}>{Icons.down(11,"currentColor")}</button>
              <button onClick={()=>onToggle(id)} style={{background:hidden?"#f0fdf4":"#ffe","none":"none",border:`1px solid ${hidden?"#86efac":"#fcd34d"}`,borderRadius:6,padding:"2px 7px",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:3,color:hidden?"#16a34a":"#b45309"}}>
                {hidden?Icons.eyeoff(11,"currentColor"):Icons.eye(11,"currentColor")}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════ EDITOR FIELDS ══════════════════════════════════ */
const Inp = ({label,value,onChange,type="text",placeholder,half,error}) => (
  <div style={{marginBottom:11,width:half?"calc(50% - 5px)":"100%",flexShrink:0}}>
    {label&&<label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:0.5}}>{label}</label>}
    <input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",padding:"8px 11px",border:`1.5px solid ${error?"#ef4444":"#e2e8f0"}`,borderRadius:8,fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",background:error?"#fef2f2":"#fff",transition:"border 0.15s"}}
      onFocus={e=>e.target.style.borderColor="#3b82f6"} onBlur={e=>e.target.style.borderColor=error?"#ef4444":"#e2e8f0"}/>
    {error&&<p style={{color:"#ef4444",fontSize:11,margin:"3px 0 0"}}>⚠ {error}</p>}
  </div>
);

const Txt = ({label,value,onChange,rows=3,placeholder}) => (
  <div style={{marginBottom:11}}>
    {label&&<label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:0.5}}>{label}</label>}
    <textarea value={value||""} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder}
      style={{width:"100%",padding:"8px 11px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",resize:"vertical",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}}
      onFocus={e=>e.target.style.borderColor="#3b82f6"} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
  </div>
);

const Card = ({title,i,onDel,children,accent="#3b82f6"}) => (
  <div style={{border:"1px solid #e2e8f0",borderLeft:`3px solid ${accent}`,borderRadius:10,padding:14,marginBottom:12,background:"#fafafa"}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
      <span style={{fontWeight:700,fontSize:12,color:"#374151"}}>#{i+1} {title}</span>
      <button onClick={onDel} style={{background:"#fee2e2",border:"none",borderRadius:6,padding:"3px 8px",cursor:"pointer",color:"#ef4444",display:"flex",alignItems:"center"}}>{Icons.trash(13,"#ef4444")}</button>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:"0 10px"}}>{children}</div>
  </div>
);

const AddBtn = ({onClick,label}) => (
  <button onClick={onClick} style={{width:"100%",padding:"10px",background:"#fff",border:"2px dashed #e2e8f0",borderRadius:10,color:"#64748b",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:"'DM Sans',sans-serif",fontWeight:500,marginTop:4}}>
    {Icons.plus(14,"#94a3b8")} {label}
  </button>
);

/* ══════════════════ MAIN APP ════════════════════════════════════════ */
export default function App() {
  const [user,setUser]=useState(null);
  const [resume,setResume]=useState(null);
  const [tab,setTab]=useState("templates");
  const [view,setView]=useState("split");
  const [saved,setSaved]=useState(false);
  const [catFilter,setCatFilter]=useState("All");
  const [skillInput,setSkillInput]=useState("");
  const [downloading,setDownloading]=useState(false);
  const [showAI,setShowAI]=useState(false);
  const previewRef=useRef(null);

  useEffect(()=>{
    try {
      const session=localStorage.getItem("rf_session");
      if(session){
        const u=JSON.parse(session); setUser(u);
        const saved=localStorage.getItem(`rf_resume_${u.email}`);
        const r=saved?JSON.parse(saved):defaultResume();
        if(!saved){r.personal.name=u.name;r.personal.email=u.email;}
        setResume(r);
      }
    }catch{}
  },[]);

  const handleLogin = u => {
    setUser(u);
    try {
      const saved=localStorage.getItem(`rf_resume_${u.email}`);
      const r=saved?JSON.parse(saved):defaultResume();
      if(!saved){r.personal.name=u.name;r.personal.email=u.email;}
      setResume(r);
    }catch{setResume(defaultResume());}
  };

  const saveResume = () => {
    if(!user||!resume) return;
    try{localStorage.setItem(`rf_resume_${user.email}`,JSON.stringify(resume));setSaved(true);setTimeout(()=>setSaved(false),2200);}catch{}
  };

  const upR = patch => setResume(r=>({...r,...patch}));
  const upP = (k,v) => setResume(r=>({...r,personal:{...r.personal,[k]:v}}));
  const addItem = (sec,blank) => setResume(r=>({...r,[sec]:[...r[sec],blank()]}));
  const delItem = (sec,id) => setResume(r=>({...r,[sec]:r[sec].filter(x=>x.id!==id)}));
  const setItem = (sec,id,k,v) => setResume(r=>({...r,[sec]:r[sec].map(x=>x.id===id?{...x,[k]:v}:x)}));
  const setPoint=(id,i,v)=>setResume(r=>({...r,experience:r.experience.map(e=>e.id===id?{...e,points:e.points.map((p,pi)=>pi===i?v:p)}:e)}));
  const addPoint=id=>setResume(r=>({...r,experience:r.experience.map(e=>e.id===id?{...e,points:[...e.points,""]}:e)}));
  const delPoint=(id,i)=>setResume(r=>({...r,experience:r.experience.map(e=>e.id===id?{...e,points:e.points.filter((_,pi)=>pi!==i)}:e)}));
  const addSkill=()=>{if(!skillInput.trim())return;setResume(r=>({...r,skills:[...r.skills,skillInput.trim()]}));setSkillInput("");};
  const delSkill=i=>setResume(r=>({...r,skills:r.skills.filter((_,si)=>si!==i)}));
  const toggleSection = id => {
    setResume(r=>{
      const hidden=r.hiddenSections||[];
      return {...r,hiddenSections:hidden.includes(id)?hidden.filter(x=>x!==id):[...hidden,id]};
    });
  };
  const logout=()=>{localStorage.removeItem("rf_session");setUser(null);setResume(null);};

  if(!user||!resume) return <AuthScreen onLogin={handleLogin}/>;

  const filteredT = Object.keys(T).filter(k=>catFilter==="All"||T[k].cat===catFilter);

  const TABS = [
    {id:"templates",label:"🎨 Templates"},
    {id:"personal",label:"👤 Personal"},
    {id:"experience",label:"💼 Work"},
    {id:"education",label:"🎓 Education"},
    {id:"projects",label:"🚀 Projects"},
    {id:"skills",label:"⚡ Skills"},
    {id:"certifications",label:"🏆 Certs"},
    {id:"extracurricular",label:"🏅 Activities"},
    {id:"languages",label:"🌐 Languages"},
    {id:"awards",label:"🥇 Awards"},
    {id:"volunteer",label:"❤️ Volunteer"},
    {id:"order",label:"↕ Reorder"},
  ];

  const EXP_ACCENT="#3b82f6", EDU_ACCENT="#059669", PROJ_ACCENT="#7c3aed", CERT_ACCENT="#dc2626", EC_ACCENT="#0e7490", LANG_ACCENT="#15803d", AWD_ACCENT="#b45309", VOL_ACCENT="#be123c";

  const downloadPDF = async () => {
  setDownloading(true);
  const loadScript = (src) => new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
    const s = document.createElement("script"); s.src = src;
    s.onload = res; s.onerror = rej; document.head.appendChild(s);
  });
  try {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");

    // Switch to preview mode temporarily if in split view
    const wasInSplit = view === "split";
    if (wasInSplit) setView("preview");
    await new Promise(r => setTimeout(r, 600));

    const el = previewRef.current;
    if (!el) { alert("Preview not found."); setDownloading(false); return; }

    const canvas = await window.html2canvas(el, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: el.scrollWidth,
      height: el.scrollHeight,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
    });

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const imgH = (canvas.height * pdfW) / canvas.width;
    let y = 0;
    while (y < imgH) {
      pdf.addImage(imgData, "JPEG", 0, -y, pdfW, imgH);
      if (y + pdfH < imgH) pdf.addPage();
      y += pdfH;
    }
    pdf.save(`${(resume.personal.name || "Resume").replace(/\s+/g,"_")}_Resume.pdf`);

    if (wasInSplit) setView("split");
  } catch(e) { alert("Download failed: " + e.message); }
  setDownloading(false);
};

  // Build resume text for AI context
  const resumeTextForAI = [
    resume.personal.name && `Name: ${resume.personal.name}`,
    resume.personal.title && `Title: ${resume.personal.title}`,
    resume.summary && `Summary: ${resume.summary}`,
    ...resume.experience.map(e=>`Experience: ${e.role} at ${e.company} (${e.start}–${e.current?"Present":e.end}). ${e.points.filter(Boolean).join(". ")}`),
    ...resume.education.map(e=>`Education: ${e.degree} from ${e.school} (${e.year})`),
    ...resume.projects.map(p=>`Project: ${p.name} [${p.tech}] - ${p.desc}`),
    resume.skills.length && `Skills: ${resume.skills.join(", ")}`,
    ...resume.certifications.map(c=>`Certification: ${c.name} by ${c.issuer} (${c.year})`),
  ].filter(Boolean).join("\n");

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"#f1f5f9",fontFamily:"'DM Sans',sans-serif",overflow:"hidden"}}>
      <Fonts/>
      {/* ── TOPBAR ── */}
      <div style={{background:"#0f172a",height:52,display:"flex",alignItems:"center",padding:"0 16px",gap:10,flexShrink:0,zIndex:20}}>
        <span style={{fontSize:22}}>📄</span>
        <span style={{color:"#fff",fontWeight:800,fontSize:15,fontFamily:"'Playfair Display',serif",marginRight:8}}>Smart Resume Builder with AI Assistant</span>
        <div style={{flex:1}}/>
        <span style={{color:"#64748b",fontSize:12}}>👋 {user.name}</span>
        <button onClick={saveResume} style={{padding:"6px 14px",background:saved?"#059669":"#2563eb",color:"#fff",border:"none",borderRadius:8,fontSize:12,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",gap:5,transition:"background 0.3s"}}>
          {saved?<>{Icons.check(12,"#fff")} Saved!</>:<>{Icons.save(12,"#fff")} Save</>}
        </button>
        <button onClick={()=>setView(v=>v==="split"?"preview":"split")} style={{padding:"6px 14px",background:"#334155",color:"#fff",border:"none",borderRadius:8,fontSize:12,cursor:"pointer",fontWeight:700}}>
          {view==="split"?"👁 Full Preview":"✏️ Edit"}
        </button>
        <button onClick={downloadPDF} disabled={downloading} style={{padding:"6px 14px",background:downloading?"#374151":"linear-gradient(135deg,#059669,#0d9488)",color:"#fff",border:"none",borderRadius:8,fontSize:12,cursor:downloading?"not-allowed":"pointer",fontWeight:700,display:"flex",alignItems:"center",gap:5,opacity:downloading?0.7:1}}>
          {downloading?"⏳ Preparing...":"⬇️ Download PDF"}
        </button>
        {/* ── AI BUTTON ── */}
        <button onClick={()=>setShowAI(s=>!s)} style={{padding:"6px 14px",background:showAI?"#7c3aed":"#4c1d95",color:"#ede9fe",border:`1.5px solid ${showAI?"#a78bfa":"#6d28d9"}`,borderRadius:8,fontSize:12,cursor:"pointer",fontWeight:700,transition:"all 0.2s"}}>
          🤖 AI {showAI?"▲":"▼"}
        </button>
        <button onClick={logout} style={{padding:"6px 12px",background:"#7f1d1d",color:"#fee2e2",border:"none",borderRadius:8,fontSize:12,cursor:"pointer",fontWeight:600}}>Logout</button>
      </div>

      {view==="preview" ? (
        <div style={{flex:1,overflowY:"auto",padding:24,display:"flex",justifyContent:"center",background:"#e2e8f0"}}>
          <div ref={previewRef} style={{width:"210mm",background:"#fff",boxShadow:"0 10px 60px rgba(0,0,0,0.2)",borderRadius:4}}>
            <ResumePreview data={resume} tKey={resume.template}/>
          </div>
        </div>
      ) : (
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>
          {/* LEFT EDITOR PANEL */}
          <div style={{width:340,flexShrink:0,display:"flex",flexDirection:"column",background:"#fff",borderRight:"1px solid #e2e8f0"}}>
            <div style={{overflowX:"auto",borderBottom:"1px solid #f0f0f0",background:"#f8fafc",flexShrink:0}}>
              <div style={{display:"flex",padding:"0 6px",minWidth:"max-content"}}>
                {TABS.map(t=>(
                  <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 10px",fontSize:10,fontWeight:tab===t.id?800:500,color:tab===t.id?"#2563eb":"#64748b",background:"none",border:"none",cursor:"pointer",borderBottom:tab===t.id?"2.5px solid #2563eb":"2.5px solid transparent",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif",transition:"color 0.15s"}}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:14}}>
              {tab==="templates"&&<>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
                  {CATS.map(c=>(
                    <button key={c} onClick={()=>setCatFilter(c)} style={{padding:"4px 11px",borderRadius:20,border:`1.5px solid ${catFilter===c?"#2563eb":"#e2e8f0"}`,background:catFilter===c?"#eff6ff":"#fff",color:catFilter===c?"#2563eb":"#6b7280",fontSize:11,fontWeight:catFilter===c?700:500,cursor:"pointer"}}>
                      {c}
                    </button>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {filteredT.map(k=>(
                    <TmplThumb key={k} tKey={k} selected={resume.template===k} onClick={()=>upR({template:k})}/>
                  ))}
                </div>
              </>}
              {tab==="personal"&&<>
                <div style={{display:"flex",flexWrap:"wrap",gap:"0 10px"}}>
                  <Inp half label="Full Name" value={resume.personal.name} onChange={v=>upP("name",v)} placeholder="XYZ"/>
                  <Inp half label="Job Title" value={resume.personal.title} onChange={v=>upP("title",v)} placeholder="Software Engineer"/>
                  <Inp half label="Email" value={resume.personal.email} onChange={v=>upP("email",v)} placeholder="XYZ@example.com"/>
                  <Inp half label="Phone" value={resume.personal.phone} onChange={v=>upP("phone",v)} placeholder="+91 9999999999"/>
                  <Inp label="Location" value={resume.personal.location} onChange={v=>upP("location",v)} placeholder="Pune, Maharashtra"/>
                  <Inp label="LinkedIn URL" value={resume.personal.linkedin} onChange={v=>upP("linkedin",v)} placeholder="linkedin.com/in/XYZ"/>
                  <Inp label="GitHub URL" value={resume.personal.github} onChange={v=>upP("github",v)} placeholder="github.com/XYZ"/>
                  <Inp label="Website / Portfolio" value={resume.personal.website} onChange={v=>upP("website",v)} placeholder="XYZ.dev"/>
                </div>
                <Txt label="Professional Summary" value={resume.summary} onChange={v=>upR({summary:v})} rows={4} placeholder="A results-driven professional with..."/>
              </>}
              {tab==="experience"&&<>
                {resume.experience.map((exp,i)=>(
                  <Card key={exp.id} title="Experience" i={i} onDel={()=>delItem("experience",exp.id)} accent={EXP_ACCENT}>
                    <Inp half label="Company" value={exp.company} onChange={v=>setItem("experience",exp.id,"company",v)} placeholder="Google"/>
                    <Inp half label="Role" value={exp.role} onChange={v=>setItem("experience",exp.id,"role",v)} placeholder="Software Engineer"/>
                    <Inp half label="Start" value={exp.start} onChange={v=>setItem("experience",exp.id,"start",v)} placeholder="Jan 2022"/>
                    <Inp half label="End" value={exp.current?"Present":exp.end} onChange={v=>setItem("experience",exp.id,"end",v)} placeholder="Dec 2023"/>
                    <Inp label="Location (optional)" value={exp.location} onChange={v=>setItem("experience",exp.id,"location",v)} placeholder="Pune, India"/>
                    <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,marginBottom:10,cursor:"pointer",width:"100%"}}>
                      <input type="checkbox" checked={exp.current} onChange={e=>setItem("experience",exp.id,"current",e.target.checked)}/> Currently working here
                    </label>
                    <div style={{width:"100%"}}>
                      <label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Bullet Points</label>
                      {exp.points.map((pt,pi)=>(
                        <div key={pi} style={{display:"flex",gap:5,marginBottom:6}}>
                          <input value={pt} onChange={e=>setPoint(exp.id,pi,e.target.value)} placeholder="Achieved X by doing Y, resulting in Z..."
                            style={{flex:1,padding:"7px 10px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:12,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
                          <button onClick={()=>delPoint(exp.id,pi)} style={{background:"#fee2e2",border:"none",borderRadius:7,padding:"0 9px",cursor:"pointer",color:"#ef4444",flexShrink:0}}>{Icons.x(12,"#ef4444")}</button>
                        </div>
                      ))}
                      <button onClick={()=>addPoint(exp.id)} style={{background:"none",border:"1.5px dashed #e2e8f0",borderRadius:8,padding:"6px 12px",fontSize:11,color:"#94a3b8",cursor:"pointer",width:"100%"}}>+ Add bullet</button>
                    </div>
                  </Card>
                ))}
                <AddBtn onClick={()=>addItem("experience",blankExp)} label="Add Experience"/>
              </>}
              {tab==="education"&&<>
                {resume.education.map((edu,i)=>(
                  <Card key={edu.id} title="Education" i={i} onDel={()=>delItem("education",edu.id)} accent={EDU_ACCENT}>
                    <Inp label="Degree / Program" value={edu.degree} onChange={v=>setItem("education",edu.id,"degree",v)} placeholder="B.Tech Computer Engineering"/>
                    <Inp label="School / University" value={edu.school} onChange={v=>setItem("education",edu.id,"school",v)} placeholder="University of Pune"/>
                    <Inp half label="Year Range" value={edu.year} onChange={v=>setItem("education",edu.id,"year",v)} placeholder="2020 – 2024"/>
                    <Inp half label="GPA / Grade" value={edu.gpa} onChange={v=>setItem("education",edu.id,"gpa",v)} placeholder="8.5/10"/>
                  </Card>
                ))}
                <AddBtn onClick={()=>addItem("education",blankEdu)} label="Add Education"/>
              </>}
              {tab==="projects"&&<>
                {resume.projects.map((pr,i)=>(
                  <Card key={pr.id} title="Project" i={i} onDel={()=>delItem("projects",pr.id)} accent={PROJ_ACCENT}>
                    <Inp label="Project Name" value={pr.name} onChange={v=>setItem("projects",pr.id,"name",v)} placeholder="E-Commerce Platform"/>
                    <Inp label="Tech Stack" value={pr.tech} onChange={v=>setItem("projects",pr.id,"tech",v)} placeholder="React, Node.js, MongoDB"/>
                    <Txt label="Description" value={pr.desc} onChange={v=>setItem("projects",pr.id,"desc",v)} rows={2} placeholder="Built a full-stack platform with..."/>
                    <Inp half label="GitHub URL" value={pr.github} onChange={v=>setItem("projects",pr.id,"github",v)} placeholder="github.com/user/repo"/>
                    <Inp half label="Live Link" value={pr.link} onChange={v=>setItem("projects",pr.id,"link",v)} placeholder="myapp.vercel.app"/>
                  </Card>
                ))}
                <AddBtn onClick={()=>addItem("projects",blankProj)} label="Add Project"/>
              </>}
              {tab==="skills"&&<>
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  <input value={skillInput} onChange={e=>setSkillInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSkill()} placeholder="Type skill + Enter..."
                    style={{flex:1,padding:"9px 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
                  <button onClick={addSkill} style={{padding:"9px 16px",background:"#2563eb",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13}}>Add</button>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {resume.skills.map((s,i)=>(
                    <span key={i} style={{background:"#eff6ff",color:"#2563eb",padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
                      {s} <button onClick={()=>delSkill(i)} style={{background:"none",border:"none",cursor:"pointer",color:"#93c5fd",padding:0,lineHeight:1,display:"flex",alignItems:"center"}}>{Icons.x(12,"#93c5fd")}</button>
                    </span>
                  ))}
                </div>
              </>}
              {tab==="certifications"&&<>
                {resume.certifications.map((c,i)=>(
                  <Card key={c.id} title="Certification" i={i} onDel={()=>delItem("certifications",c.id)} accent={CERT_ACCENT}>
                    <Inp label="Certification Name" value={c.name} onChange={v=>setItem("certifications",c.id,"name",v)} placeholder="AWS Certified Developer"/>
                    <Inp half label="Issuing Organization" value={c.issuer} onChange={v=>setItem("certifications",c.id,"issuer",v)} placeholder="Amazon Web Services"/>
                    <Inp half label="Year" value={c.year} onChange={v=>setItem("certifications",c.id,"year",v)} placeholder="2023"/>
                    <Inp label="Credential Link (optional)" value={c.link} onChange={v=>setItem("certifications",c.id,"link",v)} placeholder="https://credential.link"/>
                  </Card>
                ))}
                <AddBtn onClick={()=>addItem("certifications",blankCert)} label="Add Certification"/>
              </>}
              {tab==="extracurricular"&&<>
                {resume.extracurricular.map((e,i)=>(
                  <Card key={e.id} title="Activity" i={i} onDel={()=>delItem("extracurricular",e.id)} accent={EC_ACCENT}>
                    <Inp label="Title / Achievement" value={e.title} onChange={v=>setItem("extracurricular",e.id,"title",v)} placeholder="Hackathon Winner"/>
                    <Inp half label="Organization" value={e.org} onChange={v=>setItem("extracurricular",e.id,"org",v)} placeholder="HackIndia 2023"/>
                    <Inp half label="Year" value={e.year} onChange={v=>setItem("extracurricular",e.id,"year",v)} placeholder="2023"/>
                    <Txt label="Description" value={e.desc} onChange={v=>setItem("extracurricular",e.id,"desc",v)} rows={2} placeholder="Won first place among 500+ teams..."/>
                  </Card>
                ))}
                <AddBtn onClick={()=>addItem("extracurricular",blankEC)} label="Add Activity"/>
              </>}
              {tab==="languages"&&<>
                {resume.languages.map((l,i)=>(
                  <Card key={l.id} title="Language" i={i} onDel={()=>delItem("languages",l.id)} accent={LANG_ACCENT}>
                    <Inp half label="Language" value={l.lang} onChange={v=>setItem("languages",l.id,"lang",v)} placeholder="English"/>
                    <Inp half label="Proficiency" value={l.level} onChange={v=>setItem("languages",l.id,"level",v)} placeholder="Native / C1 / Fluent"/>
                  </Card>
                ))}
                <AddBtn onClick={()=>addItem("languages",blankLang)} label="Add Language"/>
              </>}
              {tab==="awards"&&<>
                {resume.awards.map((a,i)=>(
                  <Card key={a.id} title="Award" i={i} onDel={()=>delItem("awards",a.id)} accent={AWD_ACCENT}>
                    <Inp label="Award Title" value={a.title} onChange={v=>setItem("awards",a.id,"title",v)} placeholder="Best Innovation Award"/>
                    <Inp half label="Organization" value={a.org} onChange={v=>setItem("awards",a.id,"org",v)} placeholder="IEEE 2023"/>
                    <Inp half label="Year" value={a.year} onChange={v=>setItem("awards",a.id,"year",v)} placeholder="2023"/>
                    <Txt label="Description" value={a.desc} onChange={v=>setItem("awards",a.id,"desc",v)} rows={2} placeholder="Recognized for..."/>
                  </Card>
                ))}
                <AddBtn onClick={()=>addItem("awards",blankAward)} label="Add Award"/>
              </>}
              {tab==="volunteer"&&<>
                {resume.volunteer.map((v,i)=>(
                  <Card key={v.id} title="Volunteer" i={i} onDel={()=>delItem("volunteer",v.id)} accent={VOL_ACCENT}>
                    <Inp label="Role" value={v.role} onChange={val=>setItem("volunteer",v.id,"role",val)} placeholder="Mentor"/>
                    <Inp half label="Organization" value={v.org} onChange={val=>setItem("volunteer",v.id,"org",val)} placeholder="NGO Name"/>
                    <Inp half label="Duration" value={v.duration} onChange={val=>setItem("volunteer",v.id,"duration",val)} placeholder="2022 – Present"/>
                    <Txt label="Description" value={v.desc} onChange={val=>setItem("volunteer",v.id,"desc",val)} rows={2} placeholder="Taught coding skills to..."/>
                  </Card>
                ))}
                <AddBtn onClick={()=>addItem("volunteer",blankVol)} label="Add Volunteer Role"/>
              </>}
              {tab==="order"&&(
                <SectionReorder
                  sectionOrder={resume.sectionOrder||[]}
                  hiddenSections={resume.hiddenSections||[]}
                  onChange={arr=>upR({sectionOrder:arr})}
                  onToggle={toggleSection}
                />
              )}
            </div>
          </div>

          {/* ── AI PANEL ── */}
          {showAI && (
            <div style={{width:520,flexShrink:0,overflowY:"auto",background:"#0f172a",borderLeft:"1px solid #1e293b",borderRight:"1px solid #1e293b",padding:16,display:"flex",flexDirection:"column"}}>
              <AIAssistant resumeText={resumeTextForAI} />
            </div>
          )}

          {/* RIGHT PREVIEW */}
          <div style={{flex:1,overflowY:"auto",background:"#e2e8f0",padding:20,display:"flex",justifyContent:"center"}}>
            <div style={{width:"100%",maxWidth:760}}>
              <div style={{background:"#fff",borderRadius:8,boxShadow:"0 8px 40px rgba(0,0,0,0.15)",overflow:"hidden"}}>
                <div style={{background:"#f8fafc",padding:"8px 16px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1}}>Live Preview · {T[resume.template]?.name||"Template"}</span>
                  <div style={{width:10,height:10,borderRadius:"50%",background:T[resume.template]?.accent||"#3b82f6"}}/>
                </div>
                <ResumePreview data={resume} tKey={resume.template}/>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// AIAssistant.jsx
// Place this file in: src/components/AIAssistant.jsx

import { useState } from "react";
import {
  generateResumeContent,
  checkATSScore,
  improveGrammar,
  chatWithAssistant,
} from "../services/groqService";

const tabs = [
  { id: "generate", label: "✨ Generate" },
  { id: "ats",      label: "📊 ATS Score" },
  { id: "grammar",  label: "✍️ Improve" },
  { id: "chat",     label: "💬 Chat" },
];

export default function AIAssistant({ resumeText = "" }) {
  const [activeTab, setActiveTab] = useState("generate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [genForm, setGenForm] = useState({ jobTitle: "", skills: "", experience: "2", section: "Work Experience" });
  const [genResult, setGenResult] = useState("");

  const [atsForm, setAtsForm] = useState({ jobDescription: "" });
  const [atsResult, setAtsResult] = useState(null);

  const [grammarText, setGrammarText] = useState("");
  const [grammarResult, setGrammarResult] = useState(null);

  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "👋 Hi! I'm your AI resume assistant powered by Groq. Ask me anything about your resume or career!" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleError = (e) => {
    if (e.message?.includes("401")) setError("❌ Invalid Groq API key. Check your .env file.");
    else if (e.message?.includes("429")) setError("⚠️ Rate limit reached. Wait a moment and try again.");
    else setError("❌ Error: " + e.message);
  };

  const handleGenerate = async () => {
    if (!genForm.jobTitle || !genForm.skills) return setError("Please fill in Job Title and Skills.");
    setLoading(true); setError(""); setGenResult("");
    try { setGenResult(await generateResumeContent(genForm)); }
    catch (e) { handleError(e); }
    setLoading(false);
  };

  const handleATS = async () => {
    if (!atsForm.jobDescription) return setError("Please paste a job description.");
    if (!resumeText) return setError("Your resume appears empty. Fill in resume content first.");
    setLoading(true); setError(""); setAtsResult(null);
    try { setAtsResult(await checkATSScore({ resumeText, jobDescription: atsForm.jobDescription })); }
    catch (e) { handleError(e); }
    setLoading(false);
  };

  const handleGrammar = async () => {
    if (!grammarText) return setError("Please paste some text to improve.");
    setLoading(true); setError(""); setGrammarResult(null);
    try { setGrammarResult(await improveGrammar({ text: grammarText })); }
    catch (e) { handleError(e); }
    setLoading(false);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const newMessages = [...chatMessages, { role: "user", content: chatInput }];
    setChatMessages(newMessages);
    setChatInput("");
    setLoading(true);
    try {
      const reply = await chatWithAssistant({ messages: newMessages, resumeContext: resumeText });
      setChatMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) { handleError(e); }
    setLoading(false);
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <span style={{fontSize:28}}>🤖</span>
        <div>
          <h2 style={s.headerTitle}>AI Assistant</h2>
          <p style={s.headerSub}>Powered by Groq · Llama 3.3</p>
        </div>
      </div>

      <div style={s.tabs}>
        {tabs.map(t => (
          <button key={t.id}
            style={{...s.tab, ...(activeTab === t.id ? s.tabActive : {})}}
            onClick={() => { setActiveTab(t.id); setError(""); }}>
            {t.label}
          </button>
        ))}
      </div>

      {error && <div style={s.error}>{error}</div>}

      <div style={s.content}>

        {activeTab === "generate" && (
          <div style={s.section}>
            <p style={s.desc}>Fill in your details and let AI write your resume content.</p>
            <label style={s.label}>Job Title *</label>
            <input style={s.input} placeholder="e.g. Full Stack Developer"
              value={genForm.jobTitle} onChange={e => setGenForm({...genForm, jobTitle: e.target.value})} />
            <label style={s.label}>Skills *</label>
            <input style={s.input} placeholder="e.g. React, Node.js, Python"
              value={genForm.skills} onChange={e => setGenForm({...genForm, skills: e.target.value})} />
            <label style={s.label}>Years of Experience</label>
            <select style={s.input} value={genForm.experience}
              onChange={e => setGenForm({...genForm, experience: e.target.value})}>
              {["0","1","2","3","5","7","10+"].map(y => <option key={y}>{y}</option>)}
            </select>
            <label style={s.label}>Section to Generate</label>
            <select style={s.input} value={genForm.section}
              onChange={e => setGenForm({...genForm, section: e.target.value})}>
              {["Work Experience","Summary/Objective","Skills","Projects","Cover Letter"].map(sec => <option key={sec}>{sec}</option>)}
            </select>
            <button style={s.btn} onClick={handleGenerate} disabled={loading}>
              {loading ? "⏳ Generating..." : "✨ Generate Content"}
            </button>
            {genResult && (
              <div style={s.result}>
                <div style={s.resultHeader}>
                  <span style={{color:"#94a3b8",fontSize:12,fontWeight:600}}>Generated Content</span>
                  <button style={s.copyBtn} onClick={() => navigator.clipboard.writeText(genResult)}>📋 Copy</button>
                </div>
                <pre style={s.resultText}>{genResult}</pre>
              </div>
            )}
          </div>
        )}

        {activeTab === "ats" && (
          <div style={s.section}>
            <p style={s.desc}>Check how well your resume matches a job description.</p>
            {!resumeText && <p style={s.warning}>⚠️ Fill in resume content first.</p>}
            <label style={s.label}>Paste Job Description *</label>
            <textarea style={s.textarea} rows={6} placeholder="Paste the full job description here..."
              value={atsForm.jobDescription} onChange={e => setAtsForm({jobDescription: e.target.value})} />
            <button style={s.btn} onClick={handleATS} disabled={loading}>
              {loading ? "⏳ Analyzing..." : "📊 Check ATS Score"}
            </button>
            {atsResult && (
              <div style={s.result}>
                <div style={s.scoreRow}>
                  <div style={{...s.scoreCircle, background: atsResult.score >= 70 ? "#22c55e" : atsResult.score >= 50 ? "#f59e0b" : "#ef4444"}}>
                    <span style={{fontSize:26,fontWeight:900,color:"#fff",lineHeight:1}}>{atsResult.score}</span>
                    <span style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>/ 100</span>
                  </div>
                  <p style={{color:"#94a3b8",fontSize:12,margin:0,flex:1}}>{atsResult.summary}</p>
                </div>
                <div style={s.twoCol}>
                  <div>
                    <h4 style={{color:"#22c55e",margin:"0 0 6px",fontSize:12}}>✅ Matched</h4>
                    <div style={s.tags}>{atsResult.matched_keywords?.map(k=><span key={k} style={{...s.tag,background:"#14532d"}}>{k}</span>)}</div>
                  </div>
                  <div>
                    <h4 style={{color:"#ef4444",margin:"0 0 6px",fontSize:12}}>❌ Missing</h4>
                    <div style={s.tags}>{atsResult.missing_keywords?.map(k=><span key={k} style={{...s.tag,background:"#450a0a"}}>{k}</span>)}</div>
                  </div>
                </div>
                <h4 style={{color:"#f59e0b",margin:"12px 0 6px",fontSize:12}}>💡 Suggestions</h4>
                <ul style={{paddingLeft:18,margin:0,color:"#cbd5e1"}}>
                  {atsResult.suggestions?.map((sug,i)=><li key={i} style={{marginBottom:4,fontSize:12,lineHeight:1.5}}>{sug}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "grammar" && (
          <div style={s.section}>
            <p style={s.desc}>Paste any resume text to fix grammar and improve professional tone.</p>
            <label style={s.label}>Text to Improve *</label>
            <textarea style={s.textarea} rows={5} placeholder="Paste a bullet point, summary, or any section..."
              value={grammarText} onChange={e => setGrammarText(e.target.value)} />
            <button style={s.btn} onClick={handleGrammar} disabled={loading}>
              {loading ? "⏳ Improving..." : "✍️ Improve Text"}
            </button>
            {grammarResult && (
              <div style={s.result}>
                <div style={s.resultHeader}>
                  <span style={{color:"#22c55e",fontSize:12,fontWeight:700}}>✅ Improved</span>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{color:"#94a3b8",fontSize:11}}>Tone: {grammarResult.tone_score}/10</span>
                    <button style={s.copyBtn} onClick={() => navigator.clipboard.writeText(grammarResult.improved_text)}>📋 Copy</button>
                  </div>
                </div>
                <p style={{color:"#e2e8f0",lineHeight:1.7,fontSize:13,margin:"0 0 10px"}}>{grammarResult.improved_text}</p>
                {grammarResult.changes?.length > 0 && <>
                  <p style={{color:"#64748b",fontSize:11,fontWeight:700,margin:"0 0 5px",textTransform:"uppercase",letterSpacing:0.5}}>Changes</p>
                  <ul style={{paddingLeft:18,margin:0}}>
                    {grammarResult.changes.map((c,i)=><li key={i} style={{color:"#64748b",fontSize:12,marginBottom:3}}>{c}</li>)}
                  </ul>
                </>}
              </div>
            )}
          </div>
        )}

        {activeTab === "chat" && (
          <div style={s.chatWrap}>
            <div style={s.chatMessages}>
              {chatMessages.map((msg,i)=>(
                <div key={i} style={{...s.bubble,...(msg.role==="user"?s.bubbleUser:s.bubbleAI)}}>
                  {msg.content}
                </div>
              ))}
              {loading && <div style={s.bubbleAI}>⏳ Thinking...</div>}
            </div>
            <div style={s.chatInputRow}>
              <input style={s.chatInput}
                placeholder="Ask about your resume..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key==="Enter" && !loading && handleChat()} />
              <button style={s.sendBtn} onClick={handleChat} disabled={loading}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  container:    { background:"#0f172a", borderRadius:16, border:"1px solid #1e293b", overflow:"hidden", fontFamily:"'DM Sans',sans-serif", color:"#e2e8f0", width:"100%", display:"flex", flexDirection:"column", height:"100%" },
  header:       { display:"flex", alignItems:"center", gap:12, padding:"16px 20px", background:"linear-gradient(135deg,#1e293b,#0f172a)", borderBottom:"1px solid #1e293b", flexShrink:0 },
  headerTitle:  { margin:0, fontSize:17, fontWeight:800, color:"#f1f5f9" },
  headerSub:    { margin:0, fontSize:11, color:"#64748b" },
  tabs:         { display:"flex", borderBottom:"1px solid #1e293b", background:"#0f172a", flexShrink:0 },
  tab:          { flex:1, padding:"10px 4px", border:"none", background:"transparent", color:"#64748b", cursor:"pointer", fontSize:11, fontWeight:600, transition:"all 0.2s", whiteSpace:"nowrap" },
  tabActive:    { color:"#818cf8", borderBottom:"2px solid #818cf8", background:"#1e1b4b20" },
  content:      { padding:16, overflowY:"auto", flex:1 },
  section:      { display:"flex", flexDirection:"column", gap:8 },
  desc:         { color:"#64748b", fontSize:12, margin:"0 0 4px" },
  label:        { fontSize:11, fontWeight:700, color:"#94a3b8", marginBottom:-4 },
  input:        { padding:"9px 11px", background:"#1e293b", border:"1px solid #334155", borderRadius:8, color:"#e2e8f0", fontSize:13, outline:"none" },
  textarea:     { padding:"9px 11px", background:"#1e293b", border:"1px solid #334155", borderRadius:8, color:"#e2e8f0", fontSize:13, outline:"none", resize:"vertical", fontFamily:"'DM Sans',sans-serif" },
  btn:          { padding:"11px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:8, color:"white", fontWeight:700, fontSize:13, cursor:"pointer", marginTop:4 },
  result:       { background:"#1e293b", borderRadius:10, padding:14, border:"1px solid #334155", marginTop:4 },
  resultHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 },
  resultText:   { whiteSpace:"pre-wrap", color:"#e2e8f0", fontSize:12, lineHeight:1.7, margin:0, fontFamily:"'DM Sans',sans-serif" },
  copyBtn:      { background:"#334155", border:"none", borderRadius:6, color:"#94a3b8", padding:"3px 9px", cursor:"pointer", fontSize:11 },
  warning:      { color:"#f59e0b", fontSize:12, margin:0 },
  error:        { margin:"0 16px 8px", padding:"9px 12px", background:"#450a0a", borderRadius:8, color:"#fca5a5", fontSize:12 },
  scoreRow:     { display:"flex", alignItems:"center", gap:14, marginBottom:14 },
  scoreCircle:  { width:72, height:72, borderRadius:"50%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 },
  twoCol:       { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
  tags:         { display:"flex", flexWrap:"wrap", gap:5 },
  tag:          { padding:"2px 9px", borderRadius:20, fontSize:11, color:"#e2e8f0" },
  chatWrap:     { display:"flex", flexDirection:"column", height:380 },
  chatMessages: { flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:8, paddingBottom:8 },
  bubble:       { padding:"9px 13px", borderRadius:12, fontSize:13, lineHeight:1.6, maxWidth:"85%" },
  bubbleUser:   { background:"#6366f1", color:"white", alignSelf:"flex-end", borderBottomRightRadius:4 },
  bubbleAI:     { background:"#1e293b", color:"#e2e8f0", alignSelf:"flex-start", borderBottomLeftRadius:4 },
  chatInputRow: { display:"flex", gap:8, marginTop:8, flexShrink:0 },
  chatInput:    { flex:1, padding:"9px 13px", background:"#1e293b", border:"1px solid #334155", borderRadius:8, color:"#e2e8f0", fontSize:13, outline:"none", fontFamily:"'DM Sans',sans-serif" },
  sendBtn:      { padding:"9px 18px", background:"#6366f1", border:"none", borderRadius:8, color:"white", fontWeight:700, cursor:"pointer", fontSize:13 },
};

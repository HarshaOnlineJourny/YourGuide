import { useState, useEffect, useRef } from "react";
import { BookOpen, Download, Eye, Search, User, Home, ChevronRight, Clock, Check, ArrowLeft, Zap, Bookmark, LogOut, FileText, Award, Filter, X, Star } from "lucide-react";

/* ═══════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════ */

const EXAMS = [
  { id:"kcet",   name:"KCET",     full:"Karnataka Common Entrance Test",     color:"#6366f1", papers:["Physics","Chemistry","Mathematics","Biology"] },
  { id:"jee",    name:"JEE Main", full:"Joint Entrance Examination (Main)",  color:"#f59e0b", papers:["Paper 1 Morning Shift","Paper 1 Evening Shift","Paper 2 (B.Arch)"] },
  { id:"neet",   name:"NEET UG",  full:"National Eligibility cum Entrance",  color:"#10b981", papers:["NEET UG Code P1","NEET UG Code Q1"] },
  { id:"mhtcet", name:"MHT CET",  full:"Maharashtra Common Entrance Test",   color:"#ef4444", papers:["PCM Paper","PCB Paper"] },
  { id:"bitsat", name:"BITSAT",   full:"BITS Admission Test",                color:"#8b5cf6", papers:["Full Paper (PCM + English + Logic)"] },
  { id:"wbjee",  name:"WBJEE",    full:"West Bengal Joint Entrance Exam",    color:"#0ea5e9", papers:["Mathematics","Physics & Chemistry"] },
];

const YEARS = [2024, 2023, 2022, 2021, 2020];

const SUBJECTS = [
  { id:"phy", name:"Physics",     icon:"⚡", color:"#3b82f6", bgLight:"#eff6ff", topics:["Mechanics","Thermodynamics","Optics","Electromagnetism","Modern Physics","Waves & Sound"] },
  { id:"che", name:"Chemistry",   icon:"🧪", color:"#10b981", bgLight:"#f0fdf4", topics:["Organic Chemistry","Inorganic Chemistry","Physical Chemistry","Electrochemistry","Chemical Bonding"] },
  { id:"mat", name:"Mathematics", icon:"∑",  color:"#f59e0b", bgLight:"#fffbeb", topics:["Calculus","Algebra","Trigonometry","Coordinate Geometry","Statistics","Probability"] },
  { id:"bio", name:"Biology",     icon:"🌿", color:"#ef4444", bgLight:"#fef2f2", topics:["Cell Biology","Genetics","Ecology","Human Physiology","Plant Biology","Evolution"] },
];

const RAW_QUESTIONS = [
  { id:1,  sid:"phy", topic:"Mechanics",        diff:"medium", q:"A ball is thrown vertically upward at 20 m/s. What is the maximum height? (g = 10 m/s²)", opts:["10 m","20 m","30 m","40 m"], ans:1, exp:"Using v² = u² − 2gh, at max height v = 0: h = u²/2g = 400/20 = 20 m." },
  { id:2,  sid:"phy", topic:"Thermodynamics",   diff:"hard",   q:"A Carnot engine operates between T₁ = 500 K and T₂ = 300 K. Its efficiency is:", opts:["30%","40%","50%","60%"], ans:1, exp:"η = 1 − T₂/T₁ = 1 − 300/500 = 0.4 = 40%." },
  { id:3,  sid:"phy", topic:"Optics",           diff:"medium", q:"A convex lens has focal length 20 cm. Its power (in Diopters) is:", opts:["2 D","5 D","10 D","20 D"], ans:1, exp:"P = 1/f(meters) = 1/0.20 = 5 D." },
  { id:4,  sid:"phy", topic:"Electromagnetism", diff:"hard",   q:"A solenoid (n = 2000 turns/m, I = 2 A) has magnetic field: (μ₀ = 4π × 10⁻⁷)", opts:["5.03 × 10⁻³ T","2.51 × 10⁻³ T","1.26 × 10⁻³ T","8.04 × 10⁻³ T"], ans:0, exp:"B = μ₀nI = 4π×10⁻⁷ × 2000 × 2 ≈ 5.03 × 10⁻³ T." },
  { id:5,  sid:"che", topic:"Organic Chemistry",   diff:"easy",   q:"What is the IUPAC name of CH₃–CH₂–OH?", opts:["Methanol","Ethanol","Propanol","Butanol"], ans:1, exp:"2-carbon chain with −OH at C1 → Ethanol." },
  { id:6,  sid:"che", topic:"Physical Chemistry",  diff:"medium", q:"The pH of 0.001 M HCl solution is:", opts:["1","2","3","4"], ans:2, exp:"pH = −log[H⁺] = −log(10⁻³) = 3." },
  { id:7,  sid:"che", topic:"Electrochemistry",    diff:"hard",   q:"At the cathode during electrolysis of aqueous NaCl, the product is:", opts:["Chlorine gas","Sodium metal","Hydrogen gas","Oxygen gas"], ans:2, exp:"At cathode: 2H₂O + 2e⁻ → H₂ + 2OH⁻. Hydrogen gas is liberated." },
  { id:8,  sid:"mat", topic:"Calculus",            diff:"hard",   q:"The derivative of sin(x²) with respect to x is:", opts:["cos(x²)","2x·cos(x²)","x·cos(x²)","2·sin(x²)"], ans:1, exp:"Chain rule: d/dx[sin(x²)] = cos(x²) · 2x = 2x·cos(x²)." },
  { id:9,  sid:"mat", topic:"Algebra",             diff:"easy",   q:"If α and β are roots of x² − 5x + 6 = 0, then α + β =", opts:["5","6","−5","−6"], ans:0, exp:"By Vieta's formulas, sum of roots = −b/a = 5." },
  { id:10, sid:"mat", topic:"Trigonometry",        diff:"easy",   q:"The value of sin²θ + cos²θ for all values of θ is:", opts:["0","1","2","Varies with θ"], ans:1, exp:"Fundamental identity: sin²θ + cos²θ = 1 always." },
  { id:11, sid:"bio", topic:"Cell Biology",        diff:"easy",   q:"Which organelle is known as the 'powerhouse of the cell'?", opts:["Nucleus","Ribosome","Mitochondria","Golgi apparatus"], ans:2, exp:"Mitochondria produce ATP through cellular respiration." },
  { id:12, sid:"bio", topic:"Genetics",            diff:"medium", q:"Blood group AB is the universal recipient because:", opts:["No antigens present","No antibodies present","Has both antigens","Has both antibodies"], ans:1, exp:"AB has A and B antigens but no anti-A or anti-B antibodies, so accepts any blood." },
];

/* ═══════════════════════════════════════════
   THEME
═══════════════════════════════════════════ */

const ACCENT = "#6366f1";
const AMBER  = "#f59e0b";
const GREEN  = "#10b981";
const RED    = "#ef4444";

const card = {
  background:"#fff",
  borderRadius:14,
  border:"1px solid #e8edf4",
  boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.03)",
};

/* ═══════════════════════════════════════════
   MICRO COMPONENTS
═══════════════════════════════════════════ */

function Chip({ children, color = ACCENT }) {
  return (
    <span style={{ background:`${color}18`, color, fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:100, letterSpacing:"0.02em", display:"inline-block" }}>
      {children}
    </span>
  );
}

function DiffChip({ d }) {
  const MAP = { easy:[GREEN,"Easy"], medium:[AMBER,"Medium"], hard:[RED,"Hard"] };
  const [c,l] = MAP[d] || MAP.medium;
  return <Chip color={c}>{l}</Chip>;
}

function Btn({ children, onClick, variant="primary", full, small, icon, disabled }) {
  const base = {
    display:"inline-flex", alignItems:"center", gap:6, justifyContent:"center",
    cursor:disabled?"not-allowed":"pointer", fontFamily:"inherit", fontWeight:600,
    borderRadius:10, border:"none", transition:"all .15s",
    padding: small ? "8px 14px" : "12px 20px",
    fontSize: small ? 13 : 14,
    opacity: disabled ? 0.5 : 1,
    width: full ? "100%" : "auto",
  };
  const variants = {
    primary:   { background:ACCENT, color:"#fff", boxShadow:`0 2px 8px ${ACCENT}35` },
    secondary: { background:"#f1f5f9", color:"#334155" },
    outline:   { background:"transparent", color:ACCENT, border:`1.5px solid ${ACCENT}60` },
    ghost:     { background:"transparent", color:"#64748b", padding: small?"6px 10px":"10px 14px" },
    danger:    { background:RED, color:"#fff" },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}>
      {icon}{children}
    </button>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width:46, height:26, borderRadius:100, background:value?ACCENT:"#e2e8f0", position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0 }}>
      <div style={{ width:20, height:20, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:value?23:3, transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,0.25)" }}/>
    </div>
  );
}

function BackBtn({ onClick, label = "Back" }) {
  return (
    <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:6, color:"#64748b", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:14, padding:"0 0 20px", fontWeight:500 }}>
      <ArrowLeft size={16}/> {label}
    </button>
  );
}

/* ═══════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════ */

const NAV = [
  { id:"home",    label:"Home",     Icon:Home },
  { id:"papers",  label:"Papers",   Icon:FileText },
  { id:"qbank",   label:"Q Bank",   Icon:BookOpen },
  { id:"quiz",    label:"Quiz",     Icon:Zap },
  { id:"profile", label:"Profile",  Icon:User },
];

function NavBar({ page, setPage, user }) {
  return (
    <>
      {/* Top */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(248,249,252,0.92)", backdropFilter:"blur(12px)", borderBottom:"1px solid #e8edf4", padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between", height:54 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:30, height:30, background:`linear-gradient(135deg,${ACCENT},#818cf8)`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <BookOpen size={15} color="#fff"/>
          </div>
          <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:17, color:"#0f172a" }}>YourGuide</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {user ? (
            <div onClick={() => setPage("profile")} style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${ACCENT},#818cf8)`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", fontSize:13, fontWeight:700 }}>
              {user.name[0].toUpperCase()}
            </div>
          ) : (
            <Btn small onClick={() => setPage("auth")}>Sign In</Btn>
          )}
        </div>
      </div>

      {/* Bottom mobile nav */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:50, background:"rgba(255,255,255,0.97)", backdropFilter:"blur(12px)", borderTop:"1px solid #e8edf4", display:"flex", padding:"8px 0 10px", maxWidth:640, margin:"0 auto" }}>
        {NAV.map(({ id, label, Icon }) => {
          const active = page === id;
          return (
            <button key={id} onClick={() => setPage(id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", color:active?ACCENT:"#94a3b8", transition:"color .15s", padding:"2px 0" }}>
              <div style={{ position:"relative" }}>
                {active && <div style={{ position:"absolute", inset:-4, background:`${ACCENT}12`, borderRadius:8 }}/>}
                <Icon size={20} style={{ position:"relative" }}/>
              </div>
              <span style={{ fontSize:10, fontWeight:active?700:500, fontFamily:"inherit" }}>{label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════ */

function HomePage({ setPage, user }) {
  const stats = [
    { label:"Papers", val:"150+", icon:"📄", c:ACCENT },
    { label:"Questions", val:"5K+", icon:"❓", c:AMBER },
    { label:"Exams", val:"20+", icon:"🎓", c:GREEN },
    { label:"Students", val:"10K+", icon:"👥", c:"#8b5cf6" },
  ];

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      {/* Hero */}
      <div style={{ ...card, padding:"26px 22px", marginBottom:20, background:"linear-gradient(135deg,#1e293b 0%,#334155 100%)", border:"none", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-50, right:-30, width:180, height:180, background:"rgba(99,102,241,0.12)", borderRadius:"50%" }}/>
        <div style={{ position:"absolute", bottom:-60, right:60, width:120, height:120, background:"rgba(245,158,11,0.1)", borderRadius:"50%" }}/>
        {user && (
          <div style={{ marginBottom:10 }}>
            <Chip color="#67e8f9">👋 Welcome back, {user.name}!</Chip>
          </div>
        )}
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:27, color:"#fff", margin:"0 0 8px", lineHeight:1.25 }}>
          Your Smart Study<br/>Companion
        </h1>
        <p style={{ color:"#94a3b8", fontSize:14, margin:"0 0 20px", lineHeight:1.65 }}>
          Previous year papers, question banks &amp; timed quizzes — everything to ace your exam.
        </p>
        <div style={{ display:"flex", gap:10 }}>
          <Btn onClick={() => setPage("quiz")} icon={<Zap size={15}/>}>Start Quiz</Btn>
          <Btn variant="ghost" onClick={() => setPage("papers")} style={{ color:"#cbd5e1" }}>
            <span style={{ color:"#cbd5e1", fontSize:14, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
              <FileText size={15} color="#cbd5e1"/> Papers
            </span>
          </Btn>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:10, marginBottom:24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, padding:"14px 8px", textAlign:"center" }}>
            <div style={{ fontSize:18, marginBottom:4 }}>{s.icon}</div>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:17, color:s.c }}>{s.val}</div>
            <div style={{ fontSize:10, color:"#94a3b8", fontWeight:600, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:19, color:"#0f172a", marginBottom:12 }}>Quick Access</h2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
        {[
          { icon:"📄", title:"Previous Papers", desc:"Last 5 years, all exams", target:"papers", bg:"#eff6ff", ac:ACCENT },
          { icon:"📚", title:"Question Bank",   desc:"5000+ practice questions", target:"qbank",  bg:"#fffbeb", ac:AMBER },
          { icon:"⚡", title:"Practice Quiz",   desc:"Timed tests with scoring", target:"quiz",   bg:"#f0fdf4", ac:GREEN },
          { icon:"🔖", title:"My Bookmarks",    desc:"Saved questions",          target:"profile",bg:"#fdf4ff", ac:"#a855f7" },
        ].map(item => (
          <div key={item.target} onClick={() => setPage(item.target)} style={{ ...card, padding:"18px 14px", cursor:"pointer", background:item.bg, border:`1px solid ${item.ac}20`, transition:"transform .15s" }}
            onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>
            <div style={{ fontSize:26, marginBottom:8 }}>{item.icon}</div>
            <div style={{ fontWeight:700, fontSize:13, color:"#0f172a", marginBottom:3 }}>{item.title}</div>
            <div style={{ fontSize:12, color:"#64748b", lineHeight:1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Popular Exams */}
      <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:19, color:"#0f172a", marginBottom:12 }}>Popular Exams</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {EXAMS.slice(0, 4).map(ex => (
          <div key={ex.id} onClick={() => setPage("papers")} style={{ ...card, padding:"13px 16px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
            <div style={{ width:40, height:40, borderRadius:10, background:`${ex.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:ex.color, fontSize:10, letterSpacing:"-0.5px", flexShrink:0 }}>
              {ex.name.slice(0,3).toUpperCase()}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>{ex.name}</div>
              <div style={{ fontSize:12, color:"#64748b" }}>{ex.full}</div>
            </div>
            <ChevronRight size={16} color="#cbd5e1"/>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAPERS PAGE
═══════════════════════════════════════════ */

function PapersPage() {
  const [exam, setExam] = useState(null);
  const [year, setYear] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [dlToast, setDlToast] = useState(false);

  const getPapers = (ex, yr) =>
    ex.papers.map((name, i) => ({
      id:`${ex.id}-${yr}-${i}`, name:`${name} (${yr})`,
      size:`${(1.6 + i * 0.4).toFixed(1)} MB`, pages:20 + i * 4,
    }));

  const download = (p) => {
    setDlToast(true);
    setTimeout(() => setDlToast(false), 2000);
  };

  if (viewing) return (
    <div style={{ padding:"20px 16px 100px" }}>
      {dlToast && <div style={{ position:"fixed", top:70, left:"50%", transform:"translateX(-50%)", background:"#1e293b", color:"#fff", padding:"10px 20px", borderRadius:100, fontSize:13, fontWeight:500, zIndex:100 }}>📥 Download started!</div>}
      <BackBtn onClick={() => setViewing(null)} label="Back to papers"/>
      <div style={{ ...card, padding:"22px" }}>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:"#0f172a", margin:"0 0 10px" }}>{viewing.name}</h2>
        <div style={{ display:"flex", gap:8, marginBottom:22 }}>
          <Chip color={ACCENT}>{viewing.size}</Chip>
          <Chip color="#64748b">{viewing.pages} pages</Chip>
        </div>
        <div style={{ background:"#f8fafc", border:"2px dashed #e2e8f0", borderRadius:12, minHeight:340, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, color:"#94a3b8" }}>
          <FileText size={52} strokeWidth={1}/>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontWeight:600, fontSize:15, color:"#475569", marginBottom:6 }}>PDF Preview</div>
            <div style={{ fontSize:13, maxWidth:220, lineHeight:1.5 }}>Tap "Open PDF" to view full paper in your PDF reader.</div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            <Btn icon={<Eye size={14}/>} small>Open PDF</Btn>
            <Btn variant="secondary" icon={<Download size={14}/>} small onClick={() => download(viewing)}>Download</Btn>
          </div>
        </div>
      </div>
    </div>
  );

  if (exam && year) {
    const papers = getPapers(exam, year);
    return (
      <div style={{ padding:"20px 16px 100px" }}>
        <BackBtn onClick={() => setYear(null)} label={`${exam.name} — All Years`}/>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:`${exam.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:exam.color, fontSize:10, flexShrink:0 }}>{exam.name.slice(0,3)}</div>
          <div>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:"#0f172a", margin:0 }}>{exam.name} — {year}</h2>
            <p style={{ color:"#64748b", fontSize:12, margin:0 }}>{papers.length} papers available</p>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {papers.map(p => (
            <div key={p.id} style={{ ...card, padding:"16px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                <div style={{ width:40, height:40, background:`${exam.color}12`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <FileText size={20} color={exam.color}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:14, color:"#0f172a", marginBottom:5 }}>{p.name}</div>
                  <div style={{ display:"flex", gap:8 }}>
                    <Chip color="#94a3b8">{p.size}</Chip>
                    <Chip color="#94a3b8">{p.pages} pages</Chip>
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <Btn small icon={<Eye size={13}/>} onClick={() => setViewing(p)}>View</Btn>
                <Btn small variant="secondary" icon={<Download size={13}/>} onClick={() => download(p)}>Download</Btn>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (exam) return (
    <div style={{ padding:"20px 16px 100px" }}>
      <BackBtn onClick={() => setExam(null)} label="All Exams"/>
      <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"#0f172a", margin:"0 0 4px" }}>{exam.name}</h2>
      <p style={{ color:"#64748b", fontSize:14, margin:"0 0 22px" }}>Select a year to browse papers</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        {YEARS.map(y => (
          <div key={y} onClick={() => setYear(y)} style={{ ...card, padding:"20px 12px", textAlign:"center", cursor:"pointer", transition:"all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=exam.color; e.currentTarget.style.background=`${exam.color}06`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#e8edf4"; e.currentTarget.style.background="#fff"; }}>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:exam.color, marginBottom:4 }}>{y}</div>
            <div style={{ fontSize:11, color:"#94a3b8", fontWeight:500 }}>{exam.papers.length} papers</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:"#0f172a", margin:"0 0 4px" }}>Previous Papers</h1>
      <p style={{ color:"#64748b", fontSize:14, margin:"0 0 22px" }}>Last 5 years · All major entrance exams</p>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {EXAMS.map(ex => (
          <div key={ex.id} onClick={() => setExam(ex)} style={{ ...card, padding:"15px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, transition:"transform .15s" }}
            onMouseEnter={e => e.currentTarget.style.transform="translateX(4px)"}
            onMouseLeave={e => e.currentTarget.style.transform="translateX(0)"}>
            <div style={{ width:44, height:44, borderRadius:12, background:`${ex.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:ex.color, fontSize:10, flexShrink:0, letterSpacing:"-0.3px" }}>
              {ex.name.slice(0,3).toUpperCase()}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:15, color:"#0f172a", marginBottom:3 }}>{ex.name}</div>
              <div style={{ fontSize:12, color:"#64748b", marginBottom:7 }}>{ex.full}</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {ex.papers.map((p, i) => i < 3 && <Chip key={i} color={ex.color}>{p.split(" ")[0]}</Chip>)}
                {ex.papers.length > 3 && <Chip color="#94a3b8">+{ex.papers.length - 3}</Chip>}
              </div>
            </div>
            <ChevronRight size={18} color="#e2e8f0"/>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   QUESTION BANK
═══════════════════════════════════════════ */

function QBankPage({ questions, toggleBookmark }) {
  const [subjFilter, setSubjFilter] = useState("all");
  const [diffFilter, setDiffFilter] = useState("all");
  const [search, setSearch]         = useState("");
  const [expanded, setExpanded]     = useState(null);

  const filtered = questions.filter(q =>
    (subjFilter === "all" || q.sid === subjFilter) &&
    (diffFilter === "all" || q.diff === diffFilter) &&
    (!search || q.q.toLowerCase().includes(search.toLowerCase()))
  );

  const subj = SUBJECTS.find(s => s.id === subjFilter);

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:"#0f172a", margin:"0 0 16px" }}>Question Bank</h1>

      {/* Search */}
      <div style={{ position:"relative", marginBottom:14 }}>
        <Search size={15} color="#94a3b8" style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..."
          style={{ width:"100%", padding:"10px 14px 10px 38px", border:"1.5px solid #e2e8f0", borderRadius:10, fontFamily:"inherit", fontSize:14, outline:"none", background:"#fff", boxSizing:"border-box" }}/>
        {search && <button onClick={() => setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#94a3b8" }}><X size={15}/></button>}
      </div>

      {/* Subject pills */}
      <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:6, marginBottom:12, scrollbarWidth:"none" }}>
        {[{id:"all",name:"All",icon:"📘"}, ...SUBJECTS].map(s => (
          <button key={s.id} onClick={() => setSubjFilter(s.id)}
            style={{ flexShrink:0, padding:"7px 13px", borderRadius:100, border:"1.5px solid", borderColor:subjFilter===s.id?(s.color||ACCENT):"#e2e8f0", background:subjFilter===s.id?`${s.color||ACCENT}12`:"#fff", color:subjFilter===s.id?(s.color||ACCENT):"#64748b", fontFamily:"inherit", fontSize:13, fontWeight:500, cursor:"pointer" }}>
            {s.icon && `${s.icon} `}{s.name}
          </button>
        ))}
      </div>

      {/* Difficulty pills */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {[["all","All Levels",ACCENT],["easy","Easy",GREEN],["medium","Medium",AMBER],["hard","Hard",RED]].map(([d,l,c]) => (
          <button key={d} onClick={() => setDiffFilter(d)}
            style={{ padding:"5px 12px", borderRadius:100, border:"1.5px solid", borderColor:diffFilter===d?c:"#e2e8f0", background:diffFilter===d?`${c}10`:"transparent", color:diffFilter===d?c:"#94a3b8", fontFamily:"inherit", fontSize:12, fontWeight:600, cursor:"pointer" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ fontSize:13, color:"#94a3b8", marginBottom:14, fontWeight:500 }}>{filtered.length} question{filtered.length !== 1 ? "s" : ""}</div>

      {filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:"48px 20px", color:"#94a3b8" }}>
          <div style={{ fontSize:36, marginBottom:12, opacity:.4 }}>🔍</div>
          <div style={{ fontSize:15, fontWeight:500, color:"#64748b" }}>No questions found</div>
          <div style={{ fontSize:13, marginTop:6 }}>Try adjusting your filters or search term.</div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(q => {
          const s = SUBJECTS.find(x => x.id === q.sid);
          const open = expanded === q.id;
          return (
            <div key={q.id} style={{ ...card, padding:"16px", borderLeft: open ? `3px solid ${ACCENT}` : "1px solid #e8edf4", transition:"all .2s" }}>
              <div style={{ display:"flex", gap:7, marginBottom:10, flexWrap:"wrap" }}>
                <Chip color={s?.color}>{s?.name}</Chip>
                <Chip color="#64748b">{q.topic}</Chip>
                <DiffChip d={q.diff}/>
              </div>
              <p style={{ fontSize:14, color:"#0f172a", fontWeight:500, margin:"0 0 12px", lineHeight:1.65 }}>{q.q}</p>

              {open && (
                <div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
                    {q.opts.map((opt, i) => (
                      <div key={i} style={{ padding:"10px 14px", borderRadius:10, background:i===q.ans?"#f0fdf4":"#f8fafc", border:"1.5px solid", borderColor:i===q.ans?"#10b981":"#e2e8f0", display:"flex", alignItems:"center", gap:10, fontSize:13, color:i===q.ans?GREEN:"#334155", fontWeight:i===q.ans?600:400 }}>
                        <span style={{ width:22, height:22, borderRadius:"50%", background:i===q.ans?"#10b98120":"#e2e8f0", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:i===q.ans?GREEN:"#64748b", flexShrink:0 }}>
                          {i===q.ans ? "✓" : String.fromCharCode(65+i)}
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>
                  <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#92400e", marginBottom:5 }}>💡 Explanation</div>
                    <div style={{ fontSize:13, color:"#78350f", lineHeight:1.6 }}>{q.exp}</div>
                  </div>
                </div>
              )}

              <div style={{ display:"flex", gap:8, marginTop:12, alignItems:"center" }}>
                <Btn small variant={open?"secondary":"primary"} onClick={() => setExpanded(open ? null : q.id)}>
                  {open ? "Hide Answer" : "Show Answer"}
                </Btn>
                <button onClick={() => toggleBookmark(q.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"7px 10px", borderRadius:8, color:q.bookmarked?AMBER:"#94a3b8", display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, fontFamily:"inherit" }}>
                  <Bookmark size={14} fill={q.bookmarked?AMBER:"none"}/>{q.bookmarked?"Saved":"Save"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   QUIZ PAGE
═══════════════════════════════════════════ */

function QuizPage({ questions: allQ }) {
  const [phase, setPhase] = useState("setup");
  const [cfg, setCfg]     = useState({ sid:"all", diff:"all", count:10, timed:true });
  const [quiz, setQuiz]   = useState(null);
  const [timeLeft, setTL] = useState(null);
  const timerRef          = useRef(null);

  useEffect(() => {
    if (phase !== "running" || timeLeft === null || timeLeft <= 0) return;
    timerRef.current = setTimeout(() => setTL(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [phase, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && phase === "running") setPhase("results");
  }, [timeLeft]);

  const startQuiz = () => {
    const pool = allQ.filter(q =>
      (cfg.sid === "all" || q.sid === cfg.sid) &&
      (cfg.diff === "all" || q.diff === cfg.diff)
    );
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(cfg.count, pool.length));
    if (!shuffled.length) return;
    setQuiz({ qs: shuffled, cur: 0, ans: {} });
    if (cfg.timed) setTL(shuffled.length * 60);
    setPhase("running");
  };

  const answer = (idx) => {
    if (!quiz || quiz.ans[quiz.cur] !== undefined) return;
    setQuiz(q => ({ ...q, ans: { ...q.ans, [q.cur]: idx } }));
  };

  const next = () => {
    if (quiz.cur < quiz.qs.length - 1) setQuiz(q => ({ ...q, cur: q.cur + 1 }));
    else { clearTimeout(timerRef.current); setPhase("results"); }
  };

  const score = quiz ? Object.entries(quiz.ans).filter(([i, a]) => quiz.qs[+i]?.ans === a).length : 0;

  /* ── SETUP ── */
  if (phase === "setup") return (
    <div style={{ padding:"24px 16px 100px" }}>
      <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:"#0f172a", margin:"0 0 4px" }}>Practice Quiz</h1>
      <p style={{ color:"#64748b", fontSize:14, margin:"0 0 22px" }}>Configure your session, then start</p>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ ...card, padding:"18px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#64748b", letterSpacing:"0.07em", marginBottom:10 }}>SUBJECT</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {[{id:"all",name:"All"}, ...SUBJECTS].map(s => (
              <button key={s.id} onClick={() => setCfg(c => ({...c, sid:s.id}))}
                style={{ padding:"8px 14px", borderRadius:100, border:"1.5px solid", borderColor:cfg.sid===s.id?(s.color||ACCENT):"#e2e8f0", background:cfg.sid===s.id?`${s.color||ACCENT}12`:"#fff", color:cfg.sid===s.id?(s.color||ACCENT):"#64748b", fontFamily:"inherit", fontSize:13, fontWeight:500, cursor:"pointer" }}>
                {s.icon && `${s.icon} `}{s.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ ...card, padding:"18px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#64748b", letterSpacing:"0.07em", marginBottom:10 }}>DIFFICULTY</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8 }}>
            {[["all","All",ACCENT],["easy","Easy",GREEN],["medium","Mid",AMBER],["hard","Hard",RED]].map(([d,l,c]) => (
              <button key={d} onClick={() => setCfg(cf => ({...cf, diff:d}))}
                style={{ padding:"9px 0", borderRadius:10, border:"1.5px solid", borderColor:cfg.diff===d?c:"#e2e8f0", background:cfg.diff===d?`${c}12`:"#fff", color:cfg.diff===d?c:"#64748b", fontFamily:"inherit", fontSize:12, fontWeight:700, cursor:"pointer", textAlign:"center" }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{ ...card, padding:"18px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#64748b", letterSpacing:"0.07em" }}>QUESTIONS</div>
            <div style={{ fontSize:14, fontWeight:700, color:ACCENT }}>{cfg.count}</div>
          </div>
          <input type="range" min={5} max={12} step={1} value={cfg.count} onChange={e => setCfg(c => ({...c, count:+e.target.value}))} style={{ width:"100%", accentColor:ACCENT }}/>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#94a3b8", marginTop:4 }}>
            <span>5</span><span>12</span>
          </div>
        </div>

        <div style={{ ...card, padding:"18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontWeight:600, fontSize:14, color:"#0f172a" }}>⏱ Timed Mode</div>
            <div style={{ fontSize:12, color:"#64748b" }}>1 minute per question</div>
          </div>
          <Toggle value={cfg.timed} onChange={v => setCfg(c => ({...c, timed:v}))}/>
        </div>

        <Btn full onClick={startQuiz} icon={<Zap size={16}/>}>Start Quiz</Btn>
      </div>
    </div>
  );

  /* ── RUNNING ── */
  if (phase === "running" && quiz) {
    const q   = quiz.qs[quiz.cur];
    const sel = quiz.ans[quiz.cur];
    const done = sel !== undefined;
    const pct  = Math.round(((quiz.cur + (done ? 1 : 0)) / quiz.qs.length) * 100);
    const mins = timeLeft !== null ? Math.floor(timeLeft / 60) : null;
    const secs = timeLeft !== null ? timeLeft % 60 : null;
    const low  = timeLeft !== null && timeLeft < 30;
    const subj = SUBJECTS.find(s => s.id === q.sid);

    return (
      <div style={{ padding:"20px 16px 100px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#64748b" }}>Q {quiz.cur + 1} / {quiz.qs.length}</div>
          {timeLeft !== null && (
            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", background:low?"#fef2f2":"#f0fdf4", borderRadius:100, color:low?RED:GREEN, fontWeight:700, fontSize:14 }}>
              <Clock size={14}/> {mins}:{String(secs).padStart(2,"0")}
            </div>
          )}
        </div>

        <div style={{ height:5, background:"#f1f5f9", borderRadius:100, marginBottom:20, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${ACCENT},#818cf8)`, borderRadius:100, transition:"width .35s" }}/>
        </div>

        <div style={{ ...card, padding:"20px", marginBottom:14 }}>
          <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
            <Chip color={subj?.color}>{subj?.name}</Chip>
            <Chip color="#64748b">{q.topic}</Chip>
          </div>
          <p style={{ fontSize:16, color:"#0f172a", fontWeight:500, margin:0, lineHeight:1.7 }}>{q.q}</p>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:16 }}>
          {q.opts.map((opt, i) => {
            let bg = "#fff", border = "#e2e8f0", color = "#0f172a";
            if (done) {
              if (i === q.ans) { bg="#f0fdf4"; border=GREEN; color=GREEN; }
              else if (i === sel) { bg="#fef2f2"; border=RED; color=RED; }
            }
            return (
              <div key={i} onClick={() => !done && answer(i)} style={{ padding:"13px 16px", borderRadius:12, background:bg, border:`1.5px solid ${border}`, color, fontWeight:500, fontSize:14, cursor:done?"default":"pointer", transition:"all .15s", display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ width:26, height:26, borderRadius:"50%", background:`${border}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:border, flexShrink:0 }}>
                  {done && i === q.ans ? "✓" : done && i === sel && i !== q.ans ? "✗" : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </div>
            );
          })}
        </div>

        {done && (
          <div style={{ ...card, padding:"14px", background:"#fffbeb", border:"1px solid #fde68a", marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#92400e", marginBottom:5 }}>💡 Explanation</div>
            <div style={{ fontSize:13, color:"#78350f", lineHeight:1.6 }}>{q.exp}</div>
          </div>
        )}

        {done && (
          <Btn full onClick={next} icon={<ChevronRight size={16}/>}>
            {quiz.cur < quiz.qs.length - 1 ? "Next Question" : "View Results"}
          </Btn>
        )}
      </div>
    );
  }

  /* ── RESULTS ── */
  if (phase === "results" && quiz) {
    const total    = quiz.qs.length;
    const answered = Object.keys(quiz.ans).length;
    const pct      = Math.round((score / total) * 100);
    const [emoji, label, color] = pct >= 80 ? ["🏆","Excellent!",GREEN] : pct >= 60 ? ["⭐","Good Job!",AMBER] : ["💪","Keep Going",ACCENT];

    return (
      <div style={{ padding:"24px 16px 100px" }}>
        <div style={{ ...card, padding:"26px 20px", textAlign:"center", marginBottom:20, background:"linear-gradient(135deg,#1e293b,#334155)", border:"none" }}>
          <div style={{ fontSize:44, marginBottom:10 }}>{emoji}</div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:"#fff", margin:"0 0 4px" }}>{label}</h2>
          <p style={{ color:"#94a3b8", margin:"0 0 22px", fontSize:14 }}>Quiz complete!</p>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:96, height:96, borderRadius:"50%", background:`${color}20`, border:`3px solid ${color}`, marginBottom:22 }}>
            <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color }}>{pct}%</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            {[[score,"Correct",GREEN],[answered-score,"Wrong",RED],[total-answered,"Skipped",AMBER]].map(([v,l,c]) => (
              <div key={l} style={{ background:"rgba(255,255,255,0.07)", borderRadius:10, padding:"12px 8px" }}>
                <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:c }}>{v}</div>
                <div style={{ fontSize:11, color:"#94a3b8", fontWeight:500, marginTop:3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
          <Btn full onClick={() => { setPhase("setup"); setQuiz(null); setTL(null); }} icon={<ArrowLeft size={15}/>}>New Quiz</Btn>
          <Btn full variant="secondary" onClick={() => { setQuiz(q => ({...q, cur:0, ans:{}})); if(cfg.timed) setTL(quiz.qs.length*60); setPhase("running"); }}>Retry</Btn>
        </div>

        <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:"#0f172a", margin:"0 0 14px" }}>Review</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {quiz.qs.map((q, i) => {
            const ua = quiz.ans[i];
            const ok = ua === q.ans;
            const sk = ua === undefined;
            return (
              <div key={q.id} style={{ ...card, padding:"13px 14px", borderLeft:`3px solid ${sk?AMBER:ok?GREEN:RED}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:10, alignItems:"flex-start" }}>
                  <p style={{ fontSize:13, color:"#0f172a", margin:0, flex:1, lineHeight:1.5 }}>{q.q}</p>
                  <span style={{ fontSize:16, flexShrink:0 }}>{sk?"⏭":ok?"✅":"❌"}</span>
                </div>
                {!sk && !ok && <div style={{ fontSize:12, color:GREEN, marginTop:6, fontWeight:500 }}>✓ {q.opts[q.ans]}</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

/* ═══════════════════════════════════════════
   AUTH PAGE
═══════════════════════════════════════════ */

function AuthPage({ onLogin, mode, setMode }) {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const isLogin = mode === "login";

  const submit = () => {
    if (!email.trim()) return;
    onLogin(email.trim(), name.trim() || email.split("@")[0]);
  };

  const inp = { width:"100%", padding:"11px 14px", border:"1.5px solid #e2e8f0", borderRadius:10, fontFamily:"inherit", fontSize:14, outline:"none", boxSizing:"border-box" };

  return (
    <div style={{ padding:"24px 16px 40px", display:"flex", flexDirection:"column", justifyContent:"center", minHeight:"80vh" }}>
      <div style={{ maxWidth:400, margin:"0 auto", width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:52, height:52, background:`linear-gradient(135deg,${ACCENT},#818cf8)`, borderRadius:14, display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
            <BookOpen size={22} color="#fff"/>
          </div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:"#0f172a", margin:"0 0 6px" }}>
            {isLogin ? "Welcome Back" : "Get Started Free"}
          </h1>
          <p style={{ color:"#64748b", fontSize:14, margin:0 }}>
            {isLogin ? "Sign in to track your progress" : "Join thousands of students"}
          </p>
        </div>

        <div style={{ ...card, padding:"26px 22px" }}>
          {!isLogin && (
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:700, color:"#64748b", letterSpacing:"0.07em", display:"block", marginBottom:6 }}>FULL NAME</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inp}/>
            </div>
          )}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"#64748b", letterSpacing:"0.07em", display:"block", marginBottom:6 }}>EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inp}/>
          </div>
          <div style={{ marginBottom:22 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"#64748b", letterSpacing:"0.07em", display:"block", marginBottom:6 }}>PASSWORD</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" style={inp}/>
          </div>
          <Btn full onClick={submit}>{isLogin ? "Sign In" : "Create Account"}</Btn>

          <div style={{ textAlign:"center", marginTop:18, fontSize:13, color:"#64748b" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setMode(isLogin ? "signup" : "login")}
              style={{ background:"none", border:"none", color:ACCENT, fontWeight:700, cursor:"pointer", fontFamily:"inherit", fontSize:13 }}>
              {isLogin ? "Sign up free" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROFILE PAGE
═══════════════════════════════════════════ */

function ProfilePage({ user, onLogout, questions, setPage }) {
  const [tab, setTab] = useState("overview");
  const bookmarked    = questions.filter(q => q.bookmarked);

  if (!user) return (
    <div style={{ padding:"60px 20px", textAlign:"center" }}>
      <div style={{ fontSize:52, marginBottom:16, opacity:.3 }}>👤</div>
      <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"#0f172a", margin:"0 0 8px" }}>Not signed in</h2>
      <p style={{ color:"#64748b", fontSize:14, margin:"0 0 22px" }}>Sign in to track your progress and bookmarks</p>
      <Btn onClick={() => setPage("auth")}>Sign In</Btn>
    </div>
  );

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <div style={{ ...card, padding:"22px", marginBottom:18, background:"linear-gradient(135deg,#1e293b,#334155)", border:"none" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:52, height:52, borderRadius:"50%", background:`linear-gradient(135deg,${ACCENT},#818cf8)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:"#fff", fontWeight:700, flexShrink:0 }}>
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:"#fff", margin:"0 0 3px" }}>{user.name}</h2>
            <p style={{ color:"#94a3b8", fontSize:13, margin:0 }}>{user.email}</p>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
        {[[bookmarked.length,"Bookmarks","🔖",AMBER],[3,"Quizzes","⚡",ACCENT],["72%","Avg Score","🏆",GREEN]].map(([v,l,i,c]) => (
          <div key={l} style={{ ...card, padding:"14px 10px", textAlign:"center" }}>
            <div style={{ fontSize:20, marginBottom:4 }}>{i}</div>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:c }}>{v}</div>
            <div style={{ fontSize:10, color:"#94a3b8", fontWeight:600, marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, marginBottom:18, background:"#f1f5f9", borderRadius:10, padding:4 }}>
        {["overview","bookmarks"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:"9px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:600, background:tab===t?"#fff":"transparent", color:tab===t?"#0f172a":"#64748b", boxShadow:tab===t?"0 1px 3px rgba(0,0,0,0.08)":"none", textTransform:"capitalize", transition:"all .15s" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ ...card, padding:"18px" }}>
            <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:16, color:"#0f172a", margin:"0 0 14px" }}>Recent Activity</h3>
            {[
              { action:"Completed Physics Quiz", detail:"Score: 8/10", time:"2 hours ago", icon:"⚡" },
              { action:"Viewed KCET 2023 Papers", detail:"3 papers",   time:"Yesterday",   icon:"📄" },
              { action:"Saved 3 questions",       detail:"Chemistry",  time:"2 days ago",  icon:"🔖" },
            ].map((a, i) => (
              <div key={i} style={{ display:"flex", gap:12, alignItems:"center", padding:"10px 0", borderBottom:i<2?"1px solid #f1f5f9":"none" }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{a.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:"#0f172a" }}>{a.action}</div>
                  <div style={{ fontSize:12, color:"#94a3b8" }}>{a.time}</div>
                </div>
                <Chip color={GREEN}>{a.detail}</Chip>
              </div>
            ))}
          </div>
          <Btn full variant="ghost" icon={<LogOut size={15}/>} onClick={onLogout}>
            <span style={{ color:"#ef4444", fontWeight:600 }}>Sign Out</span>
          </Btn>
        </div>
      )}

      {tab === "bookmarks" && (
        bookmarked.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px 20px", color:"#94a3b8" }}>
            <Bookmark size={36} strokeWidth={1} style={{ marginBottom:12, opacity:.4 }}/>
            <div style={{ fontSize:15, fontWeight:500, color:"#64748b" }}>No saved questions yet</div>
            <div style={{ fontSize:13, marginTop:6 }}>Tap "Save" on any question in the Question Bank.</div>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {bookmarked.map(q => {
              const s = SUBJECTS.find(x => x.id === q.sid);
              return (
                <div key={q.id} style={{ ...card, padding:"14px" }}>
                  <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                    <Chip color={s?.color}>{s?.name}</Chip>
                    <DiffChip d={q.diff}/>
                  </div>
                  <p style={{ fontSize:13, color:"#0f172a", margin:0, lineHeight:1.6 }}>{q.q}</p>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════ */

export default function YourGuideApp() {
  const [page,      setPage]      = useState("home");
  const [user,      setUser]      = useState(null);
  const [authMode,  setAuthMode]  = useState("login");
  const [questions, setQuestions] = useState(RAW_QUESTIONS.map(q => ({ ...q, bookmarked:false })));
  const [toast,     setToast]     = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleLogin = (email, name) => {
    setUser({ email, name });
    setPage("home");
    showToast(`Welcome, ${name}! 🎉`);
  };

  const handleLogout = () => {
    setUser(null);
    setPage("home");
    showToast("Signed out successfully");
  };

  const toggleBookmark = (id) => {
    const q = questions.find(x => x.id === id);
    setQuestions(qs => qs.map(x => x.id === id ? { ...x, bookmarked:!x.bookmarked } : x));
    showToast(q?.bookmarked ? "Bookmark removed" : "Question saved! 🔖");
  };

  const renderPage = () => {
    switch (page) {
      case "home":    return <HomePage setPage={setPage} user={user}/>;
      case "papers":  return <PapersPage/>;
      case "qbank":   return <QBankPage questions={questions} toggleBookmark={toggleBookmark}/>;
      case "quiz":    return <QuizPage questions={questions}/>;
      case "auth":    return <AuthPage onLogin={handleLogin} mode={authMode} setMode={setAuthMode}/>;
      case "profile": return <ProfilePage user={user} onLogout={handleLogout} questions={questions} setPage={setPage}/>;
      default:        return <HomePage setPage={setPage} user={user}/>;
    }
  };

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'DM Sans',system-ui,sans-serif", background:"#f8f9fc", maxWidth:640, margin:"0 auto", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing:border-box; }
        input:focus { border-color:${ACCENT} !important; box-shadow:0 0 0 3px ${ACCENT}18 !important; }
        ::-webkit-scrollbar { width:3px; height:3px; }
        ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:10px; }
      `}</style>

      <NavBar page={page} setPage={setPage} user={user}/>
      <main>{renderPage()}</main>

      {toast && (
        <div style={{ position:"fixed", bottom:76, left:"50%", transform:"translateX(-50%)", background:"#1e293b", color:"#fff", padding:"11px 20px", borderRadius:100, fontSize:13, fontWeight:500, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", zIndex:200, whiteSpace:"nowrap", animation:"fadeIn .2s ease" }}>
          {toast}
        </div>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  );
}

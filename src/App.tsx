import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import logoUrl from '@/assets/web3davao-lite.png'
import { useReveal } from '@/hooks/useReveal'

// ---------- Tweakable defaults ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#ff2d8a", "#ff5e3a", "#7a1bff"],
  "heroVariant": "fluid",
  "motion": true,
  "density": "comfortable",
  "grain": true
}/*EDITMODE-END*/;

const PALETTES = {
  sunset:   ["#ff2d8a", "#ff5e3a", "#7a1bff"],
  magenta:  ["#ff1f6f", "#ff7ac0", "#3a0a4a"],
  cyber:    ["#00e5ff", "#ff2d8a", "#7a1bff"],
  emerald:  ["#22d68a", "#ff2d8a", "#0b2e2a"]
};

// ---------- Brand mark (inline so it scales + can flip color) ----------
function Mark({ size = 40, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 100 110" width={size} height={size * 1.1} fill={color} aria-label="web3 Davao">
      <path d="M14 4 H86 a10 10 0 0 1 10 10 v18 a8 8 0 0 1 -8 8 H40 a4 4 0 0 0 -4 4 v6 a4 4 0 0 0 4 4 h28 a8 8 0 0 1 8 8 v6 a8 8 0 0 1 -8 8 H22 a8 8 0 0 1 -8 -8 V14 a10 10 0 0 1 0 -10z M14 60 H58 a8 8 0 0 1 8 8 v6 a4 4 0 0 0 4 4 h16 a8 8 0 0 1 8 8 v10 a10 10 0 0 1 -10 10 H14 a10 10 0 0 1 -10 -10 V70 a10 10 0 0 1 10 -10z" opacity="0"/>
      {/* Outer hex outline */}
      <path d="M50 2 L94 22 V72 L62 92 V62 L50 56 L38 62 V92 L6 72 V22 Z" fill="none" stroke={color} strokeWidth="6" strokeLinejoin="round"/>
      {/* Inner "8" arms */}
      <path d="M22 24 H72 a6 6 0 0 1 6 6 v6 a6 6 0 0 1 -6 6 H40 a4 4 0 0 0 0 8 H64 a6 6 0 0 1 6 6 v6 a6 6 0 0 1 -6 6 H22 a4 4 0 0 0 0 0 V24 z" fill={color} opacity="0"/>
    </svg>
  );
}

// Real logo from asset (falls back to mark if image missing)
function Logo({ height = 36, invert = true }: { height?: number; invert?: boolean }) {
  const [broken, setBroken] = useState(false)
  if (broken) {
    return <Mark size={height} color="var(--ink)" />
  }
  return (
    <img
      src={logoUrl}
      alt="web3 Davao"
      onError={() => setBroken(true)}
      style={
        {
          height,
          width: 'auto',
          filter: invert ? 'invert(1)' : 'none',
          display: 'block',
        } satisfies CSSProperties
      }
    />
  )
}

// ---------- Fluid blob (CSS only, animated radial gradients) ----------
function FluidBlob({ palette, motion }: { palette: string[]; motion: boolean }) {
  const [c1, c2, c3] = palette;
  return (
    <div className={`blob-wrap ${motion ? "blob-anim" : ""}`} aria-hidden="true">
      <div className="blob b1" style={{ background: `radial-gradient(60% 60% at 50% 50%, ${c1} 0%, ${c1}00 70%)` }} />
      <div className="blob b2" style={{ background: `radial-gradient(60% 60% at 50% 50%, ${c2} 0%, ${c2}00 70%)` }} />
      <div className="blob b3" style={{ background: `radial-gradient(60% 60% at 50% 50%, ${c3} 0%, ${c3}00 70%)` }} />
      <div className="blob-shine" />
    </div>
  );
}

// ---------- Davao skyline silhouette (stylized, original) ----------
function Skyline() {
  return (
    <svg viewBox="0 0 1200 200" className="skyline" preserveAspectRatio="none" aria-hidden="true">
      <path fill="#000" d="
        M0 200 V120
        L40 120 L40 90 L80 90 L80 110 L120 110 L120 70 L160 70 L160 100 L200 100 L200 60 L240 60 L240 90 L280 90 L280 50 L330 50 L340 30 L360 50 L400 50 L400 80 L440 80 L440 60 L500 60 L500 95 L560 95 L560 70 L610 70 L620 50 L630 70 L680 70 L680 100 L720 100 L720 75 L770 75 L770 60 L800 60 L810 40 L830 60 L860 60 L860 95 L900 95 L900 70 L940 70 L940 100 L980 100 L980 80 L1030 80 L1030 110 L1080 110 L1080 90 L1130 90 L1130 120 L1200 120 V200 Z
      "/>
      {/* tiny "lights" */}
      <g fill="#ff2d8a" opacity="0.9">
        <rect x="50" y="100" width="2" height="2"/>
        <rect x="130" y="85" width="2" height="2"/>
        <rect x="210" y="75" width="2" height="2"/>
        <rect x="340" y="65" width="2" height="2"/>
        <rect x="500" y="80" width="2" height="2"/>
        <rect x="610" y="80" width="2" height="2"/>
        <rect x="820" y="75" width="2" height="2"/>
        <rect x="1020" y="95" width="2" height="2"/>
      </g>
    </svg>
  );
}

// ---------- Scroll spy hook ----------
const NAV_SECTIONS = ["guild", "pillars", "members", "pathways", "manifesto"] as const;

const REGISTRATION_EMAILS = {
  to: "reveriontech@gmail.com",
  cc: ["rod@reveriontech.com", "hello@reveriontech.com"],
} as const;

function useScrollSpy() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const els = NAV_SECTIONS
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the entry with the largest intersection ratio
        let best: IntersectionObserverEntry | null = null;
        for (const e of entries) {
          if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) {
            best = e;
          }
        }
        if (best) setActive(best.target.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}

// ---------- Nav ----------
const NAV_ITEMS: { href: string; label: string }[] = [
  { href: "#guild",     label: "The community" },
  { href: "#pillars",   label: "What we offer" },
  { href: "#members",   label: "Builders" },
  { href: "#pathways",  label: "Pathways" },
  { href: "#manifesto", label: "Manifesto" },
];

function Nav({ onRegister }: { onRegister: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useScrollSpy();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <a href="#top" className="brand">
          <Logo height={32} />
          <span className="brand-word">web3<span className="brand-dot">·</span>davao</span>
        </a>
        <nav className="nav-links">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={active === item.href.slice(1) ? "active" : ""}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button className="btn btn-primary nav-cta" onClick={onRegister}>
          <span>Join the community</span>
          <span className="arrow">→</span>
        </button>

        {/* Hamburger toggle — visible only on mobile */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className={`hamburger-bar ${menuOpen ? "hamburger-open" : ""}`} />
        </button>
      </header>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div className="mobile-drawer" onClick={closeMenu}>
          <div className="mobile-drawer-inner" onClick={(e) => e.stopPropagation()}>
            <nav className="mobile-nav">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={active === item.href.slice(1) ? "active" : ""}
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <button className="btn btn-primary btn-lg" onClick={() => { closeMenu(); onRegister(); }} style={{ width: '100%', justifyContent: 'center' }}>
              <span>Join the community</span>
              <span className="arrow">→</span>
            </button>
            <div className="mobile-drawer-meta">
              <span>N 7.07° · E 125.61°</span>
              <span>EST. 2025</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ---------- Hero ----------
function Hero({
  palette,
  motion,
  variant,
  onRegister,
}: {
  palette: string[]
  motion: boolean
  variant: string
  onRegister: () => void
}) {
  const [c1] = palette;
  return (
    <section className="hero" id="top">
      {variant === "fluid" && <FluidBlob palette={palette} motion={motion} />}
      {variant === "skyline" && (
        <div className="hero-skyline" aria-hidden="true">
          <div className="hero-sky" style={{
            background: `linear-gradient(180deg, ${palette[2]} 0%, ${palette[0]} 55%, ${palette[1]} 100%)`
          }}/>
          <Skyline />
        </div>
      )}
      {variant === "grid" && (
        <div className="hero-grid" aria-hidden="true">
          <div className="grid-glow" style={{
            background: `radial-gradient(50% 40% at 50% 30%, ${palette[0]}55, transparent 70%)`
          }}/>
        </div>
      )}

      <div className="hero-inner">
        <div className="eyebrow">
          <span className="dot" style={{ background: c1 }} />
          <span>Community · Davao Region</span>
          <span className="eyebrow-sep">/</span>
          <span>Builders helping builders</span>
        </div>

        <div className="hero-mobile-meta">
          <span>N 7.07° · E 125.61°</span>
          <span className="meta-sep">·</span>
          <span>EST. 2025</span>
          <span className="meta-sep">·</span>
          <span>OPEN</span>
        </div>

        <h1 className="hero-title">
          Developers building<br/>
          <span className="title-grad">
            solid builders
          </span><br/>
          for Davao Region.
        </h1>

        <p className="hero-lede">
          web3 Davao is a community where developers help each other grow — sharing
          knowledge, reviewing code, and connecting builders to hackathons, training,
          blockchain education, AI (RAG & fine-tuning), and automation.
          <em> No grants for now. Just real support from people who ship.</em>
        </p>

        <div className="hero-ctas">
          <button className="btn btn-primary btn-lg" onClick={onRegister}>
            <span>Join the community</span>
            <span className="arrow">→</span>
          </button>
          <a href="#pathways" className="btn btn-ghost btn-lg">
            <span>See what we connect you to</span>
          </a>
        </div>

        <div className="hero-stats">
          <Stat n="5" label="Builder pathways" />
          <Stat n="Weekly" label="Study & office hours" />
          <Stat n="Region" label="Davao-first community" />
          <Stat n="Peer" label="Led by developers" />
        </div>
      </div>

      <div className="hero-side" aria-hidden="true">
        <div className="side-tick">N 7.07° · E 125.61°</div>
        <div className="side-tick">EST. 2025</div>
        <div className="side-tick">GUILD/OPEN</div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: ReactNode; label: ReactNode }) {
  return (
    <div className="stat">
      <div className="stat-n">{n}</div>
      <div className="stat-l">{label}</div>
    </div>
  );
}

// ---------- Guild blurb ----------
function GuildSection() {
  const headRef  = useReveal()
  const copy1Ref = useReveal<HTMLParagraphElement>()
  const copy2Ref = useReveal<HTMLParagraphElement>()
  return (
    <section className="section" id="guild">
      <div className="section-head reveal" ref={headRef}>
        <span className="kicker"><span className="kicker-bar"/> 01 — The community</span>
        <h2 className="h2">
          Builders helping builders,<br/>
          rooted in Davao.
        </h2>
      </div>
      <div className="guild-grid">
        <p className="lede reveal reveal--from-left" ref={copy1Ref}>
          web3 Davao brings together students, freelancers, agency devs, and indie
          hackers from across the Davao Region. We learn in public — smart contracts,
          wallets, AI pipelines, automation — and we help each other ship work that
          actually matters locally.
        </p>
        <p className="lede dim reveal reveal--from-right" ref={copy2Ref}>
          We do not run a grant program yet. What we do is connect you to hackathon
          opportunities, structured training, blockchain education, hands-on AI work
          (RAG and fine-tuning), and automation/orchestration practice. You bring
          curiosity and a laptop. We bring mentors, office hours, and a room full
          of people who have been where you are.
        </p>
      </div>
    </section>
  );
}

// ---------- Pillars ----------
const PILLARS = [
  {
    no: "01",
    title: "Hackathon links",
    body: "We surface regional and global hackathons worth your time, help you form teams, and prep you before demo day — so you show up ready, not scrambling.",
    tag: "hackathons"
  },
  {
    no: "02",
    title: "Builder training",
    body: "Structured sessions on shipping real projects: repos, CI, testing, deployment, and the habits that turn side projects into portfolio pieces.",
    tag: "training"
  },
  {
    no: "03",
    title: "Blockchain education",
    body: "Study halls on Solidity, wallets, L2s, and on-chain tooling. Talks recorded, notes shared openly. No gatekeeping, no fake alpha.",
    tag: "web3-edu"
  },
  {
    no: "04",
    title: "AI · RAG · fine-tuning",
    body: "Practical AI for builders: retrieval pipelines, embeddings, fine-tuning workflows, and when (and when not) to reach for a model.",
    tag: "ai-lab"
  },
  {
    no: "05",
    title: "Automation & orchestration",
    body: "Workflows, agents, and glue code that saves hours. We pair on n8n, scripts, cron jobs, and the boring automation that keeps products alive.",
    tag: "automation"
  }
];

function PillarCard({ p, delay }: { p: typeof PILLARS[number]; delay: string }) {
  const ref = useReveal<HTMLElement>(0.08)
  return (
    <article ref={ref} className={`pillar reveal reveal--scale ${delay}`}>
      <div className="pillar-top">
        <span className="pillar-no">{p.no}</span>
        <span className="pillar-tag">{p.tag}</span>
      </div>
      <h3 className="pillar-title">{p.title}</h3>
      <p className="pillar-body">{p.body}</p>
      <div className="pillar-arrow">→</div>
    </article>
  )
}

const PILLAR_DELAYS = ['', 'reveal--delay-1', 'reveal--delay-2', 'reveal--delay-3', 'reveal--delay-4']

function Pillars() {
  const headRef = useReveal()
  return (
    <section className="section" id="pillars">
      <div className="section-head reveal" ref={headRef}>
        <span className="kicker"><span className="kicker-bar"/> 02 — What members get</span>
        <h2 className="h2">Five pathways into building.</h2>
        <p className="section-sub">
          We connect you to opportunities and learning — not capital. Grants are not
          part of the program today; growing capable builders is.
        </p>
      </div>
      <div className="pillars">
        {PILLARS.map((p, i) => (
          <PillarCard key={p.no} p={p} delay={PILLAR_DELAYS[i]} />
        ))}
      </div>
    </section>
  );
}

// ---------- Member feed ----------
const MEMBERS = [
  { name: "Joaquin R.",   handle: "@jrdev",       role: "Solidity · 3y",        proj: "Tindahan", desc: "On-chain receipts for sari-sari stores. Polygon, pyth oracle.", color: 0 },
  { name: "Mela A.",      handle: "@melachain",   role: "ZK · learning",        proj: "Lakaran",  desc: "Privacy-preserving proof of attendance for hackathons.",          color: 1 },
  { name: "Dax T.",       handle: "@daxbuilds",   role: "Frontend · 5y",        proj: "Cacao",    desc: "Wallet UI kit for Tagalog & Bisaya speakers.",                    color: 2 },
  { name: "Ina P.",       handle: "@inaproof",    role: "Smart contracts · 1y", proj: "Tubig",    desc: "Local-water co-op governance contracts for two barangays.",       color: 0 },
  { name: "Rex Q.",       handle: "@rexq",        role: "Infra · 4y",           proj: "Bantayan", desc: "Indexer & graph node optimized for SEA latency.",                 color: 1 },
  { name: "Sage M.",      handle: "@sagely",      role: "Move · 2y",            proj: "Pamilya",  desc: "Multi-sig family treasuries for OFW remittances.",                color: 2 },
];

function MemberCard({ m, palette }: { m: typeof MEMBERS[number]; palette: string[] }) {
  const ref = useReveal<HTMLElement>(0.08)
  return (
    <article ref={ref} className="member reveal reveal--from-left">
      <div className="member-avatar" style={{
        background: `linear-gradient(135deg, ${palette[m.color]}, ${palette[(m.color+1)%3]})`
      }}>
        <span>{m.name.split(" ").map(s => s[0]).join("")}</span>
      </div>
      <div className="member-body">
        <div className="member-line">
          <strong>{m.name}</strong>
          <a
            href={`https://github.com/${m.handle.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="member-handle"
          >
            {m.handle}
          </a>
          <span className="member-role">{m.role}</span>
        </div>
        <div className="member-proj">
          <span className="proj-label">working on</span>
          <span className="proj-name">{m.proj}</span>
        </div>
        <p className="member-desc">{m.desc}</p>
      </div>
    </article>
  )
}

function MemberFeed({ palette }: { palette: string[] }) {
  const headRef = useReveal()
  return (
    <section className="section" id="members">
      <div className="section-head reveal" ref={headRef}>
        <span className="kicker"><span className="kicker-bar"/> 03 — The builders</span>
        <h2 className="h2">
          People learning together,<br/>
          shipping in public.
        </h2>
        <p className="section-sub">
          A sample of the kind of work happening in the community. Join by filling
          out your details — we review for intent and fit, not credentials.
        </p>
      </div>

      <div className="members">
        {MEMBERS.map((m, i) => (
          <MemberCard key={i} m={m} palette={palette} />
        ))}
      </div>
    </section>
  );
}

// ---------- Pathways (no grants) ----------
function PathwaysSection({ palette }: { palette: string[] }) {
  const headRef = useReveal()
  const copyRef = useReveal<HTMLDivElement>()
  const cardRef = useReveal<HTMLDivElement>()
  return (
    <section className="section grants-section" id="pathways">
      <div className="grants-bg" aria-hidden="true" style={{
        background: `radial-gradient(40% 60% at 80% 20%, ${palette[0]}33, transparent 70%), radial-gradient(40% 60% at 20% 80%, ${palette[2]}33, transparent 70%)`
      }}/>
      <div className="section-head reveal" ref={headRef}>
        <span className="kicker"><span className="kicker-bar"/> 04 — Pathways</span>
        <h2 className="h2">
          Doors open.<br/>
          Grants not yet.
        </h2>
      </div>

      <div className="grants-grid">
        <div className="grants-copy reveal reveal--from-left" ref={copyRef}>
          <p className="lede">
            We are not a funding body — at least not for now. web3 Davao is a connector:
            we link builders to hackathons, training cohorts, education resources, AI
            labs, and automation practice so you level up before you pitch anyone.
          </p>
          <p className="lede dim">
            When you join, tell us which pathways matter to you. We match you to events,
            study groups, and mentors inside the community. A proper backend is coming;
            today your application goes straight to the team at Reverion Tech.
          </p>
        </div>

        <div className="grants-card reveal reveal--from-right" ref={cardRef}>
          <div className="grants-card-row">
            <span>Grants</span>
            <strong>Not offered yet</strong>
          </div>
          <div className="grants-card-row">
            <span>Hackathons</span>
            <strong>Curated & linked</strong>
          </div>
          <div className="grants-card-row">
            <span>Training</span>
            <strong>Builder-focused</strong>
          </div>
          <div className="grants-card-row">
            <span>Blockchain edu</span>
            <strong>Weekly study halls</strong>
          </div>
          <div className="grants-card-row">
            <span>AI · RAG · FT</span>
            <strong>Hands-on labs</strong>
          </div>
          <div className="grants-card-row">
            <span>Automation</span>
            <strong>Workflows & agents</strong>
          </div>
        </div>
      </div>

      <div className="grants-rail" aria-hidden="true">
        <div className="grants-rail-track">
          <span>LEARN TOGETHER</span><span>·</span>
          <span>SHIP IN PUBLIC</span><span>·</span>
          <span>NO GRANTS YET</span><span>·</span>
          <span>HACKATHONS</span><span>·</span>
          <span>TRAINING</span><span>·</span>
          <span>AI · RAG · FT</span><span>·</span>
          <span>AUTOMATION</span><span>·</span>
          <span>LEARN TOGETHER</span><span>·</span>
          <span>SHIP IN PUBLIC</span><span>·</span>
          <span>NO GRANTS YET</span><span>·</span>
          <span>HACKATHONS</span><span>·</span>
          <span>TRAINING</span><span>·</span>
          <span>AI · RAG · FT</span><span>·</span>
          <span>AUTOMATION</span><span>·</span>
        </div>
      </div>
    </section>
  );
}

// ---------- Manifesto ----------
function ManifestoLine({ line, index }: { line: string; index: number }) {
  const ref = useReveal<HTMLLIElement>(0.1)
  return (
    <li ref={ref} className="reveal reveal--from-left" style={{ transitionDelay: `${index * 0.07}s` }}>
      <span className="m-no">{String(index + 1).padStart(2, "0")}</span>
      <span className="m-text">{line}</span>
    </li>
  )
}

function Manifesto() {
  const lines = [
    "We are developers first. We help each other before we pitch anything.",
    "We learn in public and we ship in public.",
    "We connect builders to hackathons, training, and education — not grants (yet).",
    "We teach blockchain, AI, and automation with honest scope and working examples.",
    "We critique each other's code before we praise each other's decks.",
    "We grow the Davao builder bench — one study hall, one demo, one pairing at a time.",
    "We document everything. The next dev in the region starts where we left off."
  ];
  const headRef = useReveal()
  return (
    <section className="section manifesto" id="manifesto">
      <div className="section-head reveal" ref={headRef}>
        <span className="kicker"><span className="kicker-bar"/> 05 — Manifesto</span>
        <h2 className="h2">Seven rules of the community.</h2>
      </div>
      <ol className="manifesto-list">
        {lines.map((l, i) => (
          <ManifestoLine key={i} line={l} index={i} />
        ))}
      </ol>
    </section>
  );
}

// ---------- Registration (multi-step) ----------
const TRACKS = [
  { id: "smart",   label: "Smart contracts",  icon: "{}" },
  { id: "front",   label: "Frontend / wallets", icon: "⌥" },
  { id: "infra",   label: "Infra / indexing", icon: "≡" },
  { id: "ai",      label: "AI / RAG / ML",    icon: "◎" },
  { id: "auto",    label: "Automation",       icon: "↻" },
  { id: "design",  label: "Design / UX",      icon: "◐" },
  { id: "learning",label: "Just learning",    icon: "?"  }
];

const PATHWAY_INTERESTS = [
  { id: "hackathons", label: "Hackathon opportunities" },
  { id: "training",   label: "Builder training" },
  { id: "blockchain", label: "Blockchain education" },
  { id: "ai",         label: "AI · RAG · fine-tuning" },
  { id: "automation", label: "Automation & orchestration" },
];

const LEVELS = [
  { id: "curious", label: "Curious", sub: "I've read the docs." },
  { id: "shipping",label: "Shipping", sub: "Code on testnet." },
  { id: "running", label: "Running", sub: "On mainnet, has users." }
];

type RegForm = {
  name: string
  email: string
  city: string
  github: string
  tracks: string[]
  pathways: string[]
  level: string
  project: string
  project_url: string
  why: string
  code_of_conduct: boolean
}

async function sendRegistration(form: RegForm) {
  const payload = {
    _subject: `web3 Davao — Join request: ${form.name}`,
    _cc: REGISTRATION_EMAILS.cc.join(","),
    _captcha: "false",
    _template: "table",
    name: form.name,
    email: form.email,
    city: form.city,
    github: form.github || "(not provided)",
    skill_tracks: form.tracks.join(", ") || "(none)",
    pathways: form.pathways.join(", ") || "(none)",
    level: form.level,
    project: form.project || "(none)",
    project_url: form.project_url || "(none)",
    why: form.why,
  }

  const res = await fetch(`https://formsubmit.co/ajax/${REGISTRATION_EMAILS.to}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error("submit_failed")
}

function RegisterModal({
  open,
  onClose,
  palette,
}: {
  open: boolean
  onClose: () => void
  palette: string[]
}) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState<RegForm>({
    name: "", email: "", city: "Davao City", github: "",
    tracks: [], pathways: [], level: "", project: "", project_url: "",
    why: "", code_of_conduct: false
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegForm, string>>>({});

  useEffect(() => {
    if (!open) {
      setTimeout(() => { setStep(0); setSubmitted(false); setSubmitting(false); setSubmitError(""); setErrors({}); }, 300);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const set = (k: keyof RegForm, v: RegForm[keyof RegForm]) => setForm((f) => ({ ...f, [k]: v }));
  const toggleTrack = (id: string) => setForm((f) => ({
    ...f,
    tracks: f.tracks.includes(id) ? f.tracks.filter((t) => t !== id) : [...f.tracks, id],
  }));
  const togglePathway = (id: string) => setForm((f) => ({
    ...f,
    pathways: f.pathways.includes(id) ? f.pathways.filter((p) => p !== id) : [...f.pathways, id],
  }));

  const validate = () => {
    const e: Partial<Record<keyof RegForm, string>> = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = "Required";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Looks off";
      if (!form.city.trim()) e.city = "Required";
    }
    if (step === 1) {
      if (form.tracks.length === 0) e.tracks = "Pick at least one";
      if (form.pathways.length === 0) e.pathways = "Pick at least one";
      if (!form.level) e.level = "Pick one";
    }
    if (step === 2) {
      if (!form.why.trim() || form.why.trim().length < 30) e.why = "At least a sentence (30+ chars)";
      if (!form.code_of_conduct) e.code_of_conduct = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 2)); };
  const back = () => setStep(s => Math.max(s - 1, 0));
  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await sendRegistration(form);
      setSubmitted(true);
    } catch {
      setSubmitError("Could not send your details. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-root" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <div className="modal-brand">
            <Logo height={22} />
            <span>Join · web3 Davao</span>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {!submitted && (
          <div className="modal-progress">
            {[0,1,2].map(i => (
              <div key={i} className={`prog ${i <= step ? "prog-on" : ""}`}>
                <span className="prog-no">{String(i+1).padStart(2,"0")}</span>
                <span className="prog-label">
                  {i === 0 ? "Who you are" : i === 1 ? "What you build" : "Why you're here"}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="modal-body">
          {submitted ? (
            <SubmittedView form={form} palette={palette} onClose={onClose}/>
          ) : (
            <>
              {step === 0 && (
                <div className="form-step">
                  <h3 className="form-h">Who you are.</h3>
                  <Field label="Full name" error={errors.name}>
                    <input className="inp" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Juan dela Cruz"/>
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input className="inp" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="juan@example.ph"/>
                  </Field>
                  <div className="row">
                    <Field label="City / municipality" error={errors.city}>
                      <select className="inp" value={form.city} onChange={e => set("city", e.target.value)}>
                        <option>Davao City</option>
                        <option>Tagum</option>
                        <option>Panabo</option>
                        <option>Mati</option>
                        <option>Digos</option>
                        <option>Samal</option>
                        <option>Other (Davao Region)</option>
                        <option>Outside the region</option>
                      </select>
                    </Field>
                    <Field label="GitHub (optional)">
                      <input className="inp" value={form.github} onChange={e => set("github", e.target.value)} placeholder="github.com/yourname"/>
                    </Field>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="form-step">
                  <h3 className="form-h">What you build.</h3>
                  <Field label="Tracks (pick any that fit)" error={errors.tracks}>
                    <div className="chips">
                      {TRACKS.map(t => (
                        <button key={t.id} type="button"
                          className={`chip ${form.tracks.includes(t.id) ? "chip-on" : ""}`}
                          onClick={() => toggleTrack(t.id)}>
                          <span className="chip-icon">{t.icon}</span>
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Pathways you want in on" error={errors.pathways}>
                    <div className="chips">
                      {PATHWAY_INTERESTS.map(p => (
                        <button key={p.id} type="button"
                          className={`chip ${form.pathways.includes(p.id) ? "chip-on" : ""}`}
                          onClick={() => togglePathway(p.id)}>
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Where you're at" error={errors.level}>
                    <div className="levels">
                      {LEVELS.map(l => (
                        <button key={l.id} type="button"
                          className={`level ${form.level === l.id ? "level-on" : ""}`}
                          onClick={() => set("level", l.id)}>
                          <div className="level-label">{l.label}</div>
                          <div className="level-sub">{l.sub}</div>
                        </button>
                      ))}
                    </div>
                  </Field>

                  <div className="row">
                    <Field label="Current project (optional)">
                      <input className="inp" value={form.project} onChange={e => set("project", e.target.value)} placeholder="Tindahan · on-chain receipts"/>
                    </Field>
                    <Field label="Link (optional)">
                      <input className="inp" value={form.project_url} onChange={e => set("project_url", e.target.value)} placeholder="github.com/... or demo URL"/>
                    </Field>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="form-step">
                  <h3 className="form-h">Why you're joining.</h3>
                  <Field label="What do you want from the community?" error={errors.why} hint="Two or three sentences. Be specific about hackathons, training, or skills you want to grow.">
                    <textarea className="inp inp-area" rows={5}
                      value={form.why} onChange={e => set("why", e.target.value)}
                      placeholder="I'm building X and want help with Y. I'd like hackathon teammates, feedback on my contracts, and to learn RAG pipelines from someone who's shipped one."/>
                    <div className="char-count">{form.why.length} chars</div>
                  </Field>

                  <label className={`check ${errors.code_of_conduct ? "check-err" : ""}`}>
                    <input type="checkbox" checked={form.code_of_conduct} onChange={e => set("code_of_conduct", e.target.checked)}/>
                    <span>I've read and agree to the <a href="#manifesto" onClick={(e) => e.preventDefault()}>community manifesto & code of conduct</a>.</span>
                  </label>

                  {submitError && <p className="field-error" style={{ textAlign: "center" }}>{submitError}</p>}
                </div>
              )}
            </>
          )}
        </div>

        {!submitted && (
          <div className="modal-foot">
            <button className="btn btn-ghost" onClick={step === 0 ? onClose : back}>
              {step === 0 ? "Cancel" : "← Back"}
            </button>
            <div className="foot-meta">Step {step + 1} of 3</div>
            {step < 2 ? (
              <button className="btn btn-primary" onClick={next}>Continue <span className="arrow">→</span></button>
            ) : (
              <button className="btn btn-primary" onClick={submit} disabled={submitting}>
                {submitting ? "Sending…" : "Submit & join"} <span className="arrow">→</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  error,
  hint,
}: {
  label: string
  children: ReactNode
  error?: string
  hint?: string
}) {
  return (
    <div className={`field ${error ? "field-err" : ""}`}>
      <label className="field-label">
        <span>{label}</span>
        {error && <span className="field-error">{error}</span>}
      </label>
      {children}
      {hint && !error && <div className="field-hint">{hint}</div>}
    </div>
  );
}

function SubmittedView({
  form,
  palette,
  onClose,
}: {
  form: RegForm
  palette: string[]
  onClose: () => void
}) {
  const [refCode] = useState(
    () => `WD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  )
  return (
    <div className="submitted">
      <div className="submitted-mark" style={{
        background: `conic-gradient(from 180deg, ${palette[0]}, ${palette[1]}, ${palette[2]}, ${palette[0]})`
      }}>
        <div className="submitted-mark-inner">
          <Logo height={56} />
        </div>
      </div>
      <h3 className="submitted-h">You're on the list, {form.name.split(" ")[0] || "builder"}.</h3>
      <p className="submitted-sub">
        Your details were sent to the web3 Davao team. We'll review and reach out at{" "}
        <strong>{form.email}</strong> with next steps — study hall invites, hackathon
        links, or a pairing based on the pathways you picked.
      </p>
      <div className="submitted-meta">
        <div>
          <span>Reference</span>
          <strong>{refCode}</strong>
        </div>
        <div><span>Status</span><strong>Received</strong></div>
        <div><span>Next</span><strong>Team follow-up</strong></div>
      </div>
      <button className="btn btn-primary btn-lg" onClick={onClose}>Close</button>
    </div>
  );
}

// ---------- Footer ----------
function Footer({ onRegister }: { onRegister: () => void }) {
  return (
    <footer className="footer">
      <div className="footer-cta">
        <h2 className="footer-h">
          Davao builds.<br/>
          <span className="title-grad">Come learn with us.</span>
        </h2>
        <button className="btn btn-primary btn-lg" onClick={onRegister}>
          <span>Join the community</span>
          <span className="arrow">→</span>
        </button>
      </div>

      <div className="footer-grid">
        <div>
          <Logo height={32}/>
          <p className="footer-small">
            A developer community for the Davao Region, Philippines.<br/>
            Peer-led. Pathway-focused. No grants — yet.
          </p>
        </div>
        <div>
          <div className="footer-title">Community</div>
          <a href="#guild">About</a>
          <a href="#pillars">What we offer</a>
          <a href="#manifesto">Manifesto</a>
        </div>
        <div>
          <div className="footer-title">Builders</div>
          <a href="#members">Examples</a>
          <a href="#pathways">Pathways</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onRegister(); }}>Join</a>
        </div>
        <div>
          <div className="footer-title">Contact</div>
          <a href="mailto:reveriontech@gmail.com">reveriontech@gmail.com</a>
          <a href="mailto:rod@reveriontech.com">rod@reveriontech.com</a>
          <a href="mailto:hello@reveriontech.com">hello@reveriontech.com</a>
        </div>
      </div>

      <div className="footer-base">
        <span>© 2026 web3 Davao · A Reverion Tech initiative</span>
        <span>N 7.07° · E 125.61°</span>
      </div>
    </footer>
  );
}

// ---------- Root ----------
type TweakState = typeof TWEAK_DEFAULTS
const TWEAKS_STORAGE = 'web3davao-tweaks'

function palettesEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((c, i) => c === b[i])
}

function useTweaks(defaults: TweakState): [
  TweakState,
  <K extends keyof TweakState>(key: K, value: TweakState[K]) => void,
] {
  const [state, setState] = useState<TweakState>(() => {
    try {
      const raw = localStorage.getItem(TWEAKS_STORAGE)
      if (!raw) return defaults
      const parsed = JSON.parse(raw) as Partial<TweakState>
      return { ...defaults, ...parsed }
    } catch {
      return defaults
    }
  })

  const setTweak = <K extends keyof TweakState>(key: K, value: TweakState[K]) => {
    setState((prev) => {
      const next = { ...prev, [key]: value }
      try {
        localStorage.setItem(TWEAKS_STORAGE, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  return [state, setTweak]
}

function TweaksPanel({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="tweaks-panel">
      <button type="button" className="tweaks-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {title}
      </button>
      {open ? <div className="tweaks-body">{children}</div> : null}
    </div>
  )
}

function TweakSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="tweak-section">
      <h4 className="tweak-section-title">{title}</h4>
      {children}
    </div>
  )
}

function TweakColor({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string[]
  options: string[][]
  onChange: (v: string[]) => void
}) {
  return (
    <div className="tweak-field">
      <div className="tweak-label">{label}</div>
      <div className="tweak-swatches">
        {options.map((pal, i) => (
          <button
            key={i}
            type="button"
            className="tweak-swatch"
            aria-label={`Palette ${i + 1}`}
            style={{ background: `linear-gradient(135deg, ${pal[0]}, ${pal[1]}, ${pal[2]})` }}
            data-active={palettesEqual(pal, value) ? true : undefined}
            onClick={() => onChange(pal)}
          />
        ))}
      </div>
    </div>
  )
}

function TweakRadio({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  const name = `tweak-${label.replace(/\s+/g, '-').toLowerCase()}`
  return (
    <div className="tweak-field">
      <div className="tweak-label">{label}</div>
      <div className="tweak-radios">
        {options.map((o) => (
          <label key={o.value} className={`tweak-opt ${value === o.value ? 'tweak-opt-on' : ''}`}>
            <input type="radio" name={name} checked={value === o.value} onChange={() => onChange(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
    </div>
  )
}

function TweakToggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="tweak-toggle">
      <span>{label}</span>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
    </label>
  )
}

export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [openReg, setOpenReg] = useState(false);

  const palette = useMemo(() => t.palette || PALETTES.sunset, [t.palette]);

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--c1", palette[0]);
    r.style.setProperty("--c2", palette[1]);
    r.style.setProperty("--c3", palette[2]);
    r.dataset.density = t.density;
    r.dataset.grain = t.grain ? "on" : "off";
  }, [palette, t.density, t.grain]);

  return (
    <div className="app">
      <Nav onRegister={() => setOpenReg(true)} />
      <Hero palette={palette} motion={t.motion} variant={t.heroVariant} onRegister={() => setOpenReg(true)} />
      <GuildSection />
      <Pillars />
      <MemberFeed palette={palette} />
      <PathwaysSection palette={palette} />
      <Manifesto />
      <Footer onRegister={() => setOpenReg(true)} />
      <RegisterModal open={openReg} onClose={() => setOpenReg(false)} palette={palette} />

      {import.meta.env.DEV && (
        <TweaksPanel title="Tweaks">
          <TweakSection title="Accent palette">
            <TweakColor
              label="Pick a palette"
              value={t.palette}
              options={[PALETTES.sunset, PALETTES.magenta, PALETTES.cyber, PALETTES.emerald]}
              onChange={(v) => setTweak("palette", v)}
            />
          </TweakSection>
          <TweakSection title="Hero">
            <TweakRadio
              label="Treatment"
              value={t.heroVariant}
              options={[
                { value: "fluid",   label: "Fluid" },
                { value: "skyline", label: "Skyline" },
                { value: "grid",    label: "Grid" }
              ]}
              onChange={(v) => setTweak("heroVariant", v)}
            />
            <TweakToggle label="Motion" value={t.motion} onChange={(v) => setTweak("motion", v)} />
          </TweakSection>
          <TweakSection title="Surface">
            <TweakRadio
              label="Density"
              value={t.density}
              options={[
                { value: "compact",    label: "Compact" },
                { value: "comfortable",label: "Comfort" }
              ]}
              onChange={(v) => setTweak("density", v)}
            />
            <TweakToggle label="Film grain" value={t.grain} onChange={(v) => setTweak("grain", v)} />
          </TweakSection>
        </TweaksPanel>
      )}
    </div>
  );
}

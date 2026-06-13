import { useMemo, useState } from "react";
import Activity from "lucide-react/dist/esm/icons/activity.js";
import ArrowDown from "lucide-react/dist/esm/icons/arrow-down.js";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right.js";
import Building2 from "lucide-react/dist/esm/icons/building-2.js";
import Check from "lucide-react/dist/esm/icons/check.js";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right.js";
import CircleDollarSign from "lucide-react/dist/esm/icons/circle-dollar-sign.js";
import ExternalLink from "lucide-react/dist/esm/icons/external-link.js";
import HeartPulse from "lucide-react/dist/esm/icons/heart-pulse.js";
import Minus from "lucide-react/dist/esm/icons/minus.js";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw.js";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check.js";
import Stethoscope from "lucide-react/dist/esm/icons/stethoscope.js";
import Users from "lucide-react/dist/esm/icons/users.js";

const MAX_BUDGET = 100;

const categories = [
  {
    id: "arv",
    short: "ARVs",
    name: "Antiretroviral Treatment",
    icon: HeartPulse,
    color: "#df5b45",
    description: "Medicines, viral-load monitoring, and treatment continuity.",
    tension: "Fast, measurable HIV impact; higher exposure to disease-specific funding shifts.",
  },
  {
    id: "chw",
    short: "Community care",
    name: "Community Health Workers",
    icon: Users,
    color: "#db9b38",
    description: "Adherence support, tracing, prevention, and links between homes and clinics.",
    tension: "Extends care beyond facilities; roles are often contract- and donor-dependent.",
  },
  {
    id: "workforce",
    short: "Workforce",
    name: "Salaries & Training",
    icon: Stethoscope,
    color: "#4b91a8",
    description: "Retain nurses, clinicians, pharmacists, and facility managers.",
    tension: "Stabilizes many services; creates recurring costs that require durable financing.",
  },
  {
    id: "infrastructure",
    short: "Clinics",
    name: "Clinic Infrastructure",
    icon: Building2,
    color: "#4f8065",
    description: "Primary care space, supply systems, records, and reliable utilities.",
    tension: "Slowest visible return; broadest foundation for long-term care.",
  },
];

const indicators = [
  { id: "hiv", name: "HIV Treatment Continuity", short: "Treatment", icon: HeartPulse },
  { id: "capacity", name: "Clinic Capacity", short: "Capacity", icon: Building2 },
  { id: "workforce", name: "Workforce Stability", short: "Workforce", icon: Users },
  { id: "resilience", name: "System Resilience", short: "Resilience", icon: ShieldCheck },
];

const indicatorMeanings = [
  {
    name: "Treatment Continuity",
    fragile: "Frequent treatment interruptions put patients at serious risk of illness, drug resistance, and onward transmission.",
    vulnerable: "Many patients still receive treatment, but missed refills and interruptions become increasingly common.",
    moderate: "Most patients continue receiving treatment, but interruptions become more likely during funding disruptions.",
    strong: "Patients can reliably collect medicine, receive monitoring, and remain connected to HIV care during disruptions.",
  },
  {
    name: "Clinic Capacity",
    fragile: "Severe shortages, overcrowding, and service interruptions prevent clinics from meeting essential patient needs.",
    vulnerable: "Clinics remain operational, but staffing shortages and service delays become increasingly common.",
    moderate: "Clinics meet most routine demand, though rising patient numbers or supply delays can strain services.",
    strong: "Clinics have enough space, supplies, and operating capacity to provide dependable HIV and primary care.",
  },
  {
    name: "Workforce Stability",
    fragile: "Vacancies, burnout, and insecure contracts leave too few health workers to provide consistent, safe care.",
    vulnerable: "Healthcare workers remain in place, but retention becomes difficult during funding uncertainty.",
    moderate: "Core teams are functioning, though turnover, workload, and uneven training continue to threaten continuity.",
    strong: "Teams are adequately staffed, trained, retained, and supported to deliver consistent care over time.",
  },
  {
    name: "System Resilience",
    fragile: "A funding, supply, or staffing shock quickly interrupts essential services because there are few buffers.",
    vulnerable: "The health system functions under normal conditions but struggles to absorb major funding shocks.",
    moderate: "The system can absorb smaller disruptions, but a major or prolonged shock still causes service losses.",
    strong: "Financing, facilities, staff, and supply systems can adapt together and sustain care through disruption.",
  },
];

const sources = [
  {
    title: "UNAIDS South Africa Country Profile",
    description:
      "Supports the South Africa HIV background, including HIV prevalence, treatment access, and country-level data.",
    url: "https://www.unaids.org/en/regionscountries/countries/southafrica",
  },
  {
    title: "The Lancet Regional Health – Africa",
    description:
      "Supports the discussion of health system fragility, sustainability, and the broader consequences of funding disruptions.",
    url: "https://www.thelancet.com/journals/lanafr/article/PIIS3050-5011(26)00020-9/fulltext",
  },
  {
    title: "AIDS Care / Taylor & Francis",
    description:
      "Supports the funding shock scenario through analysis of U.S. funding cuts, HIV service disruption, and donor dependency.",
    url: "https://www.tandfonline.com/doi/full/10.1080/09540121.2025.2564196",
  },
  {
    title: "The Open AIDS Journal",
    description:
      "Supports the community health worker category, including HIV care delivery, treatment adherence, outreach, and patient retention.",
    url: "https://openaidsjournal.com/VOLUME/20/ELOCATOR/e18746136444692/FULLTEXT/",
  },
  {
    title: "HRH2030 South Africa",
    description:
      "Supports healthcare workforce development, salaries and training, staffing capacity, and health system strengthening.",
    url: "https://hrh2030program.org/where-we-work/southafrica/",
  },
  {
    title: "Spotlight NSP",
    description:
      "Supports the analysis of South Africa’s HIV response dependence on U.S. funding and its vulnerability to donor withdrawal.",
    url: "https://www.spotlightnsp.co.za/2025/03/13/in-depth-how-much-does-our-hiv-response-depend-on-us-funding/",
  },
];

function clamp(value, min = 12, max = 92) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function calculateOutcomes(allocation) {
  const a = allocation.arv;
  const c = allocation.chw;
  const w = allocation.workforce;
  const i = allocation.infrastructure;

  return {
    hiv: clamp(30 + a * 0.72 + c * 0.32 + w * 0.12 + i * 0.08),
    capacity: clamp(27 + a * 0.08 + c * 0.24 + w * 0.34 + i * 0.55),
    workforce: clamp(31 + a * 0.02 + c * 0.18 + w * 0.65 + i * 0.18),
    resilience: clamp(24 + a * 0.08 + c * 0.28 + w * 0.39 + i * 0.5),
  };
}

function calculateShock(allocation, outcomes) {
  const externalExposure =
    allocation.arv * 0.58 +
    allocation.chw * 0.42 +
    allocation.workforce * 0.22 +
    allocation.infrastructure * 0.1;
  const protection =
    allocation.infrastructure * 0.18 +
    allocation.workforce * 0.13 +
    allocation.chw * 0.06;
  const shock = Math.max(10, externalExposure - protection);

  return {
    outcomes: {
      hiv: clamp(outcomes.hiv - shock * 0.62, 8, 90),
      capacity: clamp(outcomes.capacity - shock * 0.34, 8, 90),
      workforce: clamp(outcomes.workforce - shock * 0.4, 8, 90),
      resilience: clamp(outcomes.resilience - shock * 0.28, 8, 90),
    },
    exposure: clamp(30 + externalExposure * 0.82, 25, 88),
    severity: shock,
  };
}

function getNarrative(allocation, outcomes) {
  const system = allocation.workforce + allocation.infrastructure;
  const disease = allocation.arv + allocation.chw;
  const lowest = indicators.reduce((a, b) => (outcomes[a.id] < outcomes[b.id] ? a : b));

  if (disease - system >= 30) {
    return {
      label: "Visible gains, concentrated risk",
      text: `Treatment indicators move quickly, but ${lowest.name.toLowerCase()} remains exposed. Your portfolio would likely read well in a short donor reporting cycle.`,
    };
  }
  if (system - disease >= 30) {
    return {
      label: "Durable foundations, slower proof",
      text: `The system is better prepared to absorb pressure, but HIV treatment gains arrive less dramatically. Long-term value is harder to show in a six-month report.`,
    };
  }
  return {
    label: "A negotiated balance",
    text: `You spread risk across urgent HIV services and broader capacity. The compromise improves several indicators, but ${lowest.name.toLowerCase()} still carries the greatest pressure.`,
  };
}

function scoreLabel(score) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Moderate";
  if (score >= 40) return "Vulnerable";
  return "Fragile";
}

function scoreBand(score) {
  if (score >= 80) return "strong";
  if (score >= 60) return "moderate";
  if (score >= 40) return "vulnerable";
  return "fragile";
}

function scoreInterpretation(indicatorId, score) {
  const meaning = indicatorMeanings.find((item) => {
    if (indicatorId === "hiv") return item.name === "Treatment Continuity";
    if (indicatorId === "capacity") return item.name === "Clinic Capacity";
    if (indicatorId === "workforce") return item.name === "Workforce Stability";
    return item.name === "System Resilience";
  });

  return meaning[scoreBand(score)];
}

function exposureLabel(exposure) {
  if (exposure >= 70) return "high";
  if (exposure >= 50) return "substantial";
  return "moderate";
}

function Header({ active, setActive }) {
  const links = [
    ["context", "Context"],
    ["allocate", "Allocate"],
    ["results", "Results"],
    ["shock", "Funding shock"],
    ["reflect", "Reflect"],
    ["sources", "Sources"],
  ];

  return (
    <header className="site-header">
      <button className="brand" onClick={() => setActive("home")} aria-label="Return to introduction">
        <span>What Gets Funded?</span>
      </button>
      <nav aria-label="Project sections">
        {links.map(([id, label]) => (
          <button
            key={id}
            className={active === id ? "active" : ""}
            onClick={() => setActive(id)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="header-spacer" aria-hidden="true" />
    </header>
  );
}

function Hero({ onStart }) {
  return (
    <main className="hero page">
      <div className="hero-copy">
        <p className="kicker">An interactive funding simulation</p>
        <h1>
          What gets <em>funded?</em>
        </h1>
        <p className="hero-subtitle">HIV, donor dependency, and health system fragility in South Africa</p>
        <p className="hero-body">
          Funding does more than pay for care. It determines which problems become visible,
          measurable, and politically urgent.
        </p>
        <button className="primary-button" onClick={onStart}>
          Enter the simulation <ArrowRight size={18} />
        </button>
        <p className="role-note">
          <CircleDollarSign size={17} /> Your role: an international donor consortium allocating HIV
          funding in South Africa after a major funding reduction
        </p>
      </div>
      <div className="hero-visual" aria-label="A system of connected health funding priorities">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="center-pulse">
          <span>100</span>
          <small>points</small>
        </div>
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div className={`orbit-node node-${index + 1}`} key={category.id}>
              <Icon size={21} />
              <span>{category.short}</span>
            </div>
          );
        })}
        <div className="visual-caption">
          Every allocation strengthens one pathway while leaving another under pressure.
        </div>
      </div>
      <button className="scroll-cue" onClick={onStart} aria-label="Continue to context">
        <span>Begin with context</span>
        <ArrowDown size={17} />
      </button>
    </main>
  );
}

function Context({ onNext }) {
  return (
    <main className="page content-page">
      <section className="page-intro">
        <p className="section-number">01 / Context</p>
        <h2>One epidemic. Two funding logics.</h2>
        <p>
          South Africa carries the world’s largest HIV treatment program. Its scale reflects
          extraordinary domestic commitment and decades of external partnership, including PEPFAR.
          That success also reveals a structural question: what happens when funding is organized
          around a disease rather than the system delivering its care?
        </p>
      </section>

      <section className="context-grid">
        <article className="stat-card dark">
          <span className="stat-value">~7.8M</span>
          <h3>people living with HIV</h3>
          <p>South Africa has made treatment available at a scale unmatched anywhere else.</p>
          <small>UNAIDS country estimates, recent reporting years</small>
        </article>
        <article className="stat-card">
          <span className="stat-value">Vertical</span>
          <h3>Disease-specific funding</h3>
          <p>Moves resources toward countable outputs: tests, treatment starts, viral suppression.</p>
          <div className="mini-bar">
            <span style={{ width: "82%" }} />
          </div>
          <small>Fast visibility · narrow mandate</small>
        </article>
        <article className="stat-card">
          <span className="stat-value">Horizontal</span>
          <h3>System strengthening</h3>
          <p>Builds staff, facilities, and supply systems that support HIV and primary care together.</p>
          <div className="mini-bar green">
            <span style={{ width: "64%" }} />
          </div>
          <small>Slow visibility · broad durability</small>
        </article>
      </section>

      <section className="argument-strip">
        <span className="argument-icon"><Activity /></span>
        <div>
          <p className="kicker">The central tension</p>
          <h3>Technical success can coexist with institutional fragility.</h3>
        </div>
        <p>
          A program can save lives now and still leave clinics vulnerable to the next contract
          change, staffing gap, or donor withdrawal.
        </p>
      </section>

      <button className="primary-button page-next" onClick={onNext}>
        Take the donor’s seat <ArrowRight size={18} />
      </button>
    </main>
  );
}

function AllocationControl({ category, value, remaining, onChange }) {
  const Icon = category.icon;
  const canAdd = remaining >= 5;

  return (
    <article className="allocation-card" style={{ "--accent": category.color }}>
      <div className="allocation-card-head">
        <span className="category-icon"><Icon size={22} /></span>
        <div>
          <h3>{category.name}</h3>
          <p>{category.description}</p>
        </div>
        <strong className="allocation-value">{value}</strong>
      </div>
      <div className="allocation-input">
        <button
          onClick={() => onChange(category.id, -5)}
          disabled={value === 0}
          aria-label={`Remove 5 points from ${category.name}`}
        >
          <Minus size={17} />
        </button>
        <div className="allocation-track" aria-hidden="true">
          <span style={{ width: `${value}%` }} />
        </div>
        <button
          onClick={() => onChange(category.id, 5)}
          disabled={!canAdd}
          aria-label={`Add 5 points to ${category.name}`}
        >
          <Plus size={17} />
        </button>
      </div>
      <p className="tension-note">{category.tension}</p>
    </article>
  );
}

function IndicatorBar({ indicator, value, previous }) {
  const Icon = indicator.icon;
  const delta = previous == null ? null : value - previous;
  const category = scoreLabel(value);
  return (
    <div className="indicator">
      <div className="indicator-label">
        <span><Icon size={16} /> {indicator.name}</span>
        <strong>{value} / 100</strong>
      </div>
      <div className="indicator-track">
        <span style={{ width: `${value}%` }} />
        {previous != null && <i style={{ left: `${previous}%` }} />}
      </div>
      <div className="indicator-meta">
        <span className={`score-category category-${category.toLowerCase()}`}>{category}</span>
        {delta != null && <span className={delta < 0 ? "negative" : "positive"}>{delta > 0 ? "+" : ""}{delta} after shock</span>}
      </div>
      <p className="indicator-interpretation">{scoreInterpretation(indicator.id, value)}</p>
    </div>
  );
}

function Allocator({ allocation, setAllocation, onNext }) {
  const spent = Object.values(allocation).reduce((sum, value) => sum + value, 0);
  const remaining = MAX_BUDGET - spent;
  const outcomes = useMemo(() => calculateOutcomes(allocation), [allocation]);
  const narrative = getNarrative(allocation, outcomes);

  function update(id, amount) {
    setAllocation((current) => ({ ...current, [id]: Math.max(0, current[id] + amount) }));
  }

  return (
    <main className="page simulation-page">
      <section className="sim-heading">
        <div>
          <p className="section-number">02 / Allocation</p>
          <h2>You have 100 points. What becomes possible?</h2>
          <p>
            As an international donor consortium, allocate HIV funding in five-point increments.
            The dashboard responds after every decision.
          </p>
        </div>
        <div className={`budget-dial ${remaining === 0 ? "complete" : ""}`}>
          <span>{remaining}</span>
          <small>points left</small>
        </div>
      </section>

      <div className="simulation-layout">
        <section className="allocation-list" aria-label="Budget categories">
          {categories.map((category) => (
            <AllocationControl
              key={category.id}
              category={category}
              value={allocation[category.id]}
              remaining={remaining}
              onChange={update}
            />
          ))}
        </section>

        <aside className="live-dashboard">
          <div className="dashboard-heading">
            <div>
              <p className="kicker">Live forecast</p>
              <h3>{narrative.label}</h3>
            </div>
            <Activity size={22} />
          </div>
          <p className="dashboard-narrative">{narrative.text}</p>
          <div className="indicator-list">
            {indicators.map((indicator) => (
              <IndicatorBar key={indicator.id} indicator={indicator} value={outcomes[indicator.id]} />
            ))}
          </div>
          <div className="tradeoff">
            <strong>Trade-off</strong>
            <p>
              {allocation.arv >= Math.max(allocation.workforce, allocation.infrastructure)
                ? "Immediate treatment protection is outpacing investment in the institutions expected to sustain it."
                : "Your broad investments build capacity, but fewer points are producing immediate HIV-specific gains."}
            </p>
          </div>
        </aside>
      </div>

      <div className="allocation-footer">
        <div className="total-track">
          {categories.map((category) => (
            <span
              key={category.id}
              style={{ width: `${allocation[category.id]}%`, background: category.color }}
              title={`${category.name}: ${allocation[category.id]}`}
            />
          ))}
        </div>
        <button className="primary-button" disabled={remaining !== 0} onClick={onNext}>
          {remaining === 0 ? "Lock allocation" : `Allocate ${remaining} more points`}
          <ArrowRight size={18} />
        </button>
      </div>
    </main>
  );
}

function Results({ allocation, onNext, onRevise }) {
  const outcomes = calculateOutcomes(allocation);
  const narrative = getNarrative(allocation, outcomes);
  const strongest = indicators.reduce((a, b) => (outcomes[a.id] > outcomes[b.id] ? a : b));
  const weakest = indicators.reduce((a, b) => (outcomes[a.id] < outcomes[b.id] ? a : b));

  return (
    <main className="page content-page results-page">
      <section className="page-intro compact">
        <p className="section-number">03 / Six-month forecast</p>
        <h2>{narrative.label}</h2>
        <p>{narrative.text}</p>
      </section>

      <section className="results-grid">
        <div className="result-panel">
          <p className="kicker">Your portfolio</p>
          <div className="portfolio-chart">
            {categories.map((category) => (
              <div key={category.id}>
                <span style={{ height: `${Math.max(4, allocation[category.id] * 2.1)}px`, background: category.color }}>
                  <b>{allocation[category.id]}</b>
                </span>
                <small>{category.short}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="result-panel">
          <p className="kicker">Projected indicators</p>
          <div className="indicator-list large">
            {indicators.map((indicator) => (
              <IndicatorBar key={indicator.id} indicator={indicator} value={outcomes[indicator.id]} />
            ))}
          </div>
        </div>
      </section>

      <section className="insight-row">
        <article>
          <span className="insight-number">01</span>
          <p>Strongest signal</p>
          <h3>{strongest.name}</h3>
          <strong>{outcomes[strongest.id]} / 100</strong>
        </article>
        <article>
          <span className="insight-number">02</span>
          <p>Most exposed</p>
          <h3>{weakest.name}</h3>
          <strong>{outcomes[weakest.id]} / 100</strong>
        </article>
        <article className="insight-question">
          <span className="insight-number">?</span>
          <p>What did your dashboard make visible?</p>
          <h3>And what did it leave out?</h3>
        </article>
      </section>

      <div className="button-row">
        <button className="secondary-button" onClick={onRevise}>Revise allocation</button>
        <button className="primary-button" onClick={onNext}>
          Advance six months <ArrowRight size={18} />
        </button>
      </div>
    </main>
  );
}

function Shock({ allocation, onNext }) {
  const before = calculateOutcomes(allocation);
  const shock = calculateShock(allocation, before);
  const averageDrop = Math.round(
    indicators.reduce((sum, item) => sum + before[item.id] - shock.outcomes[item.id], 0) / indicators.length,
  );

  return (
    <main className="page shock-page">
      <div className="shock-banner">
        <p className="section-number">04 / Funding shock</p>
        <div className="shock-date">Six months later · October 2026</div>
        <h2>External donor funding is cut by 45%.</h2>
        <p>
          A major reduction in external donor funding pauses contracts and shrinks community teams.
          Medicine procurement is protected first, but clinics absorb the disruption unevenly.
        </p>
      </div>

      <section className="shock-layout">
        <div className="shock-summary">
          <span className="shock-drop">−{averageDrop}</span>
          <h3>average indicator points</h3>
          <p>
            Your portfolio’s donor exposure is <strong>{exposureLabel(shock.exposure)}</strong>.
            The shock does not erase every gain, but it reveals which gains depended on uninterrupted
            external financing.
          </p>
          <div className="exposure-meter">
            <span>Dependency exposure</span>
            <strong>{shock.exposure}%</strong>
            <div><i style={{ width: `${shock.exposure}%` }} /></div>
          </div>
        </div>
        <div className="shock-indicators">
          <div className="chart-legend">
            <span><i className="before" /> Before cut</span>
            <span><i className="after" /> After cut</span>
          </div>
          {indicators.map((indicator) => (
            <IndicatorBar
              key={indicator.id}
              indicator={indicator}
              value={shock.outcomes[indicator.id]}
              previous={before[indicator.id]}
            />
          ))}
        </div>
      </section>

      <section className="shock-lesson">
        <ShieldCheck size={28} />
        <div>
          <p className="kicker">What the shock reveals</p>
          <h3>Dependency is not the same as failure.</h3>
          <p>
            External funding enabled real, life-saving capacity. Fragility emerges when that
            capacity is financed through channels that can disappear faster than domestic systems
            can replace them.
          </p>
        </div>
      </section>

      <button className="light-button page-next" onClick={onNext}>
        Reflect on your choices <ArrowRight size={18} />
      </button>
    </main>
  );
}

function Reflection({ onNext }) {
  const prompts = [
    "Which outcome did you protect first, and why did it feel most urgent?",
    "What counted as evidence of success in your dashboard?",
    "Who carries the risk when donor-funded jobs or services disappear?",
    "Can disease-specific funding strengthen a health system without being absorbed into it?",
  ];
  const [open, setOpen] = useState(0);

  return (
    <main className="page content-page reflection-page">
      <section className="page-intro">
        <p className="section-number">05 / Reflection</p>
        <h2>The model gave you numbers.<br />The politics remain.</h2>
        <p>
          There was no perfect allocation. These questions move beyond optimization and toward
          accountability: who defines the target, who funds it, and who lives with the trade-offs?
        </p>
      </section>

      <section className="prompt-list">
        {prompts.map((prompt, index) => (
          <button
            key={prompt}
            className={open === index ? "open" : ""}
            onClick={() => setOpen(index)}
          >
            <span>0{index + 1}</span>
            <strong>{prompt}</strong>
            <ChevronRight size={20} />
            {open === index && (
              <p>
                Pause before searching for a correct answer. Notice which institutions, time
                horizons, and forms of evidence your reasoning privileges.
              </p>
            )}
          </button>
        ))}
      </section>

      <button className="primary-button page-next" onClick={onNext}>
        See the final takeaway <ArrowRight size={18} />
      </button>
    </main>
  );
}

function Takeaway({ onSources, onRestart }) {
  return (
    <main className="page takeaway-page">
      <div className="takeaway-mark">“</div>
      <p className="section-number">06 / Takeaway</p>
      <h2>Funding decisions are never only financial.</h2>
      <p className="takeaway-lead">
        They shape what health systems can see, measure, staff, sustain, and imagine.
      </p>
      <div className="takeaway-rule" />
      <p className="takeaway-body">
        South Africa’s HIV response shows the power of targeted global solidarity and the danger of
        treating that support as permanent infrastructure. The task is not to choose between saving
        lives now and building systems for later. It is to design funding that refuses to separate them.
      </p>
      <p className="takeaway-disclaimer">
        This simulation explores trade-offs and funding priorities. It does not predict exact outcomes.
      </p>
      <div className="button-row centered">
        <button className="secondary-button light" onClick={onRestart}><RotateCcw size={17} /> Run again</button>
        <button className="light-button" onClick={onSources}>How the model works <ArrowRight size={18} /></button>
      </div>
    </main>
  );
}

function Sources({ onRestart }) {
  return (
    <main className="page content-page sources-page">
      <section className="page-intro compact">
        <p className="section-number">07 / How the model works</p>
        <h2>Assumptions behind the scores</h2>
        <p>
          This is an illustrative weighted system informed by HIV programming and health systems
          literature. Each funding category contributes differently to four outcome indicators, while
          the funding shock applies larger losses to investments modeled as more dependent on external
          donor financing.
        </p>
      </section>
      <section className="model-assumptions">
        <article>
          <span>01</span>
          <h3>Weighted relationships</h3>
          <p>
            ARV funding is weighted most strongly toward near-term treatment continuity. Workforce,
            community, and clinic investments contribute more broadly to capacity and resilience.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Directional, not predictive</h3>
          <p>
            The weights express relationships described in the literature. They are not causal
            estimates, probabilities, forecasts, or a reproduction of an official budgeting model.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>No perfect portfolio</h3>
          <p>
            Scores are intentionally constrained. Every portfolio leaves some pressure in the system,
            reflecting real tensions between urgent disease-specific results and durable capacity.
          </p>
        </article>
      </section>

      <section className="score-guide">
        <div className="score-guide-heading">
          <p className="kicker">Reading the indicators</p>
          <h2>What scores mean for people and services</h2>
          <p>
            Fragile means 0–39, vulnerable means 40–59, moderate means 60–79, and strong means
            80–100. These scores are comparative signals within the simulation, not measured
            real-world performance.
          </p>
        </div>
        <div className="score-table">
          <div className="score-row score-row-head" aria-hidden="true">
            <span>Indicator</span>
            <span>Fragile · 0–39</span>
            <span>Vulnerable · 40–59</span>
            <span>Moderate · 60–79</span>
            <span>Strong · 80–100</span>
          </div>
          {indicatorMeanings.map((indicator) => (
            <article className="score-row" key={indicator.name}>
              <h3>{indicator.name}</h3>
              <div><strong>Fragile · 0–39</strong><p>{indicator.fragile}</p></div>
              <div><strong>Vulnerable · 40–59</strong><p>{indicator.vulnerable}</p></div>
              <div><strong>Moderate · 60–79</strong><p>{indicator.moderate}</p></div>
              <div><strong>Strong · 80–100</strong><p>{indicator.strong}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="source-list">
        <div className="source-heading">
          <p className="section-number">08 / Sources</p>
          <h2>Evidence behind the experience</h2>
          <p>
            These sources informed the background, simulation categories, funding shock scenario,
            and interpretation of health system outcomes.
          </p>
        </div>
        <div className="source-grid">
          {sources.map((source, index) => (
            <article className="source-card" key={source.title}>
              <span className="source-number">0{index + 1}</span>
              <h3>{source.title}</h3>
              <p>{source.description}</p>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                Open Source <ExternalLink size={16} />
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="methods-note">
        <Check size={20} />
        <p>
          <strong>Interpretive note:</strong> The simulation explores trade-offs and funding
          priorities rather than predicting exact outcomes. Recent figures vary by reporting year
          and source, and approximate values are labeled as such.
        </p>
      </section>
      <button className="primary-button page-next" onClick={onRestart}><RotateCcw size={17} /> Restart simulation</button>
    </main>
  );
}

export default function App() {
  const [active, setActive] = useState("home");
  const [allocation, setAllocation] = useState({
    arv: 25,
    chw: 25,
    workforce: 25,
    infrastructure: 25,
  });

  const navigate = (page) => {
    setActive(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    setAllocation({ arv: 25, chw: 25, workforce: 25, infrastructure: 25 });
    navigate("home");
  };

  return (
    <div className={`app theme-${active}`}>
      <Header active={active} setActive={navigate} />
      {active === "home" && <Hero onStart={() => navigate("context")} />}
      {active === "context" && <Context onNext={() => navigate("allocate")} />}
      {active === "allocate" && (
        <Allocator allocation={allocation} setAllocation={setAllocation} onNext={() => navigate("results")} />
      )}
      {active === "results" && (
        <Results allocation={allocation} onNext={() => navigate("shock")} onRevise={() => navigate("allocate")} />
      )}
      {active === "shock" && <Shock allocation={allocation} onNext={() => navigate("reflect")} />}
      {active === "reflect" && <Reflection onNext={() => navigate("takeaway")} />}
      {active === "takeaway" && <Takeaway onSources={() => navigate("sources")} onRestart={restart} />}
      {active === "sources" && <Sources onRestart={restart} />}
      <footer>
        <span>Built to question what counts as impact.</span>
      </footer>
    </div>
  );
}

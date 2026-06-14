import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Lock,
  Plus,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
  Unlock,
} from 'lucide-react'
import {
  BRAND,
  PARTNERS,
  PRICING,
  activePricing,
  daysRemaining,
  fmtDate,
  fmtUsd,
  newMemberRecord,
  type Member,
  type Partner,
} from './data'

type View = 'landing' | 'checkout' | 'dashboard' | 'admin'

const GREEN = '#1f6b4a'

export default function App() {
  const [view, setView] = useState<View>('landing')
  const [member, setMember] = useState<Member | null>(null)
  const [partners, setPartners] = useState<Partner[]>(PARTNERS)

  const go = (v: View) => {
    setView(v)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DemoBanner />
      <Header view={view} member={member} go={go} />
      <main className="flex-1">
        {view === 'landing' && (
          <Landing partners={partners} member={member} go={go} />
        )}
        {view === 'checkout' && (
          <Checkout
            onComplete={(m) => {
              setMember(m)
              go('dashboard')
            }}
            go={go}
          />
        )}
        {view === 'dashboard' && member && (
          <Dashboard member={member} partners={partners} go={go} />
        )}
        {view === 'dashboard' && !member && (
          <Landing partners={partners} member={member} go={go} />
        )}
        {view === 'admin' && (
          <Admin partners={partners} setPartners={setPartners} go={go} />
        )}
      </main>
      <Footer go={go} />
    </div>
  )
}

function DemoBanner() {
  return (
    <div className="bg-[#16201b] text-white/85 text-[13px] text-center py-2 px-4">
      <Sparkles className="inline -mt-0.5 mr-1.5" size={14} />
      Interactive prototype · sample data · the live build runs on Supabase
      Auth + Stripe (Checkout, Customer Portal, status webhook)
    </div>
  )
}

function Header({
  view,
  member,
  go,
}: {
  view: View
  member: Member | null
  go: (v: View) => void
}) {
  const link = (v: View, label: string) => (
    <button
      onClick={() => go(v)}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        view === v
          ? 'bg-[#1f6b4a]/10 text-[#1f6b4a]'
          : 'text-[#16201b]/70 hover:text-[#16201b]'
      }`}
    >
      {label}
    </button>
  )
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-[#f6f5f0]/85 border-b border-black/5">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <button
          onClick={() => go('landing')}
          className="flex items-center gap-2 font-extrabold text-lg tracking-tight"
        >
          <span
            className="grid place-items-center w-8 h-8 rounded-lg text-white"
            style={{ backgroundColor: GREEN }}
          >
            <BadgeCheck size={18} />
          </span>
          {BRAND.name}
        </button>
        <nav className="hidden sm:flex items-center gap-1">
          {link('landing', 'Home')}
          {member && link('dashboard', 'My membership')}
          {link('admin', 'Partner admin')}
        </nav>
        <div className="flex items-center gap-2">
          {member ? (
            <button
              onClick={() => go('dashboard')}
              className="flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-full text-white"
              style={{ backgroundColor: GREEN }}
            >
              <BadgeCheck size={15} /> Active
            </button>
          ) : (
            <button
              onClick={() => go('checkout')}
              className="text-sm font-semibold px-4 py-2 rounded-full text-white transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: GREEN }}
            >
              Join now
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

function Landing({
  partners,
  member,
  go,
}: {
  partners: Partner[]
  member: Member | null
  go: (v: View) => void
}) {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-16 pb-12 text-center">
        <div
          className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full mb-6"
          style={{ backgroundColor: `${GREEN}14`, color: GREEN }}
        >
          <Tag size={14} /> {activePricing.label} · {fmtUsd(activePricing.priceUsd)}/year
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] max-w-3xl mx-auto">
          {BRAND.tagline}
        </h1>
        <p className="mt-5 text-lg text-[#16201b]/70 max-w-xl mx-auto">
          Pay once a year. Show your digital card. Unlock member-only
          pricing at {partners.length} local partners — and counting.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => go(member ? 'dashboard' : 'checkout')}
            className="flex items-center gap-2 text-white font-semibold px-6 py-3.5 rounded-full text-lg transition-transform hover:scale-[1.03]"
            style={{ backgroundColor: GREEN }}
          >
            {member ? 'Go to my card' : 'Become a member'}
            <ArrowRight size={19} />
          </button>
          <a
            href="#partners"
            className="font-semibold px-6 py-3.5 rounded-full text-lg border border-black/10 hover:bg-black/[0.03]"
          >
            See partners
          </a>
        </div>
        <StatStrip partners={partners} />
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-black/5">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <h2 className="text-2xl font-extrabold text-center tracking-tight">
            How it works
          </h2>
          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <CreditCard size={22} />,
                t: 'Join in 60 seconds',
                d: 'One annual fee through Stripe Checkout. No app to install.',
              },
              {
                icon: <CalendarClock size={22} />,
                t: '12 months, locked in',
                d: 'Your term starts the day you pay and runs a full year — synced from your subscription.',
              },
              {
                icon: <Unlock size={22} />,
                t: 'Save everywhere',
                d: 'Show your digital card at any partner for member-only pricing.',
              },
            ].map((s) => (
              <div
                key={s.t}
                className="rounded-2xl border border-black/5 bg-[#f6f5f0] p-6"
              >
                <div
                  className="grid place-items-center w-11 h-11 rounded-xl text-white mb-4"
                  style={{ backgroundColor: GREEN }}
                >
                  {s.icon}
                </div>
                <h3 className="font-bold text-lg">{s.t}</h3>
                <p className="mt-1.5 text-[#16201b]/65">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — seasonal windows */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="text-2xl font-extrabold text-center tracking-tight">
          Membership pricing
        </h2>
        <p className="text-center text-[#16201b]/65 mt-2">
          Seasonal windows — the live rate is highlighted automatically.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PRICING.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-3xl p-7 border ${
                p.active
                  ? 'bg-white shadow-xl shadow-black/[0.06]'
                  : 'bg-[#f6f5f0] border-black/5'
              }`}
              style={p.active ? { borderColor: GREEN } : undefined}
            >
              {p.active && (
                <span
                  className="absolute -top-3 left-7 text-xs font-bold text-white px-3 py-1 rounded-full"
                  style={{ backgroundColor: GREEN }}
                >
                  LIVE RATE
                </span>
              )}
              <p className="font-semibold text-[#16201b]/70">{p.label}</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">
                  {fmtUsd(p.priceUsd)}
                </span>
                <span className="text-[#16201b]/55">/ year</span>
              </div>
              <p className="mt-3 text-[#16201b]/65 text-sm">{p.blurb}</p>
              {p.active && (
                <button
                  onClick={() => go('checkout')}
                  className="mt-5 w-full text-white font-semibold py-3 rounded-full"
                  style={{ backgroundColor: GREEN }}
                >
                  Get this rate
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Partner directory */}
      <section id="partners" className="bg-white border-t border-black/5">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Where you'll save
              </h2>
              <p className="text-[#16201b]/65 mt-1">
                Member pricing is unlocked the moment you join.
              </p>
            </div>
            <span className="text-sm text-[#16201b]/55 flex items-center gap-1.5">
              <Lock size={14} /> Prices shown unlock with membership
            </span>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {partners.map((p) => (
              <PartnerCard key={p.id} p={p} locked={!member} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-5 py-20 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight max-w-xl mx-auto">
          Join {BRAND.name} and start saving today
        </h2>
        <button
          onClick={() => go(member ? 'dashboard' : 'checkout')}
          className="mt-7 inline-flex items-center gap-2 text-white font-semibold px-7 py-4 rounded-full text-lg transition-transform hover:scale-[1.03]"
          style={{ backgroundColor: GREEN }}
        >
          {member ? 'View my membership' : `Join for ${fmtUsd(activePricing.priceUsd)}/year`}
          <ArrowRight size={19} />
        </button>
      </section>
    </div>
  )
}

function StatStrip({ partners }: { partners: Partner[] }) {
  const avgSave = useMemo(() => {
    const withPrice = partners.filter((p) => p.regularUsd > 0)
    if (!withPrice.length) return 0
    const pct =
      withPrice.reduce(
        (a, p) => a + (p.regularUsd - p.memberUsd) / p.regularUsd,
        0,
      ) / withPrice.length
    return Math.round(pct * 100)
  }, [partners])
  const stat = (n: string, l: string) => (
    <div>
      <div className="text-3xl font-extrabold tracking-tight" style={{ color: GREEN }}>
        {n}
      </div>
      <div className="text-sm text-[#16201b]/60 mt-0.5">{l}</div>
    </div>
  )
  return (
    <div className="mt-12 flex items-center justify-center gap-10 sm:gap-16">
      {stat(`${partners.length}`, 'Local partners')}
      {stat(`~${avgSave}%`, 'Avg. member savings')}
      {stat('12 mo', 'Per-member term')}
    </div>
  )
}

function PartnerCard({ p, locked }: { p: Partner; locked: boolean }) {
  const save = p.regularUsd > 0 ? p.regularUsd - p.memberUsd : 0
  return (
    <div className="rounded-2xl border border-black/5 bg-[#f6f5f0] p-5">
      <div className="flex items-start justify-between">
        <div className="text-3xl">{p.emoji}</div>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-black/5 text-[#16201b]/60">
          {p.category}
        </span>
      </div>
      <h3 className="mt-3 font-bold text-lg leading-tight">{p.name}</h3>
      <p className="text-sm text-[#16201b]/60 mt-1">{p.blurb}</p>
      <div className="mt-4 pt-4 border-t border-black/5 flex items-end justify-between">
        {p.regularUsd > 0 ? (
          <div>
            <div className="text-xs text-[#16201b]/45 line-through">
              {fmtUsd(p.regularUsd)} {p.unit}
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xl font-extrabold ${locked ? 'blur-[5px] select-none' : ''}`}
                style={{ color: GREEN }}
              >
                {fmtUsd(p.memberUsd)}
              </span>
              <span className="text-xs text-[#16201b]/55">{p.unit}</span>
            </div>
          </div>
        ) : (
          <div
            className={`text-xl font-extrabold ${locked ? 'blur-[5px] select-none' : ''}`}
            style={{ color: GREEN }}
          >
            {p.unit}
          </div>
        )}
        {save > 0 && (
          <span
            className="text-xs font-bold px-2 py-1 rounded-full"
            style={{ backgroundColor: `${GREEN}14`, color: GREEN }}
          >
            Save {fmtUsd(save)}
          </span>
        )}
      </div>
    </div>
  )
}

function Checkout({
  onComplete,
  go,
}: {
  onComplete: (m: Member) => void
  go: (v: View) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const valid = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email)

  const pay = () => {
    if (!valid || submitting) return
    setSubmitting(true)
    // Simulates the round-trip: Stripe Checkout -> webhook flips the
    // member's status to 'active' in Supabase -> app reads it back.
    setTimeout(() => {
      onComplete(newMemberRecord(name.trim(), email.trim()))
    }, 1100)
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-12 grid lg:grid-cols-2 gap-8">
      {/* Order summary */}
      <div className="order-2 lg:order-1">
        <button
          onClick={() => go('landing')}
          className="text-sm text-[#16201b]/55 hover:text-[#16201b] mb-4"
        >
          ← Back
        </button>
        <div className="rounded-3xl bg-white border border-black/5 shadow-xl shadow-black/[0.05] p-7">
          <h2 className="text-xl font-extrabold tracking-tight">
            {BRAND.name} annual membership
          </h2>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-[#16201b]/70">{activePricing.label}</span>
            <span className="font-bold">{fmtUsd(activePricing.priceUsd)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-[#16201b]/55">
            <span>Term</span>
            <span>12 months from today</span>
          </div>
          <div className="mt-5 pt-5 border-t border-black/5 flex items-center justify-between">
            <span className="font-bold text-lg">Due today</span>
            <span className="font-extrabold text-2xl" style={{ color: GREEN }}>
              {fmtUsd(activePricing.priceUsd)}
            </span>
          </div>
          <ul className="mt-6 space-y-2.5">
            {[
              'Member-only pricing at every partner',
              'Digital membership card',
              'Auto-renews — cancel anytime in the portal',
            ].map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-[#16201b]/75">
                <CheckCircle2 size={17} style={{ color: GREEN }} /> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Payment form (visual only) */}
      <div className="order-1 lg:order-2">
        <div className="rounded-3xl bg-white border border-black/5 shadow-xl shadow-black/[0.05] p-7">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Payment</h3>
            <span className="text-xs text-[#16201b]/45 flex items-center gap-1">
              <ShieldCheck size={14} /> Stripe
            </span>
          </div>
          <div className="mt-5 space-y-3.5">
            <Field label="Full name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Avery"
                className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 outline-none focus:border-[#1f6b4a]"
              />
            </Field>
            <Field label="Email">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 outline-none focus:border-[#1f6b4a]"
              />
            </Field>
            <Field label="Card details">
              <div className="rounded-xl border border-black/10 px-3.5 py-2.5 text-[#16201b]/45 flex items-center justify-between">
                <span>4242 4242 4242 4242</span>
                <span className="text-sm">12/34 · 123</span>
              </div>
            </Field>
          </div>
          <button
            onClick={pay}
            disabled={!valid || submitting}
            className="mt-6 w-full text-white font-semibold py-3.5 rounded-full text-lg disabled:opacity-40 transition-transform enabled:hover:scale-[1.02]"
            style={{ backgroundColor: GREEN }}
          >
            {submitting
              ? 'Confirming…'
              : `Pay ${fmtUsd(activePricing.priceUsd)} & activate`}
          </button>
          <p className="mt-3 text-xs text-center text-[#16201b]/45">
            Demo checkout — no card is charged.
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#16201b]/70">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

function Dashboard({
  member,
  partners,
  go,
}: {
  member: Member
  partners: Partner[]
  go: (v: View) => void
}) {
  const left = daysRemaining(member.termEndISO)
  const pct = Math.min(100, Math.max(0, ((365 - left) / 365) * 100))
  const lifetimeSave = partners
    .filter((p) => p.regularUsd > 0)
    .reduce((a, p) => a + (p.regularUsd - p.memberUsd), 0)

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      {/* Membership card */}
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        <div
          className="rounded-3xl p-7 text-white relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${GREEN}, #0f3d29)` }}
        >
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-lg flex items-center gap-2">
              <BadgeCheck size={20} /> {BRAND.name}
            </span>
            <span className="text-xs font-semibold bg-white/15 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" /> Active
            </span>
          </div>
          <div className="mt-10">
            <div className="text-white/60 text-xs uppercase tracking-wide">
              Member
            </div>
            <div className="text-2xl font-bold">{member.name}</div>
            <div className="text-white/70 text-sm">{member.email}</div>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wide">
                Valid through
              </div>
              <div className="font-semibold">{fmtDate(member.termEndISO)}</div>
            </div>
            <div className="text-right">
              <div className="text-white/60 text-xs uppercase tracking-wide">
                Paid
              </div>
              <div className="font-semibold">
                {fmtUsd(member.pricePaidUsd)} · {member.windowId}
              </div>
            </div>
          </div>
        </div>

        {/* Term + portal */}
        <div className="rounded-3xl bg-white border border-black/5 p-7 flex flex-col">
          <div className="flex items-center gap-2 text-[#16201b]/70 font-semibold">
            <CalendarClock size={18} /> Your 12-month term
          </div>
          <div className="mt-4 text-4xl font-extrabold tracking-tight">
            {left}{' '}
            <span className="text-lg font-semibold text-[#16201b]/50">
              days left
            </span>
          </div>
          <div className="mt-4 h-2.5 rounded-full bg-black/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, backgroundColor: GREEN }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-[#16201b]/50">
            <span>{fmtDate(member.termStartISO)}</span>
            <span>{fmtDate(member.termEndISO)}</span>
          </div>
          <button
            className="mt-auto pt-5 text-sm font-semibold flex items-center gap-1.5"
            style={{ color: GREEN }}
          >
            <CreditCard size={15} /> Manage subscription in Stripe portal →
          </button>
        </div>
      </div>

      {/* Savings tally */}
      <div className="mt-6 rounded-2xl bg-white border border-black/5 p-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div
            className="grid place-items-center w-11 h-11 rounded-xl text-white"
            style={{ backgroundColor: GREEN }}
          >
            <Tag size={20} />
          </div>
          <div>
            <div className="font-bold">Member pricing unlocked</div>
            <div className="text-sm text-[#16201b]/60">
              Up to {fmtUsd(lifetimeSave)} saved across one visit to every partner.
            </div>
          </div>
        </div>
        <button
          onClick={() => go('landing')}
          className="text-sm font-semibold px-4 py-2 rounded-full border border-black/10 hover:bg-black/[0.03]"
        >
          Browse partners
        </button>
      </div>

      {/* Unlocked partners */}
      <h2 className="mt-10 text-xl font-extrabold tracking-tight flex items-center gap-2">
        <Unlock size={20} style={{ color: GREEN }} /> Your member pricing
      </h2>
      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {partners.map((p) => (
          <PartnerCard key={p.id} p={p} locked={false} />
        ))}
      </div>
    </div>
  )
}

function Admin({
  partners,
  setPartners,
  go,
}: {
  partners: Partner[]
  setPartners: (p: Partner[]) => void
  go: (v: View) => void
}) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [regular, setRegular] = useState('')
  const [memberPrice, setMemberPrice] = useState('')
  const [unit, setUnit] = useState('')
  const [added, setAdded] = useState<string | null>(null)

  const valid = name.trim() && category.trim() && unit.trim()

  const add = () => {
    if (!valid) return
    const p: Partner = {
      id: `new-${Date.now()}`,
      name: name.trim(),
      category: category.trim(),
      blurb: 'Newly added partner.',
      regularUsd: Number(regular) || 0,
      memberUsd: Number(memberPrice) || 0,
      unit: unit.trim(),
      emoji: '🏪',
    }
    setPartners([p, ...partners])
    setAdded(p.name)
    setName('')
    setCategory('')
    setRegular('')
    setMemberPrice('')
    setUnit('')
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <div className="flex items-center gap-2 text-[#16201b]/60 text-sm font-semibold">
        <Store size={16} /> Partner admin
      </div>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
        Manage partners
      </h1>
      <p className="text-[#16201b]/60 mt-1">
        Add a business and set its member-only pricing. In production this
        writes to the <code className="text-sm">partners</code> table in
        Supabase.
      </p>

      <div className="mt-8 grid lg:grid-cols-[1fr_1.3fr] gap-7">
        {/* Add form */}
        <div className="rounded-3xl bg-white border border-black/5 p-6 h-fit">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Plus size={18} style={{ color: GREEN }} /> Add a partner
          </h3>
          <div className="mt-4 space-y-3">
            <Field label="Business name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 outline-none focus:border-[#1f6b4a]"
                placeholder="Lakeside Diner"
              />
            </Field>
            <Field label="Category">
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 outline-none focus:border-[#1f6b4a]"
                placeholder="Restaurant"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Regular ($)">
                <input
                  value={regular}
                  onChange={(e) => setRegular(e.target.value)}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 outline-none focus:border-[#1f6b4a]"
                  placeholder="20"
                />
              </Field>
              <Field label="Member ($)">
                <input
                  value={memberPrice}
                  onChange={(e) => setMemberPrice(e.target.value)}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 outline-none focus:border-[#1f6b4a]"
                  placeholder="14"
                />
              </Field>
            </div>
            <Field label="Unit / offer">
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 outline-none focus:border-[#1f6b4a]"
                placeholder="per entrée or '15% off'"
              />
            </Field>
          </div>
          <button
            onClick={add}
            disabled={!valid}
            className="mt-5 w-full text-white font-semibold py-3 rounded-full disabled:opacity-40"
            style={{ backgroundColor: GREEN }}
          >
            Add partner
          </button>
          {added && (
            <p
              className="mt-3 text-sm flex items-center gap-1.5"
              style={{ color: GREEN }}
            >
              <CheckCircle2 size={16} /> Added “{added}” to the directory.
            </p>
          )}
        </div>

        {/* Partner table */}
        <div className="rounded-3xl bg-white border border-black/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5 font-bold flex items-center justify-between">
            <span>Partners</span>
            <span className="text-sm font-medium text-[#16201b]/50">
              {partners.length} total
            </span>
          </div>
          <div className="divide-y divide-black/5 max-h-[28rem] overflow-auto">
            {partners.map((p) => (
              <div key={p.id} className="px-6 py-3.5 flex items-center gap-3">
                <span className="text-xl">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{p.name}</div>
                  <div className="text-xs text-[#16201b]/50">{p.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm" style={{ color: GREEN }}>
                    {p.regularUsd > 0 ? fmtUsd(p.memberUsd) : p.unit}
                  </div>
                  {p.regularUsd > 0 && (
                    <div className="text-xs text-[#16201b]/45 line-through">
                      {fmtUsd(p.regularUsd)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => go('landing')}
        className="mt-8 text-sm font-semibold"
        style={{ color: GREEN }}
      >
        ← Back to site
      </button>
    </div>
  )
}

function Footer({ go }: { go: (v: View) => void }) {
  return (
    <footer className="bg-[#16201b] text-white/70 mt-auto">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-white">
          <BadgeCheck size={18} /> {BRAND.name}
        </div>
        <div className="flex items-center gap-5 text-sm">
          <button onClick={() => go('landing')} className="hover:text-white">
            Home
          </button>
          <button onClick={() => go('checkout')} className="hover:text-white">
            Join
          </button>
          <button onClick={() => go('admin')} className="hover:text-white">
            Partner admin
          </button>
        </div>
        <p className="text-xs text-white/40">
          Prototype · React + Vite + Tailwind · Supabase + Stripe in production
        </p>
      </div>
    </footer>
  )
}

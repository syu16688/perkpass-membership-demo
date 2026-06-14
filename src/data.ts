// Mock data for the PerkPass demo. In production these rows live in
// Supabase (partners, members, subscriptions) and the member's status is
// kept in sync by the Stripe webhook. For a static demo we hard-code a
// realistic slice so the whole flow is clickable without a backend.

export const BRAND = {
  name: 'PerkPass',
  tagline: 'One membership. Member-only pricing all over town.',
}

// Seasonal "intro vs. repeat" pricing windows — a real requirement from
// the brief. The active window is decided by today's date; the UI badges
// whichever one is live so members see the right number.
export type PricingWindow = {
  id: 'intro' | 'repeat'
  label: string
  blurb: string
  priceUsd: number
  active: boolean
}

// Intro window runs Jan–Jun (new-member acquisition); repeat/renewal
// pricing runs the rest of the year. Computed once at load.
const month = new Date().getMonth() // 0 = Jan
const introActive = month <= 5

export const PRICING: PricingWindow[] = [
  {
    id: 'intro',
    label: 'Intro — first year',
    blurb: 'New-member welcome rate. Locked in for your first 12 months.',
    priceUsd: 79,
    active: introActive,
  },
  {
    id: 'repeat',
    label: 'Renewal — returning members',
    blurb: 'What you pay when your annual term renews.',
    priceUsd: 99,
    active: !introActive,
  },
]

export const activePricing = PRICING.find((p) => p.active)!

export type Partner = {
  id: string
  name: string
  category: string
  blurb: string
  regularUsd: number
  memberUsd: number
  unit: string
  emoji: string
}

export const PARTNERS: Partner[] = [
  {
    id: 'p1',
    name: 'Riverbend Coffee Roasters',
    category: 'Café',
    blurb: 'Single-origin pour-overs and house-roasted beans.',
    regularUsd: 6,
    memberUsd: 4,
    unit: 'per drink',
    emoji: '☕',
  },
  {
    id: 'p2',
    name: 'Summit Cycle Works',
    category: 'Bike shop',
    blurb: 'Full tune-ups, fittings, and trail rentals.',
    regularUsd: 90,
    memberUsd: 65,
    unit: 'tune-up',
    emoji: '🚲',
  },
  {
    id: 'p3',
    name: 'Maple & Vine Bistro',
    category: 'Restaurant',
    blurb: 'Seasonal farm-to-table dinners.',
    regularUsd: 0,
    memberUsd: 0,
    unit: '15% off the check',
    emoji: '🍽️',
  },
  {
    id: 'p4',
    name: 'Clearwater Yoga Studio',
    category: 'Fitness',
    blurb: 'Heated vinyasa, restorative, and beginner flows.',
    regularUsd: 22,
    memberUsd: 14,
    unit: 'drop-in class',
    emoji: '🧘',
  },
  {
    id: 'p5',
    name: 'The Book Nook',
    category: 'Bookstore',
    blurb: 'Indie titles, used finds, and author nights.',
    regularUsd: 0,
    memberUsd: 0,
    unit: '10% off everything',
    emoji: '📚',
  },
  {
    id: 'p6',
    name: 'Harbor Auto Detailing',
    category: 'Auto',
    blurb: 'Hand washes and full interior+exterior details.',
    regularUsd: 150,
    memberUsd: 110,
    unit: 'full detail',
    emoji: '🚗',
  },
]

// A member record as it would arrive from Supabase after the Stripe
// webhook flips status to 'active'. termStart/termEnd are the per-member
// 12-month window derived from the Stripe subscription's current period.
export type Member = {
  name: string
  email: string
  status: 'active' | 'inactive'
  termStartISO: string
  termEndISO: string
  pricePaidUsd: number
  windowId: 'intro' | 'repeat'
}

export function newMemberRecord(name: string, email: string): Member {
  const start = new Date()
  const end = new Date(start)
  end.setFullYear(end.getFullYear() + 1)
  return {
    name,
    email,
    status: 'active',
    termStartISO: start.toISOString(),
    termEndISO: end.toISOString(),
    pricePaidUsd: activePricing.priceUsd,
    windowId: activePricing.id,
  }
}

export function fmtUsd(n: number): string {
  return `$${n.toFixed(n % 1 === 0 ? 0 : 2)}`
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function daysRemaining(termEndISO: string): number {
  const ms = new Date(termEndISO).getTime() - Date.now()
  return Math.max(0, Math.round(ms / 86_400_000))
}

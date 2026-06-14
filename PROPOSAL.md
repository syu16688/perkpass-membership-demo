# Upwork proposal — Job #1666

**Job:** Build a Subscription Membership App (React + Supabase + Stripe) — Spec & Designs Ready
**URL:** https://www.upwork.com/jobs/~022064814082355470478
**Live demo:** https://syu16688.github.io/perkpass-membership-demo/

---

## Cover letter (paste into Upwork)

Hi — I built you a working prototype before writing this, so you can click
instead of read:

**▶ Live demo: https://syu16688.github.io/perkpass-membership-demo/**
Try it: *Join now → checkout → your membership card + 12-month term*, and the
*Partner admin* tab to add a business and set its member price.

It's your exact stack (React + Vite + Tailwind), and I built the screens
around the four parts you flagged as the ones that need real experience:

- **Stripe → Supabase status sync** — membership only flips to "active"
  after the webhook confirms the subscription; the card, term, and unlocked
  pricing all read from that status. In the live build that's a Stripe
  webhook (`checkout.session.completed` + `customer.subscription.updated/
  deleted`) writing status to Supabase.
- **Per-member 12-month term** — derived from the subscription's current
  period, not a flat calendar year. The dashboard shows start, valid-through,
  and days remaining off that.
- **Seasonal intro vs. repeat pricing windows** — the live rate is chosen by
  date and badged automatically (you'll see "Intro — first year" highlighted).
  New members lock their rate for the term; renewals move to the repeat rate.
- **Partner admin** — a simple flow to add a business and set its member
  price (writes to the `partners` table). It's in the demo under *Partner
  admin*.

I'd treat your spec and mockups as the source of truth and match them exactly
— this demo is just to show I understand the shape and can move fast.

Two things I'd confirm before starting:
1. You mentioned Vercel for hosting — happy to deploy there (the demo is on
   GitHub Pages only to share it quickly).
2. For the Customer Portal — should members be able to change/cancel plans
   themselves, or just view status?

Happy to walk through the demo on a quick call. I can start this week.

---

## Internal notes (do NOT paste)

- Build: local interactive session (subscription pool), not the headless
  Burrow worker. ~30 min end-to-end.
- Static SPA + sample data; Supabase/Stripe are mocked in the demo (no
  secret keys in a static bundle — by design).
- Visual gate: passed (rendered cleanly, 0 console errors).
- Pricing model: job is **Hourly / INTERMEDIATE**. Suggest bidding a
  competitive hourly rate to land the first review (per the "go low first"
  rule), then raise once we have receipts.

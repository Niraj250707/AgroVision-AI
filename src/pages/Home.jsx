import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Camera,
  Check,
  ChevronRight,
  Languages,
  LogIn,
  Menu,
  ScanLine,
  ShieldCheck,
  Sprout,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const capabilityCards = [
  {
    icon: TrendingUp,
    number: "01",
    title: "Know your real net return",
    body: "Compare mandi rates, storage, transport, and net realization so you can choose the most profitable route with confidence.",
  },
  {
    icon: ScanLine,
    number: "02",
    title: "Grade before you negotiate",
    body: "Use AI-powered visual checks to assess moisture, defects, uniformity, and premium impact before every buyer meeting.",
  },
  {
    icon: Users,
    number: "03",
    title: "Sell with more leverage",
    body: "Connect with verified mills, processors, and institutions through trusted commercial workflows and payment protection.",
  },
];

const roleCards = [
  ["Farmers", "Protect your harvest value from the first quality check to final payment."],
  ["FPOs", "Aggregate lots, benchmark bids, and give every member a stronger market position."],
  ["Buyers", "Source consistent, graded produce from verified farming communities."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f3f0e8] text-soil-950">
      <header className="relative z-20 border-b border-white/10 bg-emerald-950 text-white shadow-[0_20px_50px_rgba(5,27,19,0.16)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Agrovision AI home">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e4b86d] to-[#d49a42] text-emerald-950 shadow-[0_10px_30px_rgba(212,154,66,0.35)]">
              <Sprout className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-lg font-bold leading-none tracking-tight">Agrovision AI</span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-[#e8d5a6]">Decisions that pay</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-[#dfece5] lg:flex" aria-label="Main navigation">
            <a href="#platform" className="transition-colors hover:text-[#f0d38d]">Platform</a>
            <a href="#how-it-works" className="transition-colors hover:text-[#f0d38d]">How it works</a>
            <a href="#roles" className="transition-colors hover:text-[#f0d38d]">For every role</a>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <Link to="/login?mode=signin" className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white transition-colors hover:text-[#f0d38d]">
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
            <Link to="/login?mode=signup" className="inline-flex items-center gap-2 rounded-xl bg-[#d49a42] px-4 py-2.5 text-sm font-bold text-[#081d14] shadow-[0_12px_24px_rgba(212,154,66,0.28)] transition-transform hover:-translate-y-0.5 hover:bg-[#e1b261]">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button onClick={() => setMenuOpen((open) => !open)} className="rounded-xl p-2 text-white sm:hidden" aria-label="Toggle menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-white/10 px-5 pb-5 pt-3 sm:hidden">
            <div className="flex flex-col gap-4 text-sm text-[#dfece5]">
              <a href="#platform" onClick={() => setMenuOpen(false)}>Platform</a>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
              <a href="#roles" onClick={() => setMenuOpen(false)}>For every role</a>
              <Link to="/login?mode=signin" className="border-t border-white/10 pt-4 font-semibold">Sign in</Link>
              <Link to="/login?mode=signup" className="font-bold text-[#f0d38d]">Get started <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="relative isolate overflow-hidden bg-emerald-950 text-white">
          <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2200&q=85')" }} />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(20,83,45,0.96)_0%,rgba(22,101,52,0.9)_36%,rgba(20,83,45,0.48)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(227,184,101,0.22),transparent_26%)]" />
          <div className="absolute bottom-0 left-0 right-0 -z-10 h-32 bg-gradient-to-t from-[#f3f0e8] to-transparent" />

          <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-28 pt-18 sm:pt-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pb-32 lg:pt-24">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 border border-[#e3bf8c]/35 bg-emerald-900/70 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#f3d8a4] backdrop-blur-sm rounded-full">
                <span className="h-2 w-2 rounded-full bg-[#4ade80] animate-pulse" /> India&apos;s post-harvest intelligence platform
              </div>
              <h1 className="max-w-2xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl lg:text-[5rem]">
                Sell with clarity.<br />
                <span className="text-[#f3d8a4]">Earn with confidence.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-[#dfece5] sm:text-lg">
                Agrovision turns your crop, quality, and market data into one clear decision: where to sell, when to sell, and what you will actually take home.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/login?mode=signup" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d49a42] px-5 py-3.5 text-sm font-bold text-[#081d14] shadow-[0_16px_30px_rgba(212,154,66,0.25)] transition-transform hover:-translate-y-0.5 hover:bg-[#e5b76a]">
                  Start your farm profile <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/login?mode=signin" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10">
                  Sign in to your account
                </Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#dfece5]">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#f0d38d]" /> e-NAM ready</span>
                <span className="inline-flex items-center gap-2"><Camera className="h-4 w-4 text-[#f0d38d]" /> AI quality grading</span>
                <span className="inline-flex items-center gap-2"><Languages className="h-4 w-4 text-[#f0d38d]" /> Local language support</span>
              </div>
            </div>

            <div className="flex items-end justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/6 p-4 shadow-[0_30px_70px_rgba(0,0,0,0.2)] backdrop-blur-md">
                <div className="rounded-[22px] border border-white/10 bg-emerald-900/90 p-5">
                  <div className="flex items-center justify-between text-[#dfece5]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f3d8a4]">This week</span>
                    <span className="text-[11px] rounded-full border border-emerald-500/40 bg-emerald-800/80 px-2 py-1 text-emerald-200">Live market</span>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl bg-emerald-800/80 p-4 border border-emerald-700/60">
                      <div className="flex items-center justify-between text-sm text-[#dfece5]">
                        <span>Net return</span>
                        <span className="text-[#f0d38d] font-semibold">+12.4%</span>
                      </div>
                      <div className="mt-3 font-display text-3xl font-bold text-white">₹4.81L</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-emerald-950/70 p-3 border border-emerald-800/60">
                        <div className="text-[10px] uppercase tracking-[0.14em] text-emerald-200">Grade A</div>
                        <div className="mt-2 font-display text-2xl text-white">88</div>
                      </div>
                      <div className="rounded-2xl bg-emerald-950/70 p-3 border border-emerald-800/60">
                        <div className="text-[10px] uppercase tracking-[0.14em] text-emerald-200">Premium</div>
                        <div className="mt-2 font-display text-2xl text-white">₹980</div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-[#d49a42]/35 bg-emerald-800/70 p-3 text-sm text-[#ecf8ef]">
                      Best action: dispatch to institutional buyer within 48 hours.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-16 max-w-7xl px-5 lg:px-8" aria-label="Platform results">
          <div className="grid overflow-hidden rounded-[26px] border border-[#d9d5cd] bg-white/90 shadow-[0_28px_65px_rgba(5,27,19,0.08)] backdrop-blur-sm sm:grid-cols-3">
            <div className="border-b border-[#e5e0d8] px-6 py-6 sm:border-b-0 sm:border-r"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6b6a6a]">Decision framework</p><p className="mt-2 font-display text-3xl font-bold text-emerald-950">4 ways</p><p className="mt-1 text-xs text-[#5b5651]">to compare every harvest</p></div>
            <div className="border-b border-[#e5e0d8] px-6 py-6 sm:border-b-0 sm:border-r"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6b6a6a]">Built for India</p><p className="mt-2 font-display text-3xl font-bold text-emerald-950">4 languages</p><p className="mt-1 text-xs text-[#5b5651]">English, Hindi, Marathi, Gujarati</p></div>
            <div className="px-6 py-6"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6b6a6a]">One clear outcome</p><p className="mt-2 font-display text-3xl font-bold text-emerald-950">Net profit</p><p className="mt-1 text-xs text-[#5b5651]">after real costs, not headline prices</p></div>
          </div>
        </section>

        <section id="platform" className="mx-auto max-w-7xl px-5 pb-24 pt-28 lg:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#b78237]">A better harvest decision</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-[#0b2419] sm:text-5xl">The market is complex.<br />Your next move should not be.</h2>
            <p className="mt-5 text-base leading-7 text-[#5b5651]">From the farm shed to the buyer&apos;s weighbridge, AgroVision brings the important numbers together so you can act before value leaks away.</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {capabilityCards.map(({ icon: Icon, number, title, body }) => (
              <article key={number} className="rounded-[26px] border border-[#e3dfd8] bg-white p-7 shadow-[0_22px_40px_rgba(13,36,28,0.06)] sm:p-9">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ebf5ef] text-[#1d5c44]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-xs text-[#8b827a]">{number}</span>
                </div>
                <h3 className="mt-10 font-display text-2xl font-bold text-[#1a1f1d]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5b5651]">{body}</p>
                <Link to="/login?mode=signup" className="mt-7 inline-flex items-center gap-1 text-xs font-bold text-[#123a2b] transition-colors hover:text-[#b78237]">Explore the platform <ChevronRight className="h-3.5 w-3.5" /></Link>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="border-y border-[#dfe5e1] bg-[#e9efe9]">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-24">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#b78237]">How it works</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-[#0b2419]">From uncertainty to a signed deal.</h2>
              <p className="mt-5 max-w-md text-sm leading-6 text-[#5b5651]">A practical workflow designed for real field conditions, real costs, and real people in the supply chain.</p>
              <Link to="/login?mode=signup" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0f2d21] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(15,45,33,0.18)] transition-colors hover:bg-[#163d2f]">Create your free profile <ArrowRight className="h-4 w-4 text-[#f0d38d]" /></Link>
            </div>

            <div className="space-y-0 rounded-[30px] border border-[#d9dfd6] bg-white/70 p-2">
              {[
                ["01", "Build your lot", "Add your crop, quantity, location, harvest date, and current grade."],
                ["02", "See the real math", "Compare market price, freight, storage, risk, and final net realization."],
                ["03", "Act with proof", "Grade produce, share a lot, negotiate with verified buyers, and lock the best route."]
              ].map(([step, title, body]) => (
                <div key={step} className="relative rounded-[22px] border-b border-[#e8e3dc] px-7 py-6 last:border-b-0 last:pb-3">
                  <span className="absolute left-4 top-7 flex h-7 w-7 items-center justify-center rounded-full border border-[#dfe5e1] bg-[#eff6f1] font-mono text-[9px] font-bold text-[#174a39]">{step}</span>
                  <div className="pl-10">
                    <h3 className="font-display text-xl font-bold text-[#1a1f1d]">{title}</h3>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-[#5b5651]">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="roles" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#b78237]">One connected network</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-[#0b2419]">Built for the people who move food.</h2>
            </div>
            <Link to="/login?mode=signup" className="inline-flex items-center gap-2 text-sm font-bold text-[#123a2b]">Join Agrovision <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {roleCards.map(([title, body]) => (
              <div key={title} className="rounded-[26px] border border-[#e4dfd7] bg-white p-6 shadow-[0_18px_30px_rgba(13,36,28,0.04)]">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold text-[#1d221f]">{title}</h3>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ee] text-[#1e5a46]">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-8 text-sm leading-6 text-[#5b5651]">{body}</p>
                <div className="mt-7 flex items-center gap-2 text-xs font-bold text-[#256c4e]"><Check className="h-4 w-4" /> Verified workflows</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-emerald-950 text-[#dfece5]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-display text-lg font-bold text-white">Agrovision AI</p>
            <p className="mt-1 text-emerald-300">Better information. Better decisions. Better farm economics.</p>
          </div>
          <div className="flex items-center gap-5 text-emerald-200">
            <span>e-NAM connected</span>
            <span>AGMARK workflows</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


import { useState } from 'react';
import { ChevronDown, Mic, Phone, Mail, MessageCircle, Sparkles } from 'lucide-react';
import { Card } from '../components/common/States';
import Button from '../components/common/Button';

const faqs = [
  {
    q: 'How does Agrovision AI work?',
    a: 'You enter your crop and quantity, and Agrovision compares live market prices, demand, transport cost and storage cost across nearby markets to suggest where, when, and how much to sell.',
  },
  {
    q: 'How are recommendations calculated?',
    a: 'The recommendation engine weighs expected revenue against transport, storage and other costs for each strategy — selling now, waiting, choosing another market, or splitting your quantity — and highlights the option with the best net return for your risk level.',
  },
  {
    q: 'Is the market data live?',
    a: 'In this prototype, market and price data is simulated for demonstration. The production version connects to Agmarknet, e-NAM and weather data sources in real time.',
  },
  {
    q: 'Can I track past selling decisions?',
    a: 'Yes — the My Reports page keeps a history of your past decisions with expected vs. actual returns so you can see how recommendations performed.',
  },
  {
    q: 'What if I grow more than one crop?',
    a: 'You can add multiple crops from the Crop Overview page. Switch between them to see market prices and recommendations specific to each.',
  },
];

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--color-soil-100)] last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-medium text-[var(--color-soil-950)]">{faq.q}</span>
        <ChevronDown size={18} className={`shrink-0 text-[var(--color-soil-600)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-4 text-sm text-[var(--color-soil-600)]">{faq.a}</p>}
    </div>
  );
}

export default function HelpSupport() {
  const [listening, setListening] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col items-center gap-4 bg-gradient-to-br from-[var(--color-canopy-800)] to-[var(--color-canopy-950)] text-center text-white">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-harvest-500)] text-[var(--color-canopy-950)]">
          <Sparkles size={22} />
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold">How can we help, {`Ramesh`}?</h2>
          <p className="mt-1 text-sm text-white/80">Ask a question by voice, or browse frequently asked questions below.</p>
        </div>
        <button
          onClick={() => setListening((l) => !l)}
          aria-pressed={listening}
          className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${
            listening ? 'bg-[var(--color-harvest-500)] text-[var(--color-canopy-950)]' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Mic size={16} /> {listening ? 'Listening… (demo)' : 'Tap to speak'}
        </button>
        <p className="text-xs text-white/60">Voice assistance is a UI placeholder in this prototype.</p>
      </Card>

      <Card>
        <h3 className="mb-2 font-display text-lg font-semibold text-[var(--color-soil-950)]">Frequently Asked Questions</h3>
        <div>
          {faqs.map((faq) => (
            <FaqItem key={faq.q} faq={faq} />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex flex-col items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-canopy-700)]/10 text-[var(--color-canopy-700)]"><Phone size={18} /></span>
          <div>
            <p className="font-medium text-[var(--color-soil-950)]">Call Support</p>
            <p className="text-sm text-[var(--color-soil-600)]">1800-XXX-XXXX (Toll-free)</p>
          </div>
        </Card>
        <Card className="flex flex-col items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-canopy-700)]/10 text-[var(--color-canopy-700)]"><Mail size={18} /></span>
          <div>
            <p className="font-medium text-[var(--color-soil-950)]">Email Us</p>
            <p className="text-sm text-[var(--color-soil-600)]">support@agrovision.ai</p>
          </div>
        </Card>
        <Card className="flex flex-col items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-canopy-700)]/10 text-[var(--color-canopy-700)]"><MessageCircle size={18} /></span>
          <div>
            <p className="font-medium text-[var(--color-soil-950)]">Chat with us</p>
            <Button size="sm" variant="secondary" className="mt-1">Start Chat</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

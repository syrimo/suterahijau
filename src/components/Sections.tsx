import { motion } from 'framer-motion'
import { useState, type ReactNode, type FormEvent } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
}

function Section({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={stagger}
      id={id}
      className={`scroll-mt-16 px-6 py-24 md:px-12 lg:py-32 ${className}`}
    >
      <div className="mx-auto max-w-5xl">{children}</div>
    </motion.section>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <motion.p variants={fadeUp} className="mb-3 text-xs font-medium tracking-[0.25em] text-silk uppercase">
      {children}
    </motion.p>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <motion.h2 variants={fadeUp} className="mb-6 text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl">
      {children}
    </motion.h2>
  )
}

function SectionText({ children }: { children: ReactNode }) {
  return (
    <motion.p variants={fadeUp} className="max-w-2xl text-lg leading-relaxed text-gray-500">
      {children}
    </motion.p>
  )
}

// --- WHAT WE BELIEVE ---
export function WhatWeBelieve() {
  return (
    <Section className="bg-white" id="about">
      <SectionLabel>What We Believe</SectionLabel>
      <SectionTitle>Technology should solve problems that matter.</SectionTitle>
      <SectionText>
        Sutera Hijau is an independent technology studio — not a startup, not an agency. We build
        for education, community, and the preservation of knowledge. We work with intent, release
        what is ready, and let the work speak for itself. Since 2017, that has not changed.
      </SectionText>
    </Section>
  )
}

// --- INITIATIVES ---
interface Initiative {
  name: string
  desc: string
  tag: string
  href: string
}

interface Solution {
  title: string
  desc: string
  tag: string
  status: string
}

const solutions: Solution[] = [
  {
    title: 'Islamic Storytelling for a New Generation',
    tag: 'Content & Media',
    status: 'Alpha',
    desc: 'AI-powered production of Islamic stories, series, and audio content — bringing the lives of the Prophets and Companions to screens and speakers at a fraction of traditional cost.',
  },
  {
    title: 'Smarter School Operations',
    tag: 'Education',
    status: 'Beta',
    desc: 'Streamlining daily operations for Islamic schools — attendance, hafazan tracking, class management, cocurricular activities, and parent communication, all in one place.',
  },
  {
    title: 'Accessible Community Finance',
    tag: 'Fintech',
    status: 'Beta',
    desc: 'Making zakat and community donations simple, transparent, and accountable — from collection to distribution, with full reporting for institutions and donors.',
  },
  {
    title: 'Autonomous Support & Ticketing',
    tag: 'Support & Ops',
    status: 'Beta',
    desc: 'AI-driven support system that receives, triages, and resolves user tickets autonomously — with human oversight through Telegram notifications and approval workflows.',
  },
  {
    title: 'Social Media Intelligence',
    tag: 'Social Media',
    status: 'Beta',
    desc: 'Automated social media management — content scheduling, engagement tracking, and AI-generated posts tailored to each platform and audience.',
  },
  {
    title: 'Enterprise Operating System',
    tag: 'Enterprise',
    status: 'Beta',
    desc: 'A unified workspace for teams — project management, role-based access, internal tools, and operational dashboards, all under one roof.',
  },
]

export function Initiatives() {
  return (
    <Section className="bg-gray-50" id="initiatives">
      <SectionLabel>What We're Building</SectionLabel>
      <SectionTitle>Solutions we're working on right now.</SectionTitle>

      <motion.div variants={stagger} className="mt-16 grid gap-6 md:grid-cols-3">
        {solutions.map((item) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            className="rounded-2xl border border-gray-100 bg-white p-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-block rounded-full bg-silk/10 px-3 py-1 text-xs font-medium text-silk">
                {item.tag}
              </span>
              <span className="inline-block rounded-full border border-gray-200 px-2.5 py-0.5 text-[10px] font-medium tracking-wider text-gray-400 uppercase">
                {item.status}
              </span>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

// --- FOLLOW THE JOURNEY ---
export function FollowJourney() {
  return (
    <Section className="bg-white" id="journey">
      <motion.div variants={fadeUp} className="text-center">
        <p className="text-lg text-gray-400">
          Follow the builder's journey &rarr;{' '}
          <a
            href="https://syrimo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-silk transition-colors hover:text-silk-dark"
          >
            syrimo.com
          </a>
        </p>
      </motion.div>
    </Section>
  )
}

// --- OUR ARSENAL ---
const arsenal: Record<string, string[]> = {
  'AI & LLM': ['Claude Code', 'Claude API', 'Ollama', 'MiMo', 'GPT-5', 'Gemini'],
  'Dev & Build': ['React', 'Vite', 'TypeScript', 'Tailwind', 'Supabase', 'Vercel', 'Bun', 'Three.js'],
  'Media & Content': ['Remotion', 'NotebookLM', 'ElevenLabs', 'Nano Banana'],
  'Comms & Ops': ['Resend', 'Baileys', 'Telegram Bots', 'DigitalOcean'],
  'Design & Gen': ['21st.dev Magic', 'Google Stitch', 'UI UX Pro Max'],
  'Dev Tools': ['GitHub CLI', 'Puppeteer', 'Context7'],
}

export function Arsenal() {
  return (
    <Section className="bg-gray-50" id="arsenal">
      <SectionLabel>Our Arsenal</SectionLabel>
      <SectionTitle>Tools we explore and use.</SectionTitle>
      <SectionText>
        The real stack behind what we build — constantly evolving, always practical.
      </SectionText>

      <motion.div variants={stagger} className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(arsenal).map(([category, tools]) => (
          <motion.div key={category} variants={fadeUp}>
            <h3 className="mb-4 text-xs font-medium tracking-[0.2em] text-gray-400 uppercase">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

// --- CONTACT ---
export function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <Section className="bg-charcoal text-white" id="contact">
      <SectionLabel>Contact</SectionLabel>
      <motion.h2 variants={fadeUp} className="mb-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
        Get in touch.
      </motion.h2>
      <motion.p variants={fadeUp} className="mb-10 max-w-lg text-base leading-relaxed text-white/40">
        Have something in mind? Drop us a message — we'll get back to you.
      </motion.p>

      <motion.form variants={fadeUp} onSubmit={handleSubmit} className="mb-12 grid max-w-xl gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="name"
            type="text"
            required
            placeholder="Your name"
            aria-label="Your name"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-silk"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email address"
            aria-label="Email address"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-silk"
          />
        </div>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Your message..."
          aria-label="Your message"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-silk resize-none"
        />
        <div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="rounded-lg bg-silk px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : 'Send Message'}
          </button>
          {status === 'sent' && <span className="ml-4 text-sm text-silk">We'll be in touch soon.</span>}
          {status === 'error' && <span className="ml-4 text-sm text-red-400">Something went wrong. Try emailing us directly.</span>}
        </div>
      </motion.form>

      <motion.div variants={fadeUp} className="space-y-3 text-lg text-white/60">
        <p><a href="mailto:admin@suterahijau.com" className="transition-colors hover:text-white">admin@suterahijau.com</a></p>
        <p>Cyberjaya, Selangor, Malaysia</p>
      </motion.div>
      <motion.div variants={fadeUp} className="mt-8">
        <span className="text-xs tracking-[0.2em] text-white/30 uppercase">
          Sutera Hijau Academy Sdn. Bhd. (1226682-T) — Est. 2017
        </span>
      </motion.div>
    </Section>
  )
}

// --- FOOTER ---
export function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/10 px-6 py-8 text-center">
      <p className="text-xs text-white/30">
        &copy; {new Date().getFullYear()} Sutera Hijau Academy Sdn. Bhd. All rights reserved.
      </p>
    </footer>
  )
}

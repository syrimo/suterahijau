import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
}

function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={stagger}
      className={`px-6 py-24 md:px-12 lg:py-32 ${className}`}
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

// --- ABOUT ---
export function About() {
  return (
    <Section className="bg-white">
      <SectionLabel>About</SectionLabel>
      <SectionTitle>Building systems that make lives better.</SectionTitle>
      <SectionText>
        Sutera Hijau Academy Sdn. Bhd. is a technology incubator based in Cyberjaya, Selangor.
        Since 2017, we design, build, and ship digital products — from AI-powered platforms to
        SaaS tools that serve real communities. We move fast, stay structured, and always build
        with purpose.
      </SectionText>
    </Section>
  )
}

// --- PORTFOLIO ---
const projects = [
  {
    name: 'OrcaSMS',
    desc: 'Intelligent SMS management platform with AI-powered campaign tools.',
    tag: 'SaaS',
  },
  {
    name: 'BayarZakat',
    desc: 'Digital zakat collection and distribution system for Malaysian communities.',
    tag: 'FinTech',
  },
  {
    name: 'HS9 Travel',
    desc: 'Comprehensive travel management platform for Hajj & Umrah operators.',
    tag: 'Travel',
  },
  {
    name: 'Scan2Verse',
    desc: 'QR-powered ecosystem — Scan2Eat (F&B ordering), Scan2Mind (knowledge sharing).',
    tag: 'Platform',
  },
  {
    name: 'OrcaNexus',
    desc: 'Team collaboration and project management for distributed teams.',
    tag: 'Productivity',
  },
  {
    name: 'Nurflix',
    desc: 'AI-powered cinematic content platform. Coming soon.',
    tag: 'Content',
  },
]

export function Portfolio() {
  return (
    <Section className="bg-gray-50">
      <SectionLabel>Portfolio</SectionLabel>
      <SectionTitle>Products we've shipped.</SectionTitle>
      <SectionText>
        From concept to production — each product solves a real problem for real people.
      </SectionText>

      <motion.div
        variants={stagger}
        className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((p) => (
          <motion.div
            key={p.name}
            variants={fadeUp}
            className="group rounded-2xl border border-gray-100 bg-white p-8 transition-shadow hover:shadow-lg"
          >
            <span className="mb-4 inline-block rounded-full bg-silk/10 px-3 py-1 text-xs font-medium text-silk">
              {p.tag}
            </span>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">{p.name}</h3>
            <p className="text-sm leading-relaxed text-gray-500">{p.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

// --- CAPABILITIES ---
const capabilities = [
  {
    title: 'AI & Automation',
    desc: 'Multi-agent AI systems, intelligent workflows, and machine learning integrations that reduce friction and accelerate delivery.',
  },
  {
    title: 'Web & Mobile Development',
    desc: 'Modern React applications, progressive web apps, and cross-platform mobile solutions built on proven frameworks.',
  },
  {
    title: 'SaaS Product Development',
    desc: 'End-to-end product engineering — from MVP to scale. Authentication, billing, real-time features, and infrastructure.',
  },
  {
    title: 'Digital Transformation',
    desc: 'Helping traditional businesses embrace technology with custom solutions that integrate into existing operations.',
  },
]

export function Capabilities() {
  return (
    <Section className="bg-white">
      <SectionLabel>Capabilities</SectionLabel>
      <SectionTitle>What we do best.</SectionTitle>

      <motion.div variants={stagger} className="mt-16 grid gap-12 md:grid-cols-2">
        {capabilities.map((c) => (
          <motion.div key={c.title} variants={fadeUp}>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">{c.title}</h3>
            <p className="text-base leading-relaxed text-gray-500">{c.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

// --- TECH STACK ---
export function TechStack() {
  const stack = ['React', 'Next.js', 'Supabase', 'Vercel', 'Google Cloud', 'Anthropic AI', 'Tailwind CSS', 'TypeScript']

  return (
    <Section className="bg-gray-50">
      <SectionLabel>Technology</SectionLabel>
      <SectionTitle>Built on modern foundations.</SectionTitle>
      <motion.div variants={stagger} className="mt-12 flex flex-wrap gap-3">
        {stack.map((s) => (
          <motion.span
            key={s}
            variants={fadeUp}
            className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700"
          >
            {s}
          </motion.span>
        ))}
      </motion.div>
    </Section>
  )
}

// --- CONTACT ---
export function Contact() {
  return (
    <Section className="bg-charcoal text-white">
      <SectionLabel>Contact</SectionLabel>
      <motion.h2 variants={fadeUp} className="mb-6 text-3xl font-semibold tracking-tight text-white md:text-5xl">
        Let's build something together.
      </motion.h2>
      <motion.div variants={fadeUp} className="space-y-3 text-lg text-white/60">
        <p>admin@suterahijau.com</p>
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

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

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

// --- ABOUT ---
export function About() {
  return (
    <Section className="bg-white" id="about">
      <SectionLabel>About</SectionLabel>
      <SectionTitle>Building AI-powered platforms for communities that matter.</SectionTitle>
      <SectionText>
        Sutera Hijau Academy Sdn. Bhd. is a technology incubator based in Cyberjaya, Selangor.
        Since 2017, we design, build, and ship digital products — from AI-powered platforms to
        SaaS tools that serve real communities. We move fast, stay structured, and always build
        with purpose.
      </SectionText>
    </Section>
  )
}

// --- ORCA ECOSYSTEM ---
const orcaProducts = [
  {
    name: 'OrcaSchool',
    desc: 'AI-powered learning management and school administration platform.',
    tag: 'EdTech',
    status: 'Beta',
  },
  {
    name: 'OrcaPulse',
    desc: 'AI-native ticketing and change request management system with real-time notifications.',
    tag: 'Ticketing',
    status: 'Live',
  },
  {
    name: 'OrcaPost',
    desc: 'AI social media automation — content generation, scheduling, and multi-platform publishing.',
    tag: 'Social Media',
    status: 'Beta',
  },
  {
    name: 'OrcaScholar',
    desc: 'Islamic knowledge platform — AI-powered research, content curation, and authenticated scholarly references.',
    tag: 'Islamic',
    status: 'Coming Soon',
  },
  {
    name: 'OrcaArena',
    desc: 'AI debate arena — watch AI models clash on real topics. Learn from structured arguments and counter-arguments.',
    tag: 'AI Debate',
    status: 'Coming Soon',
  },
  {
    name: 'OrcaNexus',
    desc: 'Enterprise operating system — team collaboration, project management, and organisational intelligence.',
    tag: 'Enterprise OS',
    status: 'Live',
  },
  {
    name: 'Nurflix Orca Edition',
    desc: 'AI-powered cinematic storytelling — delivering stories of the Prophets and the Companions through immersive visual narratives.',
    tag: 'Islamic Content',
    status: 'Coming Soon',
  },
]

const clientProjects = [
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
    desc: 'AI-powered health platform covering mental wellness screening and community nutrition intelligence.',
    tag: 'Health Tech',
  },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Live': 'bg-silk/15 text-silk',
    'Beta': 'bg-amber-50 text-amber-600',
    'Coming Soon': 'bg-gray-100 text-gray-400',
  }
  return (
    <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${styles[status] || styles['Coming Soon']}`}>
      {status}
    </span>
  )
}

export function Portfolio() {
  return (
    <>
      <Section className="bg-gray-50" id="products">
        <SectionLabel>Orca Ecosystem</SectionLabel>
        <SectionTitle>Products we're building.</SectionTitle>
        <SectionText>
          A growing suite of AI-powered platforms — built for Muslim communities and underserved markets across Southeast Asia.
        </SectionText>

        <motion.div
          variants={stagger}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {orcaProducts.map((p) => (
            <motion.div
              key={p.name}
              variants={fadeUp}
              className="group rounded-2xl border border-gray-100 bg-white p-8 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex items-center">
                <span className="inline-block rounded-full bg-silk/10 px-3 py-1 text-xs font-medium text-silk">
                  {p.tag}
                </span>
                <StatusBadge status={p.status} />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{p.name}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <Section className="bg-white" id="clients">
        <SectionLabel>Client Projects</SectionLabel>
        <SectionTitle>Platforms we've shipped.</SectionTitle>
        <SectionText>
          Custom-built solutions for organisations across Malaysia.
        </SectionText>

        <motion.div
          variants={stagger}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {clientProjects.map((p) => (
            <motion.div
              key={p.name}
              variants={fadeUp}
              className="group rounded-2xl border border-gray-100 bg-gray-50 p-8 transition-shadow hover:shadow-lg"
            >
              <span className="mb-4 inline-block rounded-full bg-gray-200/60 px-3 py-1 text-xs font-medium text-gray-600">
                {p.tag}
              </span>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{p.name}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>
    </>
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
    title: 'Community-First Design',
    desc: 'Purpose-built platforms for Muslim communities, Islamic organisations, and underserved markets — designed with cultural context and real-world impact in mind.',
  },
]

export function Capabilities() {
  return (
    <Section className="bg-white" id="capabilities">
      <SectionLabel>Capabilities</SectionLabel>
      <SectionTitle>What sets us apart.</SectionTitle>

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
    <Section className="bg-gray-50" id="technology">
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
    <Section className="bg-charcoal text-white" id="contact">
      <SectionLabel>Contact</SectionLabel>
      <motion.h2 variants={fadeUp} className="mb-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
        Let's build something together.
      </motion.h2>
      <motion.p variants={fadeUp} className="mb-8 max-w-lg text-base leading-relaxed text-white/40">
        Tell us about your project — we'll get back to you within 24 hours.
      </motion.p>
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

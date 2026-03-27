import { useState } from 'react'
import SilkHero from './components/SilkHero'
import { About, Portfolio, Capabilities, TechStack, Contact, Footer } from './components/Sections'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Contact', href: '#contact' },
]

function Nav() {
  const [scrolled, setScrolled] = useState(false)

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => setScrolled(window.scrollY > 80), { passive: true })
  }

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-charcoal/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="text-sm font-semibold tracking-wider text-white/90">
          SUTERA HIJAU
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs tracking-[0.15em] text-white/50 uppercase transition-colors hover:text-white/90"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <main className="no-scrollbar">
        <SilkHero />
        <About />
        <Portfolio />
        <Capabilities />
        <TechStack />
        <Contact />
        <Footer />
      </main>
    </>
  )
}

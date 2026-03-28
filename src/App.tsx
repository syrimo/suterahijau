import { useState, useEffect } from 'react'
import SilkHero from './components/SilkHero'
import { WhatWeBelieve, Initiatives, FollowJourney, Arsenal, Contact, Footer } from './components/Sections'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Initiatives', href: '#initiatives' },
  { label: 'Arsenal', href: '#arsenal' },
  { label: 'Contact', href: '#contact' },
]

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen ? 'bg-charcoal/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="text-sm font-semibold tracking-wider text-white/90">
          SUTERA HIJAU
        </a>

        {/* Desktop */}
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

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`block h-[1.5px] w-5 bg-white/70 transition-all duration-300 ${menuOpen ? 'translate-y-[4.5px] rotate-45' : ''}`} />
          <span className={`block h-[1.5px] w-5 bg-white/70 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-[1.5px] w-5 bg-white/70 transition-all duration-300 ${menuOpen ? '-translate-y-[4.5px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="border-t border-white/10 px-6 pb-6 pt-4 md:hidden">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm tracking-[0.15em] text-white/60 uppercase transition-colors hover:text-white/90"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <main className="no-scrollbar">
        <SilkHero />
        <WhatWeBelieve />
        <Initiatives />
        <FollowJourney />
        <Arsenal />
        <Contact />
        <Footer />
      </main>
    </>
  )
}

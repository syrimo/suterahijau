import SilkHero from './components/SilkHero'
import { About, Portfolio, Capabilities, TechStack, Contact, Footer } from './components/Sections'

export default function App() {
  return (
    <main className="no-scrollbar">
      <SilkHero />
      <About />
      <Portfolio />
      <Capabilities />
      <TechStack />
      <Contact />
      <Footer />
    </main>
  )
}

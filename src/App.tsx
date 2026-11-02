import CustomCursor from "./components/CustomCursor";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SectionRail from "./components/SectionRail";
import { navLinks } from "./data/content";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

// The hero introduces the page itself, so it gets no title on the rail.
const railLinks = navLinks.filter((link) => link.href !== "#home");

function App() {
  return (
    <>
      <Header />
      <SectionRail links={railLinks} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <CustomCursor />
    </>
  );
}

export default App;

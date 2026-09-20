import { Navigation } from '../components/layout/Navigation'
import { Footer } from '../components/layout/Footer'
import { media } from '../content/media'

export function AboutPage() {
  return <div className="about-page">
    <header className="site-header"><Navigation /></header>
    <main>
      <section className="about-intro">
        <h1>Hi, I’m Shuoyue Wu , an idealistic AI designer, developer, and new media artist. My work spans Consumer Product, B2B Solutions, and design agency, where I develop AI workflows to address complex commercial challenges. As an artist, I explore the subtle connection between people and their environments, turning hidden stories into compelling narratives.<br />Welcome to my website!</h1>
        <img className="about-intro__portrait" src={media.about.imgEllipse74} alt="Portrait of Shuoyue Wu" />
      </section>
      <section className="about-columns cells" aria-label="About Shuoyue Wu">
        <div className="frame"><span>/CURRENTLY</span><p>Studying at NYU Tisch’s ITP program (M.P.S. in Interactive Telecommunications), expecting to graduate in May 2027.</p></div>
        <div className="frame"><span>/Projects I worked on</span><p>Masterise Homes (The Ritz-Carlton Residences, Hanoi)<br />101 Franklin NYC<br />Ethancia Resort<br />TRANSSION<br />Etihad Airways<br />JD.com</p></div>
        <div className="frame"><span>/VALUES</span><p>COLLABORATION<br />CREATIVITY<br />EFFICIENCY<br />SYSTEMATISATION<br />INNOVATION<br />COMMUNICATION</p></div>
        <div className="frame"><span>/People I’m Grateful For</span><p>Danny Drohojowski<br />Henry Turner<br />Alex Suber<br />Anna Gudnason<br />Zheng Chen<br />Fuhong Han<br />Yaya Ni</p></div>
      </section>
      <section className="about-cv"><h2>C.V.</h2><div className="about-cv__rows frame"><div><span>2026 - Now</span><span>◦</span><span>To Be Continued</span></div><div><span>2026 Summer</span><span>◦</span><span>Noë &amp; Associates</span><span>Creative Technologist Intern, AI film maker</span></div><div><span>2025 Summer</span><span>◦</span><span>CUE</span><span>Product Manager, ToC Product, Comfy Workflow developer</span></div><div><span>2024 Summer</span><span>◦</span><span>JingDong</span><span>Creative Technologist Intern, B2B Product, LoRA training, Stable Diffusion based UX/UI design</span></div></div></section>
    </main>
    <Footer />
  </div>
}

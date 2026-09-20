import { Media } from '../components/projects/ProjectBlocks'
import { media } from '../content/media'

const e = media.eros
const r = (w: number, h: number) => w / h
const four3 = { ratio: r(4, 3) }

/**
 * Eros Trilogy body (Figma 80:8779). The photo galleries reuse the shared media boxes; the research
 * collages (Group 2239/2240, SmokingPics) are Figma exports because they are free-form artwork, and
 * the Metaphor compositions position their pieces by the percentages Figma reports.
 */
export function ErosStory() {
  return <div className="eros">
    {/* Figma annotation on 133:7420: YouTube gqkByELFMBA */}
    <div className="story-media story-video"><iframe src="https://www.youtube-nocookie.com/embed/gqkByELFMBA" title="Eros Trilogy film" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>

    {/* 139:8795 photo gallery */}
    <div className="story-media story-row" style={{ paddingTop: 28 }}><Media item={{ src: e.imgZhanReaction2, ratio: r(1200, 740.4) }} alt="Eros Trilogy performance" /></div>
    <div className="story-media story-columns">
      <div className="story-column"><Media item={{ src: e.imgImg89341, ...four3 }} alt="Airbag installation, photo 1" /><Media item={{ src: e.imgImg895021, ...four3 }} alt="Airbag installation, photo 2" /></div>
      <div className="story-column">
        <Media item={{ src: e.imgImg88901, ...four3 }} alt="Airbag installation, photo 3" />
        <div className="eros__portraits"><Media item={{ src: e.imgImg88511, ratio: r(1179, 2018) }} alt="Airbag installation, photo 4" style={{ width: '43.2%' }} /><Media item={{ src: e.imgImg89101, ratio: r(2165, 3024) }} alt="Airbag installation, photo 5" style={{ width: '53%' }} /></div>
      </div>
    </div>
    <div className="story-media story-columns">
      <div className="story-column">{[e.imgImg89081, e.imgImg89041, e.imgImg89001, e.imgImg89061, e.imgImg89021, e.imgImg88971].map((src, i) => <Media item={{ src, ...four3 }} alt={`Installation detail ${i + 1}`} key={src} />)}</div>
      <div className="story-column">{[e.imgImg89071, e.imgImg89031, e.imgImg88981, e.imgImg89051, e.imgImg89011].map((src, i) => <Media item={{ src, ...four3 }} alt={`Installation detail ${i + 7}`} key={src} />)}<Media item={{ src: e.imgImg89112, ratio: r(3397, 2548) }} alt="Installation detail 12" /></div>
    </div>

    {/* 133:7560 + 133:7567 Inspiration & Research */}
    <div className="story-heading"><h2>Inspiration &amp; Research</h2></div>
    <section className="story-media eros__section">
      <h3>Smoking</h3>
      <div className="eros__smoking">
        <div className="eros__body">
          <p>As more and more people around me started to smoke, it sparked my curiosity. So I started to record the moments when various people smoked and their state of being with camera images.</p>
          <p>The purpose of observational research tries to find the state of people when they smoke. Over time, I realized that when people smoke, it is often a relaxation option when they are under stress. At the same time, people don't just smoke when they are stressed, they also have behaviors such as chewing gum or eating their nail.</p>
        </div>
        <img className="eros__smoking-pics" src={e.exportSmokingPics} alt="Photographs of people smoking" />
      </div>
      <h3>Herbert Marcuse Theory&amp;Oral stage</h3>
      <div className="eros__theory">
        <div className="eros__theory-left">
          <figure><img src={e.exportGroup2239} alt="Collage: a smoker and a nursing baby" /><figcaption className="eros__body">Cigarettes are designed to look like nipples so that people get the same feeling as babies when they smoke.</figcaption></figure>
          <figure><img src={e.exportGroup2240} alt="Collage: workers on an industrial production line" /><figcaption className="eros__body">Industrial production lines are depressing for people,</figcaption></figure>
        </div>
        <div className="eros__theory-right">
          <p className="eros__lead">According to Marcuse, in modern society "the acceleration of progress seems to be associated with the intensification of unfreedom. Throughout the world of industrial civilization, the domination of man over man is increasing in both size and efficiency." In this way, he makes a profound critique of modern social civilization, which he considers to be a society that represses the Eros. This stems from the same Freudian suggestion of modern civilization's repressed Eros.</p>
          <div className="eros__freud">
            <p className="eros__callout">For infants, the mouth is the first tool they rely on to perceive the world. Babies absorb breastmilk through sucking and also express their affection through their mouths.</p>
            <img src={e.imgFuluoyide2} alt="Sigmund Freud" />
          </div>
        </div>
      </div>
    </section>

    {/* 133:7767 + 133:7775 Visual Experiment */}
    <div className="story-heading"><h2>Visual Experiment</h2></div>
    <section className="story-media eros__section">
      <h3>Video Practice</h3>
      <div style={{ padding: '14px 0' }}><Media item={{ src: e.imgGroup22411, ratio: r(1592, 936) }} alt="Video practice film strips" /></div>
      <h3>reverse topography</h3>
      <Media item={{ src: e.imgGroup22421, ratio: r(796, 212) }} alt="Reverse topography process" />
      <div className="story-paragraphs"><div><p>By reverse topography, chewing gum, which is chewed in the mouth, is converted into randomized shapes by means of topography. The shapes are then further refined in to line.</p><p>This is a process of downscaling 3D-2D-1D.</p></div></div>
      <h3>Visual Practice</h3>
      <Media item={{ src: e.imgGroup22432, ratio: r(1200, 1322), bg: '#fff' }} alt="Visual practice: gum shapes and line patterns" />
      {/* Figma annotation on 133:7823: YouTube 3lSUb1UaHg4 */}
      <div className="story-video" style={{ marginTop: 28 }}><iframe src="https://www.youtube-nocookie.com/embed/3lSUb1UaHg4" title="Eros Trilogy — video practice" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
    </section>

    {/* 133:7887 + 133:7934 Metaphor */}
    <div className="story-heading"><h2>Metaphor &amp; Trilogy</h2></div>
    <section className="story-media eros__section eros__section--tight">
      <h3>Metaphor</h3>
      <div className="eros__idea"><p>Through the element of my work, I hope to convey the idea:</p><p>people conciliate their repressed Eros through oral activity.</p></div>
      <div className="eros__metaphor">
        <div className="eros__collage eros__collage--lines">
          <span className="eros__collage-box" />
          <img className="eros__collage-gum" src={e.img5} alt="" />
          <img className="eros__collage-proto" src={e.imgProto22} alt="Airbag bound by ropes" />
          <p className="eros__body">By refining the lines, an airbag bound by ropes is reconstructed.</p>
        </div>
        <div className="eros__collage eros__collage--bags">
          <img className="eros__collage-bag" src={e.img4} alt="Inflated airbags" />
          <img className="eros__collage-bubble" src={e.imgC311} alt="Blowing a bubble of chewing gum" />
          <span className="eros__collage-box" />
          <p className="eros__body">Air bags have the same structure and form as the bubbles in chewing gum.</p>
        </div>
      </div>
      <div className="eros__bubble">
        <img className="eros__bubble-face" src={e.imgC322} alt="" />
        <div className="eros__bubble-shape" style={{ maskImage: `url(${e.bubbleMask})`, WebkitMaskImage: `url(${e.bubbleMask})` }}>
          <img src={e.img226} alt="" />
          <div className="eros__bubble-text"><p className="eros__bubble-title">Eros</p><p>The oral cavity becomes the medium through which we convey our lust for love.</p><p>All the repressed lust for love is firmly wrapped in bubbles of chewing gum. Through the movement of our mouths.</p></div>
        </div>
      </div>
    </section>

    {/* 133:8399 full-bleed still */}
    <div className="eros__bleed"><img src={e.imgGroup22491} alt="Eros Trilogy installation, wide view" loading="lazy" /></div>

    {/* 133:8428 chapters */}
    <section className="story-media eros__chapters">
      <div className="eros__chapter-row">
        <div className="eros__chapter">
          <h3>Chapter 1 The Birth</h3>
          <p className="eros__body">In the birth stage, a new Eros is birthed by two experiment-ers who symbolize the social landscape. A huge air bag symbolizing Eros is bound and restrained above the alumin-um bracket.</p>
          <div className="eros__grid2">{[e.img2024060614429, e.img2024060614430, e.img2024060614431, e.img20240604194542].map((src, i) => <Media item={{ src, ratio: r(183.5, 108) }} alt={`Birth stage still ${i + 1}`} key={src} />)}</div>
          <p className="eros__body">We interviewed laborers of different working ages and represented their repressed Eros figuratively through airbags of different gas capacities.</p>
        </div>
        <div className="eros__chapter eros__chapter--center">
          <h3>Chapter 2 Confront</h3>
          <p className="eros__body">In the confrontation phase, the airbag fights fiercely against the ropes that bind it. Meanwhile I try to soothe the tense airbag through oral activities.</p>
          <img className="eros__confront-still" src={e.img6} alt="Confrontation stage still" />
          <div className="eros__strip">{[e.img2024060614432, e.img2024060614433, e.img2024060614434].map((src, i) => <Media item={{ src, ratio: r(126.67, 90) }} alt={`Confrontation still ${i + 1}`} key={src} />)}</div>
          <ol className="eros__body"><li>I picked up the myoelectric sensor and mounted it to my face, constantly chewing the unwrapped gum.</li><li>I tried to get the rope to relax and unlock the suppressed air bag.</li><li>But when I stop chewing, the airbag goes right back to being even tighter.</li></ol>
        </div>
      </div>
      <Media item={{ src: e.img68E575224575D8102Ee9C94Dc7192Fd1, ratio: r(155, 90) }} alt="Airbag rupturing" style={{ marginTop: 28 }} />
      <h3>Chapter 3 Expire</h3>
      <div className="eros__chapter-row">
        <div className="eros__chapter eros__chapter--gap14">
          <Media item={{ src: e.img20240605220843, ratio: r(381, 184) }} alt="Expire stage still 1" />
          <p className="eros__body">During the expire phase, the huge airbag and the rope reached the end of their confrontation. Ruptures, bursts, and smoke disperses from the airbags.</p>
        </div>
        <div className="eros__chapter eros__chapter--gap18">
          <div className="eros__strip eros__strip--gap18"><Media item={{ src: e.img20240605220844, ratio: r(181, 144) }} alt="Expire stage still 2" /><Media item={{ src: e.img2024060614435, ratio: r(181, 144) }} alt="Expire stage still 3" /></div>
          <p className="eros__body">The repressed Eros ruptures at the end of the confrontation, and the Eros, the power everything disappears. The Eros dies out completely, the individual is completely crushed by the system. But then, a new Eros will be born again, and it will go through the cycle again.</p>
        </div>
      </div>
    </section>
  </div>
}

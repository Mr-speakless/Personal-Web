import { media } from '../content/media'

const diagram = media.capeexports

/**
 * CAPE body (Figma 71:8517). The research infographics are dense Figma compositions, so each
 * sub-frame is a Figma export placed in the 1200px column; the 44px section labels, the pink
 * findings callout, the award row and the headings are HTML. Section backgrounds follow Figma
 * (DesignDisplay/DesignProcess #f6f2ee, DesignSketch #383736).
 */
export function CapeStory() {
  return <div className="cape">
    <div className="story-heading"><h2>Design Display</h2></div>
    <section className="cape__light">
      <div className="cape__column"><img src={diagram.display} alt="CAPE wearable product renders and companion app screens" loading="lazy" /></div>
      <div className="story-heading cape__heading"><h2>Design Sketch</h2></div>
    </section>
    <section className="cape__dark">
      <div className="cape__column"><img src={diagram.sketch} alt="CAPE product concept and hardware sketch" loading="lazy" /></div>
    </section>
    <section className="cape__light">
      <div className="story-heading cape__heading"><h2>Design Research</h2></div>
      <div className="cape__column cape__research">
        <h3>Inspiration</h3>
        <img src={diagram.inspiration} alt="Research into shoulder and neck pain from prolonged computer use" loading="lazy" />
        <img src={diagram.selftrack} alt="Self-record: four sessions tracking sitting posture over time" loading="lazy" />
        <p className="cape__callout">After conducting further research and interviews, I dis-covered two key findings: People struggle to remain aware of their posture when they are focused on a task. Individuals with good sitting posture maintain it due to healthy habits, rather than relying on a supportive chair or other tools.</p>
        <h3>Posture Research</h3>
        <img src={diagram.posture} alt="The critical back, shoulder, and cervical angles for posture" loading="lazy" />
        <img src={diagram.observation} alt="Observation, deliberate practice and the how-might-we question" loading="lazy" />
        <h3>Sensor&amp;Workflow</h3>
        <img src={diagram.sensor} alt="Sensor wearability, body placement, and IMU workflow" loading="lazy" />
        <h3>Data Measurement</h3>
        <img src={diagram.data} alt="CAPE product insight and interaction workflow" loading="lazy" />
        <h4>Prototype Testing</h4>
        <img src={diagram.test} alt="Prototype fitting and angle measurements" loading="lazy" />
        <img src={diagram.threshold} alt="Threshold ranges for shoulder, neck, and back data" loading="lazy" />
      </div>
      <div className="cape__award">
        <img className="cape__award-render" src={media.capeend.img91} alt="CAPE worn on the shoulders, rear view" loading="lazy" />
        <img className="cape__award-certificate" src={media.capeend.imgImage121} alt="MUSE Design Awards 2025 silver winner certificate" loading="lazy" />
      </div>
      <div className="story-heading cape__heading"><h2>Acknowledgements</h2></div>
      <div className="story-paragraphs"><div><p>Give credit to my best friend Henry Zhen, the best engineer in the word.</p></div></div>
      <div className="cape__end" />
    </section>
  </div>
}

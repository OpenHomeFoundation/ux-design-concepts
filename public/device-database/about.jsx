/* "About", standalone page (Foundation baseline — always reachable from the
   footer). Introduces the project, the Open Home Foundation, and the core
   team, with the OHF "project from" lockup at the very bottom.

   The core-team avatars are <image-slot> custom elements (assets/image-slot.js,
   loaded in index.html): drop a photo onto each and it persists. OHFLockup
   comes from brand-logos.js. */

const About = () => (
  <div data-screen-label="06 About">
    <section className="section" style={{borderTop: "none"}}>
      <div className="container-narrow page-intro">
        <div className="eyebrow section-eyebrow" style={{marginBottom: 8, color: "var(--primary)"}}>About</div>
        <h1 style={{marginBottom: 16}}>About the Device Database</h1>
        <p className="lede" style={{marginBottom: 20}}>
          The Device Database is a project of the Open Home Foundation, the non-profit
          stewards of Home Assistant, ESPHome, Music Assistant, and friends.
        </p>
        <p style={{color: "var(--fg-muted)", lineHeight: "var(--lh-loose)", marginBottom: 0}}>
          It is built and maintained in the open. Manufacturer specs say what a device
          should do. We record what it actually does, drawn from anonymized data the
          community shares, and kept editorially neutral.
        </p>
        <p style={{color: "var(--fg-muted)", lineHeight: "var(--lh-loose)", marginTop: "var(--space-4)", marginBottom: 0}}>
          Read our <a href="#/privacy/data-use" className="ce-link-ink">Data Use Statement</a> to
          see exactly what is shared, and how it is protected.
        </p>
        <a className="about-ohf-badge" href="https://www.openhomefoundation.org/" target="_blank" rel="noopener" style={{marginTop: "var(--space-7)"}}>
          <span className="about-ohf-badge-eyebrow">A project from the</span>
          {window.OHFLockup ? <window.OHFLockup className="about-ohf-lockup" /> : null}
        </a>
      </div>
    </section>
  </div>
);

window.About = About;

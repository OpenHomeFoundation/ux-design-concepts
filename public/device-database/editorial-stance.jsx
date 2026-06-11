/* "Editorial stance", standalone page. Reachable from the footer. */

const EditorialStance = () => (
  <div data-screen-label="05 Editorial stance">
    <section className="section" style={{borderTop: "none"}}>
      <div className="container-narrow" style={{padding: "var(--space-9) var(--space-7) 0"}}>
        <div className="eyebrow section-eyebrow" style={{marginBottom: 8, color: "var(--primary)"}}>About</div>
        <h1 style={{marginBottom: 16}}>Editorial stance</h1>
        <p className="lede">Neutral, citable, never sponsored.</p>
      </div>
    </section>

    <section className="section">
      <div className="container-narrow">
        <p style={{color: "var(--fg)", lineHeight: "var(--lh-loose)", marginBottom: 20}}>
          The Device Database is a reference, not a marketing surface. We list what a
          device <em>does</em>, not what we think about it. Entries are written in the
          voice of a wiki editor, declarative, source-backed, and explicit about
          uncertainty.
        </p>
        <p style={{color: "var(--fg)", lineHeight: "var(--lh-loose)", marginBottom: 20}}>
          There are no affiliate links, no sponsored placements, and no recommendation
          rankings. If a device requires the cloud, we say so plainly. If a claim is
          unverified, we mark it.
        </p>
        <p style={{color: "var(--fg)", lineHeight: "var(--lh-loose)", marginBottom: 0}}>
          The Device Database is a project of the Open Home Foundation, the non-profit
          stewards of Home Assistant, ESPHome, Music Assistant, and friends.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container-narrow">
        <h2 style={{marginBottom: 24}}>Voice and tone</h2>
        <p style={{color: "var(--fg-muted)", lineHeight: "var(--lh-loose)", marginBottom: 16}}>
          Neutral and factual. State what a device <em>does</em>, not what we think
          about it. "The sensor reports presence using mmWave radar", not
          "this is a great presence sensor."
        </p>
        <p style={{color: "var(--fg-muted)", lineHeight: "var(--lh-loose)", marginBottom: 16}}>
          Acknowledge uncertainty explicitly. "Reported to work, unverified."
          "This claim has no source, please add one." Trust is built by being
          honest about gaps.
        </p>
        <p style={{color: "var(--fg-muted)", lineHeight: "var(--lh-loose)", marginBottom: 0}}>
          Verbs over adjectives. "Exposes 14 entities" beats "powerful entity support."
        </p>
      </div>
    </section>
  </div>
);

window.EditorialStance = EditorialStance;

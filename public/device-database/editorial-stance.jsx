/* "Editorial stance", standalone page. Reachable from the footer. */

const EditorialStance = () => (
  <div data-screen-label="05 Editorial stance">
    <section className="section" style={{borderTop: "none"}}>
      <div className="container-narrow page-intro">
        <div className="eyebrow section-eyebrow" style={{marginBottom: 8, color: "var(--primary)"}}>About</div>
        <h1 style={{marginBottom: 16}}>Editorial stance</h1>
        <p className="lede" style={{marginBottom: 20}}>There are no good or bad devices. Only different capabilities, compatibilities, and trade-offs.</p>
        <p style={{color: "var(--fg-muted)", lineHeight: "var(--lh-loose)", marginBottom: 0}}>
          This is a living resource. As community contributions grow and real-world
          usage evolves, so does what the database knows. We build in the open, share
          our methodology, and invite scrutiny. Trustworthiness is earned, not claimed.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container-narrow">
        <p style={{color: "var(--fg)", lineHeight: "var(--lh-loose)", marginBottom: 20}}>
          The Device Database is a reference, not a marketing surface. We list what a
          device <em>does</em>, not what we think about it. Entries are written in the
          voice of a wiki editor, declarative, source-backed, and explicit about
          uncertainty. We give you the facts to make your own informed decisions.
        </p>
        <p style={{color: "var(--fg)", lineHeight: "var(--lh-loose)", marginBottom: 20}}>
          There are no sponsored placements and no recommendation rankings. If a device
          requires the cloud, we say so plainly. If a claim is unverified, help us mark it.
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

/* "How it works", standalone page. Same content that used to live on the
   landing page; reachable from the footer. */

const HowItWorks = () => (
  <div data-screen-label="04 How it works">
    <section className="section" style={{borderTop: "none"}}>
      <div className="container-narrow" style={{padding: "var(--space-9) var(--space-7) 0"}}>
        <div className="eyebrow section-eyebrow" style={{marginBottom: 8, color: "var(--primary)"}}>About</div>
        <h1 style={{marginBottom: 16}}>How it works</h1>
        <p className="lede">
          Manufacturer specs say what a device <em style={{color: "var(--fg-muted)"}}>should</em> do.
          The Device Database tracks what it <em style={{color: "var(--primary)"}}>actually</em> does,
          built from anonymized data shared by the community.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <h3>Community shares anonymized data</h3>
            <p>
              Home Assistant users opt in to share what devices they run and how those
              devices behave. No personal data, no identifiers, no addresses.
            </p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>The database aggregates and verifies</h3>
            <p>
              Reports are deduplicated, paired with manufacturer documentation, and
              cross-checked against integration source code before going live.
            </p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Anyone can look it up, no account needed</h3>
            <p>
              You don't have to use Home Assistant to benefit. The database is free,
              open, and built to help you make informed buying decisions.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container-narrow">
        <h2 style={{marginBottom: 24}}>What's in an entry</h2>
        <p style={{color: "var(--fg-muted)", lineHeight: "var(--lh-loose)", marginBottom: 16}}>
          Each device page answers the questions that matter when you're choosing a
          device, whether it requires an internet connection, which Home Assistant
          integration controls it, and how many other people have run it successfully.
        </p>
        <p style={{color: "var(--fg-muted)", lineHeight: "var(--lh-loose)", marginBottom: 0}}>
          Where a claim is unverified, the entry says so explicitly. Where the device
          works one way on one firmware and a different way on another, both are noted.
          The goal is editorial neutrality and source-backed precision, not marketing copy.
        </p>
      </div>
    </section>
  </div>
);

window.HowItWorks = HowItWorks;

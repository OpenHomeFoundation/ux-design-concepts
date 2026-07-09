/* "How it works", standalone page. Same content that used to live on the
   landing page; reachable from the footer. */

const hiwExtIcon = (
  <svg width="0.85em" height="0.85em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink: 0, verticalAlign: "-0.1em", marginLeft: "0.2em"}}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
);

const HiwLink = ({href, children}) => (
  <a href={href} target="_blank" rel="noopener" className="ce-link-ink">{children}{hiwExtIcon}</a>
);

const HowItWorks = () => (
  <div data-screen-label="04 How it works">
    <section className="section" style={{borderTop: "none"}}>
      <div className="container-narrow page-intro">
        <div className="eyebrow section-eyebrow" style={{marginBottom: 8, color: "var(--primary)"}}>About</div>
        <h1 style={{marginBottom: 16}}>How it works</h1>
        <p className="lede">
          Manufacturer specs say what a device <em style={{color: "var(--fg-muted)"}}>should</em> do.
          The Device Database tracks what it <em style={{color: "var(--primary)"}}>actually</em> does,
          built from anonymized real-world data shared by the community.
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
              devices behave. No personal data, no identifiers, no addresses.{" "}
              <a href="https://my.home-assistant.io/redirect/analytics/" target="_blank" rel="noopener" className="ce-link-ink" style={{display: "inline-flex", alignItems: "center", gap: "0.25em"}}>Opt in today.<svg width="0.85em" height="0.85em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink: 0}}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>
            </p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>The database aggregates and verifies</h3>
            <p>
              Submissions are validated, then aggregated. A device only appears once
              enough independent contributions have been received.
            </p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Anyone can look it up, no account needed</h3>
            <p>
              You don't have to use Home Assistant to benefit. The Device Database is
              free, open, and built to help you make more informed decisions.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container-narrow">
        <h2 style={{marginBottom: 24}}>What's in an entry</h2>
        <p style={{color: "var(--fg-muted)", lineHeight: "var(--lh-loose)", marginBottom: 16}}>
          Each device page aims to answer the questions that matter most when choosing a
          device, including compatibility, whether it requires an internet connection, which
          Home Assistant integration controls it, and what others have actually experienced
          running it, good or bad.
        </p>
        <p style={{color: "var(--fg-muted)", lineHeight: "var(--lh-loose)", marginBottom: 0}}>
          Where a claim is unverified, the entry says so explicitly. Where the device
          works one way on one firmware and a different way on another, both are noted.
          The goal is editorial neutrality and source-backed precision, not marketing copy.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container-narrow">
        <h2 style={{marginBottom: 24}}>How to contribute</h2>
        <p style={{color: "var(--fg-muted)", lineHeight: "var(--lh-loose)", marginBottom: 16}}>
          For now, the best way to contribute is to{" "}
          <HiwLink href="https://my.home-assistant.io/redirect/analytics/">opt in to Device Analytics in Home Assistant</HiwLink>.
          Every submission helps grow the database and improve the data available to everyone.
        </p>
        <p style={{color: "var(--fg-muted)", lineHeight: "var(--lh-loose)", marginBottom: 16}}>
          Direct contributions to device pages, such as adding context, correcting details,
          or sharing first-hand experience, are on our{" "}
          <HiwLink href="https://github.com/orgs/OpenHomeFoundation/projects/8/views/1">roadmap</HiwLink>.
          We're starting light: the immediate focus is making the device data collected so far
          accessible and useful to everyone through the Preview edition of this website.
        </p>
        <p style={{color: "var(--fg-muted)", lineHeight: "var(--lh-loose)", marginBottom: 0}}>
          <HiwLink href="https://github.com/orgs/OHF-Device-Database/discussions">Join the community discussion</HiwLink>{" "}
          and help shape the future of the Device Database.
        </p>
      </div>
    </section>
  </div>
);

window.HowItWorks = HowItWorks;

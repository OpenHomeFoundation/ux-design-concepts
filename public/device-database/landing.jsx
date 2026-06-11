/* Landing page */

const Landing = () => {
  const SearchBox = window.SearchBox;
  const totalDevices = window.DEVICES.length;

  return (
    <div data-screen-label="01 Home">
      {/* HERO, single central search box, the sole entry point. */}
      <section className="hero">
        <div className="container hero-center">
          <h1>Find the right device for your smart home

          </h1>

          <p className="hero-lede">Real-world data from millions of Home Assistant installations</p>

          <div className="hero-search-wrap">
            {SearchBox && <SearchBox size="hero"
            placeholder="Search" />}
          </div>

          <div className="hero-actions">
            <a href="#/browse">Browse all {totalDevices} devices →</a>
          </div>
        </div>
      </section>
    </div>);

};

window.Landing = Landing;
/* App root, routing + mount */

const NotFound = () => (
  <div className="container" style={{padding: "80px 0", textAlign: "center"}}>
    <div className="eyebrow" style={{color: "var(--fg-muted)", marginBottom: 12}}>404</div>
    <h1 style={{marginBottom: 16}}>Page not found.</h1>
    <a className="btn btn-primary" href="#/">Back to home</a>
  </div>
);

const App = () => {
  const hash = useHashRoute();
  const route = parseRoute(hash);

  let page;
  if (route.path === "" || route.path === "/") {
    page = <Landing />;
  } else if (route.path === "browse" || route.path.startsWith("browse")) {
    page = <Browse route={route} />;
  } else if (route.path === "how-it-works") {
    page = <HowItWorks />;
  } else if (route.path === "editorial-stance") {
    page = <EditorialStance />;
  } else if (route.path === "about") {
    page = <About />;
  } else if (route.path === "privacy" || route.path.startsWith("privacy/") || route.path === "data-use") {
    page = window.PrivacyHub ? <window.PrivacyHub route={route} /> : <NotFound />;
  } else if (route.path === "impressum") {
    page = window.Impressum ? <window.Impressum /> : <NotFound />;
  } else if (route.path === "signin") {
    // Community-edit increment: sign in page. We don't gate the route
    // itself, it's harmless without the increment, but the increment
    // is what surfaces the entry point.
    page = window.SignIn ? <window.SignIn /> : <NotFound />;
  } else if (route.path === "signup") {
    page = window.CreateAccount ? <window.CreateAccount /> : <NotFound />;
  } else if (route.path === "welcome") {
    page = window.Welcome ? <window.Welcome /> : <NotFound />;
  } else if (route.path === "settings" || route.path.startsWith("settings/")) {
    page = window.Settings ? <window.Settings route={route} /> : <NotFound />;
  } else if (route.path === "you") {
    // your-changes increment: the private "Your changes" dashboard.
    page = window.YourChanges ? <window.YourChanges /> : <NotFound />;
  } else if (route.path.startsWith("contributors/")) {
    const handle = route.path.slice("contributors/".length);
    page = window.ContributorProfile ? <window.ContributorProfile handle={handle} /> : <NotFound />;
  } else if (route.path === "contributors") {
    page = window.ContributorsIndex ? <window.ContributorsIndex /> : <NotFound />;
  } else if (route.path.startsWith("device/")) {
    const id = route.path.slice("device/".length);
    page = <Detail deviceId={id} />;
  } else {
    page = <NotFound />;
  }

  return (
    <div className="app-shell">
      <Nav route={route} />
      <div className="app-main">{page}</div>
      <Footer flush={route.path === "" || route.path === "/"} />
      {window.ContributorHoverHost ? <window.ContributorHoverHost /> : null}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

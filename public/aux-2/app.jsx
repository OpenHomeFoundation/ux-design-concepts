// app.jsx — standalone Connect Proxy setup wizard.
// The reusable wizard pieces now live in wizard.jsx; this file is just the
// centered-stage presentation + tweaks for the standalone artifact.

const { EntryCard, WizardDialog, useProxyWizard } = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "detection": "zbt",
  "musicAssistant": "not-setup"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const { statuses, complete, dismiss, undismiss, reset, adapter } = useProxyWizard(t.detection);
  const [open, setOpen] = React.useState(false);

  return (
    <div className="stage">
      <div className="stage__inner">
        <EntryCard statuses={statuses} onOpen={() => setOpen(true)}></EntryCard>
        <p className="stage__caption">Lives on the AUX-2 device page · opens the setup wizard</p>
      </div>

      {open ? (
        <WizardDialog
          statuses={statuses}
          adapter={adapter}
          maSetup={t.musicAssistant === "setup"}
          onClose={() => setOpen(false)}
          onComplete={complete}
          onDismiss={dismiss}
          onUndismiss={undismiss}
        ></WizardDialog>
      ) : null}

      <window.TweaksPanel>
        <window.TweakSection label="Plugged in adapter"></window.TweakSection>
        <window.TweakRadio
          label=""
          value={t.detection}
          options={[{ value: "zbt", label: "ZBT-2" }, { value: "zwa", label: "ZWA-2" }, { value: "none", label: "None" }]}
          onChange={(v) => setTweak("detection", v)}
        ></window.TweakRadio>
        <window.TweakSection label="Music Assistant"></window.TweakSection>
        <window.TweakRadio
          label=""
          value={t.musicAssistant}
          options={[{ value: "not-setup", label: "Not set up" }, { value: "setup", label: "Set up" }]}
          onChange={(v) => setTweak("musicAssistant", v)}
        ></window.TweakRadio>
        <window.TweakButton label="Reset progress" onClick={reset}></window.TweakButton>
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App></App>);

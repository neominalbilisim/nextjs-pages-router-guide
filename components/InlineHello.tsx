export default function InlineHello() {
  return (
    <p style={{ color: "var(--text)", margin: 0 }}>
      👋 Bu component <code>next/dynamic</code> ile lazy load edildi
      (default export).
    </p>
  );
}

export function HeavyNamedExport() {
  return (
    <p style={{ color: "var(--text)", margin: 0 }}>
      📦 Bu ise aynı dosyanın <strong>named export</strong>&apos;u —{" "}
      <code>
        dynamic(() =&gt; import(...).then((mod) =&gt; mod.HeavyNamedExport))
      </code>{" "}
      ile yüklendi.
    </p>
  );
}

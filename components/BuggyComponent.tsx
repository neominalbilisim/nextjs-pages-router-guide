export default function BuggyComponent({ crash }: { crash: boolean }) {
  if (crash) {
    // Render sırasında throw -> Error Boundary'nin yakalayabileceği tek tür hata bu.
    throw new Error("BuggyComponent kasıtlı olarak render'da patladı.");
  }

  return (
    <div className="callout">
      Her şey yolunda. Aşağıdaki butona basınca bu component render
      sırasında <code>throw</code> edecek.
    </div>
  );
}

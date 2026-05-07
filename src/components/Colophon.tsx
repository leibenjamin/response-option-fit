function colophonTemplateHtml() {
  if (typeof document === "undefined") return "";
  return document.getElementById("colophon-template")?.innerHTML ?? "";
}

export function Colophon() {
  return (
    <div className="lab lab--colophon">
      <main
        id="colophon"
        className="colophon"
        aria-labelledby="colophon-title"
        data-testid="colophon"
        dangerouslySetInnerHTML={{ __html: colophonTemplateHtml() }}
      />
      <footer className="foot">
        <p className="foot-line">
          <a
            className="foot-link"
            href={import.meta.env.BASE_URL}
            data-testid="return-to-exhibit"
          >
            Return to overview
          </a>
        </p>
      </footer>
    </div>
  );
}

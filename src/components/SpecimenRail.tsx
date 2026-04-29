import type { Specimen } from "../types/specimen";

type Props = {
  specimens: Specimen[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function SpecimenRail({ specimens, activeId, onSelect }: Props) {
  return (
    <nav className="rail" aria-label="Specimen rail" data-testid="specimen-rail">
      <p className="rail-eyebrow">Specimens</p>
      <ol className="rail-list">
        {specimens.map((s) => {
          const isActive = s.id === activeId;
          return (
            <li key={s.id} className={`rail-item ${isActive ? "is-active" : ""}`}>
              <button
                type="button"
                className="rail-button"
                aria-current={isActive ? "true" : undefined}
                data-testid={`rail-${s.id}`}
                onClick={() => onSelect(s.id)}
              >
                <span className="rail-num">{s.number}</span>
                <span className="rail-body">
                  <span className="rail-label">{s.railLabel}</span>
                  <span className="rail-pattern">{s.patternLabel}</span>
                </span>
                <span className="rail-tick" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

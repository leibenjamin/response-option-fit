import type { BucketSplitterConfig, Vignette } from "../../../types/workbench";
import type { BucketSplitterState } from "../../../lib/diagnostics";
import { useAnnouncer } from "../../../lib/announcer";

type Props = {
  config: BucketSplitterConfig;
  state: BucketSplitterState;
  vignettes: Vignette[];
  onStateChange: (state: BucketSplitterState) => void;
};

export function BucketSplitter({ config, state, vignettes, onStateChange }: Props) {
  const announce = useAnnouncer();

  const applySplit = (splitIndex: number) => {
    const before = config.items[splitIndex - 1]?.label ?? "";
    const after = config.items[splitIndex]?.label ?? "";
    onStateChange({ kind: "bucket_splitter", splitIndex });
    announce.split(before, after);
  };

  const removeSplit = () => {
    if (state.splitIndex === null) return;
    const before = config.items[state.splitIndex - 1]?.label ?? "";
    const after = config.items[state.splitIndex]?.label ?? "";
    onStateChange({ kind: "bucket_splitter", splitIndex: null });
    announce.unsplit(before, after);
  };

  return (
    <div
      className="widget widget--bucket-splitter"
      data-testid="widget-bucket-splitter"
      aria-label={`${vignettes.length} vignette bucket splitter`}
    >
      {announce.status}
      <pre hidden data-testid="widget-state">
        {JSON.stringify(state)}
      </pre>

      <ol className="bucket-list">
        {config.items.map((item, index) => {
          const splitIndex = index + 1;
          const next = config.items[index + 1];
          const canSplit = next && config.candidateSplits.includes(splitIndex);
          const active = state.splitIndex === splitIndex;

          return (
            <li key={item.id} className="bucket-row">
              <div className="bucket-item">
                <span className="bucket-item-label">{item.label}</span>
              </div>
              {canSplit && (
                <div className={`bucket-divider ${active ? "is-active" : ""}`}>
                  {active ? (
                    <>
                      <span className="bucket-divider-line" aria-hidden="true" />
                      <button
                        type="button"
                        className="widget-secondary-button"
                        onClick={removeSplit}
                      >
                        Remove split
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="bucket-split-button"
                      aria-label={`Split between '${item.label}' and '${next.label}'`}
                      onClick={() => applySplit(splitIndex)}
                    >
                      Split here
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

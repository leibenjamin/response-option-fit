import { Settings } from "lucide-react";

type Props = {
  onClick: () => void;
};

export function SettingsButton({ onClick }: Props) {
  return (
    <button
      type="button"
      className="settings-button"
      aria-label="Open settings"
      data-testid="settings-button"
      onClick={onClick}
    >
      <Settings
        className="settings-button-icon"
        size={18}
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <span className="settings-button-label">Settings</span>
    </button>
  );
}

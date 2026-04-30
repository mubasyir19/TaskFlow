interface ToggleProps {
  checked?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({
  checked = false,
  onChange,
  disabled = false,
}: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
      className={`focus:ring-secondary relative inline-flex h-5 w-11 items-center rounded-full transition-colors duration-300 focus:ring focus:ring-offset-2 focus:outline-none ${disabled ? "cursor-not-allowed opacity-50" : ""} ${checked ? "bg-primary" : "bg-gray-300"} `}
    >
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${checked ? "translate-x-6" : "translate-x-1"} `}
      />
    </button>
  );
}

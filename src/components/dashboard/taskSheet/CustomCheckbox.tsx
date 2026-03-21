import React from "react";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: string;
  size?: number;
  label?: string;
};

const CustomCheckbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  color = "#B2CBD7",
  size = 20,
  label
}) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center border
        ${checked ? `bg-${color} border-${color}` : `border-${color}`}`}
      >
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 111.42-1.42l2.54 2.54 6.54-6.54a1 1 0 011.42 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {label && <span>{label}</span>}

      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
};

export default CustomCheckbox;
import type { IconType } from "react-icons/lib";

const SectionIcon = ({
  h = "32px",
  w = "32px",
  Icon,
  size = 14,
}: {
  h?: string;
  w?: string;
  Icon: IconType;
  size?: number;
}) => {
  return (
    <div
      className={`rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400`}
      style={{
        height: h,
        width: w
      }}
    >
      <Icon size={size} />
    </div>
  );
};

export default SectionIcon;

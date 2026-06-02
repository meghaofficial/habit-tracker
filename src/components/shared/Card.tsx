import type { ReactNode } from "react";

interface CardProps {
  styling?: string;
  cardWidth?: string;
  bodyHeight?: string;
  children: ReactNode;
  heading: string;
  subHeading?: string;
  specialCard?: boolean;
}

const Card = ({
  styling,
  cardWidth = "w-full",
  bodyHeight = "h-full",
  children,
  heading,
  subHeading,
  specialCard = false,
}: CardProps) => {
  return (
    <div
      className={`relative overflow-x-hidden rounded-2xl h-fit google-sans border border-white/10 ${cardWidth} light:border-black/10 bg-black/20 light:bg-white/20 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl ${styling}`}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#8B5CF6]/10 blur-3xl" />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-[22px] font-bold text-white light:text-lightText">
            {heading}
          </p>
          {subHeading && (
            <p className="mt-1 text-[13px] leading-6 text-gray-500">
              {subHeading}
            </p>
          )}
        </div>
        {specialCard && (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-linear-to-br from-[#6366F1] to-[#A855F7] shadow-[0_10px_30px_rgba(99,102,241,0.35)]">
            ✦
          </div>
        )}
      </div>
      <div className={`overflow-y-auto hide-scrollbar ${bodyHeight}`}>{children}</div>
    </div>
  );
};

export default Card;

type CardHeaderProps = {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  subTitle: string;
}

const CardHeader = ({ icon: Icon, title, subTitle } : CardHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
        <Icon size={14} />
      </div>
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="text-[10px] text-gray-500">
          {subTitle}
        </p>
      </div>
    </div>
  );
};

export default CardHeader;

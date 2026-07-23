const Saving = ({ saveStatus }: { saveStatus: string }) => {
  return (
    <>
      {saveStatus === "saving" && (
        <span className="text-gray-500 text-[8px] tracking-wider">
          Saving...
        </span>
      )}
      {saveStatus === "saved" && (
        <div className="flex items-center gap-2 p-2">
          <svg
            className="h-3 w-3 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>

          <span className="text-green-600 text-[8px] tracking-wider -ms-1">
            Saved
          </span>
        </div>
      )}
    </>
  );
};

export default Saving;

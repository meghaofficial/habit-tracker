const MonthSideSection = ({ rows }: { rows: number }) => {
  return (
    <>
      <div className="border">
        <p className="smText text-white p-5.5 text-center border-b border-black bg-periwinkleLight" style={{ fontWeight: "bolder" }}>DAILY HABITS</p>
        <p className="smText p-[8.5px] text-center bg-mintMist border-b border-tropicalAqua" style={{ fontWeight: "bold" }}>HABITS</p>
        {/* task input */}
        {Array.from({ length: rows }).map((_, index) => (
          <div className="text-[12px] px-2 p-1 flex items-center gap-2 border-b border-gray-300" key={index}>
            <span>{index + 1}</span>
            <input type="text" className="outline-none w-full" title="value" />
          </div>
        ))}
      </div>
    </>
  )
}

export default MonthSideSection
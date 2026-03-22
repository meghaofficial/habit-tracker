const TopTen = () => {
  return (
    <>
      <div className="border">
        <p className="smText text-center p-3.5 text-subHeaderText bg-subHeaderBg border-b" style={{ fontWeight: "bolder" }}>TOP 5 MOST CONSISTENT HABITS</p>
        <p className="text-center bg-smHeaderBg border-b border-subHeaderText flex items-center text-[8px] font-semibold">
          <span className="py-[9.5px] tracking-widest w-[70%] text-center">HABIT</span>
          <span className="py-[9.5px] tracking-widest w-[30%] text-center">PERCENTAGE</span>
        </p>
        {/* task input */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="text-[10px] flex items-center border-b border-gray-300" key={index}>
            <p className="w-[70%] px-1 border-r border-gray-300 text-center">
              habit 1
            </p>
            <p className="w-[30%] px-2 p-1 text-center">30%</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default TopTen

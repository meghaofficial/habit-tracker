import React from 'react'

const Logo = () => {
  return (
    <>
      <div className="flex items-center gap-0.5">
        <div className="relative overflow-hidden flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-[#38BDF8] via-[#6366F1] to-[#A855F7]">
          <span className="relative z-10 text-[30px] font-bold text-white playfair-display">
            H
          </span>
        </div>
        <span className="text-[32px]/[0.5px] font-bold playfair-display">abitify</span>
      </div>
    </>
  )
}

export default Logo

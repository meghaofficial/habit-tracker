import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingActionButtonComp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Smooth Chat Popup Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="mb-4 w-150 h-100 bg-[#161616] rounded-2xl shadow-2xl border border-[#1f1f1f] flex flex-col overflow-hidden origin-bottom-right"
          >
            {/* Header */}
            <div className="py-3 px-6 text-white flex items-center justify-between shadow-sm">
              <span className="font-semibold tracking-wide">Your Progress Analysis</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-indigo-700 p-1.5 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className='flex items-center gap-3 flex-col px-4'>
              {Array.from({ length: 8 }).map((_, index) => (
                <div className='rounded-lg bg-gray-500/50 h-7 w-full animate-pulse'></div>
              ))}
            </div>

            {/* Chat Messages Space */}
            {/* <div className="flex-1 p-4 bg-gray-50 overflow-y-auto space-y-4">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] border border-gray-100">
                <p className="text-sm text-gray-800">Hi there! 👋 How can I help you today?</p>
              </div>
            </div> */}

            {/* Input Box */}
            {/* <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                Send
              </button>
            </div> */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 group float-right"
      >
        <GenerateSiteButton />
        {/* <svg 
          xmlns="http://w3.org" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          stroke="currentColor" 
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          )}
        </svg> */}
      </button>
    </div>
  );
}




function GenerateSiteButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate your site generation process
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="
          relative flex items-center gap-2 px-5 py-3 
          rounded-full text-white font-medium text-[14px]
          bg-linear-to-b from-[#7c4dff] to-[#5e2ced]
          border border-[#9b75ff]/40 shadow-[0_0_20px_rgba(124,77,255,0.4)]
          transition-all duration-200 cursor-pointer select-none
          hover:brightness-110 hover:shadow-[0_0_25px_rgba(124,77,255,0.6)]
          active:scale-[0.98] disabled:opacity-80 disabled:pointer-events-none
        "
      >
        {/* Sparkle Icons */}
        <div className="relative w-6 h-6 flex items-center justify-center">
          {/* Main Large Sparkle */}
          <svg 
            className={`w-5 h-5 text-white fill-current transition-transform ${isLoading ? 'animate-spin' : ''}`}
            viewBox="0 0 24 24"
          >
            <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
          </svg>
          
          {/* Small Secondary Sparkle */}
          {!isLoading && (
            <svg 
              className="w-2.5 h-2.5 text-purple-200 fill-current absolute -bottom-0.5 -left-1 opacity-70"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
            </svg>
          )}
        </div>

        {/* Button Text */}
        <span className="tracking-wide drop-shadow-sm">
          {isLoading ? 'Analysing...' : 'Analyse'}
        </span>
      </button>
  );
}




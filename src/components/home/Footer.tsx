const Footer = () => {
  return (
    <footer className="mt-24 border-t border-darkBorder light:border-lightBorder google-sans">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-0.5">
              <div className="relative overflow-hidden flex h-6 w-6 items-center justify-center rounded-lg bg-linear-to-br from-[#38BDF8] via-[#6366F1] to-[#A855F7]">
                <span className="relative z-10 font-bold text-white playfair-display">
                  H
                </span>
              </div>
              <span className=" font-bold playfair-display">abitify</span>
            </div>

            <p className="mt-3 text-sm leading-6 text-darkSubText light:text-lightSubText">
              Build better habits, understand your progress, and stay consistent
              with your goals.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Contact
            </p>
            <a
              href="mailto:support@habitify.com"
              className="mt-3 block text-[12px] text-gray-400 transition-colors hover:text-white"
            >
              support@habitify.com
            </a>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Follow
            </p>

            <div className="mt-3 flex items-center gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-500 text-[12px] transition-colors hover:text-white"
              >
                Instagram
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-gray-500 text-[12px] transition-colors hover:text-white"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/5 pt-6 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Habitify. All rights reserved.</p>

          <p>Built for consistency.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

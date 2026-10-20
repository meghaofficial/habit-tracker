type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return [...new Set(pages)];
  };

  const buttonClass =
    "flex h-6 min-w-6 items-center justify-center rounded-lg border text-[10px] transition-colors";

  return (
    <nav
      aria-label="Pagination"
      className="flex w-full items-center justify-center gap-1.5"
    >
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`${buttonClass} border-white/10 bg-white/5 px-3 text-gray-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Prev
      </button>

      {getPages().map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-9 min-w-6 items-center justify-center text-sm text-gray-500"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-current={currentPage === page ? "page" : undefined}
            onClick={() => onPageChange(page)}
            className={`${buttonClass} ${
              currentPage === page
                ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-400"
                : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`${buttonClass} border-white/10 bg-white/5 px-3 text-gray-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Next
      </button>
    </nav>
  );
}

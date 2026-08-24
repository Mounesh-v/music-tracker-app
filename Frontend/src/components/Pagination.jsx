export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#9CA3AF] hover:text-white hover:bg-white/[0.06] transition-all"
        >
          Prev
        </button>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded-xl text-xs font-medium transition-all duration-150 ${
            page === currentPage
              ? "bg-[#5FD0B3] text-[#080A0F]"
              : "text-[#9CA3AF] hover:text-white hover:bg-white/[0.06]"
          }`}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#9CA3AF] hover:text-white hover:bg-white/[0.06] transition-all"
        >
          Next
        </button>
      )}
    </div>
  );
}

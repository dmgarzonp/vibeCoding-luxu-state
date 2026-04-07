import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <Link
        href={currentPage > 1 ? `/?page=${currentPage - 1}` : '#'}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border border-nordic/10 transition-all duration-300 ${
          currentPage === 1
            ? 'opacity-30 cursor-not-allowed bg-transparent text-nordic'
            : 'hover:border-mosque hover:text-mosque bg-white text-nordic shadow-sm'
        }`}
        aria-disabled={currentPage === 1}
      >
        <span className="material-icons text-lg">chevron_left</span>
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5 px-2">
        {pages.map((page) => (
          <Link
            key={page}
            href={`/?page=${page}`}
            className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all duration-300 ${
              currentPage === page
                ? 'bg-nordic text-white shadow-md scale-105'
                : 'text-nordic/60 hover:bg-white hover:text-nordic hover:shadow-sm'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {/* Next Button */}
      <Link
        href={currentPage < totalPages ? `/?page=${currentPage + 1}` : '#'}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border border-nordic/10 transition-all duration-300 ${
          currentPage === totalPages
            ? 'opacity-30 cursor-not-allowed bg-transparent text-nordic'
            : 'hover:border-mosque hover:text-mosque bg-white text-nordic shadow-sm'
        }`}
        aria-disabled={currentPage === totalPages}
      >
        <span className="material-icons text-lg">chevron_right</span>
      </Link>
    </div>
  );
};

export default Pagination;

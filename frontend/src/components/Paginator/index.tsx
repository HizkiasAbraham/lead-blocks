import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginatorProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

function Paginator({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginatorProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Page Info */}
      <span className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`
          px-3 py-2 rounded-md text-sm font-medium transition-colors
          ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }
        `}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`
          px-3 py-2 rounded-md text-sm font-medium transition-colors
          ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }
        `}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

export default Paginator


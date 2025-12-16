interface PagerProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    totalItems: number;
}

function Pager({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }: PagerProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
            <div className="text-gray-400 text-sm">
                Showing {startItem} to {endItem} of {totalItems} stocks
            </div>

            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg transition-all ${
                        currentPage === 1
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                >
                    ← Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                    {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page as number)}
                                className={`px-3 py-1 rounded-lg transition-all ${
                                    currentPage === page
                                        ? 'bg-blue-500 text-white font-semibold'
                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg transition-all ${
                        currentPage === totalPages
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                >
                    Next →
                </button>
            </div>
        </div>
    );
}

export default Pager;

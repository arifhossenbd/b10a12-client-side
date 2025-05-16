import { motion } from "framer-motion";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftOffset = Math.floor(maxVisiblePages / 2);
      let startPage = currentPage - leftOffset;
      let endPage = currentPage + leftOffset;

      if (startPage < 1) {
        startPage = 1;
        endPage = maxVisiblePages;
      }

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - maxVisiblePages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center gap-2 mt-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-sm text-base flex flex-col items-center justify-center"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <FaAngleDoubleLeft />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-sm text-base flex flex-col items-center justify-center"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaAngleLeft />
      </motion.button>

      {getPageNumbers().map((page) => (
        <motion.button
          key={page}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`btn btn-sm text-base md:text-lg flex flex-col items-center justify-center ${
            currentPage === page ? "btn-active" : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </motion.button>
      ))}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-sm text-base flex flex-col items-center justify-center"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaAngleRight />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-sm text-base flex flex-col items-center justify-center"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <FaAngleDoubleRight />
      </motion.button>
    </div>
  );
};

export default Pagination;

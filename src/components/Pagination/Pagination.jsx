import React from "react";
import ReactPaginate from "react-paginate";
import PropTypes from "prop-types";
const Pagination = ({ setPageNumber, pageCount, take }) => {
  const handlePageClick = (event) => {
    setPageNumber(event.selected + 1);
    console.log("clicked");
  };
  return (
    <div className="flex items-center justify-end py-4">
      <ReactPaginate
        nextLabel="Next"
        marginPagesDisplayed={2}
        onPageChange={handlePageClick}
        pageRangeDisplayed={1}
        pageCount={Math.ceil(pageCount / take)}
        previousLabel="Prev"
        renderOnZeroPageCount={null}
        containerClassName="flex justify-center text-black gap-2 items-center"
        pageClassName="flex justify-center w-full px-4 h-[38px] items-center  border rounded-md border-black text-black cursor-pointer hover:bg-blueSecondary hover:text-white"
        activeClassName="bg-blueSecondary px-4 border text-white"
        previousClassName="flex justify-center w-full px-4 h-[38px] items-center  border rounded-md border-black text-black cursor-pointer hover:bg-blueSecondary hover:text-white"
        nextClassName="flex justify-center w-full px-4 h-[38px] items-center  border rounded-md border-black text-black cursor-pointer hover:bg-blueSecondary hover:text-white"
        disabledClassName="disabled-item"
      />
    </div>
  );
};
Pagination.propTypes = {
  setPageNumber: PropTypes.func,
  pageCount: PropTypes.number,
  take: PropTypes.number,
};
export default Pagination;
// pageCount: PropTypes.number,

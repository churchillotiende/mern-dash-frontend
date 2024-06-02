import { Pagination } from "@mantine/core";
import { useState } from "react";

function PaginationLinks({ paginatedData, onLinkClicked }) {
  const [activePage, setPage] = useState(1);

  function changePage(page) {
    setPage(page);
    onLinkClicked(paginatedData?.links[page]?.url);
  }

  return (
    paginatedData && (
      <section className="flex justify-between items-center px-3 py-2 flex-col lg:flex-row">
        <span className="text-dark text-sm">
          Showing {paginatedData.from} to {paginatedData.to} of
          {" " + paginatedData.total}
        </span>

        <Pagination
          total={paginatedData?.last_page ?? 0}
          page={activePage}
          onChange={changePage}
        />
      </section>
    )
  );
}

export default PaginationLinks;

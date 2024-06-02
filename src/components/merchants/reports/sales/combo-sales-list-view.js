import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import { formatNumber } from "../../../../lib/shared/data-formatters";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import {
  fetchComboSalesList,
  fetchSalesSummaryReceipt,
} from "../../../../store/merchants/reports/sales/sales-reports-slice";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { Button } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconArrowsMaximize } from "@tabler/icons";

function ComboSalesListView() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const rawData = useSelector((state) => state.salesReports.comboSalesList);
  const comboSalesListStatus = useSelector(
    (state) => state.salesReports.comboSalesListStatus
  );
  const isLoading = comboSalesListStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (comboSalesListStatus === "idle") {
      store.dispatch(fetchComboSalesList(params));
    }
  }, [session, status, comboSalesListStatus]);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (!startDate && !endDate) {
      store.dispatch(fetchComboSalesList(params));
      return;
    }

    if (startDate && endDate) {
      params["startDate"] = startDate;
      params["endDate"] = endDate;
      store.dispatch(fetchComboSalesList(params));
    }
  }, [startDate, endDate, session, status]);

  function onStartDateChanged(event) {
    setStartDate(event.target.value);
  }

  function onEndDateChanged(event) {
    setEndDate(event.target.value);
  }

  function onPaginationLinkClicked(page) {
    if (!page) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchComboSalesList(params));
  }

  const isReceiptLoading = useSelector(
    (state) => state.salesReports.salesSummaryReceiptStatus === "loading"
  );

  function downloadReceipt() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    params["startDate"] = startDate;
    params["endDate"] = endDate;
    store.dispatch(fetchSalesSummaryReceipt(params));
  }

  return (
    <div className="flex flex-col space-y-2 w-full mb-8">
      <Card>
        <TableCardHeader>
          <div className="flex flex-wrap space-y-1 w-full md:w-6/12 xl:w-fit">
            <div className="text-dark text-sm">From</div>
            <input
              type="date"
              name="search"
              className="input-primary h-12 text-grey-100"
              placeholder="dd/mm/yyyy"
              onChange={onStartDateChanged}
              value={startDate}
            />
          </div>

          <div className="flex flex-wrap space-y-1 w-full md:w-6/12 md:pl-2 xl:w-fit">
            <div className="text-dark text-sm">To</div>
            <input
              type="date"
              name="search"
              className="input-primary h-12 text-grey-100"
              placeholder="dd/mm/yyyy"
              onChange={onEndDateChanged}
              value={endDate}
            />
          </div>
        </TableCardHeader>
        <Table>
          <Thead>
            <tr>
              <th scope="col" className="th-primary">
                ID NO
              </th>
              <th scope="col" className="th-primary">
                COMBO
              </th>
              <th scope="col" className="th-primary text-right">
                QUANTITY
              </th>
              <th scope="col" className="th-primary text-right">
                SUBTOTAL
              </th>
              <th scope="col" className="th-primary text-right">
                ACTIONS
              </th>
            </tr>
          </Thead>
          <tbody>
            {!isLoading &&
              rawData &&
              rawData.data.map((item) => (
                <Trow key={item.combo_sellable_id}>
                  <>
                    <td>{item.combo_sellable_id}</td>
                    <td>{item.combo_sellable?.name ?? "-"}</td>
                    <td className="text-right">
                      {formatNumber(item.total_quantity)}
                    </td>
                    <td className="text-right">{formatNumber(item.total)}</td>
                    <td className="py-0 pl-14 2xl:pl-4">
                      <span className="flex justify-end items-center w-full gap-2">
                        <Link
                          href={`/merchants/reports/sales/combo-sales/${item.combo_sellable_id}`}
                        >
                          <Button
                            leftIcon={<IconArrowsMaximize size={14} />}
                            size="xs"
                            variant="outline"
                          >
                            <span className="mt-1">Details</span>
                          </Button>
                        </Link>
                      </span>
                    </td>
                  </>
                </Trow>
              ))}
            {!isLoading && rawData && (
              <>
                <Trow>
                  <>
                    <td colSpan={2} className="text-lg font-bold">
                      TOTAL
                    </td>
                    <td className="text-right text-lg font-bold">
                      {formatNumber(rawData?.grand_quantity ?? 0)}
                    </td>
                    <td className="text-right text-lg font-bold">
                      {formatNumber(rawData?.grand_total ?? 0)}
                    </td>
                  </>
                </Trow>
              </>
            )}
          </tbody>
        </Table>

        {isLoading && (
          <div className="flex justify-center w-full p-3 bg-light rounded-lg">
            <StatelessLoadingSpinner />
          </div>
        )}

        <PaginationLinks
          paginatedData={rawData}
          onLinkClicked={onPaginationLinkClicked}
        />
      </Card>
    </div>
  );
}

export default ComboSalesListView;

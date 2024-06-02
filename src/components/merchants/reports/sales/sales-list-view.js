import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import Card from "../../../ui/layouts/card";
import { Table, Thead } from "../../../ui/layouts/scrolling-table";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import {
  formatNumber,
  formatDate,
} from "../../../../lib/shared/data-formatters";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import {
  fetchSalesList,
  fetchSalesListReceipt,
} from "../../../../store/merchants/reports/sales/sales-reports-slice";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";

function SalesListView() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(null);

  const rawData = useSelector((state) => state.salesReports.salesList);
  const salesListStatus = useSelector(
    (state) => state.salesReports.salesListStatus
  );
  const isLoading = salesListStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    //TODO::Allow refreshing
    if (salesListStatus === "idle") {
      store.dispatch(fetchSalesList({ accessToken: session.user.accessToken }));
    }
  }, [session, status, salesListStatus]);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (!startDate && !endDate) {
      store.dispatch(fetchSalesList(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }

    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(fetchSalesList(params));
  }, [startDate, endDate, session, status]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }
    setCurrentPage(page);

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchSalesList(params));
  }

  const isReceiptLoading = useSelector(
    (state) => state.salesReports.salesListReceiptStatus === "loading"
  );

  function downloadReceipt() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    params["startDate"] = startDate;
    params["endDate"] = endDate;
    store.dispatch(fetchSalesListReceipt(params));
  }

  const actions = (
    <Fragment>
      <ActionIconButton
        icon="fa-solid fa-file-export"
        isLoading={isReceiptLoading}
        tooltip="Export"
        clickHandler={downloadReceipt}
      />
    </Fragment>
  );

  return (
    <Card>
      <TableCardHeader actions={actions}>
        <div className="flex flex-wrap space-y-1 w-full md:w-6/12 xl:w-fit">
          <div className="text-dark text-sm">From</div>
          <input
            type="date"
            name="search"
            className="input-primary h-12 text-grey-100"
            placeholder="dd/mm/yyyy"
            onChange={(event) => {
              setStartDate(event.target.value);
            }}
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
            onChange={(event) => {
              setEndDate(event.target.value);
            }}
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
              CLIENT NAME
            </th>
            <th scope="col" className="th-primary">
              GOOD/SERVICE
            </th>
            <th scope="col" className="th-primary text-right">
              QUANTITY
            </th>
            <th scope="col" className="th-primary text-right">
              SELLING PRICE
            </th>
            <th scope="col" className="th-primary text-right">
              SUBTOTAL
            </th>
            <th scope="col" className="th-primary text-right">
              DISCOUNT*
            </th>
            <th scope="col" className="th-primary">
              PAYMENT METHOD(S)
            </th>
            <th scope="col" className="th-primary">
              SOLD BY
            </th>
            <th scope="col" className="th-primary text-right">
              SOLD ON
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            rawData &&
            rawData.data.map((item) => (
              <tr className="bg-white border-b" key={item.id}>
                <td>{item.id}</td>
                <td>{item.transaction?.client?.name ?? "-"}</td>
                <td>{item.sellable?.sellable?.name ?? "-"}</td>
                <td className="text-right">{formatNumber(item.quantity)}</td>
                <td className="text-right">{formatNumber(item.cost)}</td>
                <td className="text-right">{formatNumber(item.total)}</td>
                <td className="text-right">{formatNumber(item.discount)}</td>
                <td>
                  {item.transaction?.transaction_payments[0]?.type}
                  {item.transaction?.transaction_payments?.length > 1
                    ? " +"
                    : ""}
                </td>

                <td>
                  {item.transaction?.changeables.slice(-1)[0]?.user?.name ??
                    "-"}
                </td>
                <td className="text-right">
                  {formatDate(item.transaction?.date)}
                </td>
              </tr>
            ))}

          {!isLoading && rawData && (
            <>
              <tr className="bg-white border-b text-lg">
                <th
                  scope="row"
                  colSpan="5"
                  className="text-primary font-bold text-right"
                >
                  GRAND TOTAL
                </th>
                <td className="text-right text-dark tracking-wider text-xl font-bold">
                  {formatNumber(rawData.grand_total)}
                </td>
                <td className="text-right text-dark tracking-wider text-xl font-bold">
                  {formatNumber(rawData.item_discount_sum)}
                </td>
              </tr>

              <tr className="bg-white border-b text-lg">
                <td
                  className="text-xs font-bold text-dark mt-2 text-right"
                  colSpan={7}
                >
                  *Only showing item discounts, not transaction discounts
                </td>
              </tr>
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
  );
}

export default SalesListView;

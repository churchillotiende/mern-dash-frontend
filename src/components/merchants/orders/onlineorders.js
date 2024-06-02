import Card from "../../ui/layouts/card";
import { useSelector } from "react-redux";
import { Table, Thead, Trow } from "../../ui/layouts/scrolling-table";
import PaginationLinks from "../../ui/layouts/pagination-links";
import { Fragment, useEffect, useState } from "react";
import { formatDate } from "../../../lib/shared/data-formatters";
import StatelessLoadingSpinner from "../../ui/utils/stateless-loading-spinner";
import { useSession } from "next-auth/react";
import { Link } from "react-router-dom";
import LinkButton from "../../ui/actions/link-button";
import ActionIconButton from "../../ui/actions/action-icon-button";
import TableCardHeader from "../../ui/layouts/table-card-header";
import {
  fetchOrdersListPDF,
  fetchOrdersListExcel,
} from "../../../store/merchants/onlineorders/onlineorders-slice";
import store from "../../../store/store";
import { Badge } from "@mantine/core";
import { Button } from "@mantine/core";

import { getOnlineOrders } from "../../../store/merchants/onlineorders/onlineorders-slice";
import OrderChanges from "./changes";

function OnlineOrdersTable() {
  const { data: session, status } = useSession();

  function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
  }

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(null);

  const onlineOrdersStatus = useSelector(
    (state) => state.onlineOrders.getOnlineOrdersStatus
  );
  const onlineOrders = useSelector(
    (state) => state.onlineOrders.getOnlineOrders
  );

  const isLoadingList = onlineOrdersStatus === "loading";

  const orders = onlineOrders?.data;
  const raw_orders = onlineOrders;

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (!startDate && !endDate) {
      store.dispatch(getOnlineOrders(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }

    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(getOnlineOrders(params));
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

    store.dispatch(getOnlineOrders(params));
  }

  const isLoadingPdf = useSelector(
    (state) => state.onlineOrders.fetchOrdersListPDFStatus === "loading"
  );

  const isLoadingExcel = useSelector(
    (state) => state.onlineOrders.fetchOrdersListExcelStatus === "loading"
  );

  function downloadPDF() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    params["startDate"] = startDate;
    params["endDate"] = endDate;
    store.dispatch(fetchOrdersListPDF(params));
  }

  function downloadExcel() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    params["startDate"] = startDate;
    params["endDate"] = endDate;
    store.dispatch(fetchOrdersListExcel(params));
  }

  const actions = (
    <Fragment>
      <ActionIconButton
        icon="fa-solid fa-file-export"
        isLoading={isLoadingExcel}
        tooltip="Excel"
        clickHandler={downloadExcel}
      />

      <ActionIconButton
        icon="fa-solid fa-download"
        isLoading={isLoadingPdf}
        tooltip="PDF"
        clickHandler={downloadPDF}
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
              NO
            </th>
            <th scope="col" className="th-primary">
              CLIENT
            </th>
            <th scope="col" className="th-primary">
              PHONE
            </th>
            <th scope="col" className="th-primary">
              RECEIPT NO
            </th>
            <th scope="col" className="th-primary">
              TOTAL
            </th>
            <th scope="col" className="th-primary">
              STATUS
            </th>
            <th scope="col" className="th-primary">
              DATE
            </th>
            <th scope="col" className="th-primary text-right">
              ACTIONS
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoadingList &&
            orders &&
            orders.map((item) => (
              <Trow key={item.id}>
                <Fragment>
                  <td className="py-3 px-6 text-sm font-medium text-primary underline underline-offset-2 whitespace-nowrap">
                    <Link href={"/merchants/orders/view/" + item.id}>
                      {item.id}
                    </Link>
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    {item.client.name}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    {item.client.phone}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    {item.receipt_no}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    Ksh{" "}
                    <span className="tracking-wider">
                      {" "}
                      {formatNumber(item.cart_items[0].total)}{" "}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    <span className="text-sm">
                      {item.status === "completed" && (
                        <Badge
                          variant="gradient"
                          gradient={{ from: "teal", to: "lime", deg: 105 }}
                        >
                          Completed
                        </Badge>
                      )}
                      {item.status === "confirmed" && (
                        <Badge
                          variant="gradient"
                          gradient={{ from: "teal", to: "blue", deg: 60 }}
                        >
                          Confirmed
                        </Badge>
                      )}
                      {item.status === "pending" && (
                        <Badge
                          variant="gradient"
                          gradient={{ from: "orange", to: "red" }}
                        >
                          Pending
                        </Badge>
                      )}
                      {item.status === "processing" && (
                        <Badge
                          variant="gradient"
                          gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
                        >
                          Processing
                        </Badge>
                      )}
                      {item.status === "declined" && (
                        <Badge
                          variant="gradient"
                          gradient={{ from: "orange", to: "red" }}
                        >
                          Declined
                        </Badge>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap">
                    {formatDate(item.date)}
                  </td>
                  <td className="py-3 px-6 text-sm whitespace-nowrap text-right flex gap-2 justify-end">
                    <Link href={`/merchants/orders/view/${item.id}`}>
                      <Button variant="outline" size="xs">
                        View
                      </Button>
                    </Link>

                    <OrderChanges changes={item} />
                  </td>
                </Fragment>
              </Trow>
            ))}
        </tbody>
      </Table>

      {isLoadingList && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      <PaginationLinks
        paginatedData={raw_orders}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}

export default OnlineOrdersTable;

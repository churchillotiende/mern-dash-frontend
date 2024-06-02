import { Fragment, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getStaffTransactions } from "../../../../store/merchants/partners/staff-slice";
import store from "../../../../store/store";
import { useRouter } from "next/router";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import ShareCommissionModal from "./share-commission-modal";
import {
  formatNumber,
  formatDate,
} from "../../../../lib/shared/data-formatters";
import { showNotification } from "@mantine/notifications";
import RecalculateBtn from "./recalculate-btn";
import PrintSingleStaffTransaction from "./print-single-staff-transaction";

function StaffTransactionListView() {
  const { data: session, status } = useSession();

  const router = useRouter();
  const staffId = router?.query?.staffId;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const transactionListStatus = useSelector(
    (state) => state.staff.getStaffTransactionsStatus
  );
  const transactionList = useSelector(
    (state) => state.staff.getStaffTransactions
  );
  const isLoadingList = transactionListStatus === "loading";

  const transactions = transactionList;
  const raw_transactions = transactionList;

  useEffect(() => {
    if (!router.isReady || !staffId || !session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["staffId"] = staffId;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(getStaffTransactions(params));
  }, [startDate, endDate, session, status, staffId, router]);

  function onPaginationLinkClicked(page) {
    if (!page || !status || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;
    params["staffId"] = staffId;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(getStaffTransactions(params));
  }

  const filterWithDates = useCallback((startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const exportPDF = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/staff/${staffId}/transactions/export`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "GET",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const response = await fetch(endpoint, options);
    const result = await response.blob();

    if (!response.ok) {
      throw { message: "failure" };
    }

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(result);
    a.innerHTML = `StaffTransactions.pdf`;
    a.target = "_blank";
    a.click();

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Download Successfull",
        color: "green",
      });
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }
  };

  return (
    <Fragment>
      <div className="h-full w-full bg-white rounded-xl px-6 py-8">
        <div className="flex justify-between items-end">
          <section className="flex w-fit flex-wrap mb-2">
            <div className="flex flex-wrap space-y-1 w-full md:w-6/12 xl:w-fit">
              <div className="text-dark text-sm">From</div>
              <input
                type="date"
                className="input-primary h-12 text-grey-100"
                required=""
                placeholder="dd/mm/yyyy"
                name="start_date"
              />
            </div>
            <div className="flex flex-wrap space-y-1 w-full md:w-6/12 md:pl-2 xl:w-fit">
              <div className="text-dark text-sm">To</div>
              <input
                type="date"
                name="search"
                className="input-primary h-12 text-grey-100"
                required=""
                placeholder="dd/mm/yyyy"
              />
            </div>
          </section>
          <section>
            <div className="text-xl">
              Total:{" "}
              <span className="tracking-wider font-bold">
                KES {transactions?.total ?? 0}
              </span>
            </div>
          </section>
          <section>
            <button
              className="btn btn-primary btn-sm btn-circle"
              onClick={exportPDF}
            >
              <i className="fa-solid fa-download" />
            </button>
          </section>
        </div>
        <div className="flex flex-col z-0">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 horiz">
            <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-lg">
                <table className="rounded-lg min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="th-primary">
                        ID
                      </th>
                      <th scope="col" className="th-primary">
                        ITEM
                      </th>
                      <th scope="col" className="th-primary">
                        QUANTITY
                      </th>
                      <th scope="col" className="th-primary">
                        GRAND TOTAL
                      </th>
                      <th scope="col" className="th-primary">
                        COMMISSION AMOUNT
                      </th>
                      <th scope="col" className="th-primary">
                        SHARED COMMISSION(ISSUED)
                      </th>
                      <th scope="col" className="th-primary">
                        SHARED COMMISSION(RECEIVED)
                      </th>
                      <th scope="col" className="th-primary">
                        DISCOUNT
                      </th>
                      <th scope="col" className="th-primary">
                        PAYMENT METHOD
                      </th>
                      <th scope="col" className="th-primary">
                        PROVIDER
                      </th>
                      <th scope="col" className="th-primary">
                        CLIENT
                      </th>
                      <th scope="col" className="th-primary">
                        TRANSACTION DATE
                      </th>
                      <th scope="col" className="th-primary text-right">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!isLoadingList &&
                      transactions?.transactions?.data &&
                      transactions?.transactions?.data.map((item) => (
                        <tr className="bg-white border-b" key={item.id}>
                          <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {item?.id}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {item?.items[0]?.sellable?.sellable?.name}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {item?.quantity}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {item?.items[0]?.total}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {item?.items[0]?.frozen_staff_commission}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            0
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            0
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {item?.items[0]?.discount}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {item?.payment_method}
                          </td>
                          {item?.items.length >= 2 ? (
                            <td className="py-3 px-6 text-sm whitespace-nowrap">
                              <a
                                href={`/merchants/transactions/view/${item.id}#titems`}
                                className="text-primary underline"
                              >
                                Split
                              </a>
                            </td>
                          ) : (
                            <td className="py-3 px-6 text-sm whitespace-nowrap">
                              -
                            </td>
                          )}
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {item?.client?.name ?? "-"}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap">
                            {formatDate(item?.created_at)}
                          </td>
                          <td className="py-3 px-6 text-sm whitespace-nowrap text-right">
                            <ShareCommissionModal
                              item={item}
                              staffId={staffId}
                            />

                            <RecalculateBtn item={item} staffId={staffId} />
                            <PrintSingleStaffTransaction
                              item={item}
                              staffId={staffId}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {isLoadingList && (
                  <div className="flex justify-center w-full p-3 bg-light rounded-lg">
                    <StatelessLoadingSpinner />
                  </div>
                )}

                <PaginationLinks
                  paginatedData={transactions?.transactions}
                  onLinkClicked={onPaginationLinkClicked}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default StaffTransactionListView;

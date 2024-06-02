import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  formatDate,
  formatNumber,
} from "../../../../lib/shared/data-formatters";
import {
  fetchPosSessionDetails,
  fetchPosSessionDetailsReceipt,
} from "../../../../store/merchants/transactions/pos-sessions-slice";
import store from "../../../../store/store";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import Card from "../../../ui/layouts/card";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";

function SessionsDetailView() {
  const router = useRouter();
  let sessionId = router.query?.sessionId ?? null;

  const { data: session, status } = useSession();
  // TODO:: Check if user is merchant or normal user

  const transactionsRawData = useSelector(
    (state) => state.posSessions.posSessionDetails?.transactions
  );
  const rawData = useSelector((state) => state.posSessions.posSessionDetails);
  const loadedId = rawData?.id ?? null;
  const posSessionDetailsStatus = useSelector(
    (state) => state.posSessions.posSessionDetailsStatus
  );
  const isLoading = posSessionDetailsStatus === "loading";
  const isReceiptLoading = useSelector(
    (state) => state.posSessions.posSessionDetailsReceiptStatus === "loading"
  );

  function onPaginationLinkClicked(page) {
    if (!page) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    store.dispatch(fetchPosSessionDetails(params));
  }

  function refreshList() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["sessionId"] = sessionId;
    store.dispatch(fetchPosSessionDetails(params));
  }

  function downloadReceipt() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["sessionId"] = sessionId;
    store.dispatch(fetchPosSessionDetailsReceipt(params));
  }

  useEffect(() => {
    if (!session || status !== "authenticated" || !sessionId) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["sessionId"] = sessionId;

    if (posSessionDetailsStatus === "idle" || `${loadedId}` !== sessionId) {
      store.dispatch(fetchPosSessionDetails(params));
      return;
    }
  }, [session, status, sessionId, loadedId, posSessionDetailsStatus]);

  const actions = (
    <Fragment>
      <ActionIconButton
        icon="fa-solid fa-file-export"
        isLoading={isReceiptLoading}
        tooltip="Export"
        clickHandler={downloadReceipt}
      />

      <ActionIconButton
        icon="fa-solid fa-arrows-rotate"
        tooltip="Refresh"
        clickHandler={refreshList}
      />
    </Fragment>
  );

  return (
    <div className="flex flex-col space-y-1 w-full">
      <Card>
        <TableCardHeader actions={actions}></TableCardHeader>
      </Card>

      <Card>
        {!isLoading && rawData && <SessionMetaData rawData={rawData} />}

        {isLoading && (
          <div className="flex justify-center w-full p-3 bg-light rounded-lg">
            <StatelessLoadingSpinner />
          </div>
        )}
      </Card>

      <Card>
        <Table>
          <Thead>
            <tr>
              <th scope="col" className="th-primary">
                ID NO
              </th>

              <th scope="col" className="th-primary text-right">
                COST
              </th>

              <th scope="col" className="th-primary text-right">
                DISCOUNT
              </th>

              <th scope="col" className="th-primary text-right">
                TOTAL PAID
              </th>

              <th scope="col" className="th-primary">
                CLIENT
              </th>

              <th scope="col" className="th-primary text-right">
                TRANSACTION DATE
              </th>
            </tr>
          </Thead>
          <tbody>
            {!isLoading &&
              transactionsRawData &&
              transactionsRawData.data.map((item) => (
                <Trow key={item.id}>
                  <Fragment>
                    <td>{item.id}</td>
                    <td className="text-right">{formatNumber(item.cost)}</td>
                    <td className="text-right">
                      {formatNumber(item.discount)}
                    </td>
                    <td className="text-right">{item.total_paid}</td>
                    <td>{item.client?.name ?? "-"}</td>
                    <td className="text-right">{formatDate(item.date)}</td>
                  </Fragment>
                </Trow>
              ))}
          </tbody>
        </Table>

        <PaginationLinks
          paginatedData={transactionsRawData}
          onLinkClicked={onPaginationLinkClicked}
        />
      </Card>
    </div>
  );
}

function SessionMetaData({ rawData }) {
  return (
    <Table>
      <thead>
        <tr>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <Trow>
          <Fragment>
            <td className="font-bold py-2">Id</td>
            <td className="py-2">{rawData.id}</td>
          </Fragment>
        </Trow>

        <Trow>
          <Fragment>
            <td className="font-bold py-2">Opened By</td>
            <td className="py-2">{rawData.opener?.name ?? "-"}</td>
          </Fragment>
        </Trow>

        <Trow>
          <Fragment>
            <td className="font-bold py-2">Opened On</td>
            <td className="py-2">{formatDate(rawData.opening_date)}</td>
          </Fragment>
        </Trow>

        <Trow>
          <Fragment>
            <td className="font-bold py-2">Closed On</td>
            <td className="py-2">
              {rawData.closing_date ? formatDate(rawData.closing_date) : "-"}
            </td>
          </Fragment>
        </Trow>

        <Trow>
          <Fragment>
            <td className="font-bold py-2">Opening Balance</td>
            <td className="py-2">{formatNumber(rawData.opening_balance)}</td>
          </Fragment>
        </Trow>

        <Trow>
          <Fragment>
            <td className="font-bold py-2">Cash In</td>
            <td className="py-2">{formatNumber(rawData.cash_in)}</td>
          </Fragment>
        </Trow>

        <Trow>
          <Fragment>
            <td className="font-bold py-2">Cash Out</td>
            <td className="py-2">{formatNumber(rawData.cash_out)}</td>
          </Fragment>
        </Trow>

        <Trow>
          <Fragment>
            <td className="font-bold py-2">Closing Balance</td>
            <td className="py-2">{formatNumber(rawData.closing_balance)}</td>
          </Fragment>
        </Trow>

        <Trow>
          <Fragment>
            <td className="font-bold py-2">Cash Payments</td>
            <td className="py-2">{formatNumber(rawData.cash_payments)}</td>
          </Fragment>
        </Trow>

        <Trow>
          <Fragment>
            <td className="font-bold py-2">Card Payments</td>
            <td className="py-2">{formatNumber(rawData.card_payments)}</td>
          </Fragment>
        </Trow>

        <Trow>
          <Fragment>
            <td className="font-bold py-2">Mpesa Payments</td>
            <td className="py-2">{formatNumber(rawData.mpesa_payments)}</td>
          </Fragment>
        </Trow>

        <Trow>
          <Fragment>
            <td className="font-bold py-2">Credited Payments</td>
            <td className="py-2">{formatNumber(rawData.credited_payments)}</td>
          </Fragment>
        </Trow>

        <Trow>
          <Fragment>
            <td className="font-bold py-2">Suspended Transactions Worth</td>
            <td className="py-2">
              {formatNumber(rawData.suspended_transactions_sum)}
            </td>
          </Fragment>
        </Trow>

        <Trow>
          <Fragment>
            <td className="font-bold py-2">Grand Total</td>
            <td className="py-2">{formatNumber(rawData.grand_total)}</td>
          </Fragment>
        </Trow>
      </tbody>
    </Table>
  );
}

export default SessionsDetailView;

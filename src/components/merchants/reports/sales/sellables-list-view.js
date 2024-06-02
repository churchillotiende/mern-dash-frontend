import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import { Table, Thead } from "../../../ui/layouts/scrolling-table";
import TableCardHeader from "../../../ui/layouts/table-card-header";
import { formatNumber } from "../../../../lib/shared/data-formatters";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import {
  fetchSalesSummaryReceipt,
  fetchSoldSellables,
} from "../../../../store/merchants/reports/sales/sales-reports-slice";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { isRestaurant } from "../../../../lib/shared/roles_and_permissions";
import ActionIconButton from "../../../ui/actions/action-icon-button";
import { useRouter } from "next/router";
import SellablesListFilterBadges from "./sellables-list-filter-badges";

function SellablesListView() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const rawData = useSelector((state) => state.salesReports.sellablesList);
  const sellablesListStatus = useSelector(
    (state) => state.salesReports.sellablesListStatus
  );
  const isLoading = sellablesListStatus === "loading";
  const isRestaurantAc = isRestaurant(session?.user);
  const router = useRouter();

  useEffect(() => {
    if (!session || status !== "authenticated" || !router.isReady) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (router?.query?.category_id) {
      params["categoryId"] = router?.query?.category_id;
    }

    if (router?.query?.sub_category_id) {
      params["subCategoryId"] = router?.query?.sub_category_id;
    }

    if (!startDate && !endDate) {
      store.dispatch(fetchSoldSellables(params));
      return;
    }

    if (startDate && endDate) {
      params["startDate"] = startDate;
      params["endDate"] = endDate;
      store.dispatch(fetchSoldSellables(params));
    }
  }, [startDate, endDate, session, status, router]);

  function havingQueryFilters() {
    if (router?.query?.category_id) {
      return true;
    }

    if (router?.query?.sub_category_id) {
      return true;
    }

    return false;
  }

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

    if (router?.query?.category_id) {
      params["categoryId"] = router?.query?.category_id;
    }

    if (router?.query?.sub_category_id) {
      params["subCategoryId"] = router?.query?.sub_category_id;
    }

    store.dispatch(fetchSoldSellables(params));
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
    <div className="flex flex-col space-y-2 w-full mb-8">
      <Card>
        <TableCardHeader actions={actions}>
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

        <SellablesListFilterBadges pageUrl="/merchants/reports/sales/sellables" />

        <Table>
          <Thead>
            <tr>
              <th scope="col" className="th-primary">
                ID NO
              </th>
              <th scope="col" className="th-primary">
                GOOD/SERVICE
              </th>
              <th scope="col" className="th-primary text-right">
                QUANTITY
              </th>
              <th scope="col" className="th-primary text-right">
                SUBTOTAL
              </th>
            </tr>
          </Thead>
          <tbody className="bg-yellow-100">
            {!isLoading &&
              rawData &&
              rawData.data.map((item) => (
                <tr className="bg-white border-b" key={item.product_id}>
                  <td>{item.product_id}</td>
                  <td>{item.sellable?.sellable?.name ?? "-"}</td>
                  <td className="text-right">
                    {formatNumber(item.total_quantity)}
                  </td>
                  <td className="text-right">{formatNumber(item.total)}</td>
                </tr>
              ))}
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

      <div className="border-2 border-dark rounded-lg">
        <Card>
          <Table>
            <Thead>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th scope="col" className="th-primary text-right">
                  TOTAL
                </th>
              </tr>
            </Thead>
            <tbody>
              {!isLoading && rawData && (
                <Fragment>
                  {!havingQueryFilters() && (
                    <>
                      <tr className="bg-white border-b">
                        <td></td>
                        <td></td>
                        <th
                          scope="row"
                          className="text-primary font-bold text-right"
                        >
                          CASH
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.cash_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <td></td>
                        <td></td>
                        <th
                          scope="row"
                          className="text-primary font-bold text-right"
                        >
                          CARD
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.card_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <td></td>
                        <td></td>
                        <th
                          scope="row"
                          className="text-primary font-bold text-right"
                        >
                          CHEQUE
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.cheque_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <td></td>
                        <td></td>
                        <th
                          scope="row"
                          className="text-primary font-bold text-right"
                        >
                          BANK TRANSFER
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.bank_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-primary font-bold text-right"
                        >
                          M-PESA
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.mpesa_payments)}
                        </td>
                      </tr>
                    </>
                  )}

                  {!havingQueryFilters() && isRestaurantAc && (
                    <>
                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-warning font-bold text-right"
                        >
                          GLOVO
                        </th>
                        <td className="text-right text-warning tracking-wider text-xl font-bold">
                          {formatNumber(rawData.glovo_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-warning font-bold text-right"
                        >
                          JUMIA FOOD
                        </th>
                        <td className="text-right text-warning tracking-wider text-xl font-bold">
                          {formatNumber(rawData.jumia_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-warning font-bold text-right"
                        >
                          UBER EATS
                        </th>
                        <td className="text-right text-warning tracking-wider text-xl font-bold">
                          {formatNumber(rawData.uber_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-warning font-bold text-right"
                        >
                          BOLT FOOD
                        </th>
                        <td className="text-right text-warning tracking-wider text-xl font-bold">
                          {formatNumber(rawData.bolt_payments)}
                        </td>
                      </tr>
                    </>
                  )}

                  {!havingQueryFilters() && (
                    <>
                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-error font-bold text-right"
                        >
                          DISCOUNTS
                        </th>
                        <td className="text-right text-error tracking-wider text-xl font-bold">
                          {formatNumber(rawData.discount_total)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-error font-bold text-right"
                        >
                          CREDIT SALES
                        </th>
                        <td className="text-right text-error tracking-wider text-xl font-bold">
                          {formatNumber(rawData.credited_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-warning font-bold text-right ml-3"
                        >
                          CREDIT PAYMENTS
                        </th>
                        <td className="text-right text-warning tracking-wider text-xl font-bold">
                          {formatNumber(rawData.credited_debit_payments)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-success font-bold text-right"
                        >
                          SUSPENDED
                        </th>
                        <td className="text-right text-success tracking-wider text-xl font-bold">
                          {formatNumber(rawData.suspended_transactions_worth)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-primary font-bold text-right"
                        >
                          BEFORE TAX
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.total_before_tax)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-primary font-bold text-right"
                        >
                          TAX AMOUNT
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.total_tax_amount)}
                        </td>
                      </tr>

                      <tr className="bg-white border-b">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-primary font-bold text-right"
                        >
                          AFTER TAX
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.total_after_tax)}
                        </td>
                      </tr>
                    </>
                  )}

                  <tr className="bg-white border-b">
                    <th
                      scope="row"
                      colSpan="3"
                      className="text-primary font-bold text-right"
                    >
                      GROSS TOTAL
                    </th>
                    <td className="text-right text-dark tracking-wider text-xl font-bold">
                      {formatNumber(rawData.gross_total)}
                    </td>
                  </tr>

                  {!havingQueryFilters() && (
                    <>
                      <tr className="bg-white border-b text-lg">
                        <th
                          scope="row"
                          colSpan="3"
                          className="text-primary font-bold text-right"
                        >
                          NET TOTAL
                        </th>
                        <td className="text-right text-dark tracking-wider text-xl font-bold">
                          {formatNumber(rawData.net_total)}
                        </td>
                      </tr>
                    </>
                  )}
                </Fragment>
              )}
            </tbody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

export default SellablesListView;

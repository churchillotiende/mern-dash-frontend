import { TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatNumber } from "../../../../lib/shared/data-formatters";
import { fetchInventoryReportList } from "../../../../store/merchants/reports/sales/sales-reports-slice";
import store from "../../../../store/store";
import Card from "../../../ui/layouts/card";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import SellablesListFilterBadges from "../sales/sellables-list-filter-badges";

function InventoryReportListView() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const productList = useSelector(
    (state) => state.salesReports.inventoryReportList
  );
  const isLoading = useSelector(
    (state) => state.salesReports.inventoryReportListStatus === "loading"
  );

  const router = useRouter();

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (router?.query?.category_id) {
      params["category_id"] = router?.query?.category_id;
    }

    if (router?.query?.sub_category_id) {
      params["sub_category_id"] = router?.query?.sub_category_id;
    }

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchInventoryReportList(params));
  }, [session, status, searchTerm, router]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    if (router?.query?.category_id) {
      params["categoryId"] = router?.query?.category_id;
    }

    if (router?.query?.sub_category_id) {
      params["subCategoryId"] = router?.query?.sub_category_id;
    }

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchInventoryReportList(params));
  }

  return (
    <Card>
      <div className="flex w-full justify-end">
        <TextInput
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <SellablesListFilterBadges pageUrl="/merchants/reports/sellables/inventory/inventory-report" />

      <Table>
        <Thead>
          <tr>
            <th className="th-primary">ID</th>
            <th className="th-primary">NAME</th>
            <th className="th-primary text-right">QTT</th>
            <th className="th-primary text-right">ALERT QTT</th>
            <th className="th-primary text-right">MIN QTT</th>
            <th className="th-primary text-right">B.P.</th>
            <th className="th-primary text-right">S.P.</th>
            <th className="th-primary text-right">QTT ADDED</th>
            <th className="th-primary text-right">QTT DEDUCTED</th>
            <th className="th-primary text-right">STOCK WORTH B.P.</th>
            <th className="th-primary text-right">STOCK WORTH S.P.</th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            productList?.data?.map((item) => (
              <Trow key={item.id}>
                <>
                  <td>{item.id}</td>
                  <td>{item?.sellable?.name ?? "-"}</td>
                  <td className="text-right">
                    {formatNumber(item?.sellable?.total_remaining ?? 0)}
                  </td>
                  <td className="text-right">
                    {formatNumber(item?.sellable?.alert_quantity ?? 0)}
                  </td>
                  <td className="text-right">
                    {formatNumber(item?.sellable?.minimum_level ?? 0)}
                  </td>
                  <td className="text-right">
                    {formatNumber(item?.sellable?.buying_price ?? 0)}
                  </td>
                  <td className="text-right">
                    {formatNumber(item?.sellable?.cost ?? 0)}
                  </td>
                  <td className="text-right">
                    {formatNumber(item?.sellable?.total_bought ?? 0)}
                  </td>
                  <td className="text-right">
                    {formatNumber(item?.sellable?.total_sold ?? 0)}
                  </td>
                  <td className="text-right">
                    {formatNumber(item?.sellable?.total_stock_b_p_worth ?? 0)}
                  </td>
                  <td className="text-right">
                    {formatNumber(item?.sellable?.total_stock_s_p_worth ?? 0)}
                  </td>
                </>
              </Trow>
            ))}
        </tbody>
      </Table>

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      <PaginationLinks
        paginatedData={productList}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}

export default InventoryReportListView;

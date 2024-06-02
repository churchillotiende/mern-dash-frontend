import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import {
  formatDate,
  formatNumber,
} from "../../../../lib/shared/data-formatters";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { Menu, Button, Text, TextInput } from "@mantine/core";
import { IconChevronDown, IconEye } from "@tabler/icons";
import { Link } from "react-router-dom";
import { getCustomerTrendsTabular } from "../../../../store/merchants/reports/reports-slice";

function CustomerTrendsView() {
  const { data: session, status } = useSession();

  const trendsStatus = useSelector(
    (state) => state.reports.getCustomerTrendsTabularStatus
  );
  const trends = useSelector((state) => state.reports.getCustomerTrendsTabular);

  const isLoading = trendsStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getCustomerTrendsTabular(params));
  }, [session, status]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    store.dispatch(getCustomerTrendsTabular(params));
  }

  console.log(trends);

  return (
    <Card>
      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              ID NO
            </th>
            <th scope="col" className="th-primary">
              NAME
            </th>
            <th scope="col" className="th-primary text-right">
              REGISTERED AT
            </th>
            <th scope="col" className="th-primary text-right">
              POINTS
            </th>
            <th scope="col" className="th-primary text-right">
              VISITS
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            trends &&
            trends.data.map((item) => (
              <Trow key={item.id}>
                <>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td className="text-right">
                    {item?.created_at ? formatDate(item?.created_at) : "-"}
                  </td>
                  <td className="text-right">
                    {formatNumber(
                      (item?.points_debit_sum_points ?? 0) -
                      (item?.points_credit_sum_points ?? 0)
                    )}
                  </td>
                  <td className="text-right">{item.visits_count}</td>
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
        paginatedData={trends}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}

export default CustomerTrendsView;

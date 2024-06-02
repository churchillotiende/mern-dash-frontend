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
import { getBookingsTabular } from "../../../../store/merchants/bookings/bookings-slice";

function TableView() {
  const { data: session, status } = useSession();

  const bookingsStatus = useSelector(
    (state) => state.bookings.getBookingsTabularStatus
  );
  const bookings = useSelector((state) => state.bookings.getBookingsTabular);

  const isLoading = bookingsStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getBookingsTabular(params));
  }, [session, status]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    store.dispatch(getBookingsTabular(params));
  }

  console.log("Monyancha", bookings?.bookings?.data[37]?.title);

  const bookingData = bookings?.bookings;

  return (
    <Card>
      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              CLIENT NAME
            </th>
            <th scope="col" className="th-primary">
              SERVICE
            </th>
            <th scope="col" className="th-primary text-right">
              STAFF
            </th>
            <th scope="col" className="th-primary text-right">
              STATUS
            </th>
            <th scope="col" className="th-primary text-right">
              START TIME
            </th>
            <th scope="col" className="th-primary text-right">
              END TIME
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            bookingData?.data &&
            bookingData?.data?.map((item) => (
              <Trow key={item.id}>
                <>
                  <td>{item?.user?.name}</td>
                  <td>{item?.service?.name}</td>
                  <td>{item?.staff?.name}</td>
                  <td className="text-right">{item?.status}</td>
                  <td className="text-right">{formatDate(item?.start)}</td>
                  <td className="text-right">{formatDate(item?.end)}</td>
                </>
              </Trow>
            ))}

          {/* { bookings?.bookings?.data[37]?.title } */}
        </tbody>
      </Table>
      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      <PaginationLinks
        paginatedData={bookingData}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}

export default TableView;

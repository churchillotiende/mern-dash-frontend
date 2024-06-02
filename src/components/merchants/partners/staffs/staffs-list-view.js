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
import {
  IconChevronDown,
  IconUsers,
  IconLockAccess,
  IconEye,
  IconEdit,
} from "@tabler/icons";
import { Link } from "react-router-dom";
import { getStaffList } from "../../../../store/merchants/partners/staff-slice";
import LinkButton from "../../../ui/actions/link-button";
import DelTable from "../../inventory/del-modals/del-table-modal";
import MakePaymentModal from "./make-payment-modal";

function StaffsListView() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const staffsListStatus = useSelector(
    (state) => state.staff.getStaffListStatus
  );
  const staffsList = useSelector((state) => state.staff.getStaffList);

  const isLoading = staffsListStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(getStaffList(params));
  }, [session, status, searchTerm]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(getStaffList(params));
  }

  console.log("Staffs List", staffsList);

  return (
    <Card>
      <div className="flex w-full justify-end">
        <TextInput
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              NO
            </th>
            <th scope="col" className="th-primary">
              NAME
            </th>
            <th scope="col" className="th-primary ">
              WAGES
            </th>
            <th scope="col" className="th-primary ">
              PAYMENTS
            </th>
            <th scope="col" className="th-primary ">
              SALARY
            </th>
            <th scope="col" className="th-primary ">
              RENT
            </th>
            <th scope="col" className="th-primary ">
              BALANCE OWED
            </th>
            <th scope="col" className="th-primary text-right">
              ACTIONS
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            staffsList &&
            staffsList?.data?.map((item) => (
              <Trow key={item.id}>
                <>
                  <td>{item?.id}</td>
                  <td>{item?.name}</td>
                  <td>{item?.wage ?? 0}</td>
                  <td>0</td>
                  <td>{item?.salary ?? 0}</td>
                  <td>{item?.rent ?? 0}</td>
                  <td>{item?.balance_owed ?? 0}</td>
                  <td className="py-0 pl-14 2xl:pl-4">
                    <span className="flex justify-end items-center w-full gap-2">
                      <LinkButton
                        title="View"
                        href={`/merchants/partners/staffs/view/${item.id}`}
                        responsive={true}
                        variant="primary"
                        filled={false}
                      />

                      <LinkButton
                        title="Edit"
                        href={`/merchants/partners/staffs/edit/${item.id}`}
                        responsive={true}
                        variant="primary"
                        filled={true}
                      />

                      <MakePaymentModal staffId={item?.id} />
                      <DelTable item={item} source={"staffs"} />
                    </span>
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
        paginatedData={staffsList}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}

export default StaffsListView;

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
import { fetchClients } from "../../../../store/merchants/partners/clients-slice";

function ClientsListView() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const clientListStatus = useSelector(
    (state) => state.clients.clientListStatus
  );
  const clientList = useSelector((state) => state.clients.clientList);

  const isLoading = clientListStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["detailed"] = true;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchClients(params));
  }, [session, status, searchTerm]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["detailed"] = true;
    params["page"] = page;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(fetchClients(params));
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
              ACTIONS
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            clientList &&
            clientList.data.map((item) => (
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
                  <td className="py-0 pl-14 2xl:pl-4">
                    <span className="flex justify-end items-center w-full gap-2">
                      <Menu
                        shadow="md"
                        width={200}
                        position="bottom-end"
                        variant="outline"
                      >
                        <Menu.Target>
                          <Button rightIcon={<IconChevronDown size={14} />}>
                            Actions
                          </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>
                            #{item.id + " - " + item.name}
                          </Menu.Label>

                          <>
                            <Link
                              href={`/merchants/partners/clients/${item.id}`}
                            >
                              <Menu.Item
                                icon={<IconEye size={15} color="lime" />}
                                onClick={() => { }}
                              >
                                <Text color="lime">View</Text>
                              </Menu.Item>
                            </Link>
                          </>
                        </Menu.Dropdown>
                      </Menu>
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
        paginatedData={clientList}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}

export default ClientsListView;

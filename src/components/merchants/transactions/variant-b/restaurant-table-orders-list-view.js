import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { fetchTransactionList } from "../../../../store/merchants/transactions/transaction-list-slice";
import { useRouter } from "next/router";
import { Menu, Button, Text } from "@mantine/core";
import {
  IconPrinter,
  IconChevronDown,
  IconEdit,
  IconX,
  IconToolsKitchen2,
  IconGlassFull,
  IconListDetails,
  IconSlice,
} from "@tabler/icons";
import { Link } from "react-router-dom";
import {
  isMerchant,
  isRestaurant,
} from "../../../../lib/shared/roles_and_permissions";
import {
  formatDate,
  formatNumber,
} from "../../../../lib/shared/data-formatters";
import TransactionDetailModal from "../transaction-detail-modal";
import { hasBeenGranted } from "../../../../store/merchants/settings/access-control-slice";
import ChangeOrderTableModal from "./restaurants/change-order-table-modal";
import { printRemotePdf } from "../../../../lib/shared/printing-helpers";

function RestaurantTableOrdersListView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const tableId = router.query?.tableId;

  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [shownTransaction, setShownTransaction] = useState(null);

  const transactionListStatus = useSelector(
    (state) => state.transactions.transactionListStatus
  );

  const transactionList = useSelector(
    (state) => state.transactions.transactionList
  );
  const isLoadingList = transactionListStatus === "loading";

  const transactions = transactionList?.data ?? [];
  const raw_transactions = transactionList;

  const isMerchantAc = isMerchant(session?.user);
  const isRestaurantAc = isRestaurant(session?.user);

  useEffect(() => {
    if (!tableId || !session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["suspended"] = true;
    params["tableId"] = tableId;

    store.dispatch(fetchTransactionList(params));
  }, [session, status, tableId]);

  function onPaginationLinkClicked(page) {
    if (!page || !tableId) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;
    params["suspended"] = true;
    params["tableId"] = tableId;

    store.dispatch(fetchTransactionList(params));
  }

  const canEdit = useSelector(hasBeenGranted("can_edit_transaction"));

  return (
    <div className="flex flex-col space-y-2 w-full mb-8">
      <Card>
        <Table>
          <Thead>
            <tr>
              <th scope="col" className="th-primary">
                ID NO
              </th>

              <th scope="col" className="th-primary">
                ITEM(s)
              </th>

              <th scope="col" className="th-primary">
                COST
              </th>

              <th scope="col" className="th-primary text-right">
                TRANSACTION DATE
              </th>

              <th scope="col" className="th-primary text-right">
                ACTIONS
              </th>
            </tr>
          </Thead>
          <tbody>
            {!isLoadingList &&
              transactions.map((item) => (
                <Trow key={item.id}>
                  <Fragment>
                    <td>{item.id}</td>
                    <td>
                      <span>
                        {item.titems[0]?.sellable?.sellable?.name?.substr(
                          0,
                          30
                        ) ?? ""}
                        ...
                      </span>
                      <span className="text-xs">
                        ({item.titems?.length ?? 0})
                      </span>
                    </td>
                    <td>{formatNumber(item.cost)}</td>
                    <td className="text-right">{formatDate(item.date)}</td>
                    <td className="py-0 pl-14 2xl:pl-4">
                      <span className="flex justify-end items-center w-full gap-2">
                        <Menu
                          shadow="md"
                          width={200}
                          position="bottom-end"
                          variant="outline"
                        >
                          <Menu.Target>
                            <Button
                              rightIcon={<IconChevronDown size={14} />}
                              size="xs"
                            >
                              Actions
                            </Button>
                          </Menu.Target>

                          <Menu.Dropdown>
                            <Menu.Label>#{item.id}</Menu.Label>
                            {!item.is_void && (
                              <Fragment>
                                <Menu.Item
                                  icon={<IconPrinter size={15} />}
                                  onClick={() =>
                                    printRemotePdf(item.receipt_address)
                                  }
                                >
                                  Print
                                </Menu.Item>

                                {item.is_draft && isRestaurantAc && (
                                  <Menu.Item
                                    icon={<IconToolsKitchen2 size={15} />}
                                    onClick={() =>
                                      printRemotePdf(item.food_receipt_address)
                                    }
                                  >
                                    Food Receipt
                                  </Menu.Item>
                                )}

                                {item.is_draft && isRestaurantAc && (
                                  <Menu.Item
                                    icon={<IconGlassFull size={15} />}
                                    onClick={() =>
                                      printRemotePdf(item.drink_receipt_address)
                                    }
                                  >
                                    Drinks Receipt
                                  </Menu.Item>
                                )}

                                <Menu.Item
                                  icon={
                                    <IconListDetails size={15} color="lime" />
                                  }
                                  onClick={() => {
                                    setShowTransactionDetails(true);
                                    setShownTransaction(item);
                                  }}
                                >
                                  <Text color="lime">View</Text>
                                </Menu.Item>

                                {canEdit && item.can_be_edited && (
                                  <>
                                    <Link
                                      href={`/merchants/transactions/tables/${tableId}/orders/${item.id}`}
                                    >
                                      <Menu.Item icon={<IconSlice size={15} />}>
                                        <Text color="purple">Split Bill</Text>
                                      </Menu.Item>
                                    </Link>

                                    <Link
                                      href={`/merchants/transactions/new?transaction_id=${item.id}`}
                                    >
                                      <Menu.Item
                                        icon={
                                          <IconEdit size={15} color="blue" />
                                        }
                                      >
                                        <Text color="blue">Edit</Text>
                                      </Menu.Item>
                                    </Link>
                                  </>
                                )}

                                {isMerchantAc && (
                                  <a
                                    href="#my-modal-2"
                                    onClick={() =>
                                      setSelectedTransactionId(item.id)
                                    }
                                  >
                                    <Menu.Item
                                      icon={<IconX size={15} color="red" />}
                                    >
                                      <Text color="red">Void</Text>
                                    </Menu.Item>
                                  </a>
                                )}
                              </Fragment>
                            )}
                          </Menu.Dropdown>
                        </Menu>

                        <ChangeOrderTableModal
                          orderId={item.id}
                          tableId={tableId}
                        />
                      </span>
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
          paginatedData={raw_transactions}
          onLinkClicked={onPaginationLinkClicked}
        />
      </Card>
      <TransactionDetailModal
        opened={showTransactionDetails}
        onCloseHandler={() => setShowTransactionDetails(false)}
        transaction={shownTransaction}
      />
    </div>
  );
}

export default RestaurantTableOrdersListView;

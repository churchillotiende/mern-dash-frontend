import LinkIconButton from "../../ui/actions/link-icon-button";
import { Table, Thead, Trow } from "../../ui/layouts/scrolling-table";
import PaginationLinks from "../../ui/layouts/pagination-links";
import { Fragment, useContext, useEffect, useState } from "react";
import InfoAlert from "../../ui/display/info-alert";
import TransactionListContext from "../../../store/merchants/transactions/transaction-list-context";
import {
  formatDate,
  parseValidFloat,
} from "../../../lib/shared/data-formatters";
import StatelessLoadingSpinner from "../../ui/utils/stateless-loading-spinner";
import { useSession } from "next-auth/react";
import {
  isMerchant,
  isRestaurant,
} from "../../../lib/shared/roles_and_permissions";
import { Menu, Button, Text } from "@mantine/core";
import {
  IconPrinter,
  IconChevronDown,
  IconEdit,
  IconX,
  IconToolsKitchen2,
  IconGlassFull,
  IconListDetails,
  IconLayout2,
} from "@tabler/icons";
import { Link } from "react-router-dom";
import { printRemotePdf } from "../../../lib/shared/printing-helpers";
import TransactionDetailModal from "./transaction-detail-modal";
import { useSelector } from "react-redux";
import { hasBeenGranted } from "../../../store/merchants/settings/access-control-slice";
import Card from "../..//ui/layouts/card";

function TransactionsTable({
  transactions,
  onPaginationLinkClicked,
  rawTransactions,
  isLoading,
  filterWithDates,
  hideActions,
}) {
  const { data: session } = useSession();

  function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
  }

  const [selectedTransactionId, setSelectedTransactionId] = useState(undefined);
  const [password, setPassword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const transactionsListCtx = useContext(TransactionListContext);
  const isLoadingList = isLoading && true;

  const isMerchantAc = isMerchant(session?.user);
  const isRestaurantAc = isRestaurant(session?.user);

  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [shownTransaction, setShownTransaction] = useState(null);

  const canView = useSelector(hasBeenGranted("can_view_transaction"));
  const canEdit = useSelector(hasBeenGranted("can_edit_transaction"));
  const canVoid = useSelector(hasBeenGranted("can_void_transaction"));

  function voidTransaction() {
    if (!selectedTransactionId || !password) {
      return;
    }

    transactionsListCtx.actions.void(selectedTransactionId, password);

    setSelectedTransactionId(undefined);
    setPassword("");
  }

  useEffect(() => {
    filterWithDates(startDate, endDate);
  }, [startDate, endDate, filterWithDates]);

  return (
    <Card>
      <header className="flex flex-wrap justify-between items-end relative">
        <div className="flex w-full md:w-6/12 flex-wrap relative">
          <div className="flex flex-wrap space-y-1 w-full md:w-6/12 xl:w-fit">
            <div className="text-dark text-sm">From</div>
            <input
              type="date"
              name="search"
              className="input-primary h-12 text-grey-100"
              placeholder="dd/mm/yyyy"
              onChange={(e) => setStartDate(e.target.value)}
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
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
            />
          </div>
        </div>

        {!hideActions && (
          <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
            <LinkIconButton
              icon="fa-solid fa-upload"
              href="#"
              tooltip="Bulk Upload"
            />

            <LinkIconButton
              icon="fa-solid fa-money-bill"
              href="/merchants/transactions/credited"
              tooltip="Credited"
            />

            <LinkIconButton
              icon="fa-solid fa-arrow-down"
              href="/merchants/transactions/suspended"
              tooltip="Orders"
            />

            <LinkIconButton
              icon="fa-solid fa-sitemap"
              href="/merchants/transactions/tables"
              tooltip="Tables"
            />

            <LinkIconButton
              icon="fa-solid fa-ban"
              href="/merchants/transactions/voided"
              tooltip="Voided"
            />

            <LinkIconButton
              icon="fa-solid fa-plus"
              href="/merchants/transactions/new"
              tooltip="POS"
            />
          </div>
        )}
      </header>

      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
              ID NO
            </th>

            <th scope="col" className="th-primary">
              ITEM(s)
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
              PAYMENT METHOD(S)
            </th>

            <th scope="col" className="th-primary">
              STAFF
            </th>

            <th scope="col" className="th-primary">
              {isRestaurantAc && "TABLE/"}
              CLIENT
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
          {transactions &&
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
                  <td className="text-right">
                    {formatNumber(
                      parseValidFloat(
                        parseFloat(item.cost) +
                        parseFloat(item?.titems_sum_discount ?? 0)
                      )
                    )}
                  </td>
                  <td className="text-right">
                    {formatNumber(
                      parseValidFloat(item.discount) +
                      parseValidFloat(item?.titems_sum_discount ?? 0)
                    )}
                  </td>
                  <td className="text-right">{item.total_paid}</td>
                  <td>
                    {item.transaction_payments[0]?.type}
                    {item.transaction_payments?.length > 1 ? " +" : ""}
                  </td>
                  <td>
                    {item.titems[0]?.staff?.name ? (
                      <>
                        <span>{item.titems[0]?.staff?.name ?? ""}</span>

                        <span className="text-xs">
                          {(item.titems?.length ?? 0) > 1 ? "(+)" : ""}
                        </span>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    <span className="text-dark">
                      {isRestaurantAc &&
                        (item.restaurant_transaction?.table?.name ?? "")}
                      {" - "}
                    </span>
                    <span>{item.client?.name ?? ""}</span>
                  </td>
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
                          <Button rightIcon={<IconChevronDown size={14} />}>
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

                              <div className="inline md:hidden ">
                                <Link href={item.receipt_address}>
                                  <a target="_blank">
                                    <Menu.Item icon={<IconPrinter size={15} />}>
                                      Legacy Print
                                    </Menu.Item>
                                  </a>
                                </Link>
                              </div>

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

                              {canView && (
                                <>
                                  <Menu.Item
                                    icon={
                                      <IconListDetails size={15} color="lime" />
                                    }
                                    onClick={() => {
                                      setShowTransactionDetails(true);
                                      setShownTransaction(item);
                                    }}
                                  >
                                    <Text color="lime">Summary</Text>
                                  </Menu.Item>

                                  <Link
                                    href={`/merchants/transactions/view/${item.id}`}
                                  >
                                    <Menu.Item
                                      icon={
                                        <IconLayout2 size={15} color="purple" />
                                      }
                                    >
                                      <Text color="purple">Detailed View</Text>
                                    </Menu.Item>
                                  </Link>
                                </>
                              )}

                              {canEdit && item.can_be_edited && (
                                <Link
                                  href={`/merchants/transactions/new?transaction_id=${item.id}`}
                                >
                                  <Menu.Item
                                    icon={<IconEdit size={15} color="blue" />}
                                  >
                                    <Text color="blue">Edit</Text>
                                  </Menu.Item>
                                </Link>
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
                    </span>
                  </td>
                </Fragment>
              </Trow>
            ))}

          {rawTransactions && (
            <Trow>
              <td className="text-lg text-dark font-bold" colSpan={4}>
                Total
              </td>
              <td className="text-lg text-dark text-right">
                {formatNumber(rawTransactions?.transaction_total ?? 0)}
              </td>
            </Trow>
          )}
        </tbody>
      </Table>

      {isLoadingList && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      <PaginationLinks
        paginatedData={rawTransactions}
        onLinkClicked={onPaginationLinkClicked}
      />

      <div className="modal" id="my-modal-2">
        <div className="modal-box bg-white">
          {selectedTransactionId && (
            <Fragment>
              <h3 className="font-bold text-lg">
                Void Transaction #{selectedTransactionId}
              </h3>
              <div className="flex flex-wrap space-y-1 w-full">
                <div className="text-dark text-sm">
                  <span>Password</span>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password to proceed"
                  className="input input-primary w-full"
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                />
              </div>
            </Fragment>
          )}
          {!selectedTransactionId && (
            <div className="flex justify-center">
              <InfoAlert
                title="No transaction selected"
                message="Click the BACK button"
              />
            </div>
          )}

          <div className="modal-action">
            <a href="#" className="btn btn-outline">
              Back
            </a>

            <a href="#" className="btn btn-error" onClick={voidTransaction}>
              Void
            </a>
          </div>
        </div>
      </div>

      <TransactionDetailModal
        opened={showTransactionDetails}
        onCloseHandler={() => setShowTransactionDetails(false)}
        transaction={shownTransaction}
      />
    </Card>
  );
}

export default TransactionsTable;

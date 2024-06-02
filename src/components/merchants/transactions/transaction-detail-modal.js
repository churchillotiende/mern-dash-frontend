import { Accordion, Modal } from "@mantine/core";
import { useSession } from "next-auth/react";
import { Fragment } from "react";
import { formatDate, formatNumber } from "../../../lib/shared/data-formatters";
import { isRestaurant } from "../../../lib/shared/roles_and_permissions";
import { Table, Thead, Trow } from "../../ui/layouts/scrolling-table";

function TransactionDetailModal(props) {
  const { data: session } = useSession();
  const { opened, onCloseHandler, transaction } = props;

  const isRestaurantAc = isRestaurant(session?.user);

  return (
    <Modal
      opened={opened}
      onClose={() => onCloseHandler()}
      title={`Transaction #${transaction?.id ?? "-"}`}
      fullScreen
    >
      <Accordion defaultValue="summary">
        <Accordion.Item value="summary">
          <Accordion.Control>Summary</Accordion.Control>
          <Accordion.Panel>
            <Table>
              <Thead>
                <tr>
                  <th></th>
                  <th></th>
                </tr>
              </Thead>
              <tbody>
                {transaction && (
                  <Fragment>
                    <Trow>
                      <>
                        <td scope="row" className="text-primary font-bold">
                          ID
                        </td>
                        <td>{transaction.id}</td>
                      </>
                    </Trow>

                    <Trow>
                      <>
                        <td scope="row" className="text-primary font-bold">
                          COST
                        </td>
                        <td>{formatNumber(transaction.cost)}</td>
                      </>
                    </Trow>

                    <Trow>
                      <>
                        <td scope="row" className="text-primary font-bold">
                          DISCOUNT
                        </td>
                        <td>{formatNumber(transaction.discount)}</td>
                      </>
                    </Trow>

                    <Trow>
                      <>
                        <td scope="row" className="text-primary font-bold">
                          TOTAL PAID
                        </td>
                        <td>{formatNumber(transaction.total_paid)}</td>
                      </>
                    </Trow>

                    <Trow>
                      <>
                        <td scope="row" className="text-primary font-bold">
                          PROVIDER
                        </td>
                        <td>{transaction.staff_provider}</td>
                      </>
                    </Trow>

                    <Trow>
                      <>
                        <td scope="row" className="text-primary font-bold">
                          CLIENT/TABLE
                        </td>
                        <td>
                          <span className="text-dark">
                            {isRestaurantAc &&
                              (transaction.restaurant_transaction?.table
                                ?.name ??
                                "")}
                            {" - "}
                          </span>
                          <span>{transaction.client?.name ?? ""}</span>
                        </td>
                      </>
                    </Trow>

                    <Trow>
                      <>
                        <td scope="row" className="text-primary font-bold">
                          DATE
                        </td>
                        <td>{formatDate(transaction.date)}</td>
                      </>
                    </Trow>
                  </Fragment>
                )}
              </tbody>
            </Table>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="items">
          <Accordion.Control>Items</Accordion.Control>
          <Accordion.Panel>
            <Table>
              <Thead>
                <tr>
                  <th scope="col" className="th-primary">
                    ID NO
                  </th>

                  <th scope="col" className="th-primary">
                    ITEM
                  </th>

                  <th scope="col" className="th-primary text-right">
                    QUANTITY
                  </th>

                  <th scope="col" className="th-primary text-right">
                    COST
                  </th>
                </tr>
              </Thead>
              <tbody>
                {transaction?.titems.map((item) => (
                  <Trow key={item.id}>
                    <Fragment>
                      <td>{item.id}</td>
                      <td>{item?.sellable?.sellable?.name ?? ""}</td>
                      <td className="text-right">
                        {formatNumber(item.quantity)}
                      </td>
                      <td className="text-right">{formatNumber(item.cost)}</td>
                    </Fragment>
                  </Trow>
                ))}
              </tbody>
            </Table>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Modal>
  );
}

export default TransactionDetailModal;

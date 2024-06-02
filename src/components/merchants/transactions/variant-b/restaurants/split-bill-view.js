import { Accordion } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  formatDate,
  formatNumber,
} from "../../../../../lib/shared/data-formatters";
import Card from "../../../../ui/layouts/card";
import { Table, Thead, Trow } from "../../../../ui/layouts/scrolling-table";
import BillSplitsAction from "./bill-splits-actions";

function SplitBillView() {
  const router = useRouter();
  const orderId = router?.query?.orderId ?? -1;

  const transactionListStatus = useSelector(
    (state) => state.transactions.transactionListStatus
  );

  const transactionList = useSelector(
    (state) => state.transactions.transactionList?.data ?? []
  );

  const transaction = transactionList.find(
    (item) => item.id == orderId && item.is_draft === "1"
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const tableId = router?.query?.tableId ?? -1;
    const prevUrl = `/merchants/transactions/tables/${tableId}`;

    if (
      transactionListStatus === "idle" ||
      transactionList.length <= 0 ||
      !transaction
    ) {
      router.replace(prevUrl);
    }
  }, [transactionListStatus, transactionList, transaction, router]);

  return (
    <>
      {transaction && (
        <div className="w-full">
          <Accordion defaultValue="items">
            <Accordion.Item value="summary">
              <div className="w-full bg-info bg-opacity-50">
                <Accordion.Control>
                  <span className="text-primary font-bold">Summary</span>
                </Accordion.Control>
              </div>
              <Accordion.Panel>
                <Card>
                  <Table>
                    <Thead>
                      <tr>
                        <th></th>
                        <th></th>
                      </tr>
                    </Thead>
                    <tbody>
                      <>
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
                                {transaction.restaurant_transaction?.table
                                  ?.name ?? ""}
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
                      </>
                    </tbody>
                  </Table>
                </Card>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="items">
              <div className="w-full bg-info bg-opacity-50">
                <Accordion.Control>
                  <span className="text-primary font-bold">Items</span>
                </Accordion.Control>
              </div>

              <Accordion.Panel>
                <Card>
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
                      {transaction?.titems?.map((item) => (
                        <Trow key={item.id}>
                          <>
                            <td>{item.id}</td>
                            <td>{item?.sellable?.sellable?.name ?? ""}</td>
                            <td className="text-right">
                              {formatNumber(item.quantity)}
                            </td>
                            <td className="text-right">
                              {formatNumber(item.cost)}
                            </td>
                          </>
                        </Trow>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          <div className="w-full mt-4">
            <BillSplitsAction transaction={transaction} />
          </div>
        </div>
      )}
    </>
  );
}

export default SplitBillView;

import { useEffect } from "react";
import { useSelector } from "react-redux";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { useSession } from "next-auth/react";
import store from "../../../../store/store";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import { fetchTransactionTableList } from "../../../../store/merchants/transactions/transaction-list-slice";
import { Button, Card, Text, Badge } from "@mantine/core";
import { Link } from "react-router-dom";

function RestaurantTablesListView() {
  const { data: session, status } = useSession();

  const rawData = useSelector(
    (state) => state.transactions.transactionTableList
  );
  const transactionTableList = useSelector(
    (state) => state.transactions.transactionTableList?.data ?? []
  );
  const transactionTableListStatus = useSelector(
    (state) => state.transactions.transactionTableStatus
  );
  const isLoading = transactionTableListStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(fetchTransactionTableList(params));
  }, [session, status]);

  function onPaginationLinkClicked(page) {
    if (!page) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    store.dispatch(fetchTransactionTableList(params));
  }

  return (
    <div className="flex flex-col space-y-2 w-full mb-8">
      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      {!isLoading && (
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {transactionTableList.map((item) => (
            <Card key={item.id}>
              <div className="flex justify-between items-center">
                <Text size="md" color="black">
                  {item.name}
                </Text>

                {item.restaurant_transactions_count ? (
                  <Badge color="green" variant="light">
                    Orders: {item.restaurant_transactions_count ?? "0"}
                  </Badge>
                ) : (
                  ""
                )}
              </div>

              <Link href={`/merchants/transactions/tables/${item.id}`}>
                <Button
                  variant="light"
                  color="blue"
                  mt="md"
                  // onClick={() => selectTable(item.id)}
                  fullWidth
                >
                  View
                </Button>
              </Link>
            </Card>
          ))}
        </section>
      )}

      <PaginationLinks
        paginatedData={rawData}
        onLinkClicked={onPaginationLinkClicked}
      />
    </div>
  );
}

export default RestaurantTablesListView;

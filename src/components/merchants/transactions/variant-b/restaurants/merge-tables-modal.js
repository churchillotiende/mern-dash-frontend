import { Button, Modal, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import store from "../../../../../store/store";
import { fetchTransactionTables } from "../../../../../store/merchants/transactions/transaction-slice";
import StatelessLoadingSpinner from "../../../../ui/utils/stateless-loading-spinner";
import { showNotification } from "@mantine/notifications";
import { mergeTables } from "../../../../../store/merchants/transactions/transaction-list-slice";
import { useRouter } from "next/router";

function MergeTablesModal({ tableId }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [selectedTable, setSelectedTable] = useState();
  const [isSubmitting, setIsSubmitting] = useState();

  const transactionTableList = useSelector(
    (state) => state.posTransaction.transactionTableList ?? []
  );

  const router = useRouter();

  const validTableList = transactionTableList?.filter(
    (item) => item.id != tableId
  );

  const tableList =
    validTableList?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  const transactionTableStatus = useSelector(
    (state) => state.posTransaction.transactionTableStatus
  );
  const isLoading = transactionTableStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (transactionTableStatus === "idle") {
      store.dispatch(fetchTransactionTables(params));
    }
  }, [session, status, transactionTableStatus]);

  async function submitDetails() {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {
      fromTableId: tableId,
      toTableId: selectedTable,
      accessToken: session?.user?.accessToken,
    };

    try {
      setIsSubmitting(true);

      await store.dispatch(mergeTables(params)).unwrap();
      router.replace(`/merchants/transactions/tables/${selectedTable}`);

      setOpened(false);
      showNotification({
        title: "Success",
        message: "Tables merged successfully",
        color: "green",
      });
    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not save record";
      }

      showNotification({
        title: "Error",
        message,
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        title="Merge Tables"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {isLoading && (
          <div className="flex justify-center ">
            <section className="space-y-2 bg-light p-3 rounded-lg">
              <StatelessLoadingSpinner />
            </section>
          </div>
        )}

        {!isLoading && (
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
            <span className="text-dark text-sm font-bold">
              Merge this table to:
            </span>

            <Select
              placeholder="Table"
              label="Table"
              value={selectedTable}
              onChange={setSelectedTable}
              data={tableList}
              searchable
              clearable
            />
          </section>
        )}

        {!isLoading && (
          <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
            <Button
              onClick={submitDetails}
              loading={isSubmitting}
              disabled={!selectedTable}
            >
              Merge
            </Button>
          </section>
        )}
      </Modal>
      <Button
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
        color="violet"
      >
        Merge Table
      </Button>
    </>
  );
}

export default MergeTablesModal;

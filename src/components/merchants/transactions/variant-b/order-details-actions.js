import { Button, Alert, Loader } from "@mantine/core";
import {
  resetTransactionState,
  showViewPayments,
  showViewTables,
  suspendTransaction,
} from "../../../../store/merchants/transactions/transaction-slice";
import store from "../../../../store/store";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isRestaurant } from "../../../../lib/shared/roles_and_permissions";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";

function OrderDetailsActions() {
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.accessControl.myAccountData);
  const isRestaurantAc = isRestaurant(session?.user);

  const transactionData = useSelector((state) => state.posTransaction);
  const submittedSagaId = useSelector(
    (state) => state.posTransaction.submittedSagaId
  );
  const isSuspending = useSelector(
    (state) => state.posTransaction.suspensionStatus == "loading"
  );
  const isLoading = isSuspending;

  async function suspendTransactionHandler() {
    if (!session || status !== "authenticated" || isSuspending) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["transactionData"] = transactionData;
    try {
      await dispatch(suspendTransaction(params)).unwrap();

      showNotification({
        title: "Info",
        message: "Processing transaction",
        color: "blue",
      });

      setIsProcessing(true);
    } catch (e) {
      showNotification({
        title: "Warning",
        message: "Could not save transaction",
        color: "orange",
      });
    }
  }

  useEffect(() => {
    if (status !== "authenticated" || !user?.id || !submittedSagaId) {
      return;
    }

    const echo = new Echo({
      broadcaster: "pusher",
      key: process.env.NEXT_PUBLIC_PUSHER_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      encrypted: true,
      forceTLS: true,
    });

    echo
      .channel(`transaction-done.${user?.id}`)
      .subscribed(() => {
        console.log("ECHO:: Subscribed to transactions-done channel");
      })
      .listen(`.${submittedSagaId}`, (data) => {
        data = JSON.parse(data);
        console.log("ECHO::TransactionSaga::Received::", data);
        setIsProcessing(false);

        if (data.result_code === 0) {
          showNotification({
            title: "Success",
            message: "Transaction confirmed successfully",
            color: "green",
          });

          // Yay. Transaction was confirmed successfully
          dispatch(resetTransactionState());

          router.push("/merchants/transactions/new", "", {
            scroll: false,
          });
        } else if (data.result_code === -1) {
          showNotification({
            title: "Warning",
            message: data?.message ?? "Error confirming transaction",
            color: "orange",
          });
        }
      })
      .error((e) => {
        console.log("Could not connect ", e);
      });
  }, [user, status, submittedSagaId, router, dispatch]);

  function showPaymentsView() {
    store.dispatch(showViewPayments());
  }

  return (
    <>
      <div className="w-full justify-end">
        {isProcessing && (
          <div className="w-full">
            <Alert
              icon={<Loader variant="bars" />}
              title="Processing Transaction"
              color="blue"
            >
              Please do not close or leave this tab while this is happening.
            </Alert>
          </div>
        )}
      </div>

      <section className="w-full flex items-center gap-4 mt-2">
        {/* {useSelector(hasBeenGranted("can_create_order")) && ( */}
        <Button
          variant="outline"
          color="blue"
          loading={isLoading}
          disabled={isProcessing}
          onClick={suspendTransactionHandler}
          fullWidth
        >
          Create Order
        </Button>
        {/* )} */}

        {/* {useSelector(hasBeenGranted("can_confirm_transaction")) && ( */}
        <Button
          variant="filled"
          color="blue"
          disabled={isProcessing}
          onClick={showPaymentsView}
          fullWidth
        >
          Receive Payments
        </Button>
        {/* )} */}
      </section>
    </>
  );
}

export default OrderDetailsActions;

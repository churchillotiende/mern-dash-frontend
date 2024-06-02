import { Button } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../../ui/layouts/card";
import { IconDeviceFloppy } from "@tabler/icons";
import { useSession } from "next-auth/react";
import {
  resetTransactionState,
  setSubmittedTransaction,
  showViewReceipts,
  submitTransaction,
} from "../../../../store/merchants/transactions/transaction-slice";
import { showNotification } from "@mantine/notifications";
import { Alert, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

function TransactionSubmissionButton({ canCredit, remainingAmount }) {
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const transactionData = useSelector((state) => state.posTransaction);
  const submittedSagaId = useSelector(
    (state) => state.posTransaction.submittedSagaId
  );
  const isSubmitting = useSelector(
    (state) => state.posTransaction.submissionStatus == "loading"
  );
  const user = useSelector((state) => state.accessControl.myAccountData);

  const isLoading = isSubmitting;
  let buttonText = "Confirm";
  let buttonColor = "blue";

  if (canCredit && remainingAmount > 0) {
    buttonText = "Credit Transaction";
    buttonColor = "red";
  }

  const canConfirm = () => {
    if (!canCredit && remainingAmount > 0) {
      return false;
    }

    return true;
  };

  const dispatch = useDispatch();
  async function confirmTransaction() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["transactionData"] = transactionData;

    try {
      await dispatch(submitTransaction(params)).unwrap();

      showNotification({
        title: "Info",
        message: "Processing transaction",
        color: "blue",
      });

      setIsProcessing(true);

      // dispatch(resetTransactionState());
      // dispatch(showViewReceipts());
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
          dispatch(setSubmittedTransaction(data.transaction));
          dispatch(resetTransactionState());
          dispatch(showViewReceipts());
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
  }, [user, status, submittedSagaId, dispatch]);

  return (
    <Card>
      <div className="flex w-full justify-end">
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

        {!isProcessing && (
          <Button
            loading={isLoading}
            leftIcon={<IconDeviceFloppy size={14} />}
            disabled={!canConfirm()}
            color={buttonColor}
            onClick={confirmTransaction}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default TransactionSubmissionButton;

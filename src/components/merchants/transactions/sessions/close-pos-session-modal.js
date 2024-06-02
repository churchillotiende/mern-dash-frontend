import { useEffect, useState } from "react";
import InputControl from "../../../ui/forms/input-control";
import { Fragment } from "react";
import { ModalBackButton } from "../../../ui/layouts/modal";
import ActionButton from "../../../ui/actions/action-button";
import Modal from "../../../ui/layouts/modal";
import store from "../../../../store/store";
import { closeCurrentPosSession } from "../../../../store/merchants/transactions/pos-sessions-slice";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import TextAreaControl from "../../../ui/forms/textarea-control";
import {
  showAlertSuccess,
  showAlertWarning,
} from "../../../../store/shared/bottom-alerts-slice";

function ClosePosSessionModal() {
  const { data: session, status } = useSession();
  const [closingBalance, setClosingBalance] = useState(0);
  const [narration, setNarration] = useState("");
  const dispatch = useDispatch();

  const onClosingBalanceChanged = (value) => {
    setClosingBalance(value);
  };

  const onNarrationChanged = (value) => {
    setNarration(value);
  };

  const closingSessionStatus = useSelector(
    (state) => state.posSessions.closeCurrentPosSessionStatus
  );

  const isClosingSession = closingSessionStatus === "loading";

  useEffect(() => {
    if (closingSessionStatus === "fulfilled") {
      dispatch(showAlertSuccess({ message: "Closed session successfully" }));
    }

    if (closingSessionStatus === "rejected") {
      dispatch(showAlertWarning({ message: "Could not close session" }));
    }
  }, [closingSessionStatus, dispatch]);

  function onNewSessionClicked() {
    if (!session || status !== "authenticated" || isClosingSession) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["amount"] = closingBalance;
    params["narration"] = narration;

    store.dispatch(closeCurrentPosSession(params));
  }

  const modalActions = (
    <Fragment>
      <ModalBackButton />
      <ActionButton
        title="Close"
        size="md"
        filled={true}
        variant="error"
        clickHandler={onNewSessionClicked}
        isLoading={isClosingSession}
        icon="fa-solid fa-save"
      />
    </Fragment>
  );

  return (
    <Modal
      idRef="close-pos-session"
      title="Close POS Session"
      actions={modalActions}
    >
      <div className="w-full space-y-2">
        <InputControl
          labelText="Closing Balance"
          type="number"
          value={closingBalance}
          onChangeHandler={onClosingBalanceChanged}
        />

        <TextAreaControl
          labelText="Narration"
          value={narration}
          onChangeHandler={onNarrationChanged}
        />
      </div>
    </Modal>
  );
}

export default ClosePosSessionModal;

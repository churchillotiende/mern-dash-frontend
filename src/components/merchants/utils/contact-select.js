import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import store from "../../../store/store";
import Select from "../../ui/forms/select";
import { fetchClients } from "../../../store/merchants/partners/clients-slice";
import { clearClient } from "../../../store/merchants/transactions/transaction-slice";
// import {debounce}

export default function ContactSelect({ onContactChanged, selectedContactId }) {
  const { data: session, status } = useSession();

  const clientListStatus = useSelector(
    (state) => state.clients.clientListStatus
  );
  const clientList = useSelector(
    (state) => state.clients.clientList?.data ?? []
  );
  const selectedClient = useSelector(
    (state) => state.posTransaction.selectedClient
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["filter"] = selectedContactId;

    if (clientListStatus === "idle") {
      store.dispatch(fetchClients(params));
    }
  }, [session, status, clientListStatus, selectedContactId]);

  const onInputHandler = debounce((value) => {
    if (!session || status !== "authenticated" || !value) {
      return;
    }
    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["filter"] = value;
    // console.log("CONTACT SELECTOR:: Received Input: ", value);

    store.dispatch(fetchClients(params));
  }, 1000);

  const clients = clientList.map((client) => ({
    value: client.id,
    label: `${client.name} ${client.phone !== null ? client.phone : ""} ${
      client.car_plate ?? ""
    }`,
  }));

  return (
    <Fragment>
      <div className="text-dark text-sm">
        <span>Select Client</span>
      </div>
      <div className="flex flex-col gap-2">
        <Select
          options={clients}
          selectedValue={
            selectedContactId &&
            clients &&
            clients.find((item) => item.value === selectedContactId)
          }
          inputHandler={onInputHandler}
          changeHandler={onContactChanged}
        />

        {selectedContactId && (
          <section className="border border-darker rounded-xl px-3 py-2 text-dark flex items-center justify-start gap-2">
            <button
              className="btn btn-square btn-xs btn-error"
              onClick={() => store.dispatch(clearClient())}
            >
              <i className="fa-solid fa-times"></i>
            </button>
            <div className="text-sm font-bold">{selectedContactId}:</div>
            <div className="flex gap-2">
              <div className="text-md">{selectedClient?.name ?? "-"}</div>
              <div className="text-md">{selectedClient?.phone ?? "-"}</div>
            </div>
          </section>
        )}
      </div>
    </Fragment>
  );
}

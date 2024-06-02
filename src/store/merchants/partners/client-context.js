import { useSession } from "next-auth/react";
import { createContext, useContext, useState } from "react";
import getLogger from "../../../lib/shared/logger";
import MerchantUiContext from "../../shared/merchant-ui";

const ClientContext = createContext({
  clients: undefined,
  actions: {
    load: (filter = null) => {},
    loadOne: (clientId) => {},
  },
});

export function ClientContextProvider(props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const logger = getLogger("ClientContext");

  const { data: session } = useSession();
  const [clients, setClients] = useState();
  const uiCtx = useContext(MerchantUiContext);

  function loadClients(filter = null) {
    setClients(undefined);
    const startDate = new Date();

    logger.log("Loading clients");
    if (!session) {
      return;
    }

    const url = `${API_URL}/partners/clients?${
      filter !== null && "filter=" + encodeURIComponent(filter)
    }`;

    uiCtx.loaders.actions.increment();
    fetch(url, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken} `,
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        const endDate = new Date();
        const seconds = endDate.getTime() - startDate.getTime();
        uiCtx.loaders.actions.decrement();

        if (!response.ok) {
          logger.log("Error while loading clients", { data });
          return;
        }

        const data = await response.json();
        logger.log("Loaded clients", { took: seconds, ...data });
        setClients(data);
      })
      .then((data) => {})
      .catch((error) => {
        logger.warn(error);
      });
  }

  function loadClient(clientId) {
    setClients(undefined);
    const startDate = new Date();

    logger.log("Loading one client");
    if (!session) {
      return;
    }

    const url = `${API_URL}/partners/clients/${clientId}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken} `,
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        const endDate = new Date();
        const seconds = endDate.getTime() - startDate.getTime();
        if (!response.ok) {
          logger.log("Error while loading client", { data });
          return;
        }

        const data = await response.json();
        logger.log("Loaded client", { took: seconds, ...data });
        const clientArray = [{ ...data }];
        setClients(clientArray);
      })
      .then((data) => {})
      .catch((error) => {
        logger.warn(error);
      });
  }

  const context = {
    clients,
    actions: {
      load: loadClients,
      loadOne: loadClient,
    },
  };

  return (
    <ClientContext.Provider value={context} displayName="Clients">
      {props.children}
    </ClientContext.Provider>
  );
}

export default ClientContext;

import { useSession } from "next-auth/react";
import { createContext, useContext, useState } from "react";
import getLogger from "../../../lib/shared/logger";
import BottomAlertsContext from "../../shared/bottom-alerts";
import MerchantUiContext from "../../shared/merchant-ui";

const OnlineOdersListContext = createContext({
  orders: undefined,
  actions: {
    load: ({ page = null } = {}) => {},
  },
});

export function OnlineOrdersListContextProvider(props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const logger = getLogger("OnlineOrdersContext");

  const { data: session } = useSession();
  const [orders, setOrders] = useState(undefined);

  const uiCtx = useContext(MerchantUiContext);
  const alertCtx = useContext(BottomAlertsContext);

  function loadOnlineOrders({ page = null } = {}) {
    const startDate = new Date();

    logger.log("Loading online orders");
    if (!session) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/online-orders?`;
    }
    const params = {};

    url += new URLSearchParams(params);

    uiCtx.loaders.actions.increment();
    fetch(url, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken} `,
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();
        uiCtx.loaders.actions.decrement();

        if (!response.ok) {
          throw data;
        }

        const endDate = new Date();
        const seconds = endDate.getTime() - startDate.getTime();

        logger.log("Loaded online orders", { took: seconds, data });
        setTransactions(data);
      })
      .catch((error) => {
        logger.warn("Load online orders::ERROR", error);
      });
  }

  const context = {
    orders,
    actions: {
      load: loadOnlineOrders,
    },
  };

  return (
    <OnlineOdersListContext.Provider
      value={context}
      displayName="Online Orders List Context"
    >
      {props.children}
    </OnlineOdersListContext.Provider>
  );
}

export default OnlineOdersListContext;

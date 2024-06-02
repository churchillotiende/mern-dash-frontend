import { Link } from "react-router-dom";
import { Fragment } from "react";
import TopHr from "../../../components/ui/layouts/top-hr";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getOnlineOrders } from "../../../store/merchants/onlineorders/onlineorders-slice";
import store from "../../../store/store";
import OnlineOrdersTable from "./onlineorders";

function OrdersListView() {
  const { data: session, status } = useSession();

  const onlineOrdersStatus = useSelector(
    (state) => state.onlineOrders.getOnlineOrdersStatus
  );
  const onlineOrders = useSelector(
    (state) => state.onlineOrders.getOnlineOrders
  );

  const isLoadingList = onlineOrdersStatus === "loading";

  const orders = onlineOrders?.data;
  const raw_orders = onlineOrders;

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getOnlineOrders(params));
  }, [session, status]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    store.dispatch(getOnlineOrders(params));
  }

  return (
    <Fragment>
      <div className="w-full pt-6">
        <div className="w-full md:w-6/12">
          <h1 className="w-full text-2xl font-bold text-darkest px-1 pb-1">
            Online Orders
          </h1>

          <div className="w-full text-xs px-2 text-grey-100 flex items-center">
            <Link href="/" className="cursor-pointer">
              Home
            </Link>
            <i className="fa-solid fa-chevron-right hover:cursor-pointer mx-1 text-xs"></i>
            <span className="text-primary">Online Orders</span>
          </div>
        </div>
      </div>

      <TopHr />

      <div className="w-full flex flex-wrap mt-2">
        <OnlineOrdersTable
          orders={orders}
          rawOrders={raw_orders}
          onPaginationLinkClicked={onPaginationLinkClicked}
          isLoading={isLoadingList}
        />
      </div>
    </Fragment>
  );
}

export default OrdersListView;

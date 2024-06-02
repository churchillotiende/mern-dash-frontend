import { Link } from "react-router-dom";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import MerchantUiContext from "../../../store/shared/merchant-ui";
import LoadingSpinner from "../../ui/utils/loading-spinner";
import { useDispatch, useSelector } from "react-redux";
import OrderPrinter from "../../merchants/transactions/order-printer";
import {
  clearSubmittedTransaction,
  resetTransactionState,
  toggleCategoryMenu,
} from "../../../store/merchants/transactions/transaction-slice";
import store from "../../../store/store";
import { isRestaurant } from "../../../lib/shared/roles_and_permissions";

function TopNavPos() {
  const { data: session, status } = useSession();
  const uiCtx = useContext(MerchantUiContext);
  const dispatch = useDispatch();

  const orderDetailsVisible = uiCtx.pos.actions.areOrderDetailsVisible();
  const itemCardsVisible = uiCtx.pos.actions.areItemCardsVisible();

  const transactionItems = useSelector(
    (state) => state.posTransaction.transactionItems
  );

  let itemsCount = transactionItems.reduce(
    (partialSum, item) => partialSum + item.quantity,
    0
  );

  const transaction = useSelector(
    (state) => state.posTransaction.suspendedTransaction
  );

  const today = new Date();

  function isAuthenticated() {
    return status === "authenticated";
  }

  function resetShownView() {
    dispatch(resetTransactionState());
    dispatch(clearSubmittedTransaction());
  }

  const showCategoryMenu = useSelector(
    (state) => state.posTransaction.showCategoryMenu
  );

  const isRestaurantAc = isRestaurant(session?.user);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    if (!isRestaurantAc) {
      store.dispatch(toggleCategoryMenu({ show: false }));
    }
  }, [session, status, isRestaurantAc]);

  const currentPosView = (
    <section className="flex-none">
      {!orderDetailsVisible && (
        <button
          className="btn btn-info btn-outline gap-2"
          onClick={uiCtx.pos.actions.showOrderDetails}
        >
          <i className="fa-solid fa-shopping-cart"></i>
          POS
          <span className="badge badge-primary">{itemsCount}</span>
        </button>
      )}

      {!itemCardsVisible && (
        <button
          className="btn btn-info btn-outline gap-2"
          onClick={uiCtx.pos.actions.showItemCards}
        >
          <i className="fa-solid fa-plus"></i>
          Add Items
        </button>
      )}
    </section>
  );

  const categoryMenuToggler = (
    <section className="flex-none">
      <button
        className="btn btn-info btn-outline gap-2"
        onClick={() => store.dispatch(toggleCategoryMenu())}
      >
        <i
          className={`fa-solid ${showCategoryMenu ? "fa-toggle-on" : "fa-toggle-off"
            }`}
        ></i>
        Show Categories
      </button>
    </section>
  );

  return (
    <nav className={`top-nav-pos bg-darkest tr-eo md:h-fit`}>
      <div className="flex flex-col items-end space-y-2 w-full">
        <section className="flex items-center space-x-2 justify-end w-full">
          <LoadingSpinner variant="dark" />

          {!isRestaurantAc && (
            <div className="hidden md:inline">{categoryMenuToggler}</div>
          )}
          <div className="hidden md:inline">{currentPosView}</div>
          {transaction && <OrderPrinter transaction={transaction} />}

          <Link href="/merchants/transactions/suspended">
            <div className="tooltip tooltip-bottom " data-tip="Orders">
              <button
                className="btn btn-info btn-outline gap-2"
                onClick={resetShownView}
              >
                <i className="fa-solid fa-arrow-down text-lg"></i>
                <span className="hidden sm:inline">Orders</span>
              </button>
            </div>
          </Link>

          <Link href="/merchants/transactions">
            <div className="tooltip tooltip-bottom " data-tip="Transactions">
              <button
                className="btn btn-info btn-outline gap-2"
                onClick={resetShownView}
              >
                <i className="fa-solid fa-list"></i>
                <span className="hidden sm:inline">Transactions</span>
              </button>
            </div>
          </Link>

          <div className="border border-info rounded-xl bg-info bg-opacity-80 px-4 py-2 flex items-center w-fit space-x-1 justify-between">
            <div className="text-xs flex flex-wrap text-center">
              <span className="text-sm w-full font-bold">
                {isAuthenticated() && session.user.name}
              </span>
              <span className="w-full text-xs whitespace-nowrap">
                {today.toLocaleDateString()}
              </span>
            </div>
          </div>
        </section>
        <div className="flex md:hidden gap-2">
          {categoryMenuToggler}
          {currentPosView}
        </div>
      </div>
    </nav>
  );
}

export default TopNavPos;

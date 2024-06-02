import { Checkbox } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { parseValidFloat } from "../../../../lib/shared/data-formatters";
import { hasBeenGranted } from "../../../../store/merchants/settings/access-control-slice";
import {
  addCardPayment,
  addCashPayment,
  addMpesaPayment,
  showViewPos,
  removePayment,
  submitTransaction,
  showViewReceipts,
  resetTransactionState,
  setDiscount,
  setCoupon,
  addOtherPayment,
} from "../../../../store/merchants/transactions/transaction-slice";
import store from "../../../../store/store";
import Card from "../../../ui/layouts/card";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import CardPayment from "./card-payment-inputs";
import CashPaymentInputs from "./cash-payment-inputs";
import MpesaPaymentInputs from "./mpesa-payment-inputs";
import OtherPayment from "./other-payment-inputs";
import TransactionSubmissionButton from "./transactions-submission-button";

export default function PaymentsView() {
  const [currentTab, setCurrentTab] = useState(0);
  const [showDiscounts, setShowDiscounts] = useState(false);

  const [showVoucher, setShowVoucher] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [showPoints, setShowPoints] = useState(false);

  const { data: session, status } = useSession();

  const initialDiscount = useSelector((state) => state.posTransaction.discount);
  const initialCoupon = useSelector((state) => state.posTransaction.coupon);
  const [discount, setCurrentDiscount] = useState(
    initialDiscount ? initialDiscount : ""
  );

  const [coupon, setCurrentCoupon] = useState(
    initialCoupon ? initialCoupon : ""
  );

  // function onDiscountUpdated(event) {
  //   setCurrentDiscount(event.target.value);
  //   dispatch(setDiscount({ discount: event.target.value }));
  // }

  function onDiscountUpdated(event) {
    setCurrentDiscount(event.target.value);
    dispatch(setDiscount({ discount: event.target.value }));
  }

  const transactionData = useSelector((state) => state.posTransaction);
  const isSubmitting = useSelector(
    (state) => state.posTransaction.submissionStatus == "loading"
  );

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
        title: "Success",
        message: "Transaction added successfully",
        color: "green",
      });

      dispatch(resetTransactionState());
      dispatch(showViewReceipts());
    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not save transaction";
      }

      showNotification({
        title: "Warning",
        message,
        color: "orange",
      });
    }
  }

  function formatNumber(value) {
    return new Intl.NumberFormat().format(value);
  }

  const payments = useSelector((state) => state.posTransaction.payments);
  const transactionItems = useSelector(
    (state) => state.posTransaction.transactionItems
  );
  const existingTransaction = useSelector(
    (state) => state.posTransaction.existingTransaction
  );
  const existingPayments = useSelector(
    (state) =>
      state.posTransaction.existingTransaction?.transaction_payments ?? []
  );

  let previously_paid = existingPayments.reduce((partialSum, item) => {
    let payment_amount = item?.paymentable?.amount ?? 0;
    payment_amount = parseValidFloat(payment_amount);
    const ignoreThis = "App\\Models\\Transactions\\CreditedPayment";

    const payment_type = item?.paymentable_type ?? "";

    if (payment_type !== ignoreThis) {
      partialSum += payment_amount;
    }
    return partialSum;
  }, 0);

  let total_paid = payments.reduce(
    (partialSum, item) => partialSum + item.amount,
    0
  );
  total_paid += previously_paid;

  let grand_total = transactionItems.reduce(
    (partialSum, item) => partialSum + item.sub_total,
    0
  );
  if (discount) {
    grand_total -= discount;
  }

  // let already_paid_sum = currentPaymentsCtx.actions.alreadyPaidSum();
  // total_paid += parseFloat(already_paid_sum) ? parseFloat(already_paid_sum) : 0;

  let remaining_amount = grand_total - total_paid;
  remaining_amount = remaining_amount > 0 ? remaining_amount : 0;

  let balance = total_paid - grand_total;
  balance = balance > 0 ? balance : 0;

  const canCredit = () => {
    if (!transactionData.client_id) {
      return false;
    }

    return true;
  };

  const canConfirm = () => {
    if (!canCredit() && remaining_amount > 0) {
      return false;
    }

    // const client = transactionCtx.transactions.transaction.getClient();
    // console.log(client, " ", remaining_amount);

    return true;
  };

  // Handles the submit event on form submit.
  const handleCoupon = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    const code = event.target.coupon_code.value;

    if (!transactionData.client_id || !grand_total || !code) {
      showNotification({
        title: "Error",
        message: "Make sure you have selected a client to proceed",
        color: "red",
      });

      return false;
    }

    console.log("Client ID: " + transactionData.client_id);
    console.log("Grand Total: " + grand_total);
    console.log("Coupon Code: " + code);

    // Get data from the form.
    const data = {
      coupon_code: code,
      amount: grand_total,
      client_id: transactionData.client_id,
      // client_id: 105054,
    };

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data);
    // console.log(JSONdata);

    // API endpoint where we send form data.
    //`${API_URL}/redeem-coupon`
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/redeem-coupon`;

    //Get Access Token
    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    // Send the form data to API and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();

    console.log(result);

    // alert(`Response Data: ${result.data}`)

    if (result.type === "Success") {
      // Do Calculations here

      // console.log(result);

      const couponAmount = result.data;

      setCurrentDiscount(couponAmount);
      dispatch(setDiscount({ discount: couponAmount }));

      // console.log(couponAmount);

      //then return success response
      showNotification({
        title: "Success",
        message:
          "A referral coupon code worth Ksh. " +
          couponAmount +
          " has been Applied",
        color: "green",
      });
    } else {
      showNotification({
        title: "Error",
        message: "Sorry, referral coupon code not Found",
        color: "red",
      });
    }
  };

  // Handles the submit event on form submit.
  const handleVoucher = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const data = {
      gift_card: event.target.gift_voucher.value,
    };

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data);

    // API endpoint where we send form data.
    //`${API_URL}/redeem-coupon`
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/redeem-gift-cards`;

    //Get Access Token
    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();

    console.log(result);

    // alert(`Response Data: ${result.data}`)

    if (result.giftCode === 200) {
      //Do Calculations here

      const giftAmount = result.data.discount;

      setCurrentDiscount(giftAmount);
      dispatch(setDiscount({ discount: giftAmount }));

      console.log(giftAmount);

      //then return success response

      showNotification({
        title: result.type,
        message: "A gift code worth Ksh. " + giftAmount + " has been Applied",
        color: "green",
      });
    } else {
      showNotification({
        title: result.type,
        message: result.message,
        color: "red",
      });
    }

    // console.log(result.message);
  };

  const noPaymentMethodAlert = (
    <main className="grow flex justify-center">
      <div className="alert alert-info w-fit transition-all ease-out ignore">
        <div>
          <i className="fa-solid fa-info-circle"></i>
          <div>
            <h3 className="font-bold">No Payments Yet</h3>
            <div className="text-sm">Add a payment method to proceed.</div>
          </div>
        </div>
      </div>
    </main>
  );

  const paymentsList = (
    <main className="grow flex flex-col md:flex-row justify-start gap-4">
      <ul className="menu menu-horizonal md:menu-vertical bg-base-100 w-auto md:w-56 h-fit">
        {payments.map((paymentMethod, i) => (
          <li
            onClick={() => setCurrentTab(i)}
            className={`${currentTab === i ? "bordered" : ""}`}
            key={i}
          >
            <a className="capitalize flex justify-between">
              <div>
                <span className="mr-2">{paymentMethod.type}</span>
                {paymentMethod.amount && (
                  <span>{formatNumber(paymentMethod.amount)}</span>
                )}
              </div>
              <button
                className="btn btn-circle btn-error btn-outline btn-xs"
                onClick={() =>
                  store.dispatch(removePayment({ itemId: paymentMethod.id }))
                }
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </a>
          </li>
        ))}
      </ul>

      {payments.map(
        (paymentMethod, i) =>
          currentTab === i && (
            <div className="w-full" key={i}>
              {paymentMethod.type === "cash" && (
                <CashPaymentInputs
                  amount={paymentMethod.amount}
                  index={paymentMethod.id}
                />
              )}
              {paymentMethod.type === "mpesa" && (
                <MpesaPaymentInputs
                  amount={paymentMethod.amount}
                  index={paymentMethod.id}
                  phone={paymentMethod.phone}
                  transactionCode={paymentMethod.transaction_code}
                />
              )}
              {paymentMethod.type === "card" && (
                <CardPayment
                  amount={paymentMethod.amount}
                  index={paymentMethod.id}
                />
              )}
              {paymentMethod.type === "other" && (
                <OtherPayment
                  amount={paymentMethod.amount}
                  index={paymentMethod.id}
                  name={paymentMethod.name}
                />
              )}
            </div>
          )
      )}
    </main>
  );

  const discountView = useSelector(
    hasBeenGranted("can_do_transaction_discounts")
  ) && (
    <section className="mt-3">
      <Checkbox
        checked={showDiscounts}
        label="Add Discount"
        onChange={(event) => {
          if (!event.currentTarget.checked) {
            setCurrentDiscount(0);
            dispatch(setDiscount({ discount: 0 }));
          }
          setShowDiscounts(event.currentTarget.checked);
        }}
      />

      {showDiscounts && (
        <>
          <label className="label-text">Discount</label>
          <input
            type="discount"
            className="input-primary input-sm text-grey-100 text-sm"
            placeholder="Discount"
            onChange={onDiscountUpdated}
            value={discount}
          />
        </>
      )}
    </section>
  );

  const couponView = (
    <section className="mt-3">
      <Checkbox
        checked={showCoupon}
        label="Promo Codes (Discount or referral codes)"
        onChange={(event) => {
          if (!event.currentTarget.checked) {
            setCurrentDiscount(0);
            dispatch(setDiscount({ discount: 0 }));
          }
          setShowCoupon(event.currentTarget.checked);
        }}
      />

      {showCoupon && (
        <>
          {/* <label className="label-text">Coupon</label>
          <input
            type="coupon"
            className="input-primary input-sm text-grey-100 text-sm"
            placeholder="Coupon Code"
            onChange={onDiscountUpdated}
            value={discount}
          /> */}
          <form onSubmit={handleCoupon}>
            <div className="w-full grow">
              <div className="flex grow items-end">
                <div className="flex grow flex-wrap space-y-1 w-9/12 mt-3">
                  <div className="text-dark text-sm">
                    <span>Referral/Discount Coupon</span>
                  </div>
                  <input
                    type="text"
                    className="input-primary h-12 text-grey-100 text-sm rounded-r-none"
                    name="coupon_code"
                    required=""
                    placeholder="Promo Code"
                  />
                </div>
                <button
                  className="button-primary h-12 text-xs grow whitespace-nowrap rounded-l-none b"
                  type="submit"
                >
                  <span>Apply</span>
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </section>
  );

  const voucherView = (
    <section className="mt-3">
      <Checkbox
        checked={showVoucher}
        label="Gift Voucher Code"
        onChange={(event) => {
          if (!event.currentTarget.checked) {
            setCurrentDiscount(0);
            dispatch(setDiscount({ discount: 0 }));
          }
          setShowVoucher(event.currentTarget.checked);
        }}
      />

      {showVoucher && (
        <>
          {/* <label className="label-text">Gift Voucher Code</label>
          <input
            type="voucher"
            className="input-primary input-sm text-grey-100 text-sm"
            placeholder="Gift Voucher Code"
            onChange={onDiscountUpdated}
            value={discount}
          /> */}
          <form onSubmit={handleVoucher}>
            <div className="w-full">
              <div className="flex items-end">
                <div className="flex flex-wrap grow space-y-1 w-9/12 mt-3">
                  <div className="text-dark text-sm">
                    <span>Gift Voucher</span>
                  </div>
                  <input
                    type="text"
                    className="input-primary h-12 text-grey-100 text-sm rounded-r-none"
                    required=""
                    placeholder="Gift Voucher Code"
                    name="gift_voucher"
                  />
                </div>
                <button
                  className="button-primary h-12 text-xs grow whitespace-nowrap rounded-l-none b"
                  type="submit"
                >
                  <span>Apply</span>
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </section>
  );

  const pointsView = (
    <section className="mt-3">
      <Checkbox
        checked={showPoints}
        label="Redeem Points"
        onChange={(event) => {
          if (!event.currentTarget.checked) {
            setCurrentDiscount(0);
            dispatch(setDiscount({ discount: 0 }));
          }
          setShowPoints(event.currentTarget.checked);
        }}
      />

      {showPoints && (
        <>
          {/* <label className="label-text">Redeem Points</label>
          <input
            type="points"
            className="input-primary input-sm text-grey-100 text-sm"
            placeholder="Points to Redeem"
            onChange={onDiscountUpdated}
            value={discount}
          /> */}

          <div className="w-full">
            <div className="flex items-end">
              <div className="flex  grow flex-wrap space-y-1 w-9/12 mt-3">
                <div className="text-dark text-sm">
                  <span>Redeem Points</span>
                </div>
                <input
                  type="points"
                  className="input-primary input-sm text-grey-100 text-sm "
                  required=""
                  placeholder="Points to Redeem"
                  debounce="coupon"
                  onChange={onDiscountUpdated}
                  value={discount}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );

  return (
    <main className="w-full px-4 py-2 pt-6 mt-32 md:mt-16 mb-8">
      <div className="flex justify-between items-end mb-2">
        <h1 className="text-xl">Payment Details</h1>
        <button
          className="btn btn-sm btn-primary btn-outline gap-2"
          onClick={() => store.dispatch(showViewPos())}
        >
          <i className="fa-solid fa-angle-left"></i>
          Back
        </button>
      </div>
      <div>
        <div className="w-full flex flex-col md:flex-row items-center gap-2">
          <aside className="h-fit w-full md:w-fit">
            <Card>
              <div className="grid grid-flow-col auto-cols-auto md:grid-flow-row md:grid-cols-1 gap-2">
                <button
                  className="btn btn-primary btn-outline gap-2 flex-nowrap"
                  onClick={() => {
                    setCurrentTab(payments.length);
                    store.dispatch(addCashPayment());
                  }}
                >
                  Cash
                  <i className="fa-solid fa-plus"></i>
                </button>

                <button
                  className="btn btn-success btn-outline gap-2 flex-nowrap"
                  onClick={() => {
                    setCurrentTab(payments.length);
                    store.dispatch(addMpesaPayment());
                  }}
                >
                  MPesa
                  <i className="fa-solid fa-plus"></i>
                </button>

                <button
                  className="btn btn-primary btn-outline gap-2 flex-nowrap"
                  onClick={() => {
                    setCurrentTab(payments.length);
                    store.dispatch(addCardPayment());
                  }}
                >
                  Card
                  <i className="fa-solid fa-plus"></i>
                </button>

                <button
                  className="btn btn-primary btn-outline gap-2 flex-nowrap"
                  onClick={() => {
                    setCurrentTab(payments.length);
                    store.dispatch(addOtherPayment());
                  }}
                >
                  Other
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </Card>
          </aside>

          <div className="h-full w-full flex flex-col gap-2">
            <Card>
              {payments.length > 0 ? paymentsList : noPaymentMethodAlert}
            </Card>
            <Card>
              <Fragment>
                {discountView}

                {couponView}

                {voucherView}

                {pointsView}

                <div className="flex justify-between flex-col lg:flex-row-reverse items-center">
                  {balance ? (
                    <section className="flex gap-2 items-end w-fit text-success">
                      <span className="text-success text-xl font-medium">
                        Balance
                      </span>
                      <span className="tracking-wider text-4xl font-medium space-x-2 text-right">
                        <span className="text-base">KES</span>
                        <span>{formatNumber(balance)}</span>
                      </span>
                    </section>
                  ) : (
                    ""
                  )}

                  <div className="flex flex-col space-y-2 items-end">
                    <section className="flex gap-2 items-end w-fit">
                      <span className="text-dark text-xl font-medium">
                        Total Due
                      </span>
                      <span className="tracking-wider text-3xl font-medium space-x-2 text-right">
                        <span className="text-base">KES</span>
                        <span>{formatNumber(grand_total)}</span>
                      </span>
                    </section>

                    <section className="flex gap-2 items-end w-fit">
                      <span className="text-dark text-lg font-medium">
                        Total Paid
                      </span>
                      <span className="tracking-wider text-2xl font-medium space-x-2 text-right">
                        <span className="text-sm">KES</span>
                        <span>{formatNumber(total_paid)}</span>
                      </span>
                    </section>

                    {remaining_amount ? (
                      <section className="flex gap-2 items-end text-error w-fit">
                        <span className="text-opacity-50 text-lg font-medium">
                          Remaining
                        </span>
                        <span className="tracking-wider text-2xl font-medium space-x-2 text-right">
                          <span className="text-sm">KES</span>
                          <span>{formatNumber(remaining_amount)}</span>
                        </span>
                      </section>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </Fragment>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <TransactionSubmissionButton
          canCredit={canCredit()}
          remainingAmount={remaining_amount}
        />
      </div>
    </main>
  );
}

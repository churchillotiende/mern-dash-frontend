import { useState } from "react";
import {
  formatNumber,
  parseValidInt,
} from "../../../../lib/shared/data-formatters";
import store from "../../../../store/store";
import {
  isTransactionItemAService,
  removeTransactionItem,
  setTransactionItemCost,
  setTransactionItemDiscount,
  setTransactionItemQuantity,
  setTransactionItemStaff,
} from "../../../../store/merchants/transactions/transaction-slice";
import { Select, TextInput } from "@mantine/core";
import CalculatedInput from "../../../ui/forms/calculated-input";
import { useSelector } from "react-redux";
import { hasBeenGranted } from "../../../../store/merchants/settings/access-control-slice";
import { useEffect } from "react";

export default function TitemCard({ item, staffList }) {
  const [discount, setDiscount] = useState(item.discount);
  const [quantity, setQuantity] = useState(item.quantity);
  const [cost, setCost] = useState(item.cost);
  const [staffId, setStaffId] = useState(parseValidInt(item?.staff_id));

  console.log("Item Console now", typeof parseValidInt(item?.staff_id));
  console.log("Staff List", staffList);

  const onDiscountChanged = (event) => {
    setDiscount(event.target.value);
    const params = {
      itemId: item.id,
      discount: event.target.value,
    };
    store.dispatch(setTransactionItemDiscount(params));
  };

  const onQuantityChanged = (event_value) => {
    // Validate the local state
    let quantityInt = parseValidInt(event_value);
    if (quantityInt <= 0) {
      setQuantity(1);
    } else {
      setQuantity(event_value);
    }

    // Redux will handle its own validation
    const params = {
      itemId: item.id,
      quantity: event_value,
    };
    store.dispatch(setTransactionItemQuantity(params));
  };

  function onDeleteTitem() {
    store.dispatch(removeTransactionItem({ itemId: item.id }));
  }

  function setTitemStaff(selectedId) {
    console.log("You Selected:: ", selectedId);
    setStaffId(selectedId);
    store.dispatch(
      setTransactionItemStaff({ itemId: item.id, staffId: selectedId })
    );
  }

  const canEditPrice = useSelector(
    hasBeenGranted("can_adjust_selling_price_on_pos")
  );

  function updateCost(event) {
    if (!canEditPrice) {
      return;
    }

    setCost(event.target.value);

    store.dispatch(
      setTransactionItemCost({ itemId: item.id, cost: event.target.value })
    );
  }

  //Set Default Values
  // useEffect(() => {
  //   if (!item) {
  //     return;
  //   }
  //   setStaffId(item?.staff_id);
  // }, [item]);

  return (
    <div className="flex items-start gap-2">
      <div className="pt-2.5">
        <i
          className="fa-solid fa-times h-fit hover:cursor-pointer mx-1 text-lg text-error flex-none"
          onClick={onDeleteTitem}
        ></i>
      </div>
      <div className="w-full border-b border-grey-50 border-opacity-50 py-3">
        <div
          className={`grid grid-cols-3 md:grid-cols-4 ${
            isTransactionItemAService(item) && "xl:grid-cols-4 2xl:grid-cols-5"
          } gap-2`}
        >
          <TextInput
            value={item.sellable.sellable.name}
            label="Item"
            onChange={() => {}}
          />

          <CalculatedInput
            label="Qtt"
            placeholder="Enter amount"
            onChangeHandler={onQuantityChanged}
            value={quantity === 0 ? "" : quantity}
          />

          <TextInput
            value={item.cost ?? ""}
            type="number"
            label="Adjust Price"
            onChange={updateCost}
          />

          <TextInput
            value={formatNumber(item.sub_total)}
            label="Total"
            onChange={() => {}}
          />
          {isTransactionItemAService(item) && (
            <>
              <div className="w-full">
                <Select
                  placeholder="Staff"
                  label="Staff"
                  data={staffList}
                  value={staffId}
                  onChange={setTitemStaff}
                  searchable
                  clearable
                />
              </div>

              <div className="w-full">
                <TextInput
                  type="number"
                  label="Discount"
                  placeholder="Enter amount"
                  onChange={onDiscountChanged}
                  value={discount === 0 ? "" : discount}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

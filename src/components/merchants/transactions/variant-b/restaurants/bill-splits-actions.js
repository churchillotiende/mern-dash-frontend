import { ActionIcon, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { parseValidFloat } from "../../../../../lib/shared/data-formatters";
import KeyboardInput from "../../../../ui/forms/keyboard-input";
import Card from "../../../../ui/layouts/card";
import { IconTrash } from "@tabler/icons";
import { printRemotePdf } from "../../../../../lib/shared/printing-helpers";

function BillSplitsAction({ transaction }) {
  const [bills, setBills] = useState([
    {
      id: crypto.randomUUID(),
      amount: parseValidFloat(transaction.cost),
    },
  ]);

  const billTotal = bills.reduce((total, value) => total + value.amount, 0);

  function setBillAmount(billId, amount) {
    let allBills = [...bills];
    allBills = allBills.map((item) => {
      if (item.id === billId) {
        return {
          id: item.id,
          amount,
        };
      } else {
        return item;
      }
    });

    setBills(allBills);
  }

  function removeBill(billId) {
    const remainingBills = bills.filter((item) => item.id !== billId);

    setBills(remainingBills);
  }

  function addBill() {
    let allBills = [
      {
        id: crypto.randomUUID(),
        amount: 0,
      },
      ...bills,
    ];

    setBills(allBills);

    showNotification({
      title: "Info",
      message: "Added bill",
      color: "blue",
    });
  }

  function printBill(billId) {
    if (billTotal > parseValidFloat(transaction.cost)) {
      showNotification({
        title: "Warning",
        message: `The entered amounts(${billTotal}) are more than the transaction's value(${transaction.cost})`,
        color: "orange",
      });

      return;
    } else if (billTotal < parseValidFloat(transaction.cost)) {
      showNotification({
        title: "Warning",
        message: `The entered amounts(${billTotal}) are less than the transaction's value(${transaction.cost})`,
        color: "orange",
      });

      return;
    }

    const currentBill = bills.find((item) => item.id === billId);

    const url = `${transaction.receipt_address}?split_amount=${
      currentBill?.amount ?? 0
    }`;

    printRemotePdf(url);
  }

  return (
    <>
      <div className="flex justify-between items-end">
        <h3 className="text-dark font-bold">
          Bills <span className="text-sm font-normal">Total: {billTotal}</span>
        </h3>

        <Button onClick={addBill} variant="outline" size="xs">
          Add
        </Button>
      </div>

      <section className="flex flex-col w-full space-y-2">
        {bills?.map((item) => (
          <div className="rounded mt-2 shadow" key={item.id}>
            <Card>
              <BillAmount
                initialAmount={item.amount}
                splitId={item.id}
                updateAmount={setBillAmount}
                removeBill={removeBill}
                printBill={printBill}
              />
            </Card>
          </div>
        ))}
      </section>
    </>
  );
}

function BillAmount({
  initialAmount,
  splitId,
  updateAmount,
  removeBill,
  printBill,
}) {
  const [value, setValue] = useState(initialAmount);

  function setAmount(event_value) {
    setValue(event_value);
    updateAmount(splitId, parseValidFloat(event_value));
  }

  return (
    <>
      <div className="w-full">
        <KeyboardInput
          label="Amount"
          type="number"
          placeholder="Enter amount"
          value={value}
          onChangeHandler={setAmount}
        />
      </div>

      <div className="w-full flex justify-end mt-2 space-x-2 items-center">
        <ActionIcon
          variant="outline"
          size="lg"
          color="red"
          onClick={() => removeBill(splitId)}
        >
          <IconTrash size={17} />
        </ActionIcon>

        <Button onClick={() => printBill(splitId)} disabled={value <= 0}>
          Print
        </Button>
      </div>
    </>
  );
}

export default BillSplitsAction;

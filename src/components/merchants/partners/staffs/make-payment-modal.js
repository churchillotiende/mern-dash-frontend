import {
  Button,
  Modal,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPencil } from "@tabler/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import LinkButton from "../../../ui/actions/link-button";
import { getStaffList } from "../../../../store/merchants/partners/staff-slice";
import store from "../../../../store/store";

function MakePaymentModal({ staffId }) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");

  const submitData = async (event) => {
    event.preventDefault();

    const data = {
      payment_date: date,
      payment_amount: amount,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/staff/${staffId}/pay`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();

    console.log(result);

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Payment Successfull!",
        color: "green",
      });
      setOpened(false);
      const params = {};
      params["accessToken"] = session.user.accessToken;
      store.dispatch(getStaffList(params));
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }
  };

  return (
    <>
      <Modal
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={opened}
        title={`Record New Staff Payment`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* Modal content */}

        <section className="flex flex-col">
          <div className="px-2 py-2">
            <div className="text-dark text-sm mb-1">
              <span>Payment Date</span>
            </div>
            <input
              type="date"
              name="date"
              className="input-primary h-12 text-sm"
              required=""
              placeholder="dd/mm/yyyy"
              onChange={(e) => setDate(e.target.value)}
              value={date}
            />
          </div>
          <div className="px-2 py-2">
            <div className="text-dark text-sm mb-1">
              <span>Amount</span>
            </div>
            <input
              type="number"
              name="amount"
              className="input-primary h-12 text-sm"
              required=""
              placeholder="Amount"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitData}>Save</Button>
        </section>
      </Modal>

      <a
        onClick={() => setOpened(true)}
        className="btn btn-sm btn-success ml-2"
      >
        Make Payment
      </a>
    </>
  );
}

export default MakePaymentModal;

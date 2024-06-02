import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconPlus } from "@tabler/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../../store/store";
import { getStaffList } from "../../../../store/merchants/partners/staff-slice";
import { getStaffToShareCommission } from "../../../../store/merchants/partners/staff-slice";

function ShareCommissionModal({ item, staffId }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [amount, setAmount] = useState("");
  const [shareStaffId, setStaffId] = useState("");

  const transactionId = item?.id;

  const staffsToShareCommission = useSelector(
    (state) => state.staff.getStaffToShareCommission
  );

  useEffect(() => {
    if (!session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getStaffToShareCommission(params));
  }, [session]);

  const staffsListData =
    staffsToShareCommission?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  const selectedStaff = staffsToShareCommission?.find(
    (item) => item.id === shareStaffId
  );

  const submitDetails = async (event) => {
    event.preventDefault();

    const data = {
      staff_id: shareStaffId,
      amount: amount,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/staff/${staffId}/share-transaction-commission/${transactionId}`;

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

    if (!result.error) {
      showNotification({
        title: "Success",
        message: "Share Commission Successfull!",
        color: "green",
      });
      setOpened(false);
      const params = {};
      params["accessToken"] = session.user.accessToken;
      store.dispatch(getStaffList(params));
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.error,
        color: "red",
      });
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        title="Share Commission"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Share Commission Details
          </span>

          <Select
            placeholder="Select Staff"
            label="Select Staff"
            value={shareStaffId}
            onChange={setStaffId}
            data={staffsListData}
            searchable
            clearable
          />

          <TextInput
            placeholder="Enter Amount"
            label="Enter Amount"
            withAsterisk
            value={amount}
            onChange={(e) => setAmount(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails}>Save</Button>
        </section>
      </Modal>

      <a
        onClick={() => setOpened(true)}
        href="#"
        className="btn btn-sm btn-success gap-2 w-fit mr-2"
      >
        Share Commission
      </a>
    </>
  );
}

export default ShareCommissionModal;

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
import { getProducts } from "../../../store/merchants/inventory/products-slice";
import store from "../../../store/store";
import { getComboSubItems } from "../../../store/merchants/inventory/inventory-slice";
import { getCombosSubItems } from "../../../store/merchants/inventory/products-slice";
import { getRFQSubItems } from "../../../store/merchants/inventory/purchases-slice";
import { getRFQItems } from "../../../store/merchants/inventory/purchases-slice";

function PriceChangesModal({ item, rfqId, receivalId }) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [sellable_id, setSellable] = useState("");
  const [selling_price, setSellingPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [subItemId, setSubItemId] = useState("");

  const itemId = item?.id;

  const rfqSubItemsStatus = useSelector(
    (state) => state.purchases.getRFQSubItemsStatus
  );
  const rfqSubItems = useSelector((state) => state.purchases.getRFQSubItems);
  const isRfqSUbItemsLoading = rfqSubItemsStatus === "loading";

  const rfqItemsStatus = useSelector(
    (state) => state.purchases.getRFQItemsStatus
  );
  const rfqItems = useSelector((state) => state.purchases.getRFQItems);
  const isRfqItemsLoading = rfqItemsStatus === "loading";

  console.log("onyambu", item);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["rfqId"] = rfqId;

    store.dispatch(getRFQSubItems(params));
  }, [session, status, rfqId]);

  console.log("RFQ Sub Items", rfqSubItems);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["rfqId"] = rfqId;

    store.dispatch(getRFQItems(params));
  }, [session, status, rfqId]);

  const handleEditRfq = async (event) => {
    event.preventDefault();

    const data = {
      selling_price: event.target.selling_price.value,
      // buying_price: event.target.buying_price.value,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/inventory/purchases/receival/${receivalId}/item/${itemId}/changePrice`;

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

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Price Updated Successfully",
        color: "green",
      });
      // router.push('/merchants/inventory/purchases');
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["rfqId"] = rfqId;
      store.dispatch(getRFQItems(params));
      setOpened(false);
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }

    console.log(result);
    console.log(response);
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
        title={`Price Changes`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* Modal content */}

        <form onSubmit={handleEditRfq}>
          <section className="flex flex-col">
            <span className="text-dark text-sm font-bold">Price Changes</span>
            <div className="py-2">
              <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
                Item Name: {item?.sellable?.sellable?.name} <br></br>
                Price: {item?.sellable?.sellable?.cost}
              </section>

              {/* <div className="my-2">
                <div className="text-dark text-sm mb-1">
                  <span>Buying Price*</span>
                </div>
                <input
                  type="number"
                  name="buying_price"
                  className="input-primary h-12 text-sm"
                  required=""
                  placeholder="Buying Price"
                />
              </div> */}
              <div className="my-2">
                <div className="text-dark text-sm mb-1">
                  <span>Selling Price*</span>
                </div>
                <input
                  type="number"
                  name="selling_price"
                  className="input-primary h-12 text-sm"
                  required=""
                  placeholder="Selling Price"
                />
              </div>
            </div>
          </section>

          <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
            <Button type="submit">Save</Button>
          </section>
        </form>
      </Modal>

      <a
        className="btn btn-sm btn-outline-primary"
        onClick={() => setOpened(true)}
      >
        Price Changes
      </a>
    </>
  );
}

export default PriceChangesModal;

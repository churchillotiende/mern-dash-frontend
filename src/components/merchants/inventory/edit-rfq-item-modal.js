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

function EditRfqItem({ item, rfqId }) {
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
      sellable_id: event.target.sellable_id.value,
      quantity: event.target.quantity.value,
      unit_price: event.target.unit_price.value,
      tax_pc: event.target.tax_pc.value,
      note: event.target.note.value,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/inventory/purchases/rfq/${rfqId}/update/${itemId}`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "PATCH",
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
        message: "Item Updated Successfully",
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
        title={`Edit RFQ Item`}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* Modal content */}

        <form onSubmit={handleEditRfq}>
          <section className="flex flex-col">
            <span className="text-dark text-sm font-bold">
              Edit RFQ Details
            </span>
            <div className="py-2">
              <div className="">
                <div className="text-dark text-sm mt-1">
                  <span>Item</span>
                </div>
                <select
                  className="py-3 select select-bordered h-fit"
                  required=""
                  name="sellable_id"
                >
                  <option selected="" value="">
                    -- Select
                  </option>
                  {rfqSubItems?.products?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.sellable.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="my-2">
                <div className="text-dark text-sm mb-1">
                  <span>Quantity*</span>
                </div>
                <input
                  type="number"
                  name="quantity"
                  className="input-primary h-12 text-sm"
                  required=""
                  placeholder="Quantity"
                  defaultValue={item?.quantity}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="">
                  <div className="text-dark text-sm mb-1">
                    <span>Unit Price*</span>
                  </div>
                  <input
                    type="number"
                    name="unit_price"
                    className="input-primary h-12 text-sm"
                    required=""
                    placeholder="Unit Price"
                    defaultValue={item?.unit_price}
                  />
                </div>
                <div className="">
                  <div className="text-dark text-sm mb-1">
                    <span>Tax PC(Inclusive)</span>
                  </div>
                  <input
                    type="number"
                    name="tax_pc"
                    className="input-primary h-12 text-sm"
                    required=""
                    placeholder="Quantity"
                    defaultValue={item?.tax_pc}
                  />
                </div>
              </div>
              <div className="my-2">
                <div className="text-dark text-sm mb-1">
                  <span>Note</span>
                </div>
                <textarea
                  rows={3}
                  name="note"
                  className="input-primary h-fit text-sm"
                  placeholder="Terms and Conditions"
                  defaultValue={item?.note}
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
        className="btn btn-sm btn-primary mr-2"
        onClick={() => setOpened(true)}
      >
        Edit
      </a>
    </>
  );
}

export default EditRfqItem;

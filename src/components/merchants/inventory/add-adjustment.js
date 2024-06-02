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
import { getAdjustmentReq } from "../../../store/merchants/inventory/inventory-slice";
import store from "../../../store/store";
import { getProducts } from "../../../store/merchants/inventory/products-slice";

function AddAdjustments({ adjustment }) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [adjustment_action, setAdjustment] = useState("");
  const [warehouse_id, setWarehouse] = useState("");
  const [company_id, setCompany] = useState("");
  const [buying_price, setBuyingPrice] = useState("");
  const [selling_price, setSellingPrice] = useState("");
  const [margin, setMargin] = useState("");
  const [batchRecord, setBatchRecord] = useState("");
  const [sellOnPOS, setSellOnPOS] = useState("");
  const [margin_percent, setMarginPercent] = useState("");

  const manualStatus = useSelector(
    (state) => state.inventory.getAdjustmentReqStatus
  );

  const manual = useSelector((state) => state.inventory.getAdjustmentReq);

  const isLoading = manualStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getAdjustmentReq(params));
  }, [session, status]);

  const submitAdjustment = async (event) => {
    event.preventDefault();

    const data = {
      quantity: quantity,
      adjustment_action: adjustment_action,
      warehouse_id: warehouse_id,
      company_id: company_id,
      buying_price: buying_price,
      selling_price: selling_price,
      batch_this_record: batchRecord,
      make_active_batch: sellOnPOS,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/products/${adjustment?.id}/create-manual-adjustment`;

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
        message: "Adjustment was Successfully",
        color: "green",
      });
      setOpened(false);
      const params = {};
      params["accessToken"] = session.user.accessToken;
      store.dispatch(getProducts(params));
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }
  };

  useEffect(() => {
    const margin = selling_price - buying_price;
    setMargin(margin);
  }, [buying_price, selling_price]);

  // console.log(manual?.companies[0]?.name);

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
        title={`#${adjustment?.id} ${adjustment?.name} `}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* Modal content */}

        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">Add Adjustment</span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            <div className="">
              <div className="text-dark text-sm mb-1">
                <span>Name *</span>
              </div>
              <input
                type="text"
                name="quantity"
                className="input-primary h-12 text-sm"
                required=""
                placeholder="Name"
                value={adjustment?.name}
                readOnly
              />
            </div>
            <div className="">
              <div className="text-dark text-sm mb-1">
                <span>Adjustment Quantity *</span>
              </div>
              <input
                type="number"
                name="adjustment"
                className="input-primary h-12 text-sm"
                required=""
                placeholder="Quantity"
                onChange={(e) => setQuantity(e.currentTarget.value)}
              />
            </div>
            <div className="">
              <div className="text-dark text-sm">
                <span>Store</span>
              </div>
              <select
                className="py-3 select select-bordered h-fit"
                required=""
                name="warehouse_id"
                onChange={(e) => setWarehouse(e.currentTarget.value)}
              >
                <option>Select Store</option>
                {manual?.warehouse.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="">
              <div className="text-dark text-sm">
                <span>Action</span>
              </div>
              <select
                className="py-3 select select-bordered h-fit"
                required=""
                name="adjustment_action"
                placeholder="Choose whether you adding or subtracting the product"
                onChange={(e) => setAdjustment(e.currentTarget.value)}
              >
                <option value="">Action</option>
                <option value="addition">Recieving</option>
              </select>
            </div>
            <div className="">
              <div className="text-dark text-sm mb-1">
                <span>New Buying Price*</span>
              </div>
              <input
                type="number"
                name="buying_price"
                className="input-primary h-12 text-sm"
                required=""
                placeholder="Selling Price"
                onChange={(e) => setBuyingPrice(e.currentTarget.value)}
              />
            </div>
            <div className="">
              <div className="text-dark text-sm mb-1">
                <span>New Selling Price*</span>
              </div>
              <input
                type="number"
                name="selling_price"
                className="input-primary h-12 text-sm"
                required=""
                placeholder="Selling Price"
                onChange={(e) => setSellingPrice(e.currentTarget.value)}
              />
            </div>
            <div className="">
              <div className="text-dark text-sm mb-1">
                <span>Profit Margin</span>
              </div>
              <input
                type="number"
                name="profit_margin"
                className="input-primary h-12 text-sm bg-light"
                placeholder="Margin"
                readOnly
                value={margin}
              />
            </div>
            <div className="">
              <div className="text-dark text-sm mb-1">
                <span>Company*</span>
              </div>
              <select
                type="text"
                className="py-3 select select-bordered h-fit"
                name="company_id"
                onChange={(e) => setCompany(e.currentTarget.value)}
              >
                <option value="">-- Select Company</option>
                {manual?.companies.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control pl-1">
              <label className="label cursor-pointer justify-start space-x-2">
                <input
                  type="checkbox"
                  name="batch_this_record"
                  className="checkbox checkbox-primary"
                  onChange={() => setBatchRecord(!batchRecord)}
                />
                <span className="label-text">Batch this record</span>
              </label>
            </div>

            {batchRecord && (
              <div className="form-control pl-1">
                <label className="label cursor-pointer justify-start space-x-2">
                  <input
                    type="checkbox"
                    name="make_active_batch"
                    className="checkbox checkbox-primary"
                    onChange={() => setSellOnPOS(!sellOnPOS)}
                  />
                  <span className="label-text">Sell On POS</span>
                </label>
              </div>
            )}
          </div>
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitAdjustment}>Save</Button>
        </section>
      </Modal>

      <div
        className="tooltip tooltip-top items-center"
        data-tip="Manual Adjustment"
      >
        <a
          onClick={() => setOpened(true)}
          className="btn btn-sm btn-primary btn-outline gap-2"
        >
          <i className="fa-solid fa-plus-minus" />
        </a>
      </div>
    </>
  );
}

export default AddAdjustments;

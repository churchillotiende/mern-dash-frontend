import { useRouter } from "next/router";
import CategoriesForm from "./categories-form";
//Get Categories Imports
import {
  getInventoryCategories,
  getProductTax,
} from "../../../store/merchants/inventory/products-slice";
import { Select } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../store/store";
//End Get Categories Imports

function CreateMenuForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Start Get Categories and SubCategories Data
  const [psCategoryId, setPsCategoryId] = useState("");
  const [psSubcategoryId, setPsSubcategoryId] = useState("");

  const platformCategories = useSelector(
    (state) => state.products.getInventoryCategories
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getInventoryCategories(params));
  }, [session, status]);

  const platformCategoryData =
    platformCategories?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  const selectedPlatformCategory = platformCategories?.find(
    (item) => item.id === psCategoryId
  );

  const platformSubcategoryData =
    selectedPlatformCategory?.product_sub_categories?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  // End Get Categories and SubCategories Data

  //Get Tax Data
  const taxList = useSelector((state) => state.products.getProductTax);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getProductTax(params));
  }, [session, status]);
  //End Get Tax Data

  const submitMenu = async (event) => {
    event.preventDefault();

    if (!event.target.name.value) {
      showNotification({
        title: "Error",
        message: "Name is required!",
        color: "red",
      });
      return;
    }

    if (!event.target.cost.value) {
      showNotification({
        title: "Error",
        message: "Selling Price is required!",
        color: "red",
      });
      return;
    }

    // Payload Data to Submit
    // {
    //   "name": "Spaghetti Bolognese",
    //   "description": null,
    //   "cost": "303",
    //   "tax_id": null,
    //   "tax_method": null,
    //   "menu_item_type": "food",
    //   "inventory_category_id": null,
    //   "inventory_sub_category_id": null
    // }

    const data = {
      name: event.target.name.value,
      description: event.target.description.value,
      cost: event.target.cost.value,
      tax_id: event.target.tax_id.value,
      tax_method: event.target.tax_method.value,
      inventory_category_id: psCategoryId,
      inventory_sub_category_id: psSubcategoryId,
    };

    console.log("POST Payload Data", data);

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/menu-items`;

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
        message: "Your menu has been added Successfully",
        color: "green",
      });
      router.push("/merchants/inventory/menus");
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }

    console.log(result);
  };

  return (
    <Fragment>
      <div className="min-h-96 h-fit w-100 mx-6" poll="">
        <form prevent="submit" onSubmit={submitMenu}>
          <div className="h-full w-full bg-white rounded-t-xl px-6 py-4 pb-8">
            <h3>Menu Item Information</h3>
            <div className="flex flex-wrap justify-between items-stretch">
              <div className="basis-full md:basis-6/12 flex flex-col justify-between flex-wrap h-auto">
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-5">
                    <span>Name</span>
                  </div>
                  <input
                    type="text"
                    name="name"
                    className="input-primary h-12 text-sm"
                    placeholder="Item Name"
                    lazy="name"
                  />
                </div>
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-5">
                    <span>Description</span>
                  </div>
                  <input
                    type="text"
                    name="description"
                    className="input-primary h-12 text-sm"
                    placeholder="Description"
                    lazy="description"
                  />
                </div>

                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-5">
                    <span>Product Tax</span>
                  </div>
                  <select
                    className="py-3 select select-bordered h-fit w-full rounded-r-none"
                    name="tax_id"
                  >
                    <option selected="" value="">
                      -- Select
                    </option>
                    {taxList?.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name} {item.rate}%
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="basis-full md:basis-6/12 flex flex-col justify-start flex-wrap">
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-5">
                    <span>Type</span>
                  </div>
                  <select
                    className="py-3 select select-bordered h-fit"
                    required=""
                    name="menu_item_type"
                  >
                    <option>--select</option>
                    <option value="food">food</option>
                    <option value="drink">drink</option>
                  </select>
                </div>
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-5">
                    <span>Selling Price</span>
                  </div>
                  <input
                    type="number"
                    name="cost"
                    className="input-primary h-12 text-sm"
                    placeholder="cost"
                    lazy="cost"
                  />
                </div>
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-5">
                    <span>Tax Method</span>
                  </div>
                  <select
                    className="py-3 select select-bordered h-fit"
                    required=""
                    name="tax_method"
                    placeholder="Choose tax included in SP or excluded"
                  >
                    {/*Choose tax included in SP or excluded*/}
                    <option value="">Tax Method</option>
                    <option value="Exclusive">Exclusive</option>
                    <option value="Inclusive">Inclusive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* <CategoriesForm /> */}

          <div className="w-full flex flex-wrap mt-2 w-100">
            <div className="bg-white w-full rounded-xl px-6 py-4">
              <div className="font-bold">Marketplace Settings</div>
              <div className=" w-full grid md:grid-cols-2 grid-cols-1 gap-4 mt-4">
                <div className="">
                  <div className="flex">
                    <div className="grow">
                      <Select
                        placeholder="Product Category"
                        label="Product Category"
                        value={psCategoryId}
                        onChange={setPsCategoryId}
                        data={platformCategoryData}
                        searchable
                        clearable
                        size="md"
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="flex">
                    <div className="grow">
                      <Select
                        placeholder="Product Sub Category"
                        label="Product Sub Category"
                        value={psSubcategoryId}
                        onChange={setPsSubcategoryId}
                        data={platformSubcategoryData}
                        searchable
                        clearable
                        size="md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-full w-full bg-white rounded-b-xl px-6 py-4 mt-1">
            <div className="flex justify-start mx-2 space-x-2">
              <button type="submit" className="btn btn-primary gap-2">
                <i className="fa-solid fa-save" />
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default CreateMenuForm;

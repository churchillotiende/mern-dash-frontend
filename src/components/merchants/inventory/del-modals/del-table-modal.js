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
import store from "../../../../store/store";
import { getRestaurant } from "../../../../store/merchants/inventory/restaurant-slice";
import { getMenuItems } from "../../../../store/merchants/inventory/inventory-slice";
import { getAccompaniments } from "../../../../store/merchants/inventory/inventory-slice";
import { useRouter } from "next/router";
import { getCombosSubItems } from "../../../../store/merchants/inventory/products-slice";
import { getContacts } from "../../../../store/merchants/inventory/inventory-slice";
import { getRFQItems } from "../../../../store/merchants/inventory/purchases-slice";
import { getStaffList } from "../../../../store/merchants/partners/staff-slice";
import { getProducts } from "../../../../store/merchants/inventory/products-slice";
import { getServices } from "../../../../store/merchants/inventory/inventory-slice";

function DelTable({
  item,
  source,
  menuItemId,
  comboId,
  vendorId,
  rfqId,
  staffId,
}) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const itemId = item?.id;

  const deleteItem = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (source === "tables") {
      const endpoint = `${API_URL}/restaurant-tables/${itemId}`;
      const accessToken = session.user.accessToken;
      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: "DELETE",
        // Tell the server we're sending JSON.
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const response = await fetch(endpoint, options);
      // const result = await response.json()
      console.log(response);
      //Refresh table data
      const params = {};
      params["accessToken"] = session.user.accessToken;
      store.dispatch(getRestaurant(params));
      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Your table has been deleted Successfully",
          color: "green",
        });
      } else {
        showNotification({
          title: "Error",
          message:
            "An API Error Occured: Error Code: " +
            response.status +
            " Error Message: " +
            response.statusText,
          color: "red",
        });
      }
    }

    if (source === "menus") {
      const endpoint = `${API_URL}/menu-items/${itemId}`;
      const accessToken = session.user.accessToken;
      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: "DELETE",
        // Tell the server we're sending JSON.
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const response = await fetch(endpoint, options);
      // const result = await response.json()
      console.log(response);
      //Refresh table data
      const params = {};
      params["accessToken"] = session.user.accessToken;
      store.dispatch(getMenuItems(params));
      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Your menu has been deleted Successfully",
          color: "green",
        });
      } else {
        showNotification({
          title: "Error",
          message:
            "An API Error Occured: Error Code: " +
            response.status +
            " Error Message: " +
            response.statusText,
          color: "red",
        });
      }
    }

    if (source === "accompaniments") {
      const endpoint = `${API_URL}/menu-item/${menuItemId}/accompaniments/${itemId}/delete`;
      const accessToken = session.user.accessToken;
      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: "DELETE",
        // Tell the server we're sending JSON.
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const response = await fetch(endpoint, options);
      const result = await response.json();
      console.log(response);
      console.log(result);
      //Refresh table data
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["menuItemId"] = menuItemId;
      store.dispatch(getAccompaniments(params));
      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Your accompaniment has been deleted Successfully",
          color: "green",
        });
      } else {
        showNotification({
          title: "Error",
          message:
            "An API Error Occured: Error Code: " +
            response.status +
            " Error Message: " +
            response.statusText,
          color: "red",
        });
      }
    }

    if (source === "service_reminders") {
      const endpoint = `${API_URL}/inventory/service/reminder/${itemId}/delete`;
      const accessToken = session.user.accessToken;
      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: "DELETE",
        // Tell the server we're sending JSON.
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const response = await fetch(endpoint, options);
      const result = await response.json();
      console.log(response);
      console.log(result);

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message:
            "Your service reminder has been deleted Successfully! Add a new Reminder",
          color: "green",
        });
        router.push("/merchants/inventory/add-service-reminder");
      } else {
        showNotification({
          title: "Error",
          message:
            "An API Error Occured: Error Code: " +
            response.status +
            " Error Message: " +
            response.statusText,
          color: "red",
        });
      }
    }

    if (source === "reminders") {
      const endpoint = `${API_URL}/transaction/reminder/${itemId}/delete`;
      const accessToken = session.user.accessToken;
      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: "DELETE",
        // Tell the server we're sending JSON.
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const response = await fetch(endpoint, options);
      const result = await response.json();

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message:
            "Your transaction reminder has been deleted Successfully! Add a new Reminder",
          color: "green",
        });
        router.push("/merchants/inventory/add-reminder");
      } else {
        showNotification({
          title: "Error",
          message:
            "An API Error Occured: Error Code: " +
            response.status +
            " Error Message: " +
            response.statusText,
          color: "red",
        });
      }
    }

    if (source === "combo_sub_items") {
      const endpoint = `${API_URL}/combo/${comboId}/sub-item/delete/${itemId}`;
      const accessToken = session.user.accessToken;
      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: "DELETE",
        // Tell the server we're sending JSON.
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const response = await fetch(endpoint, options);
      const result = await response.json();

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Combo Item Deleted Successfully",
          color: "green",
        });
        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["comboId"] = comboId;
        store.dispatch(getCombosSubItems(params));
      } else {
        showNotification({
          title: "Error",
          message:
            "An API Error Occured: Error Code: " +
            response.status +
            " Error Message: " +
            response.statusText,
          color: "red",
        });
      }
    }

    if (source === "contacts") {
      const endpoint = `${API_URL}/vendors/${vendorId}/contact/delete/${itemId}`;
      const accessToken = session.user.accessToken;
      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: "DELETE",
        // Tell the server we're sending JSON.
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const response = await fetch(endpoint, options);
      const result = await response.json();

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Contact Deleted Successfully",
          color: "green",
        });
        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["vendorId"] = vendorId;
        store.dispatch(getContacts(params));
      } else {
        showNotification({
          title: "Error",
          message:
            "An API Error Occured: Error Code: " +
            response.status +
            " Error Message: " +
            response.statusText,
          color: "red",
        });
      }
    }

    if (source === "rfqs") {
      const endpoint = `${API_URL}/inventory/purchases/rfq/${rfqId}/delete/${itemId}`;
      const accessToken = session.user.accessToken;
      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: "DELETE",
        // Tell the server we're sending JSON.
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const response = await fetch(endpoint, options);
      const result = await response.json();

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "RFQ Item Deleted Successfully",
          color: "green",
        });
        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["rfqId"] = rfqId;
        store.dispatch(getRFQItems(params));
      } else {
        showNotification({
          title: "Error",
          message:
            "An API Error Occured: Error Code: " +
            response.status +
            " Error Message: " +
            response.statusText,
          color: "red",
        });
      }
    }

    if (source === "staffs") {
      const endpoint = `${API_URL}/staff/delete/${itemId}`;
      const accessToken = session.user.accessToken;
      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: "DELETE",
        // Tell the server we're sending JSON.
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const response = await fetch(endpoint, options);
      const result = await response.json();

      console.log("Staff Delete Result", result);

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Staff data deleted Successfully",
          color: "green",
        });
        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["staffId"] = itemId;
        store.dispatch(getStaffList(params));
      } else {
        showNotification({
          title: "Error",
          message:
            "An API Error Occured: Error Code: " +
            response.status +
            " Error Message: " +
            response.statusText,
          color: "red",
        });
      }
    }

    if (source === "products") {
      const endpoint = `${API_URL}/products/${itemId}`;
      const accessToken = session.user.accessToken;
      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: "DELETE",
        // Tell the server we're sending JSON.
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const response = await fetch(endpoint, options);
      const result = await response.json();

      console.log("Product Deleted Successfully", result);

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Product Deleted Successfully",
          color: "green",
        });
        const params = {};
        params["accessToken"] = session.user.accessToken;
        store.dispatch(getProducts(params));
      } else {
        showNotification({
          title: "Error",
          message:
            "An API Error Occured: Error Code: " +
            response.status +
            " Error Message: " +
            response.statusText,
          color: "red",
        });
      }
    }

    if (source === "services") {
      const endpoint = `${API_URL}/inventory/products/delete/${itemId}`;
      const accessToken = session.user.accessToken;
      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: "DELETE",
        // Tell the server we're sending JSON.
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const response = await fetch(endpoint, options);
      const result = await response.json();

      console.log("Service Deleted Successfully", result);

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Service Deleted Successfully",
          color: "green",
        });
        const params = {};
        params["accessToken"] = session.user.accessToken;
        store.dispatch(getServices(params));
      } else {
        showNotification({
          title: "Error",
          message:
            "An API Error Occured: Error Code: " +
            response.status +
            " Error Message: " +
            response.statusText,
          color: "red",
        });
      }
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
        title={`Confirm Delete #${itemId}: ${item?.name ?? "Item"}`}
        onClose={() => setOpened(false)}
        padding="xs"
      >
        {/* Modal content */}

        <section className="flex flex-col">
          <h4>Are you sure you want to delete the item?</h4>
        </section>

        <section className=" bg-light  py-3 text-sm whitespace-nowrap text-right">
          <a
            onClick={() => setOpened(false)}
            className="btn btn-sm btn-outline-primary ml-2"
          >
            Go Back
          </a>
          <a onClick={deleteItem} className="btn btn-sm btn-error ml-2">
            Delete
          </a>
        </section>
      </Modal>

      <a onClick={() => setOpened(true)} className="btn btn-sm btn-error ml-2">
        Delete
      </a>
    </>
  );
}

export default DelTable;

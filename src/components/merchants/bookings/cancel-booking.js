import {
    Modal,
    useMantineTheme,
  } from "@mantine/core";
  import { useSession } from "next-auth/react";
  import { useState, useEffect } from "react";
  import { showNotification } from "@mantine/notifications";
  import store from "../../../store/store";
  import { getBookingsList } from "../../../store/merchants/bookings/bookings-slice";
  
  function CancelBooking({
    item,
  }) {
    const { data: session, status } = useSession();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
  
    const itemId = item?.id;
  
    const deleteItem = async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const endpoint = `${API_URL}/bookings/${itemId}`;
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
            message: "Booking Canceled Successfully",
            color: "green",
          });
          const params = {};
          params["accessToken"] = session.user.accessToken;
          params["bookingId"] = item?.int_id;

          store.dispatch(getBookingsList(params));
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
          title={`Confirm Cancel of ${item?.title ?? " Booking"}`}
          onClose={() => setOpened(false)}
          padding="xs"
        >
          {/* Modal content */}
  
          <section className="flex flex-col">
            <h4>Are you sure you want to cancel the booking?</h4>
          </section>
  
          <section className=" bg-light  py-3 text-sm whitespace-nowrap text-right">
            <a
              onClick={() => setOpened(false)}
              className="btn btn-sm btn-outline-primary ml-2"
            >
              No Go Back
            </a>
            <a onClick={deleteItem} className="btn btn-sm btn-error ml-2">
              Yes Cancel Booking
            </a>
          </section>
        </Modal>


        <a
         onClick={() => setOpened(true)} 
            className="btn btn-sm btn-error btn-outline gap-2"
        >
            <i className="fa-solid fa-times" />
            Cancel
        </a>

      </>
    );
  }
  
  export default CancelBooking;
  
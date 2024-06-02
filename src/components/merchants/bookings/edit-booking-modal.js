import {
    Button,
    Modal,
    DatePicker,
    Select,
    Textarea,
    TextInput,
    TimeInput,
    MultiSelect,
  } from "@mantine/core";
  import { useSession } from "next-auth/react";
  import { useState, useEffect } from "react";
  import { useSelector } from "react-redux";
  import { showNotification } from "@mantine/notifications";
  import store from "../../../store/store";
  import { getBookings, getSingleBooking, getBookingsSelect } from "../../../store/merchants/bookings/bookings-slice";
  import StatelessLoadingSpinner from "../../../components/ui/utils/stateless-loading-spinner";
  
  function EditBookingModal({ item }) {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
    //
    const [staffId, setStaffId] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [clientId, setClientId] = useState("");
    //setBookingType
    const [bookingType, setBookingType] = useState("");
    //setStartTime
    const [startTime, setStartTime] = useState("");
    const [startDate, setStartDate] = useState("");

    const bookingId = item?.int_id;
  
    const platformCategories = useSelector(
      (state) => state.categories.platformCategoryList
    );
  
    const bookingsSelect = useSelector(
      (state) => state.bookings.getBookingsSelect
    );

    const singleBooking = useSelector(
      (state) => state.bookings.getSingleBooking
    );

    const singleBookingStatus = useSelector(
      (state) => state.bookings.getSingleBookingStatus
    );

    const isLoading = singleBookingStatus === "loading";
    

    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
      }
  
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params["bookingId"] = bookingId;
  
      store.dispatch(getSingleBooking(params));
    }, [session, status, bookingId]);

    const bookingData = singleBooking?.booking;

  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
      }
  
      const params = {};
      params["accessToken"] = session.user.accessToken;
  
      store.dispatch(getBookingsSelect(params));
    }, [session, status]);
  
    console.log("Bookings Select Data", bookingsSelect);
  
    // Staffs
    const staffs = bookingsSelect?.staff;
  
    const staffList =
      staffs?.map((item) => ({
        value: item.id,
        label: item.id + " | " + item.name,
      })) ?? [];
  
    //Services
    const services = bookingsSelect?.products;
  
    const serviceList =
      services?.map((item) => ({
        value: item.id,
        label: item.name,
      })) ?? [];
  
    //Clients
    const clients = bookingsSelect?.clients;
  
    const clientList =
      clients?.map((item) => ({
        value: item.id,
        label: item.name,
      })) ?? [];
  
    //Time
    const time = bookingsSelect?.times;
  
    const saveBooking = async (event) => {
      event.preventDefault();
  
      const formdata = new FormData();
      formdata.append("event_type", bookingType);
      formdata.append("start_date", startDate);
      formdata.append("staff_id", staffId);
      formdata.append("start_time", startTime);
      formdata.append("client_id", clientId);
      serviceId.forEach(service => {
          formdata.append("service_id[]", service);
      });
  
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/bookings`;
  
      const accessToken = session.user.accessToken;
  
      const response = fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
        body: formdata,
      }).then(async (response) => {
        const data = await response.json();
        console.log("Response Data", data);
        console.log(response);
  
        if (response.status === 200) {
          showNotification({
            title: "Success",
            message: "Booking created Successfully",
            color: "green",
          });
          setOpened(false)
          const params = {};
          params["accessToken"] = session.user.accessToken;
          store.dispatch(getBookings(params));
        } else {
          showNotification({
            title: "Error",
            message: "Error " + data.message,
            color: "red",
          });
        }
      });
  
  
    };
  
    return (
      <>
        <Modal
          opened={opened}
          title="Reschedule Booking"
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          {!isLoading &&
            bookingData && (
              <>
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
            <span className="text-dark text-sm font-bold">
            Reschedule Booking
            </span>

            <TextInput
              placeholder="Booking Type"
              label="Booking Type"
              value={bookingData?.booking_type}
              disabled
              size="md"
            />
  
            <Select
              placeholder="Select Staff"
              label="Select Staff"
              value={staffId}
              onChange={setStaffId}
              data={staffList}
              searchable
              clearable
              size="md"
            />
  
            <Select
              placeholder="Select Client"
              label="Select Client"
              value={clientId}
              onChange={setClientId}
              data={clientList}
              searchable
              clearable
              size="md"
            />
  
            <MultiSelect
              data={serviceList}
              value={serviceId}
              onChange={setServiceId}
              maxSelectedValues={1}
              label="Select Service"
              placeholder="Select Service"
              searchable
              clearable
              size="md"
              nothingFound="Nothing found"
            />
  
            <div className="text-dark text-sm mb-1">
              <span>
                <b>Start Date</b>
              </span>
            </div>
  
            <input
              type="date"
              name="start_date"
              className="input-primary h-12 text-sm"
              required=""
              placeholder="Start Date"
              onChange={(e) => setStartDate(e.currentTarget.value)}
            />
  
            <div className="text-dark text-sm mb-1">
              <span>
                <b>Start Time</b>
              </span>
            </div>
  
            <input
              type="time"
              name="start_time"
              className="input-primary h-12 text-sm"
              required=""
              placeholder="Start Time"
              onChange={(e) => setStartTime(e.currentTarget.value)}
            />
          </section>

            
  
          <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
            <Button onClick={saveBooking}>Book</Button>
          </section>

          </>

          )}

          {isLoading && (
              <div className="flex justify-center w-full p-3 bg-light rounded-lg">
                <StatelessLoadingSpinner />
              </div>
            )}
              
         
        </Modal>

        <a
           onClick={() => setOpened(true)}
            className="btn btn-sm btn-primary btn-outline gap-2"
        >
            <i className="fa-solid fa-clock" />
            Reschedule
        </a>

      </>
    );
  }
  
  export default EditBookingModal;
  
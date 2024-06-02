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
import { IconPlus, IconCalendar, IconClock } from "@tabler/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "../../../store/store";
import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
  "Mgo+DSMBaFt/QHRqVVhjVFpFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF5jSH9QdkJnWXxfd3RQRw==;Mgo+DSMBPh8sVXJ0S0J+XE9HflRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31Td0RgWXhacHdUQWJcUA==;ORg4AjUWIQA/Gnt2VVhkQlFadVdJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkRiWn9ZdHRWR2dfVEU=;OTM0NzA4QDMyMzAyZTM0MmUzMHBDSE8xemMzVURxc0oybHFJVDg4eXVLN1I4bnZ3blpwcisrVmFJZjBYaW89;OTM0NzA5QDMyMzAyZTM0MmUzMFg2RWU1V0pWMGorUHFJd1RtUURvcURreEMwUkJiQkorTVNEbjhCL0ZVeFk9;NRAiBiAaIQQuGjN/V0Z+WE9EaFxKVmJLYVB3WmpQdldgdVRMZVVbQX9PIiBoS35RdUViWHxed3BVRWFUUE13;OTM0NzExQDMyMzAyZTM0MmUzMGsreUF2K1NndWptemVlcEJhRngvWk1iRHF1MG5FZkJmaWgvemNlNDFIcmc9;OTM0NzEyQDMyMzAyZTM0MmUzMFFMQ0FENGJJS01wdmR0R1RIbjBMcm9JZ1kvYmxmMEVEd1FsTVZIRHBlb0k9;Mgo+DSMBMAY9C3t2VVhkQlFadVdJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkRiWn9ZdHRWR2ldUEU=;OTM0NzE0QDMyMzAyZTM0MmUzMGJ4M0J6ZW9rT01iVENkemVLQWhtQk1sMjB3ckJCdENyZmN2NGFNWW9VZkU9;OTM0NzE1QDMyMzAyZTM0MmUzMGRsSUloUEdXWmRkRnJXeDdVNENuT1BZSlNJbUd6T2sxZXNsanAzbExPUDg9;OTM0NzE2QDMyMzAyZTM0MmUzMGsreUF2K1NndWptemVlcEJhRngvWk1iRHF1MG5FZkJmaWgvemNlNDFIcmc9"
);
import { getBookingsSelect } from "../../../store/merchants/bookings/bookings-slice";
import { getBookings } from "../../../store/merchants/bookings/bookings-slice";

function AddBookingModal() {
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
  //setEndDate //setEndTime
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  //
  const [recurring, setRecurring] = useState(false);
  const [fullDay, setFullDay] = useState(false);

  const platformCategories = useSelector(
    (state) => state.categories.platformCategoryList
  );

  const bookingsSelect = useSelector(
    (state) => state.bookings.getBookingsSelect
  );

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
      label: item.name + " | " + item?.phone ?? "Add Phone",
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
    //graying
    formdata.append("end_date", endDate);
    formdata.append("end_time", endTime);
    formdata.append("recurring", recurring);
    formdata.append("full_day", fullDay);
    //end graying
    formdata.append("client_id", clientId);
    if (bookingType === "booking") {
      serviceId.forEach((service) => {
        formdata.append("service_id[]", service);
      });
    }

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

      if (data.statusCode != 201) {
        showNotification({
          title: "Success",
          message: "Booking created Successfully",
          color: "green",
        });
        setOpened(false);
        const params = {};
        params["accessToken"] = session.user.accessToken;
        store.dispatch(getBookings(params));
        //Reset Values
        setStaffId("");
        setServiceId("");
        setClientId("");
        setBookingType("");
        setStartTime("");
        setStartDate("");
        setEndDate("");
        setEndTime("");
      } else {
        showNotification({
          title: "Error",
          message: "Error ): " + data.error,
          color: "red",
        });
      }
    });
  };

  //Booking Type
  const bookingOptions = [
    { value: "booking", label: "Booking" },
    { value: "graying", label: "Graying Out" },
  ];

  return (
    <>
      <Modal
        opened={opened}
        title="Add Booking"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            New Booking Details
          </span>

          <Select
            placeholder="Select Type"
            label="Select Type"
            value={bookingType}
            onChange={setBookingType}
            data={bookingOptions}
            searchable
            clearable
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

          {bookingType != "graying" ? (
            <>
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
                // maxSelectedValues={1}
                label="Select Service"
                placeholder="Select Service"
                searchable
                clearable
                size="md"
                nothingFound="Nothing found"
              />
            </>
          ) : null}

          <div className="text-dark text-sm mb-1">
            <span>
              <b>Start Date</b>
            </span>
          </div>

          <input
            type="date"
            name="start_date"
            className="input-primary h-12 text-sm"
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
            placeholder="Start Time"
            onChange={(e) => setStartTime(e.currentTarget.value)}
          />

          {bookingType === "graying" ? (
            <>
              <div className="text-dark text-sm mb-1">
                <span>
                  <b>End Date</b>
                </span>
              </div>
              <input
                type="date"
                name="end_date"
                className="input-primary h-12 text-sm"
                placeholder="End Date"
                onChange={(e) => setEndDate(e.currentTarget.value)}
              />

              <div className="text-dark text-sm mb-1">
                <span>
                  <b>End Time</b>
                </span>
              </div>
              <input
                type="time"
                name="end_time"
                className="input-primary h-12 text-sm"
                placeholder="End Time"
                onChange={(e) => setEndTime(e.currentTarget.value)}
              />

              <div className="flex px-2">
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-1 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      name="recurring"
                    />
                    <span>Recurring?</span>
                  </div>
                </div>
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-1 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      name="full_day"
                    />
                    <span>Full Day?</span>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </section>

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={saveBooking}>Book</Button>
        </section>
      </Modal>

      <a
        onClick={() => setOpened(true)}
        className="btn btn-sm btn-primary ml-2"
      >
        <i className="fa fa-add mr-2" />
        New
      </a>
    </>
  );
}

export default AddBookingModal;

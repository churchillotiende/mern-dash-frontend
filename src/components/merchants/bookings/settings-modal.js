import {
    Button,
    Modal,
  } from "@mantine/core";
  import { useSession } from "next-auth/react";
  import { useState, useEffect } from "react";
  import { useSelector } from "react-redux";
  import { showNotification } from "@mantine/notifications";
  import store from "../../../store/store";
  import { registerLicense } from "@syncfusion/ej2-base";
  registerLicense(
    "Mgo+DSMBaFt/QHRqVVhjVFpFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF5jSH9QdkJnWXxfd3RQRw==;Mgo+DSMBPh8sVXJ0S0J+XE9HflRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31Td0RgWXhacHdUQWJcUA==;ORg4AjUWIQA/Gnt2VVhkQlFadVdJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkRiWn9ZdHRWR2dfVEU=;OTM0NzA4QDMyMzAyZTM0MmUzMHBDSE8xemMzVURxc0oybHFJVDg4eXVLN1I4bnZ3blpwcisrVmFJZjBYaW89;OTM0NzA5QDMyMzAyZTM0MmUzMFg2RWU1V0pWMGorUHFJd1RtUURvcURreEMwUkJiQkorTVNEbjhCL0ZVeFk9;NRAiBiAaIQQuGjN/V0Z+WE9EaFxKVmJLYVB3WmpQdldgdVRMZVVbQX9PIiBoS35RdUViWHxed3BVRWFUUE13;OTM0NzExQDMyMzAyZTM0MmUzMGsreUF2K1NndWptemVlcEJhRngvWk1iRHF1MG5FZkJmaWgvemNlNDFIcmc9;OTM0NzEyQDMyMzAyZTM0MmUzMFFMQ0FENGJJS01wdmR0R1RIbjBMcm9JZ1kvYmxmMEVEd1FsTVZIRHBlb0k9;Mgo+DSMBMAY9C3t2VVhkQlFadVdJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkRiWn9ZdHRWR2ldUEU=;OTM0NzE0QDMyMzAyZTM0MmUzMGJ4M0J6ZW9rT01iVENkemVLQWhtQk1sMjB3ckJCdENyZmN2NGFNWW9VZkU9;OTM0NzE1QDMyMzAyZTM0MmUzMGRsSUloUEdXWmRkRnJXeDdVNENuT1BZSlNJbUd6T2sxZXNsanAzbExPUDg9;OTM0NzE2QDMyMzAyZTM0MmUzMGsreUF2K1NndWptemVlcEJhRngvWk1iRHF1MG5FZkJmaWgvemNlNDFIcmc9"
  );
  import { getBookingsSettings } from "../../../store/merchants/bookings/bookings-slice";
  import StatelessLoadingSpinner from "../../ui/utils/stateless-loading-spinner";

  function BookingSettingsModal() {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
    //Payment Mandatory Checkbox
    const [paymentMandatory, setPaymentMandatory] = useState(false);
  
    const bookingSettings = useSelector(
      (state) => state.bookings.getBookingsSettings
    );

    const bookingSettingStatus = useSelector(
      (state) => state.bookings.getBookingsSettingsStatus
    );

    const isLoading = bookingSettingStatus === "loading";
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
      }
  
      const params = {};
      params["accessToken"] = session.user.accessToken;
  
      store.dispatch(getBookingsSettings(params));
    }, [session, status]);

    function handleSetPaymentMandatory(event) {
      setPaymentMandatory(event.target.checked);
    }
  
    //Set Default data
    useEffect(() => {
      if (!bookingSettings) {
        return;
      }
      console.log("Data Items Response", bookingSettings);

      //Set Values
      setPaymentMandatory(bookingSettings?.payment_mandatory ?? "");

    }, [bookingSettings]);

  
    const updateSettings = async (event) => {
      event.preventDefault();
  
      if (!event.target.deposit.value) {
        showNotification({
          title: "Error",
          message: "Deposit is required!",
          color: "red",
        });
        return;
      }
  
      if (!event.target.session_time.value) {
        showNotification({
          title: "Error",
          message: "Session time is required!",
          color: "red",
        });
        return;
      }

      const data = {
        deposit: event.target.deposit.value,
        opening_time: event.target.opening_time.value,
        closing_time: event.target.closing_time.value,
        session_time: event.target.session_time.value,
        policy: event.target.policy.value,
        payment_mandatory: paymentMandatory,
      };
  
      console.log("POST Payload Data", data);
  
      const JSONdata = JSON.stringify(data);
  
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/booking/settings/save`;
  
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
          message: "Booking Settings updated Successfully",
          color: "green",
        });
        setOpened(false);
        // router.push("/merchants/inventory/menus");
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
      <>
        <Modal
          opened={opened}
          title="Booking Settings"
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          {!isLoading &&
            bookingSettings && (
          <form onSubmit={updateSettings} method="POST" >
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <div className="w-full md:basis-6/12 flex flex-col justify-between flex-wrap h-auto">
                
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-1">
                    <span>Deposit</span>
                    <span className="text-xs">(% of total)</span>
                  </div>
                  <input
                    type="number"
                    name="deposit"
                    className="input-primary h-12 text-sm"
                    required=""
                    placeholder="Deposit Percentage eg. 60%"
                    defaultValue={bookingSettings?.deposit}
                  />
                </div>

              </div>
              <div className="w-full md:basis-6/12 flex flex-col justify-between flex-wrap">
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-1">
                    <span>Opening Time</span>
                  </div>
                  <input
                    type="time"
                    name="opening_time"
                    className="input-primary h-12 text-sm"
                    required=""
                    placeholder="Opening Time"
                    defaultValue={bookingSettings?.opening_time}
                  />
                </div>
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-1">
                    <span>Closing Time</span>
                  </div>
                  <input
                    type="time"
                    name="closing_time"
                    className="input-primary h-12 text-sm"
                    required=""
                    placeholder="Closing Time"
                    defaultValue={bookingSettings?.closing_time}
                  />
                </div>
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-1">
                    <span>Session Time</span>
                  </div>
                  <input
                    type="number"
                    name="session_time"
                    className="input-primary h-12 text-sm"
                    required=""
                    placeholder="Session Time"
                    defaultValue={bookingSettings?.session_time}
                  />
                </div>
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-1">
                    <span>Refund Policy Statement</span>
                  </div>
                  <textarea
                    rows={5}
                    name="policy"
                    className="input-primary h-fit text-sm"
                    required=""
                    placeholder="Policy Statement"    
                    defaultValue={bookingSettings?.policy}
                  />
                </div>
                <div className="px-2 py-2">
                  <div className="text-dark text-sm mb-1 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      name="payment_mandatory"
                      checked={paymentMandatory}
                      onChange={handleSetPaymentMandatory}
                    />
                    <span>Payment Mandatory?</span>
                  </div>
                </div>
              </div>

          </section>
  
          <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
            {/* <Button >Update</Button> */}
            <button type="submit" className="btn btn-md btn-primary">
              Update
            </button>
          </section>

          </form>
          )}

          {isLoading && (
            <div className="flex justify-center w-full p-3 bg-light rounded-lg">
              <StatelessLoadingSpinner />
            </div>
          )}

        </Modal>
  
        <a
          onClick={() => setOpened(true)}
          className="btn btn-sm btn-outline btn-primary ml-2"
        >
          <i className="fa-solid fa-cog mr-2" />
          Settings
        </a>
      </>
    );
  }
  
  export default BookingSettingsModal;
  
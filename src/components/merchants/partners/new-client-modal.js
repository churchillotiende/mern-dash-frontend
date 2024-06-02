import { Button, Modal, Select, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { IconUser } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isCarWash } from "../../../lib/shared/roles_and_permissions";
import {
  fetchClientFormData,
  submitClient,
} from "../../../store/merchants/partners/clients-slice";
import store from "../../../store/store";

function NewClientModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [gender, setGender] = useState();
  const [dob, setDob] = useState();

  const [carMake, setCarMake] = useState();
  const [carModel, setCarModel] = useState();
  const [carPlate, setCarPlate] = useState();
  const [carSeries, setCarSeries] = useState();
  const [carType, setCarType] = useState();
  const [carYom, setCarYom] = useState();

  const [houseNo, setHouseNo] = useState();
  const [streetName, setStreetName] = useState();
  const [city, setCity] = useState();
  const [estate, setEstate] = useState();

  const dataStatus = useSelector((state) => state.clients.clientFormDataStatus);
  const carFormData = useSelector((state) => state.clients.clientFormData);

  const isCarWashAc = isCarWash(session?.user);

  function clearForm() {
    setName("");
    setEmail("");
    setPhone("");
    setGender(null);
    setDob(null);
    setCarMake(null);
    setCarModel(null);
    setCarPlate("");
    setCarSeries("");
    setCarType(null);
    setCarYom("");

    setHouseNo("");
    setStreetName("");
    setCity("");
    setEstate("");
  }

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (dataStatus === "idle") {
      store.dispatch(fetchClientFormData(params));
    }
  }, [session, status, dataStatus]);

  const carTypes =
    carFormData?.car_types?.map((item) => ({
      value: item.name,
      label: item.name,
    })) ?? [];

  const carMakes =
    carFormData?.car_makes?.map((item) => ({
      value: item.name,
      label: item.name,
    })) ?? [];

  const selectedCarMake = carFormData?.car_makes?.find(
    (item) => item.name === carMake
  );

  const carModels =
    selectedCarMake?.models?.map((item) => ({
      value: item.name,
      label: item.name,
    })) ?? [];

  const isSubmitting = useSelector(
    (state) => state.clients.submissionStatus == "loading"
  );

  const dispatch = useDispatch();

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["name"] = name;
    params["email"] = email;
    params["phone"] = phone;
    params["gender"] = gender;
    params["dob"] = dob?.toISOString();
    params["car_model"] = carModel;
    params["car_plate"] = carPlate;
    params["car_series"] = carSeries;
    params["car_year"] = carYom;
    params["car_type"] = carType;

    params["house_no"] = houseNo;
    params["estate"] = estate;
    params["city"] = city;
    params["street_name"] = streetName;

    try {
      await dispatch(submitClient(params)).unwrap();
      showNotification({
        title: "Success",
        message: "Record saved successfully",
        color: "green",
      });
      clearForm();
    } catch (e) {
      let message = null;
      if (e?.message ?? null) {
        message = e.message;
      } else {
        message = "Could not save record";
      }
      showNotification({
        title: "Error",
        message,
        color: "red",
      });
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        title="New Customer"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">
            Customer Information
          </span>
          <TextInput
            placeholder="Name"
            label="Name"
            withAsterisk
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Phone"
            label="Phone"
            type="telephone"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
          />

          <Select
            placeholder="Gender"
            label="Gender"
            value={gender}
            onChange={setGender}
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            searchable
            clearable
          />

          <DatePicker
            placeholder="DOB"
            label="Date of Birth"
            value={dob}
            onChange={setDob}
          />

          <TextInput
            placeholder="House No"
            label="House No"
            type="text"
            value={houseNo}
            onChange={(e) => setHouseNo(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Estate/Building"
            label="Estate/Building"
            type="text"
            value={estate}
            onChange={(e) => setEstate(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Street/Road"
            label="Street/Road"
            type="text"
            value={streetName}
            onChange={(e) => setStreetName(e.currentTarget.value)}
          />

          <TextInput
            placeholder="City"
            label="City"
            type="text"
            value={city}
            onChange={(e) => setCity(e.currentTarget.value)}
          />
        </section>

        {isCarWashAc && (
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg mt-3">
            <span className="text-dark text-sm font-bold">
              Customer Information
            </span>
            <div className="grid grid-cols-2 gap-4">
              <Select
                placeholder="Car Make"
                label="Car Make"
                value={carMake}
                onChange={setCarMake}
                data={carMakes}
                searchable
                clearable
              />

              <Select
                placeholder="Car Model"
                label="Car Model"
                value={carModel}
                onChange={setCarModel}
                data={carModels}
                searchable
                clearable
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                placeholder="Car Plate"
                label="Car Plate"
                value={carPlate}
                onChange={(e) => setCarPlate(e.currentTarget.value)}
              />

              <TextInput
                placeholder="Car Series"
                label="Car Series"
                value={carSeries}
                onChange={(e) => setCarSeries(e.currentTarget.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                placeholder="Car Type"
                label="Car Type"
                value={carType}
                onChange={setCarType}
                data={carTypes}
                searchable
                clearable
              />

              <TextInput
                placeholder="Year of Manufacture"
                label="Year of Manufacture"
                type="number"
                value={carYom}
                onChange={(e) => setCarYom(e.currentTarget.value)}
              />
            </div>
          </section>
        )}

        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            Save
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconUser size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
      >
        New
      </Button>
    </>
  );
}

export default NewClientModal;

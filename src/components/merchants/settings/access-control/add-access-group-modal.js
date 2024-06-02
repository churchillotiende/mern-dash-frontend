import { Button, Modal, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccessGroups,
  submitAccessGroup,
} from "../../../../store/merchants/settings/access-control-slice";

function AddAccessGroupModal() {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [name, setName] = useState();

  function clearForm() {
    setName("");
  }

  const isSubmitting = useSelector(
    (state) => state.accessControl.submitAccessGroupStatus == "loading"
  );

  const dispatch = useDispatch();

  async function submitDetails() {
    if (!session || status !== "authenticated" || isSubmitting) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["name"] = name;

    try {
      await dispatch(submitAccessGroup(params)).unwrap();

      dispatch(fetchAccessGroups(params));

      showNotification({
        title: "Success",
        message: "Record saved successfully",
        color: "green",
      });

      setOpened(false);
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
        title="Add Access Group"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col px-2 rounded-lg">
          <TextInput
            placeholder="e.g. Cashier, Waiter etc."
            label="Role"
            withAsterisk
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end p-2 rounded-lg my-3">
          <Button onClick={submitDetails} loading={isSubmitting}>
            Save
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
        size="xs"
      >
        <span className="pt-1">Add Role</span>
      </Button>
    </>
  );
}

export default AddAccessGroupModal;

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
import { IconEye } from "@tabler/icons";

function OrderChanges({ changes }) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [actual_quantity, setQuantity] = useState("");
  const [narration, setNarration] = useState("");
  const [variance, setVariance] = useState("");

  const submitStockReconciliation = async (event) => {
    event.preventDefault();

    const data = {
      actual_quantity: actual_quantity,
      narration: narration,
      sellable_id: stock?.sellable?.id,
    };

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/product/${stock?.id}/stock-reconciliation`;

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
        message: "Stock Reconciliation was Successfully",
        color: "green",
      });
      setOpened(false);
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }
  };

  console.log(changes);

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
        title={`Changes #245465  `}
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        {/* Modal content */}

        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <span className="text-dark text-sm font-bold">Change Details</span>
        </section>

        <section className="overflow-x-auto horiz mb-2">
          <div className="inline-block py-2 min-w-full">
            <div className="overflow-hidden rounded-lg">
              <table className="rounded-lg min-w-full">
                <tbody>
                  <tr className="border-b bg-white even:bg-info even:bg-opacity-30 even:text-dark">
                    <td className="p-2 px-3 font-bold">Record Type</td>
                    <td className="p-2 px-3">Orders</td>
                  </tr>
                  <tr className="border-b bg-white even:bg-info even:bg-opacity-30 even:text-dark">
                    <td className="p-2 px-3 font-bold">Change Type</td>
                    <td className="p-2 px-3">
                      <div className="px-3 py-1 bg-primary text-primary text-center rounded-lg w-fit bg-opacity-20">
                        Updated
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b bg-white even:bg-info even:bg-opacity-30 even:text-dark">
                    <td className="p-2 px-3 font-bold">Done By</td>
                    <td className="p-2 px-3">My Shop</td>
                  </tr>
                  <tr className="border-b bg-white even:bg-info even:bg-opacity-30 even:text-dark">
                    <td className="p-2 px-3 font-bold">Done On</td>
                    <td className="p-2 px-3">Wed, Dec 21, 2022 3:34 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </Modal>

      <Button
        leftIcon={<IconEye size={14} />}
        variant="outline"
        size="xs"
        onClick={() => setOpened(true)}
      >
        Changes
      </Button>
    </>
  );
}

export default OrderChanges;

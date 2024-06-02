import { Button, Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconPencil } from "@tabler/icons";
import { useState } from "react";
import { ClientContextProvider } from "../../../../store/merchants/partners/client-context";
import ContactSelect from "../../utils/contact-select";

function TransactionMetadataModal({
  canBackDate,
  transactionDate,
  selectedContact,
  contactSelected,
  onTransactionDateUpdated,
}) {
  const [opened, setOpened] = useState(false);

  function contactSelectedHandler(value) {
    contactSelected(value);
    setOpened(false);

    showNotification({
      title: "Success",
      message: `Selected ${value.label}`,
      color: "green",
    });
  }

  return (
    <>
      <Modal
        opened={opened}
        title="Metadata"
        onClose={() => setOpened(false)}
        overflow="inside"
      >
        {canBackDate && (
          <section className="mt-3">
            <label className="label-text">
              Transaction Date
              <span className="text-xs">(for backdated transactions only)</span>
            </label>
            <input
              type="date"
              className="input-primary input-sm pt-3 pb-8 text-grey-100 text-sm"
              placeholder="Transaction Date"
              onChange={onTransactionDateUpdated}
              value={transactionDate}
            />
          </section>
        )}

        <section className="mt-3">
          <ClientContextProvider>
            <ContactSelect
              onContactChanged={contactSelectedHandler}
              selectedContactId={selectedContact}
            />
          </ClientContextProvider>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPencil size={14} />}
        variant="outline"
        onClick={() => setOpened(true)}
      >
        Customers
      </Button>
    </>
  );
}

export default TransactionMetadataModal;

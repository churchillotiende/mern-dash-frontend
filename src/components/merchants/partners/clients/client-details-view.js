import { Card, Tabs } from "@mantine/core";
import { IconUser, IconCash, IconCashBanknote } from "@tabler/icons";
import { useState } from "react";
import ClientBioView from "./client-bio-view";
import ClientCreditedTransactionsListView from "./client-credited-transactions-list-view";
import ClientTransactionListView from "./client-transactions-list-view";

function ClientDetailView() {
  const [activeTab, setActiveTab] = useState("bio");

  return (
    <div className="w-full">
      <Tabs defaultValue="bio" value={activeTab} onTabChange={setActiveTab}>
        <div className="z-10">
          <Card>
            <Tabs.List>
              <Tabs.Tab value="bio" icon={<IconUser size={14} />}>
                Bio
              </Tabs.Tab>
              <Tabs.Tab value="transactions" icon={<IconCash size={14} />}>
                Transactions
              </Tabs.Tab>
              <Tabs.Tab
                value="credited-transactions"
                icon={<IconCashBanknote size={14} />}
              >
                Credited
              </Tabs.Tab>
            </Tabs.List>
          </Card>
        </div>

        <div className="w-full mt-1 z-100">
          <Tabs.Panel value="bio">
            <ClientBioView />
          </Tabs.Panel>
          <Tabs.Panel value="transactions">
            {activeTab === "transactions" && <ClientTransactionListView />}
          </Tabs.Panel>
          <Tabs.Panel value="credited-transactions">
            {activeTab === "credited-transactions" && (
              <ClientCreditedTransactionsListView />
            )}
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  );
}

export default ClientDetailView;

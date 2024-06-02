import { Card, Tabs } from "@mantine/core";
import { IconUser, IconCash, IconCashBanknote } from "@tabler/icons";
import { useState } from "react";
import StaffBioView from "./staff-bio-view";
import StaffTransactionListView from "./staff-transactions-list-view";

function StaffDetailView() {
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
            </Tabs.List>
          </Card>
        </div>

        <div className="w-full mt-1 z-100">
          <Tabs.Panel value="bio">
            <StaffBioView />
          </Tabs.Panel>
          <Tabs.Panel value="transactions">
            {activeTab === "transactions" && <StaffTransactionListView />}
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  );
}

export default StaffDetailView;

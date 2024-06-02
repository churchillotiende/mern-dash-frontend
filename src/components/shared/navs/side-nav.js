import { useContext } from "react";
import MerchantUiContext from "../../../store/shared/merchant-ui";
import SideNavButton from "./side-nav-button";
import SideNavDropdownButton from "./side-nav-dropdown-button";
import SideNavDropdownItem from "./side-nav-dropdown-item";
import SideNavCollapseButton from "./side-nav-collapse-button";
import {
  canViewPages,
  hasBeenGranted,
} from "../../../store/merchants/settings/access-control-slice";
import { useSelector } from "react-redux";

function SideNav() {
  const uiCtx = useContext(MerchantUiContext);
  const collapsed = uiCtx.sidenav.collapsed;
  const isVisible = uiCtx.layout.showSideNav;

  const canViewSalesReports = useSelector(
    hasBeenGranted("can_view_sales_report")
  );
  const canViewGoodsServicesReports = useSelector(
    hasBeenGranted("can_view_goods_services_report")
  );

  const canViewClients = useSelector(canViewPages("clients"));
  const canViewStaffs = useSelector(canViewPages("staffs"));
  const canViewPartners = canViewClients;

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const oldUrl = (path) => `${backend_url}${path}`;

  return (
    <div
      className={`sidenav-look fixed h-full top-0 left-0 z-40 overflow-y-auto overflow-x-hidden tr-eo ${collapsed && "w-28"
        } ${!isVisible && "hidden"}`}
    >
      <SideNavCollapseButton
        toggle={uiCtx.sidenav.actions.toggle}
        collapsed={collapsed}
      />

      <section className="flex space-x-2 items-center w-full  h-fit grow-0">
        {/* <Image
          src="/images/logos/logo-white.png"
          alt="logo"
          className="w-12"
          width={100}
          height={100}
        /> */}
        {!collapsed && (
          <div
            className={`basis-full flex flex-wrap text-xs items-center space-y-1 ${collapsed && "justify-center"
              }`}
          >
            <div className="w-full font-semibold">Oteemedia</div>
            <div className="text-xs font-thin text-white/70">
              Solutions
            </div>
          </div>
        )}
      </section>

      <section
        className={`w-full flex flex-wrap space-y-1 text-sm mt-8 ${collapsed ? "justify-center" : "justify-start"
          }`}
      >
        <SideNavButton
          href="/merchants/dashboard"
          tooltip="Dashboard"
          title="Dashboard"
          icon="fa-solid fa-desktop"
          collapsed={collapsed}
        />

        {/* {useSelector(canViewPages("transactions")) && ( */}
        <>
          <SideNavDropdownButton
            tooltip="HR"
            title="HR"
            icon="fa-solid fa-user"
            collapsed={collapsed}
          >
            <SideNavDropdownItem
              href="#"
              title="Dashboard"
            />
            <SideNavDropdownItem
              href="#"
              title="Employees List"
            />
          </SideNavDropdownButton>

          {false && (
            <SideNavButton
              href="/merchants/orders"
              tooltip="Online Orders"
              title="Online Orders"
              icon="fa-solid fa-chalkboard text-grey-50"
              collapsed={collapsed}
            />
          )}

          <SideNavDropdownButton
            tooltip="Transactions"
            title="Transactions"
            icon="fa-solid fa-credit-card"
            collapsed={collapsed}
          >
            <SideNavDropdownItem
              href="/merchants/transactions/sessions"
              title="POS Sessions"
            />

            <SideNavDropdownItem
              href="/merchants/transactions"
              title="All Transactions"
            />

            <SideNavDropdownItem
              href="/merchants/transactions/suspended"
              title="Orders"
            />

            <SideNavDropdownItem
              href="/merchants/transactions/credited"
              title="Credited"
            />

            <SideNavDropdownItem
              href="/merchants/transactions/voided"
              title="Voided"
            />
          </SideNavDropdownButton>
        </>
        {/* )} */}

        {/* {useSelector(canViewPages("products")) && false && ( */}
        <SideNavDropdownButton
          tooltip="Inventory"
          title="Inventory"
          icon="fa-solid fa-dolly text-grey-50"
          collapsed={collapsed}
        >
          <SideNavDropdownItem
            href="/merchants/inventory/restaurant"
            title="Restaurants"
          />

          <SideNavDropdownItem
            href="/merchants/inventory/marketplace-categories"
            title="Inventory Categories"
          />

          <SideNavDropdownItem
            href="/merchants/inventory/store-categories"
            title="In-Store Categories"
          />

          <SideNavDropdownItem
            href="/merchants/inventory/products"
            title="Product List"
          />
          <SideNavDropdownItem
            href="/merchants/inventory/batches"
            title="Batches"
          />
          <SideNavDropdownItem
            href="/merchants/inventory/services"
            title="Service List"
          />
          <SideNavDropdownItem
            href="/merchants/inventory/adjustments"
            title="Adjustment List"
          />
          <SideNavDropdownItem
            href="/merchants/inventory/vendors"
            title="Vendors"
          />
          {/* <SideNavDropdownItem
              href="/merchants/inventory/purchases"
              title="Purchases"
            /> */}
        </SideNavDropdownButton>
        {/* )} */}

        {/* <SideNavDropdownButton
          tooltip="Marketing"
          title="Marketing"
          icon="fa-solid fa-globe-africa text-grey-50"
          collapsed={collapsed}
        >
          <SideNavDropdownItem
            href="/merchants/marketing/communication"
            title="Communication"
          />

          <SideNavDropdownItem
            href="/merchants/marketing/marketingcampaigns"
            title="Marketing Campaigns"
          />

          <SideNavDropdownItem
            href="/merchants/marketing/promotions"
            title="Promotions"
          />

          <SideNavDropdownItem
            href="/merchants/marketing/campaigns"
            title="Campaigns"
          />

          <SideNavDropdownItem
            href="/merchants/marketing/discounts"
            title="Discounts"
          />

          <SideNavDropdownItem
            href="/merchants/marketing/referrals"
            title="Referrals"
          />

          <SideNavDropdownItem
            href="/merchants/marketing/giftvouchers"
            title="Gift Vouchers"
          />

          <SideNavDropdownItem
            href="/merchants/marketing/statistics"
            title="Statistics"
          />

          <SideNavDropdownItem
            href="/merchants/marketing/reviewsandratings"
            title="Reviews and Ratings"
          />
        </SideNavDropdownButton> */}

        {/* {useSelector(canViewPages("transactions")) && ( */}
        <SideNavButton
          href={oldUrl("/merchant-alt/orders")}
          tooltip="Online Orders"
          title="Online Orders"
          icon="fa-solid fa-chalkboard"
          collapsed={collapsed}
        />
        {/* )} */}

        {/* {useSelector(canViewPages("products")) && ( */}
        <>
          <SideNavDropdownButton
            tooltip="Inventory"
            title="Inventory"
            icon="fa-solid fa-dolly"
            collapsed={collapsed}
          >
            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/table-list")}
              title="Restaurant"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/prod")}
              title="Product List"
            />

            <SideNavDropdownItem
              href="/merchants/inventory/marketplace-categories"
              title="Inventory Categories"
            />

            <SideNavDropdownItem
              href="/merchants/inventory/store-categories"
              title="In-Store Categories"
            />

            <SideNavDropdownItem
              href="/merchants/inventory/batches"
              title="Batches"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/products")}
              title="Service List"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/adjustment")}
              title="Adjustment List"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/vendors")}
              title="Vendors"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/purchases/rfqs")}
              title="Purchases"
            />
          </SideNavDropdownButton>
        </>
        {/* )} */}

        {/* {useSelector(canViewPages("marketing")) && ( */}
        <>
          <SideNavDropdownButton
            tooltip="Marketing"
            title="Marketing"
            icon="fa-solid fa-globe-africa"
            collapsed={collapsed}
          >
            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/communications")}
              title="Communication"
            />

            <SideNavDropdownItem
              href={oldUrl("/marketing-campaigns")}
              title="Marketing Campaigns"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/promotions")}
              title="Promotions"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/campaigns")}
              title="Campaigns"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/discounts")}
              title="Discounts"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/referrals")}
              title="Referrals"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/gift-cards/gift-cards")}
              title="Gift Vouchers"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/statistics")}
              title="Statistics"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/review-ratings")}
              title="Reviews and Ratings"
            />
          </SideNavDropdownButton>
        </>
        {/* )} */}

        {/* {useSelector(canViewPages("loyalty")) && ( */}
        <SideNavButton
          href={oldUrl("/merchant-alt/loyalty")}
          tooltip="Loyalty"
          title="Loyalty"
          icon="fa-solid fa-shapes"
          collapsed={collapsed}
        />
        {/* )} */}

        {/* {canViewPartners && ( */}
        <>
          <SideNavDropdownButton
            tooltip="Partners"
            title="Partners"
            icon="fa-solid fa-user-friends"
            collapsed={collapsed}
          >
            {canViewClients && (
              <SideNavDropdownItem
                href="/merchants/partners/clients"
                title="Clients"
              />
            )}

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/staff")}
              title="Staff"
            />

            {/* {canViewStaffs && (
                <SideNavDropdownItem
                  href="/merchants/partners/staffs"
                  title="Staffs"
                />
              )} */}
          </SideNavDropdownButton>
        </>
        {/* )} */}

        {/* {useSelector(canViewPages("accounts")) && ( */}
        <>
          <SideNavDropdownButton
            tooltip="Accounts"
            title="Accounts"
            icon="fa-solid fa-money-check-alt"
            collapsed={collapsed}
          >
            <SideNavDropdownItem
              href={`${backend_url}/merchant-alt/customers`}
              title="Customers"
            />

            <SideNavDropdownItem
              href={`${backend_url}/merchant-alt/estimates`}
              title="Quotations"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/invoices")}
              title="Invoices"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/expenses")}
              title="Expenses"
            />
          </SideNavDropdownButton>
        </>
        {/* )} */}

        {/* {useSelector(canViewPages("bookings")) && ( */}
        <>
          <SideNavDropdownButton
            tooltip="Bookings"
            title="Bookings"
            icon="fa-solid fa-dna"
            collapsed={collapsed}
          >
            <SideNavDropdownItem
              href="/merchants/bookings/newcalendar"
              title="Calendar"
            />
            <SideNavDropdownItem
              href="/merchants/bookings/list"
              title="List"
            />
            <SideNavDropdownItem
              href="/merchants/bookings/reports"
              title="Reports"
            />
            <SideNavDropdownItem
              href="/merchants/bookings/settings"
              title="Settings"
            />
          </SideNavDropdownButton>
        </>
        {/* )} */}

        {/* {useSelector(canViewPages("bookings")) && false && ( */}
        <>
          <SideNavDropdownButton
            tooltip="Bookings"
            title="Bookings"
            icon="fa-solid fa-dna"
            collapsed={collapsed}
          >
            <SideNavDropdownItem
              href="/merchants/bookings/newcalendar"
              title="Calendar"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/bookings/list")}
              title="List"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/bookings/analytics")}
              title="Report"
            />

            <SideNavDropdownItem
              href={oldUrl("/merchant-alt/bookings/settings")}
              title="Settings"
            />
          </SideNavDropdownButton>
        </>
        {/* )} */}

        {false && (
          <SideNavDropdownButton
            tooltip="Bookings"
            title="Bookings"
            icon="fa-solid fa-dna text-grey-50"
            collapsed={collapsed}
          >
            <SideNavDropdownItem
              href="/merchants/bookings/newcalendar"
              title="Calendar"
            />

            <SideNavDropdownItem href="/merchants/bookings/list" title="List" />

            <SideNavDropdownItem
              href="/merchants/bookings/reports"
              title="Reports"
            />

            <SideNavDropdownItem
              href="/merchants/bookings/settings"
              title="Settings"
            />
          </SideNavDropdownButton>
        )}

        {/* {useSelector(canViewPages("reports")) && ( */}
        <SideNavDropdownButton
          tooltip="Reports"
          title="Reports"
          icon="fa-solid fa-file-alt"
          collapsed={collapsed}
        >
          {/* {canViewSalesReports && ( */}
          <SideNavDropdownItem
            href="/merchants/reports/sales"
            title="Sales"
          />
          {/* )} */}

          {/* {canViewGoodsServicesReports && ( */}
          <SideNavDropdownItem
            href="/merchants/reports/sales/sellables"
            title="Goods & Services"
          />
          {/* )} */}

          <SideNavDropdownItem
            href={oldUrl("/merchant-alt/reports-new/loyalty")}
            title="Customer Trends"
          />

          <SideNavDropdownItem
            href={oldUrl("/merchant-alt/reports-new/sales")}
            title="Sales Reports"
          />

          <SideNavDropdownItem
            href={oldUrl("/merchant-alt/reports-new/staff")}
            title="Staff Reports"
          />

          <SideNavDropdownItem
            href={oldUrl("/merchant-alt/reports-new/profitandloss")}
            title="Profit & Loss Report"
          />

          <SideNavDropdownItem
            href={oldUrl("/merchant-alt/reports-new/invoicereports")}
            title="Invoice Reports"
          />

          <SideNavDropdownItem
            href={oldUrl("/merchant-alt/reports-new/expensereports")}
            title="Expense Reports"
          />

          <SideNavDropdownItem
            href={oldUrl("/merchant-alt/reports-new/balancesheet")}
            title="Balance Sheet"
          />

          <SideNavDropdownItem
            href={oldUrl("/merchant-alt/reports-new/cashflow")}
            title="Cash Flow Report"
          />

          <SideNavDropdownItem
            href={oldUrl("/merchant-alt/reports-new/aging")}
            title="Aging Report"
          />

          <SideNavDropdownItem
            href={oldUrl("/merchant-alt/reports-new/inventory")}
            title="Inventory Report"
          />

          <SideNavDropdownItem
            href={oldUrl("/merchant-alt/reports-new/taxreport")}
            title="Tax Report"
          />

          <SideNavDropdownItem
            href={oldUrl("/merchant-alt/reports-new/changeTracking")}
            title="Change Tracking"
          />

          {/*
                <SideNavDropdownItem
                  href="/merchants/reports/customers"
                  title="Customer Trends "
                />

                <SideNavDropdownItem
                  href="/merchants/reports/staffs"
                  title="Staff Reports"
                />
                <SideNavDropdownItem
                  href="/merchants/reports/profitloss"
                  title="Profit & Loss Reports"
                />
                <SideNavDropdownItem
                  href="/merchants/reports/invoices"
                  title="Invoice Reports"
                />
                <SideNavDropdownItem
                  href="/merchants/reports/expenses"
                  title="Expense Reports"
                />
                <SideNavDropdownItem
                  href="/merchants/reports/balancesheet"
                  title="Balance Sheet"
                />
                <SideNavDropdownItem
                  href="/merchants/reports/cashflow"
                  title="Cash Flow Report"
                />
                <SideNavDropdownItem
                  href="/merchants/reports/aging"
                  title="Aging Report"
                />
                <SideNavDropdownItem
                  href="/merchants/reports/inventory"
                  title="Inventory Reports"
                />
                <SideNavDropdownItem
                  href="/merchants/reports/taxes"
                  title="Tax Reports"
                />
                <SideNavDropdownItem
                  href="/merchants/reports/changes"
                  title="Change Tracking"
                />
                */}
        </SideNavDropdownButton>
        {/* )} */}

        <div className="w-full border-b border-grey-50 h-0 my-4 opacity-50" />

        {/* {useSelector(canViewPages("settings")) && ( */}
        <SideNavDropdownButton
          tooltip="Settings"
          title="Settings"
          icon="fa-solid fa-gear"
          collapsed={collapsed}
        >
          <SideNavDropdownItem
            href="/merchants/settings/id-auto-generation"
            title="ID Auto Generation"
          />
          <SideNavDropdownItem
            href="/merchants/settings/paye"
            title="PAYE"
          />
          <SideNavDropdownItem
            href="/merchants/settings/nssf"
            title="NSSF"
          />
          <SideNavDropdownItem
            href="/merchants/settings/nhif"
            title="NHIF"
          />
          <SideNavDropdownItem
            href="/merchants/settings/salary-rule"
            title="Salary Rule"
          />
          <SideNavDropdownItem
            href="/merchants/settings/access-control"
            title="Access Control"
          />
          <SideNavDropdownButton
            tooltip="Company Setup"
            title="Company Setup"
            icon="fa-solid fa-gear"
            collapsed={collapsed}
          >
            <SideNavDropdownItem
              href="/merchants/settings/company-setup"
              title="Company Settings"
            />
            <SideNavDropdownItem
              href="/merchants/settings/company-setup/bank-settings"
              title="Bank Settings"
            />
            <SideNavDropdownItem
              href="/merchants/settings/company-setup/departments"
              title="Departments"
            />
            <SideNavDropdownItem
              href="/merchants/settings/company-setup/designations"
              title="Designations"
            />
            <SideNavDropdownItem
              href="/merchants/settings/company-setup/logo"
              title="Logo Setup"
            />
          </SideNavDropdownButton>

          <SideNavDropdownItem
            href={`${backend_url}/merchant-alt/settings`}
            title="General Settings"
          />

          <SideNavDropdownItem
            href={`${backend_url}/merchant-alt/tax`}
            title="Tax"
          />

          <SideNavDropdownItem
            href={`${backend_url}/merchant-alt/units`}
            title="Units"
          />

          <SideNavDropdownItem
            href={`${backend_url}/merchant-alt/warehouse`}
            title="Warehouse"
          />
        </SideNavDropdownButton>
        {/* )} */}

        {/* {useSelector(canViewPages("billing")) && ( */}
        <SideNavButton
          href="/merchants/settings/billing"
          tooltip="Billing"
          title="Billing"
          icon="fa-solid fa-money-bill text-grey-50"
          collapsed={collapsed}
        />
        {/* )} */}

        <SideNavButton
          href="#"
          tooltip="Help"
          title="Help"
          icon="fa-solid fa-question-circle text-grey-50"
          collapsed={collapsed}
        />
      </section>
    </div>
  );
}

export default SideNav;

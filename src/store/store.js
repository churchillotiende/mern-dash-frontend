import { configureStore } from "@reduxjs/toolkit";
import posTransactionReducer from "./merchants/transactions/transaction-slice";
import salesReportsReducer from "./merchants/reports/sales/sales-reports-slice";
import posSessionsReducer from "./merchants/transactions/pos-sessions-slice";
import bottomAlertsReducer from "./shared/bottom-alerts-slice";
import staffReducer from "./merchants/partners/staff-slice";
import clientsReducer from "./merchants/partners/clients-slice";
import transactionsReducer from "./merchants/transactions/transaction-list-slice";
import accessControlReducer from "./merchants/settings/access-control-slice";
import dashboardReducer from "./merchants/dashboard/dashboard-slice";
import bookingReducer from "./merchants/transactions/booking-slice";
import ordersReducer from "./merchants/transactions/orders-slice";
import onlineOrdersReducer from "./merchants/onlineorders/onlineorders-slice";
import restaurantReducer from "./merchants/inventory/restaurant-slice";
import productsReducer from "./merchants/inventory/products-slice";
import batchesReducer from "./merchants/inventory/batches-slice";
import redirectReducer from "./merchants/transactions/redirects-slice";
import inventoryReducer from "./merchants/inventory/inventory-slice";
import categoriesReducer from "./merchants/inventory/categories-slice";
import reportsReducer from "./merchants/reports/reports-slice";
import bookingsReducer from "./merchants/bookings/bookings-slice";
import purchasesReducer from "./merchants/inventory/purchases-slice";

export default configureStore({
  reducer: {
    posTransaction: posTransactionReducer,
    salesReports: salesReportsReducer,
    posSessions: posSessionsReducer,
    bottomAlerts: bottomAlertsReducer,
    staff: staffReducer,
    clients: clientsReducer,
    transactions: transactionsReducer,
    accessControl: accessControlReducer,
    dashboard: dashboardReducer,
    booking: bookingReducer,
    orders: ordersReducer,
    onlineOrders: onlineOrdersReducer,
    restaurant: restaurantReducer,
    products: productsReducer,
    batches: batchesReducer,
    redirect: redirectReducer,
    inventory: inventoryReducer,
    categories: categoriesReducer,
    reports: reportsReducer,
    bookings: bookingsReducer,
    purchases: purchasesReducer,
  },
});

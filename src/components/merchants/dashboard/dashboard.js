import { Fragment } from "react";
import TopHr from "../../ui/layouts/top-hr";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard } from "../../../store/merchants/dashboard/dashboard-slice";
import store from "../../../store/store";
import { useSession } from "next-auth/react";
import StatelessLoadingSpinner from "../../ui/utils/stateless-loading-spinner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DashboardComponent() {
  const { data: session, status } = useSession();

  const dashboard = useSelector((state) => state.dashboard.getDashboard);

  const dashboardStatus = useSelector(
    (state) => state.dashboard.getDashboardStatus
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    // console.log(session.user.accessToken);

    store.dispatch(getDashboard(params));
  }, [session, status]);

  const week = dashboard?.incomeVsExpenses?.weeklyIncomeLabels;

  // console.log(week);

  //get graph filter
  const [graph, setGraph] = useState();

  // onClick Show graph
  const [showWeekGraph, setShowWeekGraph] = useState(true);
  const [showFortNightGraph, setShowFortNightGraph] = useState(false);
  const [showMonthGraph, setShowMonthGraph] = useState(false);

  function graphWeek() {
    // setGraph(dashboard?.incomeVsExpenses?.weeklyIncomeLabels);
    setShowWeekGraph(true);
    setShowMonthGraph(false);
    setShowFortNightGraph(false);
  }

  function graphTwoWeeks() {
    // setLabels(dashboard?.incomeVsExpenses?.fortNightIncomeLabels);
    setShowFortNightGraph(true);
    setShowWeekGraph(false);
    setShowMonthGraph(false);
  }

  function graphMonthly() {
    // setLabels(dashboard?.incomeVsExpenses?.monthlyIncomeLabels);
    setShowMonthGraph(true);
    setShowFortNightGraph(false);
    setShowWeekGraph(false);
  }

  // Income Data Structure
  const x = dashboard?.incomeVsExpenses?.monthlyIncomeLabels;
  const y = dashboard?.incomeVsExpenses?.monthlyIncome;

  //Expense Data
  const x2 = dashboard?.incomeVsExpenses?.monthlyExpensesLabels;
  const y2 = dashboard?.incomeVsExpenses?.monthlyExpenses;

  const lineArray = x?.map((xvalue, index) => {
    let lineObject = {};
    lineObject.x = xvalue;
    lineObject.y = y[index];

    // console.log(xvalue);
    // console.log(y[index]);

    return lineObject;
  });

  const lineArray2 = x2?.map((xvalue, index) => {
    let lineObject2 = {};
    lineObject2.x = xvalue;
    lineObject2.y = y2[index];

    // console.log(xvalue);
    // console.log(y2[index]);

    return lineObject2;
  });

  const data = {
    // labels,
    datasets: [
      {
        label: "Income",
        data: lineArray,
        borderColor: "rgb(74, 124, 213)",
        backgroundColor: "rgba(74, 124, 213, 1)",
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: lineArray2,
        borderColor: "rgb(54, 75, 106)",
        backgroundColor: "rgba(54, 75, 106, 1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      footer: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  };

  //Week Graph Data

  // Income Data Structure
  const xWeek = dashboard?.incomeVsExpenses?.weeklyIncomeLabels;
  const yWeek = dashboard?.incomeVsExpenses?.weeklyIncome;

  //Expense Data
  const x2Week = dashboard?.incomeVsExpenses?.weeklyExpensesLabels;
  const y2Week = dashboard?.incomeVsExpenses?.weeklyExpenses;

  const lineArrayWeek = xWeek?.map((xvalue, index) => {
    let lineObjectWeek = {};
    lineObjectWeek.x = xvalue;
    lineObjectWeek.y = yWeek[index];

    // console.log(xvalue);
    // console.log(yWeek[index]);

    return lineObjectWeek;
  });

  const lineArrayWeek2 = x2Week?.map((xvalue, index) => {
    let lineObjectWeek2 = {};
    lineObjectWeek2.x = xvalue;
    lineObjectWeek2.y = y2Week[index];

    // console.log(xvalue);
    // console.log(y2Week[index]);

    return lineObjectWeek2;
  });

  const weekData = {
    // labels,
    datasets: [
      {
        label: "Income",
        data: lineArrayWeek,
        borderColor: "rgb(74, 124, 213)",
        backgroundColor: "rgba(74, 124, 213, 1)",
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: lineArrayWeek2,
        borderColor: "rgb(54, 75, 106)",
        backgroundColor: "rgba(54, 75, 106, 1)",
        tension: 0.4,
      },
    ],
  };
  // End Week Data

  //Two Weeks Graph Data

  // Income Data Structure
  const xWeek2 = dashboard?.incomeVsExpenses?.fortNightIncomeLabels;
  const yWeek2 = dashboard?.incomeVsExpenses?.fortNightIncome;

  //Expense Data
  const x2Week2 = dashboard?.incomeVsExpenses?.fortNightExpensesLabels;
  const y2Week2 = dashboard?.incomeVsExpenses?.fortNightExpenses;

  const lineArray2Week = xWeek2?.map((xvalue, index) => {
    let lineObject2Week = {};
    lineObject2Week.x = xvalue;
    lineObject2Week.y = yWeek2[index];

    // console.log(xvalue);
    // console.log(yWeek2[index]);

    return lineObject2Week;
  });

  const lineArrayWeek22 = x2Week2?.map((xvalue, index) => {
    let lineObjectWeek22 = {};
    lineObjectWeek22.x = xvalue;
    lineObjectWeek22.y = y2Week2[index];

    // console.log(xvalue);
    // console.log(y2Week2[index]);

    return lineObjectWeek22;
  });

  const week2Data = {
    // labels,
    datasets: [
      {
        label: "Income",
        data: lineArray2Week,
        borderColor: "rgb(74, 124, 213)",
        backgroundColor: "rgba(74, 124, 213, 1)",
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: lineArrayWeek22,
        borderColor: "rgb(54, 75, 106)",
        backgroundColor: "rgba(54, 75, 106, 1)",
        tension: 0.4,
      },
    ],
  };
  // End Two Weeks Data

  //Update Total Sales

  const [total, setTotal] = useState();

  function updateToday() {
    setTotal(dashboard.sales.todaySales);
  }

  function updateWeekly() {
    setTotal(dashboard.sales.sevenDaySales);
  }

  function updateTwoWeeks() {
    setTotal(dashboard.sales.fourteenDaySales);
  }

  function updateMontly() {
    setTotal(dashboard.sales.thirtyDaySales);
  }

  // Update Total Expenses

  const [expenses, setExpenses] = useState();

  function todayExpenses() {
    setExpenses(dashboard.expenses.todayExpenses);
  }

  function weeklyExpenses() {
    setExpenses(dashboard.expenses.sevenDayExpenses);
  }

  function twoWeeksExpenses() {
    setExpenses(dashboard.expenses.fourteenDayExpenses);
  }

  function montlyExpenses() {
    setExpenses(dashboard.expenses.thirtyDayExpenses);
  }

  const myDate = new Date();
  const hours = myDate.getHours();
  var greet;

  if (hours < 12) greet = "Good Morning";
  else if (hours >= 12 && hours <= 17) greet = "Good Afternoon";
  else if (hours >= 17 && hours <= 24) greet = "Good Evening";

  if (dashboardStatus != "fulfilled")
    return (
      <div className="w-full p-4 flex justify-center">
        <StatelessLoadingSpinner />
      </div>
    );

  return (
    <Fragment>
      <div className="w-full pt-6">
        <div className="w-full md:w-6/12">
          <h1 className="w-full text-2xl font-bold text-darkest px-1 pb-1">
            Dashboard
          </h1>

          <div className="w-full text-lg px-2">
            <span id="greeting">{greet}</span>, {dashboard.greetings.shop_name}
          </div>
        </div>
      </div>

      <TopHr />

      <div className="w-full flex flex-wrap justify-around px-2 space-y-2 mb-14">
        <div className="flex w-full flex-wrap">
          <div
            className="w-full md:w-6/12 xl:w-4/12 h-52 md:pr-1"
            x-data="{ salesShow: 'day' }"
          >
            <div className="h-full w-full bg-white rounded-xl px-6 py-4 flex flex-col justify-between items-start text-darkest">
              <div className="flex w-full justify-between items-center">
                <span className="text-sm font-semibold">Total Sales</span>
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    data-dropdown-toggle="dropdown"
                    className="button-primary-outline px-2 py-1"
                    type="button"
                  >
                    <i className="fa-regular fa-calendar-alt" />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li onClick={updateToday}>
                      <a>Today</a>
                    </li>
                    <li onClick={updateWeekly}>
                      <a>Last 7 Days</a>
                    </li>
                    <li onClick={updateTwoWeeks}>
                      <a>Last 14 Days</a>
                    </li>
                    <li onClick={updateMontly}>
                      <a>Last 30 Days</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="w-full">
                <span className="text-2xl tracking-wide mr-2">Ksh</span>
                <span className="text-4xl font-thin tracking-widest">
                  <span x-show="salesShow=='day'">
                    {total ? total : dashboard.sales.todaySales}
                  </span>
                </span>
              </div>
              <div className="w-full flex items-end text-sm text-primaryDarker mt-2">
                <a
                  className="hover:cursor-pointer w-fit hover:underline hover:underline-offset-1"
                  href="/reports"
                >
                  <span>View all</span>{" "}
                  <i className="fa-solid fa-angle-double-right text-xs" />
                </a>
              </div>
            </div>
          </div>
          <div className="w-full md:w-6/12 xl:w-4/12 h-52 md:pl-1 xl:pr-1 mt-2 md:mt-0">
            <div className="h-full w-full bg-white rounded-xl px-6 py-4 flex flex-col justify-between items-start text-darkest">
              <div className="flex w-full">
                <span className="text-sm font-semibold">
                  Customer Return Rate
                </span>
              </div>
              <div className="w-full">
                <span className="text-4xl font-thin tracking-widest">
                  {dashboard.customerReturnRate.customerReturnRate}
                </span>
                <span className="text-2xl tracking-wide ml-1">%</span>
              </div>
              <div className="w-full flex items-end text-sm text-primaryDarker mt-2">
                <a
                  className="hover:cursor-pointer w-fit hover:underline hover:underline-offset-1"
                  href="/loyalty"
                >
                  <span>View all</span>{" "}
                  <i className="fa-solid fa-angle-double-right text-xs" />
                </a>
              </div>
            </div>
          </div>
          <div className="w-full xl:w-4/12 h-52 xl:pl-1 mt-2 xl:mt-0">
            <div
              className="h-full w-full bg-white rounded-xl px-6 py-4 flex flex-col justify-between items-start text-darkest"
              x-data="{ expensesShow: 'day' }"
            >
              <div className="flex w-full justify-between items-center">
                <span className="text-sm font-semibold">Expenses</span>
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="button-primary-outline px-2 py-1"
                  >
                    <i className="fa-regular fa-calendar-alt" />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li onClick={todayExpenses}>
                      <a>Today</a>
                    </li>
                    <li onClick={weeklyExpenses}>
                      <a>Last 7 Days</a>
                    </li>
                    <li onClick={twoWeeksExpenses}>
                      <a>Last 14 Days</a>
                    </li>
                    <li onClick={montlyExpenses}>
                      <a>Last 30 Days</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="w-full">
                <span className="text-2xl tracking-wide">Ksh</span>
                <span className="text-4xl font-thin tracking-widest">
                  <span x-show="expensesShow=='day'">
                    {expenses ? expenses : dashboard.expenses.todayExpenses}
                  </span>
                </span>
              </div>
              <div className="w-full flex items-end text-sm text-primaryDarker mt-2">
                <a
                  className="hover:cursor-pointer w-fit hover:underline hover:underline-offset-1"
                  href="/reports"
                >
                  <span>View all</span>{" "}
                  <i className="fa-solid fa-angle-double-right text-xs" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="h-fit w-full overflow-x-hidden">
          <div
            className="h-full w-full bg-white rounded-xl px-6 py-4"
            x-data="{ currentChart: 'Daily' }"
          >
            <div className="flex w-full justify-between">
              <div className="text-sm font-semibold">Income vs Expenses</div>
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="button-primary-outline px-2 py-1"
                >
                  <i className="fa-regular fa-calendar-alt" />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li onClick={graphWeek}>
                    <a>Last 7 Days</a>
                  </li>
                  <li onClick={graphTwoWeeks}>
                    <a>Last 14 Days</a>
                  </li>
                  <li onClick={graphMonthly}>
                    <a>Last 30 Days</a>
                  </li>
                </ul>
              </div>
            </div>

            {showWeekGraph ? (
              <div
                id="canvasM"
                className="w-100 overflow-x-hidden"
                style={{ height: 256, display: "block", width: "100%" }}
              >
                <Line data={weekData} options={options} updateMode="resize" />
              </div>
            ) : null}

            {showFortNightGraph ? (
              <div
                id="canvasM"
                className="w-100 overflow-x-hidden"
                style={{ height: 256, display: "block", width: "100%" }}
              >
                <Line data={week2Data} options={options} updateMode="resize" />
              </div>
            ) : null}

            {showMonthGraph ? (
              <div
                id="canvasM"
                className="w-100 overflow-x-hidden"
                style={{ height: 256, display: "block", width: "100%" }}
              >
                <Line data={data} options={options} updateMode="resize" />
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex w-full items-stretch flex-wrap">
          <div className="w-full md:w-3/12 md:pr-1 h-52 md:h-full">
            <div className="h-full w-full bg-white rounded-xl px-6 py-4 flex flex-col justify-between items-start text-darkest">
              <div className="flex w-full">
                <span className="text-sm font-semibold">Today Bookings</span>
              </div>
              <div className="w-full">
                <span className="text-4xl font-thin tracking-widest">
                  {dashboard.bookings.todaysBookings}
                </span>
              </div>
              <div className="w-full flex items-end text-sm text-primaryDarker mt-2">
                <a
                  className="hover:cursor-pointer w-fit hover:underline hover:underline-offset-1"
                  href="/bookings/calendar"
                >
                  <span>View all</span>{" "}
                  <i className="fa-solid fa-angle-double-right text-xs" />
                </a>
              </div>
            </div>
          </div>
          <div className="w-full md:w-3/12 md:px-1 h-52 md:h-full">
            <div className="h-full w-full bg-white rounded-xl px-6 py-4 flex flex-col justify-between items-start text-darkest">
              <div className="flex w-full">
                <span className="text-sm font-semibold">Today Orders</span>
              </div>
              <div className="w-full">
                <span className="text-4xl font-thin tracking-widest">
                  {dashboard.orders.todaysOrders}{" "}
                </span>
              </div>
              <div className="w-full flex items-end text-sm text-primaryDarker mt-2">
                <a
                  className="hover:cursor-pointer w-fit hover:underline hover:underline-offset-1"
                  href="/orders"
                >
                  <span>View all</span>{" "}
                  <i className="fa-solid fa-angle-double-right text-xs" />
                </a>
              </div>
            </div>
          </div>
          <div className="w-full md:w-6/12 mt-2 md:mt-0 md:pl-1">
            <div className="h-full w-full bg-primary bg-opacity-90 rounded-xl px-6 py-4 pb-6 flex flex-wrap items-start text-white">
              <div className="flex w-full pb-3">
                <span className="text-sm font-semibold">Quick Links</span>
              </div>
              <div className="w-full px-6">
                <ul className="space-y-1 flex flex-col w-fit">
                  <li className="btn btn-sm btn-info justify-start gap-2 hover:bg-opacity-75">
                    <i className="fa-solid fa-credit-card text-primary" />
                    <Link
                      className="text-primary"
                      href="/merchants/transactions/new"
                    >
                      New Transaction
                    </Link>
                  </li>
                  {/* <li className="btn btn-sm btn-outline btn-info justify-start gap-2">
                    <i className="fa-solid fa-dolly" />
                    <a
                      className="hover:cursor-pointer hover:text-primary"
                      href="/transactions/products"
                    >
                      Products
                    </a>
                  </li> */}
                  <li className="btn btn-sm btn-outline btn-info justify-start gap-2">
                    <i className="fa-solid fa-briefcase" />
                    <Link
                      className="hover:cursor-pointer hover:text-primary"
                      href="/merchants/partners/clients"
                    >
                      Clients
                    </Link>
                  </li>
                  {/* <li className="btn btn-sm btn-outline btn-info justify-start gap-2">
                    <i className="fa-solid fa-shapes" />
                    <a
                      className="hover:cursor-pointer hover:text-primary"
                      href="/transactions/loyalty"
                    >
                      Loyalty
                    </a>
                  </li>
                  <li className="btn btn-sm btn-outline btn-info justify-start gap-2">
                    <i className="fa-solid fa-globe-africa" />
                    <a
                      className="hover:cursor-pointer hover:text-primary"
                      href="/transactions/promotions"
                    >
                      Marketing
                    </a>
                  </li> */}
                </ul>
              </div>
              <div className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default DashboardComponent;

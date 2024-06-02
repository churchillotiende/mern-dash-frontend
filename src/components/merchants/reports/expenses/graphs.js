import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut, Line, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getExpenses } from "../../../../store/merchants/reports/reports-slice";
import store from "../../../../store/store";
import { useSession } from "next-auth/react";

function GraphsView() {
  const { data: session, status } = useSession();

  const expenses = useSelector((state) => state.reports.getExpenses);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getExpenses(params));
  }, [session, status]);

  console.log(expenses);

  const data = {
    labels: expenses?.pmethod_labels,

    datasets: [
      {
        label: "Invoices Payment Method",
        data: expenses?.pmethod_values,
        backgroundColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(217, 78, 78)",
        ],
        borderColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(217, 78, 78, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
  };

  const data3 = {
    labels: expenses?.transaction_day_labelsx,
    datasets: [
      {
        label: "Count",
        data: expenses?.transaction_day_valuesx,
        borderColor: "rgba(74, 124, 213, 1)",
        backgroundColor: "rgba(74, 124, 213, 1)",
        tension: 0.4,
      },
    ],
  };

  const options2 = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Horizontal Bar Chart",
      },
    },
  };

  const data2 = {
    labels: expenses?.sdc_labels,
    datasets: [
      {
        label: "Amount",
        data: expenses?.sdc_values,
        borderColor: "rgba(74, 124, 213, 1)",
        backgroundColor: "rgba(74, 124, 213, 1)",
      },
    ],
  };

  return (
    <div>
      <div className="h-full w-full bg-white rounded-xl px-6 py-4 pb-8">
        <div className="flex justify-between items-center flex-wrap">
          <div className="flex w-full md:w-6/12 flex-wrap">
            <div className="flex flex-wrap space-y-1 w-full md:w-6/12 xl:w-fit md:pr-2">
              <div className="text-dark text-sm">From</div>
              <input
                type="date"
                name="search"
                className="input-primary h-12 text-grey-100"
                required=""
                placeholder="dd/mm/yyyy"
              />
            </div>
            <div className="flex flex-wrap space-y-1 w-full md:w-6/12 xl:w-fit">
              <div className="text-dark text-sm">To</div>
              <input
                type="date"
                name="search"
                className="input-primary h-12 text-grey-100"
                required=""
                placeholder="dd/mm/yyyy"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="h-full w-full" x-show="tabShow=='summary'">
        <div className="h-full w-full mt-2 flex justify-between items-stretch flex-wrap">
          <div className="w-full md:w-9/12">
            <div className="w-full bg-white px-6 py-4 pb-8 rounded-xl">
              <div className="text-sm font-semibold">Total Expenses</div>
              <div className="w-full h-full flex items-center">
                <div className="w-full flex justify-center ">
                  <div
                    id="canvas1"
                    className="relative w-full overflow-x-hidden"
                  >
                    <Bar options={options2} data={data2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-3/12 md:pl-2">
            <div className="w-full bg-white  rounded-xl px-6 py-4 pb-8 mt-2 md:mt-0">
              <div className="text-sm font-semibold">Top Expenses</div>
              <div id="canvas2" className="overflow-x-hidden relative ">
                <Doughnut data={data} />
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-full mt-2 flex justify-between items-stretch mb-8 flex-wrap">
          <div className="w-full md:w-12/12">
            <div className="w-full bg-white px-6 py-4 pb-8 rounded-xl">
              <div className="text-sm font-semibold">Expenses per Month</div>
              <div id="canvas4" className="w-full relative overflow-x-hidden ">
                <Line options={options} data={data3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraphsView;

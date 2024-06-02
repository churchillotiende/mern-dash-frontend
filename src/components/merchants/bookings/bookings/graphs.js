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
import { Doughnut, Pie, Bar, Line } from "react-chartjs-2";

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
import { getBookingsAnalytics } from "../../../../store/merchants/bookings/bookings-slice";
import store from "../../../../store/store";
import { useSession } from "next-auth/react";

function GraphsView() {
  const { data: session, status } = useSession();

  const bookings = useSelector((state) => state.bookings.getBookingsAnalytics);

  const bookingsStatus = useSelector(
    (state) => state.bookings.getBookingsAnalyticsStatus
  );

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    // console.log(session.user.accessToken);

    store.dispatch(getBookingsAnalytics(params));
  }, [session, status]);

  // console.log(trends.client_visits_labels)

  const data = {
    labels: bookings?.res_status_titles,

    datasets: [
      {
        label: "Bookings Status",
        data: bookings?.res_status_values,
        backgroundColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(93, 162,113, 1)",
        ],
        borderColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(93, 162,113, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const data2 = {
    labels: bookings?.res_status_titles,

    datasets: [
      {
        label: "Bookings Status",
        data: bookings?.res_status_values,
        backgroundColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(93, 162,113, 1)",
        ],
        borderColor: [
          "rgba(255, 140, 66, 1)",
          "rgba(74, 124, 213, 1)",
          "rgba(93, 162,113, 1)",
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
    labels: bookings?.staff_b_titles,
    datasets: [
      {
        label: "Staff Bookings",
        data: bookings?.staff_b_values,
        backgroundColor: "rgba(255, 140, 66, 1)",
      },
    ],
  };

  const data4 = {
    labels: bookings?.res_trend_titles,
    datasets: [
      {
        label: "Reservation trend per Day",
        data: bookings?.res_trend_values,
        borderColor: "rgba(74, 124, 213, 1)",
        backgroundColor: "rgba(74, 124, 213, 1)",
      },
    ],
  };

  const data5 = {
    labels: bookings?.prod_trend_titles,
    datasets: [
      {
        label: "Product Booking Trends",
        data: bookings?.prod_trend_values,
        borderColor: "rgba(255, 242, 117, 1)",
        backgroundColor: "rgba(255, 242, 117, 1)",
        tension: 0.4,
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

      <div className="h-full w-full">
        <div className="h-full w-full mt-2 flex justify-between items-stretch flex-wrap">
          <div className="w-full md:w-9/12">
            <div className="w-full bg-white px-6 py-4 pb-8 rounded-xl">
              <div className="text-sm font-semibold">Staff Bookings</div>
              <div className="w-full h-full flex items-center">
                <div className="w-full flex justify-center ">
                  <div id="canvas4" className="w-full overflow-x-hidden h-72">
                    <Bar options={options} data={data3} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-3/12 md:pl-2">
            <div className="w-full bg-white  rounded-xl px-6 py-4 pb-8 mt-2 md:mt-0">
              <div className="text-sm font-semibold">Reservation by Status</div>
              <div id="canvas2" className="overflow-x-hidden relative h-72">
                <Pie data={data2} />
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-full mt-2 flex justify-between items-stretch mb-8 flex-wrap">
          <div className="w-full md:w-6/12">
            <div className="w-full bg-white px-6 py-4 pb-8 rounded-xl">
              <div className="text-sm font-semibold">
                Reservation trend per Day
              </div>
              <div
                id="canvas3"
                className="w-full relative overflow-x-hidden h-72"
              >
                <Bar options={options} data={data4} />
              </div>
            </div>
          </div>
          <div className="w-full md:w-6/12 md:pl-2">
            <div className="w-full bg-white  rounded-xl px-6 py-4 pb-8 mt-2 md:mt-0">
              <div className="text-sm font-semibold">
                Product Booking Trends
              </div>
              <div id="canvas4" className="w-full overflow-x-hidden h-72">
                <Line options={options} data={data5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraphsView;

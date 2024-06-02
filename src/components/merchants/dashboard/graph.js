import { Fragment } from "react";

function Graph({ title, data, cal, link }) {
  return (
    <Fragment>
      <div className="h-fit w-full overflow-x-hidden">
        <div
          className="h-full w-full bg-white rounded-xl px-6 py-4"
          x-data="{ currentChart: 'Daily' }"
        >
          <div className="flex w-full justify-between">
            <div className="text-sm font-semibold">
              Income vs Expenses
              <span className="text-xs" x-show="currentChart == 'Daily'">
                (daily)
              </span>
              <span
                className="text-xs"
                x-show="currentChart == 'Yearly'"
                style={{ display: "none" }}
              >
                (fortnight)
              </span>
              <span
                className="text-xs"
                x-show="currentChart == 'Monthly'"
                style={{ display: "none" }}
              >
                (monthly)
              </span>
            </div>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="button-primary-outline px-2 py-1">
                <i className="fa-regular fa-calendar-alt" />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li click="currentChart='Daily'; document.activeElement.blur()">
                  <a>Last 7 Days</a>
                </li>
                <li click="currentChart='Yearly'; document.activeElement.blur()">
                  <a>Last 14 Days</a>
                </li>
                <li click="currentChart='Monthly'; document.activeElement.blur()">
                  <a>Last 30 Days</a>
                </li>
              </ul>
            </div>
          </div>
          <div
            id="canvasM"
            className="w-100 overflow-x-hidden h-64"
            x-show="currentChart == 'Monthly'"
            style={{ display: "none" }}
          >
            <canvas
              height={256}
              style={{
                display: "block",
                boxSizing: "border-box",
                height: 256,
                width: 1248,
              }}
              width={1248}
            />
          </div>
          <div
            id="canvasW"
            className="w-100 overflow-x-hidden h-64"
            x-show="currentChart == 'Daily'"
          >
            <canvas
              height={256}
              style={{
                display: "block",
                boxSizing: "border-box",
                height: 256,
                width: 1285,
              }}
              width={1285}
            />
          </div>
          <div
            id="canvasY"
            className="w-100 overflow-x-hidden h-64"
            x-show="currentChart == 'Yearly'"
            style={{ display: "none" }}
          >
            <canvas
              height={256}
              style={{
                display: "block",
                boxSizing: "border-box",
                height: 256,
                width: 1248,
              }}
              width={1248}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Graph;

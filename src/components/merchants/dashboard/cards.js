import { Fragment } from "react";

function Cards({ title, data, cal, link }) {
  return (
    <Fragment>
      <div
        className="w-full md:w-6/12 xl:w-4/12 h-52 md:pr-1"
        x-data="{ salesShow: 'day' }"
      >
        <div className="h-full w-full bg-white rounded-xl px-6 py-4 flex flex-col justify-between items-start text-darkest">
          <div className="flex w-full justify-between items-center">
            <span className="text-sm font-semibold">{title}</span>
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
                <li click="salesShow='day'; document.activeElement.blur()">
                  <a>Today</a>
                </li>
                <li click="salesShow='week'; document.activeElement.blur() ">
                  <a>Last 7 Days</a>
                </li>
                <li click="salesShow='fortnight'; document.activeElement.blur()">
                  <a>Last 14 Days</a>
                </li>
                <li click="salesShow='month'; document.activeElement.blur()">
                  <a>Last 30 Days</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full">
            <span className="text-2xl tracking-wide mr-2">Ksh</span>
            <span className="text-4xl font-thin tracking-widest">
              <span x-show="salesShow=='day'">{data}</span>
              <span x-show="salesShow=='week'" style={{ display: "none" }}>
                {data}
              </span>
              <span x-show="salesShow=='fortnight'" style={{ display: "none" }}>
                {data}
              </span>
              <span x-show="salesShow=='month'" style={{ display: "none" }}>
                {data}
              </span>
            </span>
          </div>
          <div className="w-full flex items-end text-sm text-primaryDarker mt-2">
            <a
              className="hover:cursor-pointer w-fit hover:underline hover:underline-offset-1"
              href={link}
            >
              <span>View all </span>
              <i className="fa-solid fa-angle-double-right text-xs" />
            </a>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Cards;

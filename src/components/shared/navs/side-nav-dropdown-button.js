import { useState, Fragment } from "react";

export default function SideNavDropdownButton({
  collapsed,
  title,
  tooltip,
  children,
  icon,
}) {
  const [expandDropdown, setExpandDropdown] = useState(false);

  return (
    <Fragment>
      <div
        className={`${collapsed ? "sidenav-item-collapsed" : "sidenav-item"}`}
        data-tip={tooltip}
        onClick={() => !collapsed && setExpandDropdown(!expandDropdown)}
      >
        <div className="flex-none">
          <div className="flex space-x-2 items-center">
            <i className={`${icon} text-grey-50`}></i>
            {!collapsed && <span>{title}</span>}
          </div>
        </div>
        {!collapsed && (
          <div className="grow flex justify-end pr-2">
            {expandDropdown ? (
              <i className="fa-solid fa-angle-up text-grey-50"></i>
            ) : (
              <i className="fa-solid fa-angle-down text-grey-50"></i>
            )}
          </div>
        )}
      </div>

      {!collapsed && expandDropdown && children}
    </Fragment>
  );
}

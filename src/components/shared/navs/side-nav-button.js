import { Link } from "react-router-dom";

export default function SideNavButton({
  collapsed,
  title,
  tooltip,
  icon,
  href,
}) {
  return (
    <a href={href}>
      <div
        className={`${collapsed ? "sidenav-item-collapsed" : "sidenav-item"}`}
        data-tip={tooltip}
      >
        <i className={`${icon} text-grey-50`}></i>
        {!collapsed && <span>{title}</span>}
      </div>
    </a>
  );
}

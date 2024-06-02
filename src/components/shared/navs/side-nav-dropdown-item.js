import { Link } from "react-router-dom";

export default function SideNavDropdownItem({ href, title }) {
  return (
    <Link href={href} className="w-full">
      <div className="sidenav-item pl-10">
        <span>{title}</span>
      </div>
    </Link>
  );
}

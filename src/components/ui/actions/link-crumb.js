import { Link } from "react-router-dom";
import { Fragment } from "react";

function LinkCrumb({ title, href }) {
  return (
    <Fragment>
      <Link href={href} className="cursor-pointer">
        {title}
      </Link>
      <i className="fa-solid fa-chevron-right hover:cursor-pointer mx-1 text-xs"></i>
    </Fragment>
  );
}

export default LinkCrumb;

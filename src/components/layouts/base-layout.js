import { Fragment } from "react";

function BaseLayout(props) {
  return (
    <Fragment>

      <title>Oteemedia Dash</title>

      {props.children}
    </Fragment>
  );
}

export default BaseLayout;

import { Fragment, useContext } from "react";
import getLogger from "../../lib/shared/logger";
import BottomAlertsContext from "../../store/shared/bottom-alerts";

function BottomAlerts() {
  const alertCtx = useContext(BottomAlertsContext);
  const logger = getLogger("BottomAlerts");

  let alert = null;

  if (alertCtx.alert && alertCtx.alert.type === "success") {
    alert = (
      <div className="w-full fixed bottom-5 flex justify-center">
        <div className="alert alert-success w-fit transition-all ease-out ignore">
          <div>
            <i className="fa-solid fa-check-circle"></i>
            <span>{alertCtx.alert.message}</span>
          </div>
        </div>
      </div>
    );
  }

  if (alertCtx.alert && alertCtx.alert.type === "warning") {
    alert = (
      <div className="w-full fixed bottom-5 flex justify-center">
        <div className="alert alert-warning w-fit transition-all ease-out ignore">
          <div>
            <i className="fa-solid fa-exclamation-circle"></i>
            <span>{alertCtx.alert.message}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      {alertCtx.alert && alert && (
        <div className="w-full fixed bottom-5 flex flex-col items-center justify-center gap-2">
          {alert}
        </div>
      )}
    </Fragment>
  );
}

export default BottomAlerts;

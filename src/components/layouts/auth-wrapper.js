import { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchMyAccountData } from "../../store/merchants/settings/access-control-slice";
import store from "../../store/store";

function AuthWrapper() {
  // const { data: session, status } = useSession();

  const myAccountDataStatus = useSelector(
    (state) => state.accessControl.myAccountDataStatus
  );

  // useEffect(() => {
  //   if (!session || status !== "authenticated") {
  //     return;
  //   }

  //   if (myAccountDataStatus === "idle") {
  //     store.dispatch(
  //       fetchMyAccountData({ accessToken: session.user.accessToken })
  //     );
  //   }
  // }, [session, status, myAccountDataStatus]);

  return <></>;
}

export default AuthWrapper;

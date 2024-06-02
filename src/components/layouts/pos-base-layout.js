import { useSession } from "next-auth/react";
import { BottomAlertsContextProvider } from "../../store/shared/bottom-alerts";
import { MerchantUiContextProvider } from "../../store/shared/merchant-ui";
import BottomAlertsAlt from "../shared/bottom-alerts";
import BottomAlerts from "../ui/display/bottom-alerts";
import TopNavPos from "../shared/navs/top-nav-pos";
import { TransactionContextProvider } from "../../store/merchants/transactions/transaction-context";
import { TransactionEditingContextProvider } from "../../store/merchants/transactions/transaction-editing-context";
import { PaymentsContextProvider } from "../../store/merchants/transactions/payments-context";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PaymentsEditingContextProvider } from "../../store/merchants/transactions/payments-editing-context";
import AuthWrapper from "./auth-wrapper";
import { useSelector } from "react-redux";
import store from "../../store/store";
import { fetchStaff } from "../../store/merchants/partners/staff-slice";
import { clearLocalStorage } from "../../store/merchants/settings/access-control-slice";

function PosBaseLayout(props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    clearLocalStorage();

    if (status !== "authenticated" && status !== "loading") {
      router.replace("/auth/sign-in");
    }
  }, [status, router]);

  const staffListStatus = useSelector((state) => state.staff.staffListStatus);
  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["fetch_all"] = true;
    params["lean"] = true;

    if (staffListStatus === "idle") {
      store.dispatch(fetchStaff(params));
    }
  }, [session, status, staffListStatus]);

  return (
    <BottomAlertsContextProvider>
      <MerchantUiContextProvider>
        <PaymentsEditingContextProvider>
          <PaymentsContextProvider>
            <TransactionEditingContextProvider>
              <TransactionContextProvider>
                <section>
                  <main>
                    <TopNavPos />
                    {props.children}
                  </main>

                  <BottomAlerts />
                  <BottomAlertsAlt />
                  <AuthWrapper />
                </section>
              </TransactionContextProvider>
            </TransactionEditingContextProvider>
          </PaymentsContextProvider>
        </PaymentsEditingContextProvider>
      </MerchantUiContextProvider>
    </BottomAlertsContextProvider>
  );
}

/*
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
*/

export default PosBaseLayout;

import SideNav from "../shared/navs/side-nav";
import TopNav from "../shared/navs/top-nav";
import { MerchantUiContextProvider } from "../../store/shared/merchant-ui";
import MerchantPageContent from "./merchant-page-content";
import BottomAlertsAlt from "../shared/bottom-alerts";
import BottomAlerts from "../ui/display/bottom-alerts";
import { BottomAlertsContextProvider } from "../../store/shared/bottom-alerts";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import store from "../../store/store";
import ScrollerFabs from "../ui/actions/scroller-fabs";
import AuthWrapper from "./auth-wrapper";

function MerchantBaseLayout(props) {
  // const { data: session, status } = useSession();
  // const doNotCheckForSubscription = props?.doNotCheckForSubscription ?? false;

  // const router = useRouter();
  // const userName = session?.user?.name;
  // const isSubscriptionActive =
  //   useSelector(hasActiveSubscription) || doNotCheckForSubscription;



  return (
    <BottomAlertsContextProvider>
      <MerchantUiContextProvider>
        <section className="relative">
          <nav>
            <SideNav />
          </nav>
          <main className="relative">
            <TopNav />
            <MerchantPageContent>{props.children}</MerchantPageContent>
            <ScrollerFabs />
          </main>

          <BottomAlerts />
          <BottomAlertsAlt />
          <AuthWrapper />
        </section>
      </MerchantUiContextProvider>
    </BottomAlertsContextProvider>
  );
}

export default MerchantBaseLayout;

import { useContext } from "react";
import MerchantUiContext from "../../store/shared/merchant-ui";

export default function MerchantPageContent({ children }) {
  const uiCtx = useContext(MerchantUiContext);
  const collapsed = uiCtx.sidenav.collapsed;

  return (
    <div className={`pl-0 tr-eo ${collapsed ? "lg:pl-28" : "lg:pl-64"}`}>
      <div className="px-4 mt-14 mb-8">{children}</div>
    </div>
  );
}

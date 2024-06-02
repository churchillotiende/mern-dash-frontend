// import { useSession } from "next-auth/react";

import { useContext } from "react";
import MerchantUiContext from "../../../store/shared/merchant-ui";
import LoadingSpinner from "../../ui/utils/loading-spinner";
// import Image from "next/image";
import { useSelector } from "react-redux";
import { subscriptionDays } from "../../../store/merchants/settings/access-control-slice";

function TopNav() {
  // const { data: session, status } = useSession();

  const uiCtx = useContext(MerchantUiContext);
  const collapsed = uiCtx.sidenav.collapsed;
  const isSideNavVisible = uiCtx.layout.showSideNav;
  const isMobile = uiCtx.layout.actions.isMobile();

  // function isAuthenticated() {
  //   return status === "authenticated";
  // }

  const remainingDays = useSelector(subscriptionDays);

  return (
    <nav
      className={`top-nav tr-eo ${isSideNavVisible && (collapsed ? "ml-28" : "ml-64")
        }`}
    >
      <div className="space-x-2 flex items-center">
        <button
          className="btn btn-ghost btn-square bg-base-content bg-opacity-5 lg:hidden"
          onClick={uiCtx.layout.actions.toggleSidenav}
        >
          {isSideNavVisible && <i className="fa-solid fa-times"></i>}
          {!isSideNavVisible && <i className="fa-solid fa-bars"></i>}
        </button>
      </div>

      {(!isSideNavVisible || !isMobile) && (
        <div className="grow flex items-center space-x-2 justify-end">
          <LoadingSpinner />

          <div className="dropdown dropdown-end w-fit">
            <label
              tabIndex="0"
              className="border border-grey-50 rounded-full shadow-md px-4 py-2 flex items-center w-fit justify-between cursor-pointer relative"
            >
              <div className="space-x-1 flex w-full sm:mr-8">
                {/* <Image
                  src="/images/logos/96x96-blue.png"
                  alt="logo"
                  width={24}
                  height={24}
                  className="w-6"
                /> */}
                <div className="w-fit whitespace-nowrap hidden md:inline">
                  <span className="hidden sm:inline">
                    {/* {isAuthenticated() && session.user.name} */}
                  </span>
                </div>
              </div>
              <i className="fa-solid fa-chevron-down text-grey-50 w-fit"></i>
            </label>

            <ul
              tabIndex="0"
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a href="#" className="bg-info text-dark cursor-default">
                  {/* {isAuthenticated() && session.user.name} */}
                </a>
              </li>
              <li>
                <a href="#">Subscription: </a>
              </li>
              <li>
                <a href="#" >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}

export default TopNav;

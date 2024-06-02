import { useSession } from "next-auth/react";
import { createContext, useState } from "react";
import getLogger from "../../../lib/shared/logger";

const StaffContext = createContext({
  staff: undefined,
  actions: {
    load: (fetch_all = false, lean = false) => {},
  },
});

export function StaffContextProvider(props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const logger = getLogger("StaffContext");

  const { data: session, status } = useSession();
  const [staff, setStaff] = useState();

  function loadStaff(fetch_all = false, lean = false) {
    const startDate = new Date();

    logger.log("Loading staff");
    if (!session) {
      return;
    }

    let url = fetch_all
      ? `${API_URL}/partners/staff?get_all`
      : `${API_URL}/partners/staff`;

    if (lean) {
      url += fetch_all ? "&lean" : "?lean";
    }

    fetch(url, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken} `,
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        const endDate = new Date();
        const seconds = endDate.getTime() - startDate.getTime();
        if (!response.ok) {
          logger.log("Error while loading staff", { data });
          return;
        }

        const data = await response.json();
        logger.log("Loaded staff", { took: seconds, ...data });
        setStaff(data);
      })
      .catch((error) => {
        logger.warn(error);
      });
  }

  const context = {
    staff,
    actions: {
      load: loadStaff,
    },
  };

  return (
    <StaffContext.Provider value={context}>
      {props.children}
    </StaffContext.Provider>
  );
}

export default StaffContext;

import { Card } from "@mantine/core";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { isCarWash } from "../../../../lib/shared/roles_and_permissions";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import { getStaffDetails } from "../../../../store/merchants/partners/staff-slice";
import { useEffect, useState } from "react";
import store from "../../../../store/store";
import { useSession } from "next-auth/react";

function StaffBioView() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const staffId = router?.query?.staffId;
  const currentClient = useSelector((state) =>
    state.staff?.staffList?.data?.find((item) => item.id == staffId)
  );

  const staffListLoaded = useSelector(
    (state) => state.staff?.staffListStatus === "fulfilled"
  );

  const staffDetailsStatus = useSelector(
    (state) => state.staff.getStaffDetails
  );
  const staff = useSelector((state) => state.staff.getStaffDetails);

  const isLoading = staffDetailsStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["detailed"] = true;
    params["staffId"] = staffId;

    store.dispatch(getStaffDetails(params));
  }, [session, status, staffId]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!staffListLoaded) {
      router.replace("/merchants/partners/staffs");
    }
  }, [staffListLoaded, router]);

  const isAcCarWash = useSelector(isCarWash);

  return (
    <Card>
      <Table>
        <Thead>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </Thead>
        <tbody>
          {staff && (
            <>
              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Name
                  </td>
                  <td>{staff?.staff?.name}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Bio
                  </td>
                  <td>{staff?.staff?.bio ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Phone
                  </td>
                  <td>{staff.phone ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Email
                  </td>
                  <td>{staff?.staff?.user?.email ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Gender
                  </td>
                  <td>{staff?.staff?.user?.gender ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Date of Birth
                  </td>
                  <td>{staff?.staff?.user?.dob ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    House No
                  </td>
                  <td>{staff?.staff?.user?.house_no ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Street Name
                  </td>
                  <td>{staff?.staff?.user?.street_name ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    City
                  </td>
                  <td>{staff?.staff?.user?.city ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Estate
                  </td>
                  <td>{staff?.staff?.user?.estate ?? "-"}</td>
                </>
              </Trow>
            </>
          )}
        </tbody>
      </Table>
    </Card>
  );
}

export default StaffBioView;

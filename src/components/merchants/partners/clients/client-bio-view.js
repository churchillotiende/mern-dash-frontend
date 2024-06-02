import { Card } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { isCarWash } from "../../../../lib/shared/roles_and_permissions";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";

function ClientBioView() {
  const router = useRouter();

  const clientId = router?.query?.clientId;
  const currentClient = useSelector((state) =>
    state.clients?.clientList?.data?.find((item) => item.id == clientId)
  );

  const clientListLoaded = useSelector(
    (state) => state.clients?.clientListStatus === "fulfilled"
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!clientListLoaded) {
      router.replace("/merchants/partners/clients");
    }
  }, [clientListLoaded, router]);

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
          {currentClient && (
            <>
              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Name
                  </td>
                  <td>{currentClient.name}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Phone
                  </td>
                  <td>{currentClient.phone ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Email
                  </td>
                  <td>{currentClient.email ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Gender
                  </td>
                  <td>{currentClient.gender ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Date of Birth
                  </td>
                  <td>{currentClient.dob ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    House No
                  </td>
                  <td>{currentClient.house_no ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Street Name
                  </td>
                  <td>{currentClient.street_name ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    City
                  </td>
                  <td>{currentClient.city ?? "-"}</td>
                </>
              </Trow>

              <Trow>
                <>
                  <td scope="row" className="text-primary font-bold">
                    Estate
                  </td>
                  <td>{currentClient.estate ?? "-"}</td>
                </>
              </Trow>

              {isAcCarWash && (
                <>
                  <Trow>
                    <>
                      <td scope="row" className="text-primary font-bold">
                        Car Model
                      </td>
                      <td>{currentClient.car_model ?? "-"}</td>
                    </>
                  </Trow>

                  <Trow>
                    <>
                      <td scope="row" className="text-primary font-bold">
                        Car Plate
                      </td>
                      <td>{currentClient.car_plate ?? "-"}</td>
                    </>
                  </Trow>

                  <Trow>
                    <>
                      <td scope="row" className="text-primary font-bold">
                        Car Series
                      </td>
                      <td>{currentClient.car_series ?? "-"}</td>
                    </>
                  </Trow>

                  <Trow>
                    <>
                      <td scope="row" className="text-primary font-bold">
                        Car Year
                      </td>
                      <td>{currentClient.car_year ?? "-"}</td>
                    </>
                  </Trow>
                </>
              )}
            </>
          )}
        </tbody>
      </Table>
    </Card>
  );
}

export default ClientBioView;

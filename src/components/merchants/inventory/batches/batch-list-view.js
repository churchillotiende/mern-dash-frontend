import { Button, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { Link } from "react-router-dom";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../../../../lib/shared/data-formatters";
import { getBatches } from "../../../../store/merchants/inventory/batches-slice";
import store from "../../../../store/store";
import Card from "../../../ui/layouts/card";
import PaginationLinks from "../../../ui/layouts/pagination-links";
import { Table, Thead, Trow } from "../../../ui/layouts/scrolling-table";
import StatelessLoadingSpinner from "../../../ui/utils/stateless-loading-spinner";
import MergeBatchesModal from "./merge-batches-modal";

export default function BatchListView() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const mergeFromId = router?.query?.merge_from_id ?? null;

  const batchStatus = useSelector((state) => state.batches.getBatchesStatus);
  const batches = useSelector((state) => state.batches.getBatches);
  const isLoading = batchStatus === "loading";

  const fromBatch =
    batches?.data?.find((item) => item.id == mergeFromId) ?? null;

  useEffect(() => {
    if (!session || status !== "authenticated" || !router.isReady) {
      return;
    }

    const sellableId = router?.query?.merge_item_id ?? null;

    const params = {};
    params["accessToken"] = session.user.accessToken;
    if (sellableId) {
      params["sellable_id"] = sellableId;
    }
    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(getBatches(params));
  }, [session, status, searchTerm, router]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;
    if (sellableId) {
      params["sellable_id"] = sellableId;
    }
    if (filter) {
      params["filter"] = searchTerm;
    }

    store.dispatch(getBatches(params));
  }

  return (
    <Card>
      <div className="flex w-full justify-end">
        <TextInput
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary text-right">
              ID NO
            </th>
            <th scope="col" className="th-primary">
              ITEM NAME
            </th>
            <th scope="col" className="th-primary text-right">
              ITEM ID
            </th>
            <th scope="col" className="th-primary text-right">
              UPDATED ON
            </th>
            <th scope="col" className="th-primary text-right">
              ACTIVATED ON
            </th>
            <th scope="col" className="th-primary text-right">
              ACTIONS
            </th>
          </tr>
        </Thead>
        <tbody>
          {!isLoading &&
            batches?.data?.map((item) => (
              <Trow key={item.id}>
                <td className="text-center">{item.id}</td>
                <td>{item?.batchedable?.sellable?.name}</td>
                <td className="text-right">{item?.batchedable?.id}</td>
                <td className="text-right">{formatDate(item.updated_at)}</td>
                <td className="text-right">
                  {item.activated_at ? formatDate(item.activated_at) : "-"}
                </td>
                <td className="py-2 pl-14 2xl:pl-4">
                  <span className="flex justify-end items-center w-full gap-2">
                    {mergeFromId && (
                      <MergeBatchesModal toBatch={item} fromBatch={fromBatch} />
                    )}

                    {!mergeFromId && (
                      <Link
                        href={`/merchants/inventory/batches?merge_from_id=${item.id}&merge_item_id=${item?.batchedable?.id}`}
                      >
                        <Button variant="outline" size="xs">
                          Merge
                        </Button>
                      </Link>
                    )}

                    {/*
                    <Link href={`/merchants/inventory/batches/${item.id}`}>
                    */}
                    <Link
                      href={`/merchants/inventory/batch-details/${item.id}`}
                    >
                      <Button variant="outline" size="xs">
                        View
                      </Button>
                    </Link>
                  </span>
                </td>
              </Trow>
            ))}
        </tbody>
      </Table>

      {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      <PaginationLinks
        paginatedData={batches}
        onLinkClicked={onPaginationLinkClicked}
      />
    </Card>
  );
}

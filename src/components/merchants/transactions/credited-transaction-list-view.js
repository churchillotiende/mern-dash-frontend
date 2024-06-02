import { Link } from "react-router-dom";
import { Fragment, useCallback, useState } from "react";
import TopHr from "../../ui/layouts/top-hr";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import LinkButton from "../../ui/actions/link-button";
import TransactionsTable from "./transactions-table";
import { fetchTransactionList } from "../../../store/merchants/transactions/transaction-list-slice";
import store from "../../../store/store";
import BreadCrumbsHeader from "../../ui/layouts/breadcrumbs-header";
import { IconChevronLeft, IconSettings } from "@tabler/icons";
import { Button } from "@mantine/core";
import LinkCrumb from "../../ui/actions/link-crumb";
import MutedCrumb from "../../ui/actions/muted-crumb";

function CreditedTransactionListView() {
  const { data: session, status } = useSession();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const transactionListStatus = useSelector(
    (state) => state.transactions.transactionListStatus
  );
  const transactionList = useSelector(
    (state) => state.transactions.transactionList
  );
  const isLoadingList = transactionListStatus === "loading";

  const transactions = transactionList?.data;
  const raw_transactions = transactionList;

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["is_credited"] = true;
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchTransactionList(params));
  }, [startDate, endDate, session, status]);

  function onPaginationLinkClicked(page) {
    if (!page || !status || !session) {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;
    params["page"] = page;
    params["is_credited"] = true;
    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    store.dispatch(fetchTransactionList(params));
  }

  const filterWithDates = useCallback((startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const breadCrumbActions = (
    <div className="flex gap-1">
      <Link href="/merchants/transactions">
        <Button
          size="xs"
          variant="outline"
          leftIcon={<IconChevronLeft size={16} />}
        >
          Back
        </Button>
      </Link>

      <Link href="/merchants/settings/transactions/credit-reminders">
        <Button
          size="xs"
          variant="outline"
          leftIcon={<IconSettings size={16} />}
        >
          Reminders
        </Button>
      </Link>
    </div>
  );

  return (
    <Fragment>
      <BreadCrumbsHeader title="Credit Sales" actions={breadCrumbActions}>
        <LinkCrumb title="Home" href="/" />
        <LinkCrumb title="Transactions" href="/merchants/transactions" />
        <MutedCrumb title="Credited" />
      </BreadCrumbsHeader>

      <div className="w-full flex flex-wrap mt-2">
        <TransactionsTable
          transactions={transactions}
          rawTransactions={raw_transactions}
          onPaginationLinkClicked={onPaginationLinkClicked}
          isLoading={isLoadingList}
          filterWithDates={filterWithDates}
        />
      </div>
    </Fragment>
  );
}

export default CreditedTransactionListView;

import { CircularProgress } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SCROOL } from "../../../config/App";
import { index } from "../../../store/actions/transactions.action";
import Header from "../../components/Header";

export default function Transactions() {
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state) => state.transactionsReducer.transactions
  );

  const [isLoading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [query, setQuery] = useState({ page: 1 });

  useEffect(() => {
    const scrollEl = document;

    scrollEl.addEventListener("scroll", handleScroll);

    return () => {
      scrollEl.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  useEffect(() => {
    _index(isLoadingMore);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (isLoadingMore) {
      setQuery({
        ...query,
        page: query.page + 1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingMore]);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } =
      event.srcElement.documentElement;
    let scroll = scrollHeight - (clientHeight + scrollTop);

    if (scroll < SCROOL) {
      if (!isLoadingMore && _handleLoadMore());
    }
  };

  const _handleLoadMore = () => {
    if (transactions.current_page < transactions.last_page) {
      setIsLoadingMore(true);
    }
  };

  const _index = (loadMore) => {
    dispatch(index(query, loadMore)).then((res) => {
      setLoading(false);
      setIsLoadingMore(false);
    });
  };

  return (
    <>
      <Header title="Transações" />

      <div className="container mt-4 pt-3">
        {isLoading ? (
          <div className="d-flex justify-content-center mt-5 pt-5">
            {" "}
            <CircularProgress />{" "}
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="font-weight-normal">Transações</h3>
             
            </div>
          </>
        )}
      </div>
    </>
  );
}

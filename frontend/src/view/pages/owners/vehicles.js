import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  CircularProgress,
  Divider,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { MdKeyboardBackspace } from "react-icons/md";
import { changeScreenB } from "../../../store/actions/navigation.action";
import { Fragment, useEffect, useState } from "react";
import { rootUrl, SCROOL } from "../../../config/App";
import { vehicles } from "../../../store/actions/owners.action";
import { FcOpenedFolder } from "react-icons/fc";

export default function OwnerVehicles(props) {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.ownersReducer.vehicles);

  const [isLoading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [query, setQuery] = useState({
    page: 1,
    owner_id: props.uid || null,
  });

  useEffect(() => {
    const scrollEl = document.getElementById("scroll");

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
    let scrollTop =
      event.srcElement.scrollHeight -
      (event.srcElement.offsetHeight + event.srcElement.scrollTop);

    if (scrollTop < SCROOL) {
      if (!isLoadingMore && _handleLoadMore());
    }
  };

  const _handleLoadMore = () => {
    if (list.current_page < list.last_page) {
      setIsLoadingMore(true);
    }
  };

  const _index = (loadMore) => {
    dispatch(vehicles(query, loadMore)).then((res) => {
      setLoading(false);
      setIsLoadingMore(false);
    });
  };

  return (
    <>
      <AppBar position="absolute">
        <Toolbar>
          <IconButton
            onClick={() => dispatch(changeScreenB({ open: false }))}
            edge="start"
            color="inherit"
          >
            <MdKeyboardBackspace />
          </IconButton>

          <Typography variant="h6" color="inherit">
            Veículos
          </Typography>
        </Toolbar>
      </AppBar>

      <div id="scroll" className="scroll">
        {isLoading ? (
          <div className="d-flex justify-content-center mt-5 pt-5">
            <CircularProgress />
          </div>
        ) : (
          <>
            {list.data.length > 0 && (
              <div className="card-body">
                <h6 className="m-0">
                  {list.total}{" "}
                  {list.total > 1
                    ? "veículos encontrados"
                    : "veículo encontrado"}
                </h6>
              </div>
            )}

            {list.data.length < 1 && (
              <div className="text-center mt-5 mb-5 pt-5 pb-5">
                <span className="mt-4 text-muted">
                  <FcOpenedFolder size="70" />
                  <h6 className="mt-4 text-muted">Nenhum veículo encontrado</h6>
                </span>
              </div>
            )}

            {list.data.map((item, index) => (
              <Fragment key={index}>
                <div className="card-body d-flex">
                  <div className="vehicle-img d-flex justify-content-center align-items-center">
                    {item.cover && (
                      <img
                        alt=""
                        className="shadow rounded"
                        src={
                          rootUrl +
                          "thumb/vehicles/" +
                          item.cover.img +
                          "?u=" +
                          item.cover.user_id +
                          "&s=" +
                          item.cover.vehicle_id +
                          "&w=180&h=135"
                        }
                      />
                    )}
                  </div>

                  <div className="vehicle-detail pl-3 pl-md-4">
                    <h6>
                      {item.vehicle_brand.label} {item.vehicle_model.label}
                    </h6>
                    <strong className="d-block">
                      {item.vehicle_version.label}
                    </strong>
                    {item.vehicle_price && (
                      <strong className="text-danger h5 d-block">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.vehicle_price)}
                      </strong>
                    )}

                    <button className="btn btn-light mt-2">Visualizar</button>
                  </div>
                </div>

                <Divider />
              </Fragment>
            ))}

            {isLoadingMore && (
              <div className="text-center card-body">
                <CircularProgress />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

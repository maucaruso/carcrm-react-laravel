import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { index } from "../../../store/actions/vehicles.action";
import Header from "../../components/Header";
import { SCROOL, rootUrl } from "../../../config/App";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { FaPlus } from "react-icons/fa";

export default function Vehicles() {
  const dispatch = useDispatch();
  const vehicles = useSelector((state) => state.vehiclesReducer.vehicles);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [query, setQuery] = useState({ page: 1 });
  const [state, setState] = useState({
    isDeleted: null,
    menuEl: null,
    confirmEl: null,
  });

  const _index = (loadMore) => {
    dispatch(index(query, loadMore)).then((res) => {
      if (res) {
        setLoading(false);
        if (isLoadingMore && setIsLoadingMore);
      }
    });
  };

  const _handleLoadMore = () => {
    if (vehicles.current_page < vehicles.last_page) {
      setQuery(
        {
          ...query,
          page: query.page + 1,
        },
        () => {
          _index(true);
        }
      );
    }
  };

  const _handleScroll = (event) => {
    let scrollTop =
      event.srcElement.body.scrollHeight -
      (event.srcElement.body.offsetHeight +
        EventTarget.srcElement.body.scrollTop);

    if (scrollTop < SCROOL) {
      if (!isLoadingMore && _handleLoadMore());
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", _handleScroll);
    _index();
  }, []);

  return (
    <>
      <Header title="Veículos" />

      <div className="container mt-4 pt-3">
        {isLoading ? (
          <div className="d-flex justify-content-center mt-5 pt-5">
            {" "}
            <CircularProgress />{" "}
          </div>
        ) : (
          <>
            <div className="d-flex mb-4">
              <h3 className="font-weight-normal">Veículos</h3>
              <Link to="/vehicles/create" className="ml-auto">
                <Button variant="contained" color="primary" size="large">
                  <FaPlus size="1.5em" className="mr-2" />
                  Cadastrar
                </Button>
              </Link>
            </div>

            <div className="card">
              {vehicles.data.length > 0 && (
                <div className="card-header">
                  <h6 className="m-0">resultados: {vehicles.total}</h6>
                </div>
              )}

              <div className="p-2 p-md-3">
                {vehicles.data.map((item, index) => (
                  <Fragment key={index}>
                    <div className="d-md-flex">
                      <div className="d-flex">
                        <div className="vehicle-img d-flex justify-content-center align-items-center">
                          {state.isDeleted === item.id ? (
                            <CircularProgress color="secondary" />
                          ) : (
                            item.cover && (
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
                            )
                          )}
                        </div>
                        
                        <div className="vehicle-detail pl-3 pl-md-4">
                          <h6>{item.vehicle_brand.label} {item.vehicle_model.label}</h6>
                          <strong className="d-block">{item.vehicle_version.label}</strong>
                          {(item.vehicle_price) &&
                            <strong className="text-danger h5 d-block">
                              {new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(item.vehicle_price)}
                            </strong>
                          }
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

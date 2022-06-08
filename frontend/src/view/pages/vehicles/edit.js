import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
} from "@material-ui/core";
import Header from "../../components/Header";
import {
  store,
  show,
  change,
  cep,
  brand,
  model,
  version,
} from "../../../store/actions/vehicles.action";
import MaskedInput from "react-text-mask";

const TextMaskCustom = (props) => {
  const { inputRef, ...other } = props;
  let mask = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/];

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={mask}
      guide={false}
    />
  );
};

export default function VehicleEdit(props) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.vehiclesReducer);

  const [state, setState] = useState({
    isLoading: true,
    isLoadingCep: false,
    isDeleted: null,
    redirect: false,
    tips: 0,
    confirmEl: null,
    vehicle_id: props.match?.params?.id ? props.match.params.id : null,
  });

  useEffect(() => {
    index();
  }, []);

  const index = () => {
    if (state.vehicle_id) {
      dispatch(show(state.vehicle_id)).then((res) => {
        if (res) {
          setState({ isLoading: false });
        }
      });
    } else {
      dispatch(store()).then((res) => {
        if (res) {
          setState({ isLoading: false });
        }
      });
    }
  };

  return (
    <>
      <Header title="Veículos - gestão" />
      <div className="container mt-4 pt-3">
        {state.isLoading ? (
          <div className="d-flex justify-content-center mt-5 pt-5">
            {" "}
            <CircularProgress />{" "}
          </div>
        ) : (
          <div className="row">
            <div className="col-md-7">
              <h3 className="font-weight-normal mb-4">
                Localização do Veículo
              </h3>

              <div className="card card-body">
                <div className="row">
                  <div className="col-md-7  form-group">
                    <label htmlFor="" className="label-custom">
                      CEP
                    </label>
                    <TextField
                      style={state.isLoadingCep ? { opacity: 0.5 } : {}}
                      error={data.error.zipCode && true}
                      type="tel"
                      InputProps={{
                        inputComponent: TextMaskCustom,
                        value: data.vehicle.zipCode,
                        onChange: (text) => {
                          dispatch(change({ zipCode: text.target.value }));

                          if (text.target.value.length > 8) {
                            setState({ isLoadingCep: true });
                            dispatch(cep(text.target.value)).then(
                              (res) => res && setState({ isLoadingCep: false })
                            );
                            if (data.error.zipCode) {
                              delete data.error.zipCode;
                              delete data.error.uf;
                              delete data.error.city;
                            }
                          }
                        },
                        endAdornment: (
                          <InputAdornment position="start">
                            {state.isLoadingCep ? (
                              <CircularProgress size={32} />
                            ) : (
                              <></>
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                    {data.error.zipCode && (
                      <strong className="text-danger">
                        {data.error.zipCode}
                      </strong>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-9 form-group">
                    <label className="label-custom">CIDADE</label>

                    <TextField
                      error={data.error.city && true}
                      disabled
                      value={data.vehicle.city || ""}
                    />
                    {data.error.city && (
                      <strong className="text-danger">
                        {data?.error?.city[0]}
                      </strong>
                    )}
                  </div>
                  <div className="col-md-3 form-group">
                    <label className="label-custom">UF</label>

                    <TextField
                      error={data.error.uf && true}
                      disabled
                      value={data.vehicle.uf || ""}
                    />
                    {data.error.uf && (
                      <strong className="text-danger">
                        {data?.error?.uf[0]}
                      </strong>
                    )}
                  </div>
                </div>
              </div>

              <h3 className="font-weight-normal mt-4 mb-4">Dados do Veículo</h3>
              <div className="card card-body">
                <div className="form-group">
                  <label className="label-custom">CATEGORIA</label>
                  <Select
                    error={data.error.vehicle_type && true}
                    value={data.vehicle.vehicle_type || ""}
                    onChange={(event) => {
                      dispatch(
                        change({
                          vehicle_type: event.target.value,
                          vehicle_brand: null,
                          vehicle_model: null,
                          vehicle_version: null,
                          vehicle_gearbox: null,
                          vehicle_fuel: null,
                          vehicle_steering: null,
                          vehicle_motorpower: null,
                          vehicle_doors: null,
                        })
                      );
                      dispatch(brand(event.target.value));
                      if (data.error.vehicle_type) {
                        delete data.error.vehicle_type;
                      }
                    }}
                  >
                    {data.vehicle_types.map((item) => (
                      <MenuItem key={item.id} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>

                  {data.error.vehicle_type && (
                    <strong className="text-danger">
                      {data?.error?.vehicle_type[0]}
                    </strong>
                  )}
                </div>

                <div className="form-group">
                  <label className="label-custom">MARCAS</label>

                  <Select
                    error={data.error.vehicle_brand && true}
                    value={data.vehicle.vehicle_brand || ""}
                    onChange={(event) => {
                      dispatch(
                        change({
                          vehicle_brand: event.target.value,
                          vehicle_model: null,
                          vehicle_version: null,
                        })
                      );
                      dispatch(
                        model(data.vehicle.vehicle_type, event.target.value)
                      );

                      if (data.error.vehicle_brand) {
                        delete data.error.vehicle_brand;
                      }
                    }}
                  >
                    {data.vehicle_brand.map((item) => (
                      <MenuItem key={item.id} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>

                  {data.error.vehicle_brand && (
                    <strong className="text-danger">
                      {data?.error?.vehicle_brand[0]}
                    </strong>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="label-custom">MODELO</label>
                    <Select
                      error={data.error.vehicle_model && true}
                      value={data.vehicle.vehicle_model || ""}
                      onChange={(event) => {
                        dispatch(
                          change({
                            vehicle_model: event.target.value,
                            vehicle_version: null,
                          })
                        );
                        dispatch(
                          version(
                            data.vehicle.vehicle_brand,
                            event.target.value
                          )
                        );

                        if (data.error.vehicle_model) {
                          delete data.error.vehicle_model;
                        }
                      }}
                    >
                      {data.vehicle_model?.map((item) => (
                        <MenuItem key={item.id} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>

                    {data.error.vehicle_model && (
                      <strong className="text-danger">
                        {data?.error?.vehicle_model[0]}
                      </strong>
                    )}
                  </div>

                  <div className="col-md-6 form-group">
                    <label className="label-custom">ANO DO MODELO</label>
                    <Select
                      error={data.error.vehicle_regdate && true}
                      value={data.vehicle.vehicle_regdate || ""}
                      onChange={(event) => {
                        dispatch(
                          change({ vehicle_regdate: event.target.value })
                        );
                        if (data.error.vehicle_regdate) {
                          delete data.error.vehicle_regdate;
                        }
                      }}
                    >
                      {data.regdate?.map((item) => (
                        <MenuItem key={item.id} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>

                    {data.error.vehicle_regdate && (
                      <strong className="text-danger">
                        {data?.error?.vehicle_regdate[0]}
                      </strong>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="label-custom">VERSÃO</label>

                  <Select
                    error={data.error.vehicle_version && true}
                    value={data.vehicle.vehicle_version || ""}
                    onChange={(event) => {
                      dispatch(change({ vehicle_version: event.target.value }))
                      if (data.error.vehicle_version) {
                        delete data.error.vehicle_version;
                      }
                    }}
                  >
                    {data.vehicle_version?.map((item) => (
                      <MenuItem key={item.id} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>

                  {data.error.vehicle_version && (
                    <strong className="text-danger">
                      {data?.error?.vehicle_version[0]}
                    </strong>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-5"></div>
          </div>
        )}
      </div>
    </>
  );
}

import { Button, Divider, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { zonedTimeToUtc } from "date-fns-tz";
import { MdCheck } from "react-icons/md";

export default function Account() {
  const dispatch = useDispatch();
  const app = useSelector((state) => state.appReducer.app);

  return (
    <div className="container mt-4 pt-3">
      <h3>Minha conta</h3>

      <div className="card">
        <div className="card-body text-center">
          <h4 className="text-uppercase font-weight-bold mt-2 mb-0">
            {app.plan.title}
          </h4>
        </div>

        <Divider />

        <div className="card-body text-center">
          <h5>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(app.plan.price)}
            <span className="badge badge-success ml-2">
              {app.plan.discount}
            </span>
          </h5>
          <label>Equivalente a</label>
          <h3 className="mt-2 mb-4 h1">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(app.plan.equivalent)}
            <span className="btn-sm p-0">/mês</span>
          </h3>
        </div>

        <Divider />

        <div className="card-body text-center pt-3">
          <p className="label-custom text-uppercase mt-md-4 text-info">
            Próximo vencimento
          </p>

          <Typography variant="h5" className="mb-5 font-weight-bold">
            {format(
              zonedTimeToUtc(app.expira, "America/Sao_paulo"),
              "dd 'de' MMMM 'de' yyyy",
              { locale: pt }
            )}
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            className="mb-4 font-weight-bold"
            startIcon={<MdCheck />}
          >
            Pagamento efetuado
          </Button>
        </div>
      </div>
    </div>
  );
}

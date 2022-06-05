import { TextField, Typography, Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { change, login } from "../../../store/actions/auth.action";
import { withStyles } from "@material-ui/core/styles";

const RegisterButton = withStyles({
  root: {
    color: "#fff",
    backgroundColor: "#28a745",
    "&:hover": {
      backgroundColor: "#218838",
      color: "#fff",
    },
  },
})(Button);

export default function Auth() {
  const dispatch = useDispatch();
  const { credentials, success } = useSelector((state) => state.authReducer);

  return (
    <div className="d-flex bg-white min-vh-100 align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="form-group text-center">
              <img src="/logo.png" alt="CAR CRM" height="54px" />
              <Typography className="mt-3 mb-3" variat="h6" component="h1">
                Plataforma para Revenda de Veículos
              </Typography>

              <TextField
                label="email"
                type="email"
                autoComplete="email"
                value={credentials.email}
                onChange={(text) =>
                  dispatch(change({ email: text.target.value }))
                }
                margin="normal"
              />

              <TextField
                label="password"
                type="password"
                value={credentials.password}
                onChange={(text) =>
                  dispatch(change({ password: text.target.value }))
                }
                margin="normal"
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                className="mt-4 md-4"
                onClick={() => dispatch(login(credentials))}
              >
                Entrar
              </Button>

              <RegisterButton
                component={Link}
                to="/register"
                variant="contained"
                fullWidth
                size="large"
                className="mt-4"
              >
                Cadastrar
              </RegisterButton>

              {success && <Navigate to="/vehicles" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

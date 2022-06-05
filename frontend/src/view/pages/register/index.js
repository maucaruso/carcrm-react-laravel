import { TextField, Typography, Button } from "@material-ui/core";
import { Link, Navigate } from 'react-router-dom';
import { change, register } from "../../../store/actions/register.action";
import { useDispatch, useSelector } from "react-redux";

export default function Register() {
  const dispatch = useDispatch();
  const { user, error, success } = useSelector(
    (state) => state.registerReducer
  );

  return (
    <div className="d-flex bg-white min-vh-100 align-items-center">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-4">
            <div className="form-group text-center">
              <img src="/logo.png" height="54" alt="CAR CRM" />
              <Typography component="h1" variant="h6" className="mt-3">
                Crie sua conta teste grátis!
              </Typography>
            </div>

            <TextField
              onError={error.name && true}
              margin="normal"
              label="Nome"
              value={user.name}
              onChange={(text) => {
                dispatch(change({ name: text.target.value }));
                if (error.name && delete error.name);
              }}
            />
            {error.name && (
              <strong className="text-danger">{error.name[0]}</strong>
            )}

            <TextField
              onError={error.email && true}
              margin="normal"
              label="E-mail"
              value={user.email}
              type="email"
              autoComplete="email"
              onChange={(text) => {
                dispatch(change({ email: text.target.value }));
                if (error.email && delete error.email);
              }}
            />
            {error.email && (
              <strong className="text-danger">{error.email[0]}</strong>
            )}

            <TextField
              onError={error.password && true}
              margin="normal"
              label="Senha"
              value={user.password}
              type="password"
              onChange={(text) => {
                dispatch(change({ password: text.target.value }));
                if (error.password && delete error.password);
              }}
            />
            {error.password && (
              <strong className="text-danger">{error.password[0]}</strong>
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              className="mt-4 mb-4"
              onClick={() => dispatch(register(user))}
            >
              Avançar
            </Button>

            <div className="text-center">
              <Link to="/login" className="mt-4 text-muted">
                Fazer Login
              </Link>
            </div>

            {(success &&
              <Navigate to="/vehicles" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

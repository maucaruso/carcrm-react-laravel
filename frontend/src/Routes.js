import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes as ReactRoutes,
  Route,
} from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

const Auth = lazy(() => import("./view/pages/auth"));
const Register = lazy(() => import("./view/pages/register"));
const Vehicles = lazy(() => import("./view/pages/vehicles"));
const VehicleEdit = lazy(() => import("./view/pages/vehicles/edit"));
const Pay = lazy(() => import("./view/pages/pay"));
const Transactions = lazy(() => import("./view/pages/transactions"));
const TransactionShow = lazy(() => import("./view/pages/transactions/show"));
const Steps = lazy(() => import("./view/pages/steps"));

const Routes = () => (
  <Router>
    <Suspense
      fallback={
        <div className="d-flex justify-content-center  mt-5 pt-5">
          <CircularProgress />
        </div>
      }
    >
      <ReactRoutes>
        <Route exact path="/vehicles" element={<Vehicles />} />
        <Route exact path="/vehicles/create" element={<VehicleEdit />} />
        <Route exact path="/vehicles/:id/edit" element={<VehicleEdit />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pay" element={<Pay />} />
        <Route exact path="/transactions" element={<Transactions />} />
        <Route path="/transactions/:id" element={<TransactionShow />} />
        <Route exact path="/" element={<Steps />} />
      </ReactRoutes>
    </Suspense>
  </Router>
);

export default Routes;

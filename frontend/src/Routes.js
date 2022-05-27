import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes as ReactRoutes, Route } from "react-router-dom"; 
import { CircularProgress } from "@material-ui/core";
import Auth from './view/auth';

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
        <Route exact path="/vehicles" element={<h1>Olá mundo</h1>} />
        <Route exact path="/" element={<Auth />} />
        <Route exact path="/login" element={<Auth />} />
      </ReactRoutes>
    </Suspense>
  </Router>
);

export default Routes;

import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes as ReactRoutes, Route } from "react-router-dom"; 
import { CircularProgress } from "@material-ui/core";

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
        <Route exact path="/" element={<h1>Home</h1>} />
      </ReactRoutes>
    </Suspense>
  </Router>
);

export default Routes;

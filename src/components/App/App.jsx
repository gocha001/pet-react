import { Routes, Route } from "react-router-dom";
import Layout from "../Layout.jsx";
import HomePage from "../../pages/HomePage/HomePage.jsx";
import {
  useDispatch,
  useSelector
} from "react-redux";
import { useEffect } from "react";
import { refresh } from "../../redux/auth/operations.js";
import { selectIsRefreshing } from "../../redux/auth/selectors.js";
import Loader from "../Loader/Loader.jsx";
import { PrivateRoute } from "../PrivateRoute.jsx";
import { RestrictedRoute } from "../RestrictedRoute.jsx";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";

const NotFound = lazy(() => import("../../pages/NotFound/NotFound.jsx"));
const RegistrationPage = lazy(() =>
  import("../../pages/RegistrationPage/RegistrationPage.jsx")
);
const LoginPage = lazy(() => import("../../pages/LoginPage/LoginPage.jsx"));
const ContactsPage = lazy(() =>
  import("../../pages/ContactsPage/ContactsPage.jsx")
);

const App = () => {
const isRefreshing = useSelector(selectIsRefreshing);

  const dispatch = useDispatch();

  useEffect(() => {
    const initialize = async () => {
      try {
        await dispatch(refresh());
      } catch (error) {
        console.error("Error during refresh:", error);
      }
    };
    initialize();
  }, [dispatch]);

  return isRefreshing ? (
    <Loader />
  ) : (
    <Suspense fallback={<Loader />}>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path="register"
            element={
              <RestrictedRoute
                component={<RegistrationPage />}
                redirectTo="/contacts"
              />
            }
          />
          <Route
            path="login"
            element={
              <RestrictedRoute
                component={<LoginPage />}
                redirectTo="/contacts"
              />
            }
          />
          <Route
            path="contacts"
            element={
              <PrivateRoute component={<ContactsPage />} redirectTo="/login" />
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;

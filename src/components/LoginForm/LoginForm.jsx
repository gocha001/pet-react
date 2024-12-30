import css from "./LoginForm.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { login } from "../../redux/auth/operations";
import { slideInFromLeft, slideInFromTop } from "../motion/motion";
import { motion } from "framer-motion";

const LoginForm = () => {
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = (values, options) => {
    dispatch(login(values));
    options.resetForm();
  };

  const orderSchema = Yup.object().shape({
    email: Yup.string().email("Must be a valid email!").required("Required"),
    password: Yup.string()
      .min(5, "Too Short!")
      .max(10, "Too Long!")
      .required("Required"),
  });

  return (
    <div className={css.wrapper}>
      <div className={css.title}>
        <motion.h1
          variants={slideInFromTop()}
          initial="hidden"
          animate="visible"
          className={css.content}
        >
          Login now!
        </motion.h1>
      </div>
      <motion.div
        variants={slideInFromLeft()}
        initial="hidden"
        animate="visible"
        className={css.container}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={orderSchema}
        >
          <Form>
            <div>
              <label>
                <span>Email</span>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className={css.field}
                />
                <ErrorMessage
                  name="email"
                  component="span"
                  className={css.error}
                />
              </label>
            </div>
            <div>
              <label>
                <span>Password</span>
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className={css.field}
                />
                <ErrorMessage
                  name="password"
                  component="span"
                  className={css.error}
                />
              </label>
            </div>
            <div>
              <button className={css.btn} type="submit">
                Login
              </button>
            </div>
            <NavLink
              to="/registed"
              className={({ isActive }) => (isActive ? css.active : css.link)}
            >
              Don`t have account? Register
            </NavLink>
          </Form>
        </Formik>
      </motion.div>
    </div>
  );
};

export default LoginForm;

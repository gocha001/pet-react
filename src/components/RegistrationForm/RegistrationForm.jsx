import css from "./RegistrationForm.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { register } from "../../redux/auth/operations";
import { slideInFromLeft, slideInFromTop } from "../motion/motion";
import { motion } from "framer-motion";

const RegistrationForm = () => {
  const dispatch = useDispatch();

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const onSubmit = (values, options) => {
    dispatch(register(values));
    console.log(values);
    options.resetForm();
  };

  const orderSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(20, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Must be a valid email!").required("Required"),
    password: Yup.string()
      .min(3, "Too Short!")
      .max(20, "Too Long!")
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
          Registration
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
                <span>Name</span>
                <Field
                  name="name"
                  type="text"
                  placeholder="Enter a name"
                  className={css.field}
                />
                <ErrorMessage
                  name="name"
                  component="span"
                  className={css.error}
                />
              </label>
            </div>
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
                Registration
              </button>
            </div>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? css.active : css.link)}
            >
              Have account? Login
            </NavLink>
          </Form>
        </Formik>
      </motion.div>
    </div>
  );
};

export default RegistrationForm;

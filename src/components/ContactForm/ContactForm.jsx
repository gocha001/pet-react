import css from "./ContactForm.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addContact } from "../../redux/contacts/operations.js";
import { motion } from "framer-motion";
import { slideInFromBot } from "../motion/motion.js";

const ContactForm = () => {
  const dispatch = useDispatch();

  const onSubmit = (values, options) => {
    dispatch(addContact(values));
    options.resetForm();
  };

  const initialValues = {
    name: "",
    phoneNumber: "",
    email: "",
    isFavourite: "",
    contactType: "",
  };

  const orderSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    phoneNumber: Yup.string()
      .min(3, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string()
      .email("Must be a valid email!")
      .required("Required"),
    isFavourite: Yup.string(),
    contactType: Yup.string()
      .required("Required"),
  });

  return (
    <motion.div
      variants={slideInFromBot()}
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
          <label className={css.label}>
            <span>Name</span>
            <Field
              className={css.field}
              name="name"
              placeholder="Enter a name"
            />
            <ErrorMessage name="name"
              component="span"
              className={css.error}
            />
          </label>
          <label className={css.label}>
            <span>Number</span>
            <Field
              className={css.field}
              name="phoneNumber"
              placeholder="Enter a number"
            />
            <ErrorMessage
              name="phoneNumber"
              component="span"
              className={css.error}
            />
          </label>
          <label className={css.label}>
            <span>Email</span>
            <Field
              className={css.field}
              name="email"
              placeholder="Enter a email"
            />
            <ErrorMessage name="email" component="span" className={css.error} />
          </label>
          <h3 id="contact-group">Contact type</h3>
          <div role="group" aria-labelledby="contact-group" className={css.div}>
            <label>
              <Field type="radio" name="contactType" value="work" />
              Work
            </label>
            <label>
              <Field type="radio" name="contactType" value="home" />
              Home
            </label>
            <label>
              <Field type="radio" name="contactType" value="personal" />
              Personal
            </label>
          </div>
          <ErrorMessage
            name="contactType"
            component="span"
            className={css.error}
          />
          <h3 id="favourite-group">Favourite</h3>
          <div
            role="group"
            aria-labelledby="favourite-group"
            className={css.div}
          >
            <label>
              <Field type="radio" name="isFavourite" value="true" />
              True
            </label>
            <label>
              <Field type="radio" name="isFavourite" value="false" />
              False
            </label>
          </div>
          <ErrorMessage
            name="isFavourite"
            component="span"
            className={css.error}
          />
          <button className={css.btn} type="submit">
            Add contact
          </button>
        </Form>
      </Formik>
    </motion.div>
  );
};

export default ContactForm;

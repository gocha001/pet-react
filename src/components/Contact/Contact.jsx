import css from "./Contact.module.css";
import { RiUser3Fill } from "react-icons/ri";
import { PiPhoneFill } from "react-icons/pi";
import { MdEmail } from "react-icons/md";
import { FiType } from "react-icons/fi";
import { MdOutlineFavorite } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  deleteContact,
  patchContact,
} from "../../redux/contacts/operations.js";
import { useState } from "react";
import Modal from "../Modal/Modal.jsx";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";

const Contact = ({ id, name, number, email, contactType, isFavourite }) => {
  
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [isOpenR, setIsOpenR] = useState(false);
  const openModalR = () => setIsOpenR(true);
  const closeModalR = () => setIsOpenR(false);

  const handleDelete = () => {
    dispatch(deleteContact(id));
    closeModal();
  };

  const onSubmit = (values, options) => {
    dispatch(patchContact({ values, id }));
    options.resetForm();
    closeModalR();
  };

  const initialValues = {
    name: name,
    phoneNumber: number,
    email: email,
    contactType: contactType,
    isFavourite: isFavourite + "",
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
      .min(10, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    isFavourite: Yup.string().oneOf(["true", "false"]),
    contactType: Yup.string().required("Required"),
  });

  return (
    <>
      <div className={css.container}>
        <div className={css.contact}>
          <div className={css.item}>
            <RiUser3Fill className={css.icon} size="24" />
            <p>{name}</p>
          </div>
          <div className={css.item}>
            <PiPhoneFill className={css.icon} size="24" />
            <p>{number}</p>
          </div>
          <div className={css.item}>
            <MdEmail className={css.icon} size="24" />
            <p>{email}</p>
          </div>
          <div className={css.item}>
            <FiType className={css.icon} size="24" />
            <p>{contactType}</p>
          </div>
          <div className={css.item}>
            <MdOutlineFavorite className={css.icon} size="24" />
            <p>{isFavourite + ""}</p>
          </div>
        </div>
        <div className={css.contBtn}>
          <button onClick={openModalR} className={css.btn}>
            Edit
          </button>
          <button onClick={openModal} className={css.btn}>
            Delete
          </button>
        </div>
      </div>
      <div>
        {isOpen && (
          <Modal onClose={closeModal}>
            <p className={css.text}>Do you want to delete a contact {name} ?</p>
            <div className={css.contBtn}>
              <button onClick={handleDelete} className={css.modalBtn}>
                Yes
              </button>
              <button onClick={closeModal} className={css.modalBtn}>
                No
              </button>
            </div>
          </Modal>
        )}
      </div>
      <div>
        {isOpenR && (
          <Modal onClose={closeModalR}>
            <div className={css.formContainer}>
              <div className={css.modalTitle}>
                <p>Edit contact</p>
              </div>
              <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={orderSchema}
              >
                <Form>
                  <label>
                    <span>Name</span>
                    <Field className={css.field} name="name" />
                    <ErrorMessage
                      name="name"
                      component="span"
                      className={css.error}
                    />
                  </label>
                  <label>
                    <span>Number</span>
                    <Field className={css.field} name="phoneNumber" />
                    <ErrorMessage
                      name="phoneNumber"
                      component="span"
                      className={css.error}
                    />
                  </label>
                  <label className={css.label}>
                    <span>Email</span>
                    <Field className={css.field} name="email" />
                    <ErrorMessage
                      name="email"
                      component="span"
                      className={css.error}
                    />
                  </label>
                  <h3 id="contact-group">Contact type</h3>
                  <div
                    role="group"
                    aria-labelledby="contact-group"
                    className={css.div}
                  >
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
                  <button className={css.btnForm} type="submit">
                    Save the contact
                  </button>
                </Form>
              </Formik>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default Contact;

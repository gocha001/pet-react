import css from "./ContactsPage.module.css";
import ContactForm from "../../components/ContactForm/ContactForm.jsx";
import SearchBox from "../../components/SearchBox/SearchBox.jsx";
import ContactList from "../../components/ContactList/ContactList.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchContacts } from "../../redux/contacts/operations.js";
import {
  selectLoading,
  selectError,
  selectContacts,
} from "../../redux/contacts/selectors.js";
import Loader from "../../components/Loader/Loader.jsx";
import Error from "../../components/Error/Error.jsx";
import { motion } from "framer-motion";
import { slideInFromTop } from "../../components/motion/motion.js";
import ScrollUp from '../../components/ScrollUp/ScrollUp.jsx';
import { selectIsRefreshing } from "../../redux/auth/selectors.js";

function ContactsPage() {
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const contacts = useSelector(selectContacts);
  const [scr, setScr] = useState(0);
  const isRefreshing = useSelector(selectIsRefreshing);

  window.onscroll = () => {
    if (window.scrollY > 400) {
      setScr(1);
    } else {
      setScr(0);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (isRefreshing === false) {
      dispatch(fetchContacts());
    };
  });
  

  return (
    <>
      <div className={css.container}>
        <motion.h1
          variants={slideInFromTop(1)}
          initial="hidden"
          animate="visible"
          className={css.title}
        >
          Contact book
        </motion.h1>
        <ContactForm />
        {loading && <Loader />}
        {error && <Error />}
        {contacts.length ? (
          <SearchBox />
        ) : (
          <p className={css.note}>You have no saved contacts yet.</p>
        )}
        <ContactList />
        {!!scr && <ScrollUp />}
      </div>
    </>
  );
}

export default ContactsPage;

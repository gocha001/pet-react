import css from "./ContactList.module.css";
import Contact from "../Contact/Contact.jsx";
import { selectFilteredContacts } from "../../redux/contacts/selectors.js";
import { useSelector } from "react-redux";

const ContactList = () => {
  const contacts = useSelector(selectFilteredContacts);

  const inAlphabeticalOrder = contacts.toSorted((firstContact, secondContact) =>
    firstContact.name
      .toLowerCase()
      .trim()
      .localeCompare(secondContact.name.toLowerCase().trim())
  );

  return (
    <div className={css.container}>
      <ul>
        {inAlphabeticalOrder.map((contact) => {
          return (
            <li key={contact._id}>
              <Contact
                id={contact._id}
                name={contact.name}
                number={contact.phoneNumber}
                email={contact.email}
                contactType={contact.contactType}
                isFavourite={contact.isFavourite}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ContactList;

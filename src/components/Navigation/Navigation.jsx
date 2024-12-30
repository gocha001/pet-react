import css from "./Navigation.module.css";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <div className={css.wrapper}>
      <div className={css.home}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? css.active : css.link)}
        >
          Home
        </NavLink>
      </div>

      <div>
        <NavLink
          to="contacts"
          className={({ isActive }) => (isActive ? css.active : css.link)}
        >
          Contacts
        </NavLink>
      </div>
    </div>
  );
};

export default Navigation;

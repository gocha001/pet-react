import { useDispatch } from "react-redux";
import { logout } from "../../redux/auth/operations";
import css from "./UserMenu.module.css";
// import { useSelector } from "react-redux";
// import { selectUser } from "../../redux/auth/selectors";

const UserMenu = () => {
// const user = useSelector(selectUser);

  const dispatch = useDispatch();

  return (
    <div className={css.wrapper}>
      <button onClick={() => dispatch(logout())} className={css.btn}>
        Exit
      </button>
    </div>
  );
};

export default UserMenu;

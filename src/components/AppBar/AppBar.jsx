
import css from "./AppBar.module.css";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from '../../redux/auth/selectors';
import Navigation from "../Navigation/Navigation";
import AuthNav from "../AuthNav/AuthNav";
import UserMenu from "../UserMenu/UserMenu";
import { selectUser } from "../../redux/auth/selectors";

const AppBar = () => {
  
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <div className={css.app}>
      <Navigation />
      {user.name && <div className={css.user}>Welcome, {user.name}</div>}
      <div className={css.links}>
        {!isLoggedIn && <AuthNav />}
        {isLoggedIn && <UserMenu />}
      </div>
    </div>
  );
};

 export default AppBar;

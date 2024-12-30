import defaultImg from "../../assets/notFound.png";
import css from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={css.notFound}>
      <img src={defaultImg} />
    </div>
  );
};

export default NotFound;

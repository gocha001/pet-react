import css from "./Error.module.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const Error = () => {
  return (
    <div className={css.error}>
      {iziToast.error({
        timeout: 5000,
        title: `Error`,
        message: `Oops... Something went wrong...Try again.`,
        position: "topRight",
        transitionIn: "bounceInDown",
      })}
    </div>
  );
};

export default Error;

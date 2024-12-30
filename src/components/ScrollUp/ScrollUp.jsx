import css from "./ScrollUp.module.css";
import { RxThickArrowUp } from "react-icons/rx";

const ScrollUp = () => {
  const handleScroll = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <button className={css.btnScroll} onClick={handleScroll}>
        <RxThickArrowUp className={css.iconScroll} />
      </button>
    </div>
  );
};

export default ScrollUp;

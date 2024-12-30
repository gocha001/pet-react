import css from "./SearchBox.module.css";
import { changeFilter } from "../../redux/filters/slice.js";
import { useDispatch } from "react-redux";
import { slideInFromRight } from "../motion/motion.js";
import { motion } from "framer-motion";

const SearchBox = () => {
  const dispatch = useDispatch();

  return (
    <motion.div
      variants={slideInFromRight(1.5)}
      initial="hidden"
      animate="visible"
      className={css.container}
    >
      <label>Search contacts by name or phone number</label>
      <input
        type="text"
        placeholder="Enter a name or number"
        onChange={(e) => dispatch(changeFilter(e.target.value))}
      />
    </motion.div>
  );
};

export default SearchBox;

import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";
import css from "./RegistrationPage.module.css";

const RegistrationPage = () => {
  return (
    <div className={css.wrapper}>
      <RegistrationForm />
    </div>
  );
};

export default RegistrationPage;

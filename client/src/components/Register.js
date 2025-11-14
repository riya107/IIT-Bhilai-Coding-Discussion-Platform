import { Modal } from "reactstrap";
import LogIn from "./register/LogIn";

import { Toggle_Foucs, Toggle_modal } from "./../actions/ToggleActions";
import { connect } from "react-redux";
import SignUp from "./register/SignUp";
const Register = ({ Toggle, Toggle_modal, Toggle_Foucs }) => {
  const externalCloseBtn = (
    <button
      className="close text-light"
      style={{ position: "absolute", top: "15px", right: "15px", textDecoration: "none", border: "none", background: "none" }}
      onClick={Toggle_modal}
    >
      <i className="fa fa-times fa-2x" aria-hidden="true" />
    </button>
  );

  return (
    <Modal
      isOpen={Toggle.modal}
      toggle={Toggle_modal}
      centered
      backdrop="static"
      external={externalCloseBtn}
      color="white"
    >
      <div className="loginmodal">
        <div className="logToggler">
          <button
            style={signupStyle[Toggle.focus * 1]}
            onClick={() => Toggle_Foucs(true)}
          >
            <h2>Sign Up</h2>
          </button>
          <button
            style={logInstyle[Toggle.focus * 1]}
            onClick={() => Toggle_Foucs(false)}
          >
            <h2>Log In</h2>
          </button>
        </div>
        {Toggle.focus ? <SignUp /> : <LogIn />}
      </div>
    </Modal>
  );
};

const signupStyle = [
  { boxShadow: "#343a40 -4px -4px 10px 0px inset" },
  { backgroundColor: "#343a40", color: "white" },
];
const logInstyle = [
  { backgroundColor: "#343a40", color: "white" },
  { boxShadow: "#343a40 4px -4px 10px 0px inset" },
];

const mapStateToProps = (state) => ({
  Toggle: state.Toggle,
});
export default connect(mapStateToProps, {
  Toggle_modal,
  Toggle_Foucs,
})(Register);

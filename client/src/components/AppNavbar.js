import React, { useState } from "react";
import { Toggle_Foucs, Toggle_modal } from "./../actions/ToggleActions";
import { logout } from "./../actions/AuthActions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink,
  Container,
  Button,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";

const AppNavbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleNavbar = () => setIsOpen(!isOpen);
  const closeNavbar = () => setIsOpen(false);

  const loginBtn = (
    <NavLink onClick={closeNavbar} key="login" className="d-flex align-items-center">
      <Button
        size="sm"
        color="success"
        onClick={() => {
          props.Toggle_Foucs(true);
          props.Toggle_modal();
        }}
      >
        Sign Up
      </Button>
    </NavLink>
  );

  const registerBtn = (
    <NavLink onClick={closeNavbar} key="register" className="d-flex align-items-center ms-2">
      <Button
        size="sm"
        onClick={() => {
          props.Toggle_Foucs(false);
          props.Toggle_modal();
        }}
      >
        Log In
      </Button>
    </NavLink>
  );

  const logoutBtn = (
    <UncontrolledDropdown nav inNavbar key="logout">
      <DropdownToggle nav caret>
        Hi, {props.auth.user ? props.auth.user.username : "Guest"}
      </DropdownToggle>
      <DropdownMenu end className="text-center">
        <DropdownItem>
          <Link
            className="text-link"
            to={`/api/users/${props.auth.user?.username}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Account
          </Link>
        </DropdownItem>
        <DropdownItem divider />
        <div className="px-3 pb-2">
          <Button
            size="md"
            onClick={() => {
              props.logout();
              closeNavbar();
            }}
          >
            Log Out
          </Button>
        </div>
      </DropdownMenu>
    </UncontrolledDropdown>
  );

  return (
    <Navbar
      color="dark"
      dark
      expand="sm"
      fixed="top"
      className="shadow-bar py-2"
    >
      <Container fluid className="d-flex align-items-center justify-content-between py-2">
        {/* Left: Brand */}
        <NavbarBrand tag={Link} to="/" onClick={closeNavbar} className="mb-0">
          <span className="text-success fw-bold">IIT BHILAI CODERS</span> UNITE!
        </NavbarBrand>

        {/* Right: Toggler and collapse */}
        <div className="d-flex align-items-center">
          <NavbarToggler onClick={toggleNavbar} className="border-0" />

          <Collapse isOpen={isOpen} navbar>
            <Nav className="ms-auto align-items-center" navbar>
              <NavLink
                tag={Link}
                to="/api/posts"
                onClick={closeNavbar}
                className="d-flex align-items-center px-2"
              >
                Feed
              </NavLink>

              <NavLink
                onClick={closeNavbar}
                className="d-flex align-items-center px-2"
                tag={Link}
                to={{
                  pathname: "/api/posts/newpost",
                  state: {
                    id: "",
                    title: "",
                    body: "",
                    snippet: "",
                    isUpdated: false,
                  },
                }}
              >
                New Post
              </NavLink>

              {props.auth.isAuthenticated ? (
                logoutBtn
              ) : (
                <>
                  {loginBtn}
                  {registerBtn}
                </>
              )}
            </Nav>
          </Collapse>
        </div>
      </Container>
    </Navbar>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { Toggle_Foucs, Toggle_modal, logout })(
  AppNavbar
);

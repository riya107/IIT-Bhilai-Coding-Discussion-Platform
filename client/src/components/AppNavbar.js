import React, { useState } from "react";
import { Toggle_Foucs, Toggle_modal } from "./../actions/ToggleActions";
import { logout } from "./../actions/AuthActions";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
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
  Input,
} from "reactstrap";

const AppNavbar = (props) => {
  const [collapsed, setCollapsed] = useState(true); // navbar collapse
  const [text, setText] = useState(""); // navbar collapse
  const toggleNavbar = () => setCollapsed(!collapsed); //navbar Toggler
  const closeNavbar = () => setCollapsed(true); // strictly closes the navbar.
  const history = useHistory();

  const registerBtn = (
    <NavLink onClick={closeNavbar} key="2" className="my-auto">
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

  const loginBtn = (
    <NavLink onClick={closeNavbar} key="1" className="my-auto">
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

  const logoutBtn = (
    <UncontrolledDropdown nav inNavbar key="69">
      <DropdownToggle nav caret>
        Hi, {props.auth.user ? props.auth.user.username : "Guest"}
      </DropdownToggle>
      <DropdownMenu right className="text-center">
        <DropdownItem>
          <Link
            className="text-link"
            to={`/api/users/${props.auth.user?.username}`}
          >
            Account
          </Link>
        </DropdownItem>
        <DropdownItem divider />
        <Button
          size="md"
          onClick={() => {
            props.logout();
            closeNavbar();
          }}
        >
          log out
        </Button>
      </DropdownMenu>
    </UncontrolledDropdown>
  );

  const handleKeyDown = async (e) => {
    if(e.key === 'Enter'){
      history.push({
        pathname: '/api/posts',
        state: { text: e.target.value }
      });
    }
  }

  return (
    <div className="navbar">
      <Navbar
        color="dark"
        dark
        expand="sm"
        className="mb-5 fixed-top shadow-bar"
      >
        <Container>
          <NavbarBrand
            className="mr-auto"
            onClick={closeNavbar}
            tag={Link}
            to="/"
          >
            <span className="text-success font-weight-bold">
              IIT BHILAI CODERS
            </span>
            UNITE!
          </NavbarBrand>
          <NavbarToggler onClick={toggleNavbar} className="mr-2" />
          <Collapse isOpen={!collapsed} navbar>
            <Nav className="ml-auto" navbar>
              <Input className="w-25" type="text" onChange={(e)=>{setText(e.target.value)}} onKeyDown={handleKeyDown} value={text} />

              <NavLink
                tag={Link}
                to="/api/posts"
                onClick={closeNavbar}
                className="my-auto"
              >
                Feed
              </NavLink>

              <NavLink
                onClick={closeNavbar}
                className="my-auto"
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

              {props.auth.isAuthenticated
                ? [logoutBtn]
                : [loginBtn, registerBtn]}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { Toggle_Foucs, Toggle_modal, logout })(
  AppNavbar
);

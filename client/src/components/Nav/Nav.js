import React, { Fragment } from "react";
import { Link } from 'react-router-dom';
import { Col } from '../Grid';
import './Nav.css';
import MediaQuery from 'react-responsive';

const Nav = (props) => {
  let greeting;

  if (props.user === null) {
		greeting = <p>Hello guest</p>
	} else if (props.user.firstName) {
		greeting = (
			<Fragment>
				Welcome back, <strong>{props.user.firstName}</strong>
        &nbsp; <Link to="#" className="logout" onClick={props.logout}>[Logout]</Link>
			</Fragment>
		)
	} else if (props.user.username) {
		greeting = (
			<Fragment>
				Welcome back, <strong>{props.user.username} </strong>
        &nbsp; <Link to="#" className="logout" onClick={props.logout}>[Logout]</Link>
			</Fragment>
		)
  }

  let location;
  let linkLocation = "/";

  if (window.location.pathname.toLowerCase() === "/statsboard") {
    location = "Game Stats";
    linkLocation = "/board-question";
    greeting = "";
  } else if (window.location.pathname.toLowerCase() === "/board-question") {
    location = "by\xa0\xa0\xa0" + props.user.username
    linkLocation = "/statsboard";
    greeting = "";
  } else if (window.location.pathname.toLowerCase() === "/live-game" || "/admin") {
    location = "by\xa0\xa0\xa0" + props.user.username
    linkLocation = "#";
  }

  return (
    <div>

      <MediaQuery query="(max-width: 768px)">
        <div className="text-center p-3">
          <Link to="/" className="navbar-brand"><img src="/trivializer-logo.png" alt="Trivializer" className="logo img-fluid"/></Link>
          <h4 className="align-middle m-0 p-0 pageTitle">{location}</h4>
        </div>
      </MediaQuery>

      <MediaQuery query="(min-width: 769px)">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <Col size="md-9">
            <Link to="/" className="navbar-brand"><img src="/trivializer-logo.png" alt="Trivializer" className="logo img-fluid"/></Link>
            <Link to={linkLocation}><h1 style={ {display: "inline-block" } } className="align-middle m-0 ml-4 p-0 pageTitle">{location}</h1></Link>
          </Col>
          {/* <Col size="md-7"></Col> */}
          <Col size="md-3">
            <div className="float-right">
            {greeting}
            {/* - <Link to="#" className="logout" onClick={props.logout}>Logout</Link> */}
            </div>
          </Col>
        </nav>
      </MediaQuery>

    </div>
  )
};

export default Nav;

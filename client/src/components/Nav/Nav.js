import React, { Fragment } from "react";
import { Link } from 'react-router-dom';
import { Col } from '../Grid';
import './Nav.css';

const Nav = (props) => {
  let greeting;

  if (props.user === null) {
		greeting = <p>Hello guest</p>
	} else if (props.user.firstName) {
		greeting = (
			<Fragment>
				Welcome back, <strong>{props.user.firstName}</strong>
        - <Link to="#" className="logout" onClick={props.logout}>Logout</Link>
			</Fragment>
		)
	} else if (props.user.username) {
		greeting = (
			<Fragment>
				Welcome back, <strong>{props.user.username} </strong>
        - <Link to="#" className="logout" onClick={props.logout}>Logout</Link>
			</Fragment>
		)
  }

  let location;
  let linkLocation = "/";

  console.log("window.location.pathname = ");
  console.log(window.location.pathname);

  if (window.location.pathname.toLowerCase() === "/statsboard") {
    location = "Game Stats";
    linkLocation = "/board-question";
    greeting = "";
  } else if (window.location.pathname.toLowerCase() === "/board-question") {
    location = props.user.username
    linkLocation = "/statsboard";
    greeting = "";
  } else if (window.location.pathname.toLowerCase() === "/live-game") {
    location = "YOUR GAME IS LIVE!!!"
    linkLocation = "#";
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <Col size="md-9">
        <Link to="/" className="navbar-brand"><img src="/trivializer-logo.png" className="logo"/></Link>
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
  )
};

export default Nav;

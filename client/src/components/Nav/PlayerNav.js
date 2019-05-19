import React, { Fragment } from "react";
import { Link } from 'react-router-dom';
import { Col } from '../Grid';
import './Nav.css';

const PlayerNav = (props) => {
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

  return (
    <nav className="text-center p-3">

        <Link to="/" className=""><img src="/trivializer-logo.png" alt="Trivializer" className="logo img-fluid img-block"/></Link>
        <h4 className="align-middle m-0 p-0 pageTitle">Your Team: {props.user.username}</h4>

    </nav>
  )
};

export default PlayerNav;

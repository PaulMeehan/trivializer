import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginForm from './pages/Auth/LoginForm';
import SignupForm from './pages/Auth/SignupForm';
import Nav from "./components/Nav";
import Books from './pages/Books';
import Detail from "./pages/Detail";
import NoMatch from "./pages/NoMatch";
import AUTH from './utils/AUTH';

// BH 20190508
// new pages
// separate files at the moment, need to be combined later:
import BoardWelcome from "./pages/BigBoard/BoardWelcome";
import BoardQMultiLive from "./pages/BigBoard/BoardQMultiLive";
import BoardQMultiPost from "./pages/BigBoard/BoardQMultiPost";
import BoardQTFLive from "./pages/BigBoard/BoardQTFLive";
import BoardQTFPost from "./pages/BigBoard/BoardQTFPost";
import BoardQOpenLive from "./pages/BigBoard/BoardQOpenLive";
import BoardQOpenPost from "./pages/BigBoard/BoardQOpenPost";
// import BoardHalfTime from "./pages/BigBoard/BoardHalfTime";
// import BoardGameOver from "./pages/BigBoard/BoardGameOver";
import GameMasterAdmin from "./pages/GameMaster/Admin";
import GameMasterLiveGame from "./pages/GameMaster/LiveGame";
import StatsBoard from "./pages/BigBoard/StatsBoard";
import BoardQuestion from "./pages/BigBoard/BoardQuestion";
import User from "./pages/User/User";
import LandingPage from './pages/LandingPage'


class App extends Component {

  constructor() {
    super();
		this.state = {
			loggedIn: false,
			user: null
    };
  }

	componentDidMount() {
		AUTH.getUser().then(response => {
			if (!!response.data.user) {
				this.setState({
					loggedIn: true,
					user: response.data.user
				});
			} else {
				this.setState({
					loggedIn: false,
					user: null
				});
			}
		});
	}

	logout = (event) => {
    event.preventDefault();
		AUTH.logout().then(response => {
			console.log(response.data);
			if (response.status === 200) {
				this.setState({
					loggedIn: false,
					user: null
				});
			}
		});
	}

	login = (username, password) => {
		AUTH.login(username, password).then(response => {
      console.log(response);
      if (response.status === 200) {
        // update the state
        this.setState({
          loggedIn: true,
          user: response.data.user
        });
      }
    });
	}

	render() {
		return (
			<div className="App">
        { this.state.loggedIn && (
          <div>
            { (window.location.pathname.toLowerCase() == "/user") ? ("") : <Nav user={this.state.user} logout={this.logout} />  }
						{/* <Nav user={this.state.user} logout={this.logout}/> */}
            <div className="main-view">
              <Switch>
                <Route exact path="/" component={() => <LandingPage user={this.state.user}/>} />
                <Route exact path="/books" component={() => <Books user={this.state.user}/>} />
                <Route exact path="/books/:id" component={Detail} />

								{/* BH Additions (Temp): */}
								<Route exact path="/board-welcome" component={BoardWelcome} />
								<Route exact path="/board-multi-live" component={BoardQMultiLive} />
								<Route exact path="/board-multi-post" component={BoardQMultiPost} />
								<Route exact path="/board-tf-live" component={BoardQTFLive} />
								<Route exact path="/board-tf-post" component={BoardQTFPost} />
								<Route exact path="/board-open-live" component={BoardQOpenLive} />
								<Route exact path="/board-open-post" component={BoardQOpenPost} />
								{/* <Route exact path="/board-halftime" component={BoardHalfTime} /> */}
								{/* <Route exact path="/board-gameover" component={BoardGameOver} /> */}
								<Route exact path="/admin" component={GameMasterAdmin} />
								<Route exact path="/live-game" component={GameMasterLiveGame} />
								<Route exact path="/statsboard" component={StatsBoard} />
								<Route exact path="/board-question" component={BoardQuestion} />
								<Route exact path="/user/" component={User} />
                <Route component={NoMatch} />
              </Switch>
            </div>
          </div>
        )}
        { !this.state.loggedIn && (
          <div className="auth-wrapper" style={{paddingTop:40}}>
            <Route exact path="/" component={() => <LoginForm login={this.login}/>} />
            <Route exact path="/books" component={() => <LoginForm user={this.login}/>} />
            <Route exact path="/signup" component={SignupForm} />
          </div>
        )}
			</div>
		)
	}
}

export default App;

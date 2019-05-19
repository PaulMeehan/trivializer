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
		console.log('LOGGED IN?????????????? ', this.state.loggedIn)
		return (
			<div className="App">
        { this.state.loggedIn && (
          <div>
            { (window.location.pathname.toLowerCase() === "/user") ? ("") : <Nav user={this.state.user} logout={this.logout} />  }
						{/* <Nav user={this.state.user} logout={this.logout}/> */}
            <div className="main-view">
              <Switch>
								<Route exact path="/" component={LandingPage} />
                <Route exact path="/books" component={() => <Books user={this.state.user}/>} />
                <Route exact path="/books/:id" component={Detail} />

								{/* New Additions: */}
								<Route exact path="/live-game" component={() => <GameMasterLiveGame username={this.state.user.username}/>} />
								<Route exact path="/admin" component={GameMasterAdmin} />
								<Route exact path="/statsboard" component={StatsBoard} />
								<Route exact path="/board-question" component={() => <BoardQuestion userID={this.state.user.username}/>} />
                <Route path='/play*' component={() => <User userId={this.state.user.username}/>} />
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

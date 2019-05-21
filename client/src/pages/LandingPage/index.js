import React from 'react'
import { Link } from 'react-router-dom'
import Pusher from 'pusher-js'
import MediaQuery from 'react-responsive';

const styles = {
	h1Form: {
    fontFamily: "'Bangers', cursive",
    fontSize: "3em"
	},
};

class LandingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { game: '' }
  }

  componentWillMount () {
    Pusher.logToConsole = true
    const pusher = new Pusher('e5795cf1dfac2a8aee31', {
      cluster: 'us2',
      forceTLS: true
    })
    const game = pusher.subscribe('game-question')
    game.bind('dp',this.log)
  }

  log = x => {
    console.log('\n***\nhere\n***\n')
    console.log(x)
  }

  handleInputChange = e => {
    console.log(e.target.value)
    this.setState({game: e.target.value})
  }


  render() {
    return (
      <div className="container">

        <div className="row mt-5">
          <div className="col-md-12">
            <Link to="/admin" className="btn btn-large btn-block btn-success"><h1 className="fiddle">Host a Game</h1></Link>
            <h1 className="text-center m-5">- OR -</h1>

            <MediaQuery query="(max-width: 768px)">
              <div className="mb-3 text-center">
                  <h4>Enter the Host's username:</h4>
                  <input
                    type="text"
                    className="form-control"
                    style={styles.h1Form}
                    placeholder=""
                    aria-label="Host Name"
                    aria-describedby="Host Name"
                    id="searchBar"
                    value={this.state.game}
                    onChange={(e) => this.handleInputChange(e)}
                  >
                  </input>
                  <Link
                    to={`/play-${this.state.game}`}
                    className="btn btn-success btn-large btn-block"
                  >
                    <h1 className="fiddle">Play a Game</h1>
                  </Link>
                </div>
            </MediaQuery>

            <MediaQuery query="(min-width: 769px)">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  style={styles.h1Form}
                  placeholder="Type Username of Host Here"
                  aria-label="Host Name"
                  aria-describedby="Host Name"
                  id="searchBar"
                  value={this.state.game}
                  onChange={(e) => this.handleInputChange(e)}
                >
                </input>
                <Link
                  to={`/play-${this.state.game}`}
                  className="btn btn-success btn-large"
                >
                  <h1 className="fiddle">Play a Game</h1>
                </Link>
              </div>
            </MediaQuery>
          </div>
        </div>

      </div>
    )
  }

}

export default LandingPage
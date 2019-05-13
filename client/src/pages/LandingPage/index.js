import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Pusher from 'pusher-js'


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
    const question = pusher.subscribe('game-question')
  }

  handleInputChange = e => {
    console.log(e.target.value)
    this.setState({game: e.target.value})
  }



  render() {
    return (
      <div className="container">
        I want to
        <Link to="/admin">
          Host a game
        </Link>
        <div>Or Play a Game</div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Host Name"
            aria-label="Host Name"
            aria-describedby="Host Name"
            id="searchBar"
            value={this.state.game}
            onChange={(e) => this.handleInputChange(e)}
          >
          </input>
          <a
            href={`/play/${this.state.game}`}
            className="btn btn-outline-secondary"
            type="button"
          >Play Game</a>
        </div>

      </div>
    )
  }

}

export default LandingPage
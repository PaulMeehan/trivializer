import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import PageVisibility from 'react-page-visibility';
import gameAPI from '../../utils/gameAPI';

class User extends React.Component {
    state = {
        show: true,
        questionIndex: 0,
        curChoice: "",
        questions: [
            {
                question: "According to a Beatles song, who kept her face in a jar by the door?",
                answer: "Eleanor Rigby",
                choices: [
                    "Eleanor Rigby",
                    "Loretta Martin",
                    "Molly Jones",
                    "Lady Madonna"
                ]
            }
        ]
    }

        componentWillMount () {
            Pusher.logToConsole = true
            const pusher = new Pusher('e5795cf1dfac2a8aee31', {
              cluster: 'us2',
              forceTLS: true
            })
            const game = pusher.subscribe('game-question')
            game.bind('   something here   ',this.log)
        }

    handleChoiceClick = (e) => {
        console.log(e.target.value)
        this.setState({ curChoice: e.target.value })
    }

    handleSubmit = (e) => {
        console.log(e.target.value)
        this.setState({ show: !this.state.show })
        if (this.state.questions[this.state.questionIndex].answer === this.state.curChoice) {
            alert("Correct")
        } else {
            alert("Wrong")
        }
    }
    
    getQuestions = () => { // pull questions from DB
        // /api/questions
        // GET request
        console.log("getQuestions triggered");
        axios.get("/api/questions")
            .then(response => {
                console.log(response.data);
                // this.setQuestions(response.data.questions);
                // this.setIsActive(response.data.isActive);
                // this.setCurrentQNumber(response.data.qNum);
                // response.data.time
            })
            .catch(err => {
                console.log(err);
            })
    }
    
    render() {
        console.log(this.state);
        var preQuestions = [
            {
                question: "According to a Beatles song, who kept her face in a jar by the door?",
                answer: "Eleanor Rigby",
                choices: [
                    "Eleanor Rigby",
                    "Loretta Martin",
                    "Molly Jones",
                    "Lady Madonna"
                ]
            }
        ]

            return (
                <div style={{ borderRadius: '5px', maxWidth: '420px', margin: 'auto' }}>
                    <nav>
                        <Link to="/" className="navbar-brand"><img style={{ width: '100%' }} src="/trivializer-logo.png" alt="" className="logo" /></Link>
                    </nav>
                    <div style={{ borderRadius: '5px', margin: 'auto', backgroundColor: '#eee', maxWidth: "420px", height: 'auto' }}>
                        <div style={{ display: 'block', width: '25%', margin: 'auto' }}><img src="https://img.icons8.com/color/96/000000/alarm-clock.png" alt="" />
                        </div>
                        <div>
                            <h1 style={{ textAlign: 'center', color: 'black' }}>Question: {this.state.questionIndex + 1} </h1>
                            <div style={{ padding: '10px', }}>
                                <p style={{ textAlign: 'center', color: '#9800ff' }}>{preQuestions[0].question}</p>
                                {this.state.show ?
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '75%' }}>
                                        <ul style={{ display: 'block', margin: 'auto', listStyleType: 'none', color: '#9800ff' }}>

                                            {this.state.questions[this.state.questionIndex].choices.map((singleChoice) => {
                                                return (<li><input type="radio" checked={this.state.curChoice === singleChoice} value={singleChoice} onChange={this.handleChoiceClick}></input>{singleChoice}</li>)
                                            })}

                                            <button style={{ borderRadius: '5px', height: '30px', width: '100%', backgroundColor: '#f9800ff' }} onClick={this.handleSubmit}>Submit</button>
                                        </ul>
                                    </div>
                                    : <p style={{ padding: '15px', fontFamily: 'karmatic arcade', textAlign: 'center', color: '#9800ff' }}>Good choice.  But, you an idiot.</p>}
                            </div>
                        </div>
                    </div>
                    <footer>
                        <Link to="/" className="navbar-brand"><img style={{ width: '100%' }} src="/trivializer-logo.png" alt="" className="logo" /></Link>
                    </footer>


                </div>

            );
        }

}

export default User;
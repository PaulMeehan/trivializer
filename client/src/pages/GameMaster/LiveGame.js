import React, {useState, useEffect} from 'react'
import './Admin.css'
import {Pie} from "react-chartjs-2"
import AdminLiveQDiv from "../../components/Admin/AdminLiveQDiv"
import gameAPI from '../../utils/gameAPI'
// import { start } from 'repl';

let preQuestions = [
  [
    "According to a Beatles song, who kept her face in a jar by the door?",
    "Eleanor Rigby",
    "Loretta Martin",
    "Molly Jones",
    "Lady Madonna",
    "A"
  ],
  [
    "What is the stage name of English female rapper Mathangi Arulpragasam, who is known for the song &quot;Paper Planes&quot;?",
    "K.I.A.",
    "C.I.A.",
    "M.I.A.",
    "A.I.A.",
    "C"
  ],
  [
    "Which one of these Rammstein songs has two official music videos?",
    "Du Hast",
    "Benzin",
    "Mein Teil",
    "Du Riechst So Gut",
    "D"
  ],
  [
    "Which rock band released the album &quot;The Bends&quot; in March 1995?",
    "Nirvana",
    "Radiohead",
    "Lemonheads",
    "U2",
    "B"
  ],
  [
    "Which band recorded the album &quot;Parallel Lines&quot;?",
    "The Police",
    "Coldplay",
    "Paramore",
    "Blondie",
    "D"
  ],
  [
    "Which of these aliases has NOT been used by electronic musician Aphex Twin?",
    "Burial",
    "Caustic Window",
    "Bradley Strider",
    "GAK",
    "A"
  ]
]

const GameMasterLiveGame = () => {

  const [questions, setQuestions] = React.useState([])
  const [qNum,setQNum] = useState()
  const [questionIsActive,setQuestionIsActive] = useState()
  const [gameIsActive, setGameIsActive] = useState()
  const [timerData, setTimerData] = useState(baseTimerData); // not doing anything at the moment

  useEffect( () => {
    gameAPI.getQuestions()
    .then(res => updateState(res))
    .catch(err => console.log(err))
  },[])
  const updateState = res => {
    console.log(res.data.qNum)
    setQuestions(res.data.game)
    setQNum(res.data.qNum)
    setQuestionIsActive(res.data.isActive)
    setGameIsActive(res.data.gameActive)
  }
  const baseTimerData = {
    labels: [
      'Time Remaining',
    ],
    datasets: [
      {
        data: [
          180, // what's left
          0 // what's elapsed
        ],
        backgroundColor: [
          "#34edaf",
          "#ed4634"
        ]
      }
    ],
    options: {
      responsive: true
    }
  }
  const getQuestions = () => {
    gameAPI.getQuestions()
    .then(res => {
      console.table(res.data)
      setQuestions(res.data.game);
      setQNum(res.data.qNum)
      setQuestionIsActive(res.data.isActive)
      setGameIsActive(res.data.gameActive)

    })
    .catch(err => console.log(err))
  }
  const startNextQuestion = () => {
    gameAPI.nextQuestion()
    .then(res => updateState(res))
    .catch(err => console.log(err))
  }
  const endQuestion = () => {
    gameAPI.endQuestion()
    .then(res => updateState(res))
    .catch(err => console.log(err))
  }
  const endGame = () => {
    gameAPI.endGame()
    .then(res => updateState(res))
    .catch(err => console.log(err))
  }
  const printState = () => {
    console.log('questions')
    console.table(questions)
    console.log('gameIsActive', gameIsActive)
    console.log('questionIsActive', questionIsActive)
    console.log('qNum', qNum)
  }

  const decrementTimer = () => {
    console.log("decrement run");
    if (timerData.datasets[0].data[0] > 0) {
      let currentTime = [timerData.datasets[0].data[0],timerData.datasets[0].data[1]];
      currentTime = [(currentTime[0] - 1),(currentTime[1] + 1)]
      setTimerData(
        {
          datasets: [
            {
              data: currentTime,
              backgroundColor: [
                "#34edaf",
                "#ed4634"
              ]
            }
          ],
          options: {
              responsive: true
          }
        }
      )
    }
  }

  const timerControl = () => {
    const timerInterval = setInterval(decrementTimer,1000);
  }

  const ControllButton = () => {
    const button = []
    // game has started but question is over
    if (gameIsActive && !questionIsActive) {
      button.push(
        <button
          className="btn btn-success btn-lg btn-block"
          onClick={() => startNextQuestion()}
        >Start Next Question
        </button>

      )
    }
    // current question is live
    else if (gameIsActive && questionIsActive) {
      button.push(
        <button
          className="btn btn-danger btn-lg btn-block"
          onClick={()=> endQuestion()}
        >End Current Question</button>
      )
    }
    // game is active but the last question is over
    else if (!questionIsActive && qNum === questions.length) {
      button.push(
        <button
          className='btn btn-success btn-lg btn-block'
          // onClick={() => }
        ></button>

      )
    }
    // game has not started
    else if (!gameIsActive) {
      button.push(
        <button
          className="btn btn-success btn-lg btn-block"
          onClick={() => startNextQuestion()}
        >Start Game
        </button>
      )
    }
    return button
  }

  const DrawQuestions = () => {
    const qstns = []
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const activeQuestion = i === qNum && gameIsActive && questionIsActive
      const currentQuestion = i === qNum
      qstns.push(
        <div>
          <div className={ currentQuestion ? "row border mt-3 p-3" : "row border mt-3 p-3 deadQuestion" }>
            <div className="col-md-1">
              <h1>{i + 1}.</h1>
            </div>
            <div className="col-md-3">
              <h4>{q.question}</h4>
            </div>
            <div className="col-md-3">
              <h4>A. {q.choices[0]}</h4>
              <h4>B. {q.choices[1]}</h4>
              <h4>C. {q.choices[2]}</h4>
              <h4>D. {q.choices[3]}</h4>
            </div>
            <div className="col-md-2">
              {(currentQuestion && !activeQuestion) ? (<div>This question has ended</div>) : (<div></div>)}
            </div>
            <div className={ activeQuestion ? "col-md-3" : "col-md-3 hidden" }>
              <Pie
                data= {timerData}
              />
            </div>
        </div>
        </div>
      )
    }
    return qstns
  }

  return(
    <div className="container">
      <button onClick={() => printState()}>PrintState</button>
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="container">
            <ControllButton />
            <DrawQuestions />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameMasterLiveGame;
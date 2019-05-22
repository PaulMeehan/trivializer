import React, {useState, useEffect} from 'react'
import './Admin.css'
import {Pie} from "react-chartjs-2"
import gameAPI from '../../utils/gameAPI'
import {Element, scroller} from "react-scroll"
import { Link } from 'react-router-dom';

const baseTimerData = {
  labels: [
    'Time Remaining',
  ],
  datasets: [
    {
      data: [
        30, // what's left
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

const GameMasterLiveGame = props => {

  /*
    State variables
  */
  const [questions, setQuestions] = useState([])
  const [qNum,setQNum] = useState()
  const [questionIsActive, setQuestionIsActive] = useState()
  const [gameIsActive, setGameIsActive] = useState()
  const [time, setTime] = useState()
  const [timer, setTimer] = useState()
  const [timerData, setTimerData] = useState(baseTimerData)
  const [pieOptions, setPieOptions] = useState({
      legend: {
        display: false,
      },
      responsive: true,
      maintainAspectRatio: true,
    }
  )

  /*
    Core loading & data handling
  */
  useEffect( () => {
    gameAPI.getQuestions()
    .then(res => {
      console.log('\n***\nInitial Data\n***',res)
      console.log('\n***\nres.data\n***',res.data)
      const x = res.data
      // if there is a current live question we need to start the timer
      if (x.isActive && x.gameActive) {
        updateState(res,true)
        gameTimer(x.game[x.qNum].time)
      } else {
        updateState(res)
      }
    })
    .catch(err => console.log(err))
  },[])

  useEffect( () => {
    if (qNum >= 0) {
      triggerScroll(qNum);
    }
  },[qNum])

  const updateState = (res, ignoreTime = false) => {
    // test whether we have data & that it's good
    let test = res.hasOwnProperty('data') && res.data.hasOwnProperty('game')
        && res.data.game.hasOwnProperty('length') && res.data.game.length > 0
        && res.data.hasOwnProperty('qNum') && res.data.hasOwnProperty('isActive')
        && res.data.hasOwnProperty('gameActive')
        && typeof res.data.qNum === 'number'
        && typeof res.data.isActive === typeof res.data.gameActive
        && typeof res.data.isActive === 'boolean'
    if (!test)  return  console.log('bad data')// we don't have good data. Ignore it
    console.log('good data')
    // we must have good data
    const x = res.data
    setQuestions(x.game)
    setQNum(x.qNum)
    setQuestionIsActive(x.isActive)
    setGameIsActive(x.gameActive)
    if ((!ignoreTime) && (qNum >= 0)) setTime(parseInt(x.game[x.qNum].time))
  }

  /*
    Functions: API & functionality
  */

  const gameTimer = (startTime = false) => {
    let elapsed = 0
    startTime = startTime || time || questions[0].time
    const t = setInterval(() => {
      elapsed++
      let remaining = startTime - elapsed
      setTime(remaining)
      gameAPI.setTime(remaining)
      if (startTime === elapsed) {
        clearInterval(t)
        endQuestion()
      }

      setTimerData({
        labels: [
          'Time Remaining',
        ],
        datasets: [
          {
            data: [
              startTime-elapsed, // what's left
              elapsed // what's elapsed
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
      })

    }, 1000)
    setTimer(t)
  }

  const startNextQuestion = () => {
    gameAPI.nextQuestion()
    .then(res => {
      updateState(res)
      gameTimer()
    })
    .catch(err => console.log(err))
  }

  const endQuestion = () => {
    clearInterval(timer)
    // reset the time on this question first, then call endQuestion
    let time, q = qNum - 1
    if (qNum - 1 < 0) q = qNum + 1
    if (questions.length <= 1) time = 30
    else {
      time = questions[q].time
    }
    gameAPI.setTime(time)
    .then(success => {
      gameAPI.endQuestion()
      .then(res => updateState(res))
      .catch(err => console.log(err))
    })
    .catch(err => {
      gameAPI.endQuestion()
      .then(res => updateState(res))
      .catch(err => console.log(err))
    })
  }

  const triggerScroll = (elementID) => {
    var thisElement = 0;
    if (elementID) {
      thisElement = elementID;
    } 
    scroller.scrollTo('scrollElement'+elementID, {
      duration: 750,
      delay: 10,
      smooth: true,
      containerId: 'questionsFrame',
      offset: -200, // Scrolls to element + 50 pixels down the page
    })
  }

  /*
    Components
  */
  const ControllButton = () => {
    const button = []
    // game is active but the last question is over
    if (!questionIsActive && (qNum === questions.length - 1)) {
      button.push(
        <div className="container" key={1}>
          <div className="row" key={2}>
            <div className="col md-3" key={3}>
              <button key={4} type="button" className="btn btn-success btn-lg btn-block" data-toggle="modal" data-target="#gotoadmin">
                Back to Admin
              </button>
            </div>
            <div className="col md-3" key={5}>
              <button  key={6} type="button" className="btn btn-danger btn-lg btn-block" data-toggle="modal" data-target="#startover">
                Start Over
              </button>
            </div>
          </div>
          <div key={7} className="modal fade" data-backdrop="false" id="gotoadmin" tabIndex="-1" role="dialog" aria-labelledby="gotoadminModalLabel" aria-hidden="true">
            <div key={8} className="modal-dialog" role="document">
              <div key={9} className="modal-content">
                <div key={10} className="modal-header">
                  <h2 key={11} className="modal-title" id="exampleModalLabel">Warning ! ! !</h2>
                  <button key={12} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span key={13} aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body" key={14}>
                  <h2 key={15}>If you go to the Admin Screen, you will have to restart this game.</h2>
                  <h4 key={16}>Do you want to continue to the Admin Screen?</h4>
                </div>
                <div className="modal-footer" key={16}>
                  <button  key={17} type="button" className="btn btn-primary btn-lg btn-block" data-dismiss="modal">No, stay here</button>
                  <Link key={18}
                    to={'/admin'}
                    className='btn btn-secondary btn-lg btn-block'
                  >Yes, go to Admin</Link>
                </div>
              </div>
            </div>
          </div>
          <div key={19} className="modal fade" id="startover" tabIndex="-1" role="dialog" aria-labelledby="startoverModalLabel" aria-hidden="true">
            <div key={20} className="modal-dialog" role="document">
              <div key={21} className="modal-content">
                <div key={22} className="modal-header">
                  <h2 key={23} className="modal-title" id="exampleModalLabel">Warning ! ! !</h2>
                  <button key={24} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span key={25} aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div  key={26} className="modal-body">
                  <h2 key={27}>If you Start Over, all player answers will be deleted.</h2>
                  <h4 key={28}>Are you sure you want to start over?</h4>
                </div>
                <div className="modal-footer" key={29}>
                  <button key={30} type="button" className="btn btn-primary btn-lg btn-block" data-dismiss="modal">No, stay here</button>
                  <button key={31} type="button" id="btnStartOver" className='btn btn-danger btn-lg btn-block' data-dismiss="modal" onClick={() => startNextQuestion()}>
                    Yes, Start Over!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    // game has started but question is over
    else if (gameIsActive && !questionIsActive) {
      button.push(
        <button
          key={1}
          className="btn btn-success btn-lg btn-block"
          onClick={() => startNextQuestion()}
        >Start Next Question
        </button>
      )
    }
    // current question is live
    else if (questionIsActive) {
      button.push(
        <button
          key={1}
          className="btn btn-danger btn-lg btn-block"
          onClick={()=> endQuestion()}
        >End Current Question</button>
      )
    }
    // game has not started
    else if (!gameIsActive && qNum === -1) {
      button.push(
        <button
          key={1}
          className="btn btn-success btn-lg btn-block"
          onClick={() => startNextQuestion()}
        >Start Game
        </button>
      )
    }
    return button
  }

  const DrawQuestions = () => {
    // test whether or not we have anything to draw, if not return empty div
    let test = questions.hasOwnProperty('length') && questions.length > 0
    if (!test) return <div></div>

    // we must have something to draw
    const qstns = []
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const activeQuestion = i === qNum && gameIsActive && questionIsActive
      const currentQuestion = i === qNum
      qstns.push(
        <div key={i*100}>
          <Element name={"scrollElement" + i} key={i*100+1}></Element>
          { currentQuestion ? <h2 key={i*100+15}>Current Question</h2> : "" }
          <div  key={i*100+2} className={ currentQuestion ? "row border p-3 notDeadQuestion mb-3" : "row border p-3 mb-3 deadQuestion" }>
              <div className="col-md-1" key={i*100+3}>
                <h1 key={i*100+4}>{i + 1}.</h1>
              </div>
              <div className="col-md-3"  key={i*100+5}>
                <h4  key={i*100+6}>{q.question}</h4>
              </div>
              <div className="col-md-5"  key={i*100+7}>
                <h4 key={i*100+8}>A. {q.choices[0]}</h4>
                <h4 key={i*100+9}>B. {q.choices[1]}</h4>
                <h4 key={i*100+10}>C. {q.choices[2]}</h4>
                <h4 key={i*100+11}>D. {q.choices[3]}</h4>
              </div>
              <div className="col-md-3" key={i*100+12}>
                {(currentQuestion && !activeQuestion) ? (<h4 key={i*100+13}>This question has ended</h4>)
                  :
                  (currentQuestion && activeQuestion) ? (<h2 key={i*100+14}>LIVE</h2>) : "" }
              </div>
          </div>
        </div>
      )
    }
    return qstns
  }

  /*
    Main body
  */
  return(
    <div className="container">
      <ControllButton />
      <div className="row">
        <div className="col-md-4 mt-3 text-center">

          <h3>Time Left:</h3>
          <Pie
            data = {timerData}
            options = {pieOptions}
            width = {200}
          />

          <h4 className="mt-4">Live game links:</h4>
          <Link to={`/play-${props.username}`} target="_blank"><h4 className="white">{`  trivializer.com/play-${props.username}`}</h4></Link>
          <Link to="/board-question" target="_blank"><h4 className="white">trivializer.com/board-question</h4></Link>
          <Link to="/statsboard" target="_blank"><h4 className="white">trivializer.com/statsboard</h4></Link>
        </div>
        <div className="col-md-1"></div>
        <div className="col-md-7 mt-3">
          <div className="container" id="questionsFrame">
            <DrawQuestions />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameMasterLiveGame;
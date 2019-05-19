import React, {useState, useEffect, useRef } from 'react'
import './Admin.css'
import {Pie} from "react-chartjs-2"
import gameAPI from '../../utils/gameAPI'
import {animateScroll, Element, scroller} from "react-scroll"
import { Link } from 'react-router-dom';

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

const styles = {
	tempHolderDiv: {
    width: 600,
	},
};



const GameMasterLiveGame = (props) => {

  const [questions, setQuestions] = useState([])
  const [qNum,setQNum] = useState()
  const [questionIsActive, setQuestionIsActive] = useState()
  const [gameIsActive, setGameIsActive] = useState()
  const [time, setTime] = useState()
  const [timer, setTimer] = useState()
  const [timerData, setTimerData] = useState(baseTimerData); // TODO: stop using fake data

  // onload
  useEffect( () => {
    gameAPI.getQuestions()
    .then(res => {
      const x = res.data
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
    triggerScroll(qNum);
  },[qNum])

  const updateState = (res, ignoreTime = false) => {
    const x = res.data
    setQuestions(x.game)
    setQNum(x.qNum)
    setQuestionIsActive(x.isActive)
    setGameIsActive(x.gameActive)
    if (!ignoreTime) setTime(parseInt(x.game[x.qNum].time))
  }

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
      // res.data.qNum
      // triggerScroll(2)
      // add logic here to grab current question #, tack that on to the element name, and trigger the scroll function
      // triggerScroll(res.data.qNum);
    })
    .catch(err => console.log(err))
  }

  const endQuestion = () => {
    clearInterval(timer)
    // reset the time on this question first, then call endQuestion
    let time, q = qNum - 1
    if (qNum - 1 <= 0) q = qNum + 1
    if (questions.length <= 1) time = 180
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

  const printState = () => {
    console.log('questions')
    console.table(questions)
    console.log('gameIsActive', gameIsActive)
    console.log('questionIsActive', questionIsActive)
    console.log('qNum ', qNum)
    console.log('time ', time)
    console.log('timer ', timer)
  }

  const ControllButton = () => {
    const button = []
    // game is active but the last question is over
    if (!questionIsActive && (qNum === questions.length - 1)) {
      button.push(
//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 

        <div class="container">

          <div className="row">
            <div className="col md-3">

              <button type="button" class="btn btn-success btn-lg btn-block" data-toggle="modal" data-target="#gotoadmin">
                Back to Admin
              </button>
            </div>
            <div className="col md-3">
              <button type="button" class="btn btn-danger btn-lg btn-block" data-toggle="modal" data-target="#startover">
                Start Over
              </button>
            </div>
          </div>

          <div class="modal fade" id="gotoadmin" tabindex="-1" role="dialog" aria-labelledby="gotoadminModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h2 class="modal-title" id="exampleModalLabel">Warning ! ! !</h2>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <h2>If you go to the Admin Screen, you will have to restart this game.</h2>
                  <h4>Do you want to continue to the Admin Screen?</h4>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary btn-lg btn-block" data-dismiss="modal">No, stay here</button>
                  <a id="adminAnchor"
                    className='btn btn-secondary btn-lg btn-block'
                    href="/admin"
                  >Yes, go to Admin</a>
                </div>
              </div>
            </div>
          </div>

          <div class="modal fade" id="startover" tabindex="-1" role="dialog" aria-labelledby="startoverModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h2 class="modal-title" id="exampleModalLabel">Warning ! ! !</h2>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <h2>If you Start Over, all player answers will be deleted.</h2>
                  <h4>Are you sure you want to start over?</h4>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary btn-lg btn-block" data-dismiss="modal">No, stay here</button>
                  <button type="button" id="btnStartOver" className='btn btn-danger btn-lg btn-block' data-dismiss="modal" onClick={() => startNextQuestion()}>
                    Yes, Start Over!
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */}

        </div>
      )
    }
    // game has started but question is over
    else if (gameIsActive && !questionIsActive) {
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
          <Element name={"scrollElement" + i}></Element>
          {/* { currentQuestion ? <h2>Current Question</h2> : "" } */}
          <div className={ currentQuestion ? "row border p-3 notDeadQuestion mb-3 lastOf" : "row border p-3 mb-3 deadQuestion lastOf" }>
              <div className="col-md-1">
                <h1>{i + 1}.</h1>
              </div>
              <div className="col-md-3">
                <h4>{q.question}</h4>
              </div>
              <div className="col-md-5">
                <h4>A. {q.choices[0]}</h4>
                <h4>B. {q.choices[1]}</h4>
                <h4>C. {q.choices[2]}</h4>
                <h4>D. {q.choices[3]}</h4>
              </div>
              <div className="col-md-3">
                {(currentQuestion && !activeQuestion) ? (<h4>This question has ended</h4>) 
                  : 
                  (currentQuestion && activeQuestion) ? (<h2>LIVE</h2>) : "" }
              </div>
        </div>
        </div>
      )
    }
    return qstns
  }

  const triggerScroll = (elementID) => {
    scroller.scrollTo('scrollElement'+elementID, {
      duration: 750,
      delay: 10,
      smooth: true,
      containerId: 'questionsFrame',
      offset: -200, // Scrolls to element + 50 pixels down the page
    })
  }

  const scrollToTop = () => {
    animateScroll.scrollToTop({
      containerId: "questionsFrame"
    });
  }
  
  
 

  const [pieOptions, setPieOptions] = useState( // TODO: had to create this separate state object b/c answerData.options wouldn't work
        {
          legend: {
            display: false,
          },  
          responsive: true,
          maintainAspectRatio: true,
        }
    );

  const scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: "questionsFrame"
    });
  }

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
          <Link to={`/play/${props.username}`} target="_blank"><h4 className="white">{`  trivializer.com/play/${props.username}`}</h4></Link>
          <Link to="/board-question" target="_blank"><h4 className="white">trivializer.com/board-question</h4></Link>
          <Link to="/statsboard" target="_blank"><h4 className="white">trivializer.com/statsboard</h4></Link>
          
          {/* <button onClick={() => triggerScroll(2)}>Trigger Scroll</button> */}
          {/* <button onClick={() => printState()}>PrintState</button>
          {time} */}

        </div>
        <div className="col-md-1"></div>
        <div className="col-md-7 mt-3">
          <div className="container" id="questionsFrame">
            <DrawQuestions />
          </div>
        </div>
      </div> {/* close row */}
      
    </div>
  )
}

export default GameMasterLiveGame;

  // const baseTimerData = {
  //   labels: [
  //     'Time Remaining',
  //   ],
  //   datasets: [
  //     {
  //       data: [
  //         180, // what's left
  //         0 // what's elapsed
  //       ],
  //       backgroundColor: [
  //         "#34edaf",
  //         "#ed4634"
  //       ]
  //     }
  //   ],
  //   options: {
  //     responsive: true
  //   }
  // }
  // const decrementTimer = () => {
  //   console.log("decrement run");
  //   if (timerData.datasets[0].data[0] > 0) {
  //     let currentTime = [timerData.datasets[0].data[0],timerData.datasets[0].data[1]];
  //     currentTime = [(currentTime[0] - 1),(currentTime[1] + 1)]
  //     setTimerData(
  //       {
  //         datasets: [
  //           {
  //             data: currentTime,
  //             backgroundColor: [
  //               "#34edaf",
  //               "#ed4634"
  //             ]
  //           }
  //         ],
  //         options: {
  //             responsive: true
  //         }
  //       }
  //     )
  //   }
  // }
  // const timerControl = () => {
  //   const timerInterval = setInterval(decrementTimer,1000);
  // }

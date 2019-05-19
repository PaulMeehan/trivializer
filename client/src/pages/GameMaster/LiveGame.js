import React, {useState, useEffect, useRef } from 'react'
import './Admin.css'
import {Pie} from "react-chartjs-2"
import gameAPI from '../../utils/gameAPI'


const GameMasterLiveGame = (props) => {

  const [questions, setQuestions] = useState([])
  const [qNum,setQNum] = useState()
  const [questionIsActive, setQuestionIsActive] = useState()
  const [gameIsActive, setGameIsActive] = useState()
  const [time, setTime] = useState()
  const [timer, setTimer] = useState()

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
        <div className="row">
          <div className="col md-3">
            <a
              className='btn btn-success btn-lg btn-block'
              href="/admin"
            >Back to Admin</a>
          </div>
          <div className="col md-3">
            <button
              className='btn btn-danger btn-lg btn-block'
              onClick={() => startNextQuestion()}
            >Start Over
            </button>
          </div>
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
                // data= {timerData}
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
      <h4>Live game at
        <a href={`trivializer.com/play/${props.username}`} target="_blank">{`  trivializer.com/play/${props.username}`}</a>
      </h4>
      <button onClick={() => printState()}>PrintState</button>
      {time}
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

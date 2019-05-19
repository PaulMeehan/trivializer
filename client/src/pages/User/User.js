import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {Pie} from "react-chartjs-2"
import gameAPI from '../../utils/gameAPI';
import Pusher from 'pusher-js';
import Visibility from '../../components/Visibility/Visibility.js';


const User = ({ userId }) => {

  // need persist memory because for some reason
  // the state variables get reset when pusher sends
  // data into setState
  const persist = {
    qNum: -1,
    question: '',
    choices: ['','','',''],
    answerText: '',
    userChoice: '',
    userChoiceText: '',
    userWasCorrect: '',
    time: 180,
    timer: null,
    whereAreWe: 'preGame',
    userDidAnswer: false,
    timerData: '',
    timerStarted: false,
    pieOptions: {
      legend: {
        display: false,
      },
      responsive: true,
      maintainAspectRatio: true,
    },
    baseTimerData: {
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
  }

  /*
    State & Session mem
  */
  const [qNum, setQNum] = useState()
  const [question, setQuestion] = useState()
  const [choices, setChoices] = useState()
  const [answerText, setAnswerText] = useState()
  const [userChoice, setUserChoice] = useState()
  const [userChoiceText, setUserChoiceText] = useState()
  const [userWasCorrect, setUserWasCorrect] = useState()
  const [time, setTime] = useState()
  const [timer, setTimer] = useState(false)
  const [stateTimer, setStateTimer] = useState()
  const [whereAreWe, setWhereAreWe] = useState('preGame')
  const [timerData, setTimerData] = useState(persist.baseTimerData) // TODO: stop using fake data
  const [pieOptions, setPieOptions] = useState(persist.pieOptions)

  /*
    onLoad & setState logic (where the magic happens)
  */
  useEffect( () => {
    // call for current question
    const host = window.location.pathname.substring(window.location.pathname.indexOf('-')+1)
    gameAPI.getCurrentQuestion(host)
    .then(res => {
      setState(res.data)
    })
    // bind pusher
    Pusher.logToConsole = false
    const pusher = new Pusher('e5795cf1dfac2a8aee31', {
      cluster: 'us2',
      forceTLS: true
    })
    const game = pusher.subscribe('game-question')
    game.bind(host, setState)

  }, [])

  const setState = r => {
    /*
      Function & Variable Farm
    */
    const putPersistentIntoState = (p = persist) => {
      setQNum(p.qNum)
      setQuestion(p.question)
      setChoices(p.choices)
      setAnswerText(p.answerText)
      setUserChoice(p.userChoice)
      setUserChoiceText(p.userChoiceText)
      setTime(p.time)
      setWhereAreWe(p.whereAreWe)
    }
    const findChoice = (ans = false) => {
      const answers = r.ansRcvd
      let found = false
      for (let i in answers) {
        if (answers[i][0] === userId) {
          found = true
          if (ans) found = answers[i][1]
        }
      }
      return found
    }
    const finishedQuestion = () => {
      persist.qNum = r.qNum
      persist.answerText = r.question.answerText
      persist.question = r.question.question
      persist.choices = r.question.choices
    }
    const checkAnswer = () => {
      // console.log("let's find out it we're right")
      const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
      const choice = findChoice(true)
      const choiceText = r.question.choices[alphabet.indexOf(choice)]
      persist.userChoiceText = choiceText
      console.log(r.question.answerText === choiceText)
      persist.userWasCorrect = r.question.answerText === choiceText
      setUserWasCorrect(persist.userWasCorrect)
      // console.log('you were right',persist.userWasCorrect)
    }

    /*
      Logic
      ‾‾‾‾‾‾
      need to determine what's going on with the incoming data, and
      whether or not we need to do anything with it.
    */
    putPersistentIntoState()
    console.log('\n---\nReceived Data from Server\n---')

    // does this game exist?
    if (r && r.hasOwnProperty('message') && r.message.toLowerCase() === 'dne') {
      // No, but were we already here?
      if (persist.whereAreWe === 'dne') {
        console.log("already knew this game didn't exist")
        return  // yes, nothing changed, ignore
      }
      else {
        // no, we need to display the 'dne' screen
        console.log("just found out this game doesn't exist")
        persist.whereAreWe = 'dne'
        putPersistentIntoState()
        return
      }
    }
    // has this game not started?
    else if (r.qNum === -1 && !r.isActive && !r.gameActive) {
      // no, the game hasn't started, but were we already here?
      if (persist.whereAreWe === 'preGame') {
        console.log('already knew we were pregame')
        return // yes, nothing changed, ignore
      }
      else {
        // no, we need to display the 'before' screen
        console.log("just found out we're pregame")
        persist.whereAreWe = 'preGame'
        putPersistentIntoState()
        return
      }
    }
    // is this game over?
    else if (r.qNum === r.game.length - 1 && !r.isActive && r.gameActive) {
      // yes the game is over, but were we already here?
      if (persist.whereAreWe === 'gameOver') {
        console.log('gameOver - we already knew this')
        return // yes, nothing changed, ignore
      }
      else {
        // no, we need to display the 'gameover' screen
        console.log('just found out the game is over')
        finishedQuestion()
        // did we answer the last question?
        if (findChoice()) { // yes we did
          console.log('did we get the last question right?')
          checkAnswer()
        }
        else {  // no we didn't
          persist.userWasCorrect = false
        }
        persist.whereAreWe = 'gameOver'
        putPersistentIntoState()
        return
      }
    }
    // the game must be live, but is there an active question?
    else if (!r.isActive && r.gameActive) {
      // No, but were we already here?
      if (persist.whereAreWe === 'waitScreen' && r.qNum === persist.qNum) {
        console.log('inactive known question - ignored')
        return  //  yes, nothing changed, ignore
      }
      else {
        // No, we need to display the 'inbetween' screen.
        console.log('inactive unknown question')
        finishedQuestion()
        // Did we answer the prior question?
        if (findChoice()) {
          // yes, we need to display our choice & whether or not we are correct
          checkAnswer()
        }
        else {
          // no, we need to display the prior question & 'looks like you didn't answer'
          // or something like that
          console.log("you didn't answer")
          persist.choices = ['','','','']
          persist.userChoice = ''
          persist.userChoiceText = ''
          persist.userWasCorrect = false
          putPersistentIntoState(persist)
          setUserWasCorrect(false)
        }
        persist.whereAreWe = 'waitScreen'
        putPersistentIntoState(persist)
      }
    }
    // a question must be active, but have we answered already?
    else if (r.isActive && findChoice()) {
      // we have answered, but were we already here?
      if (persist.whereAreWe === 'answered') {
        console.log('answered question - we already know')
        return // yes, nothing changed, ignore
      }
      else {
        // no, we need to update, display the 'waiting' screen
        // TODO: clear interval for timer
        console.log('answered question - this is our first time')
        persist.qNum = r.qNum
        persist.answerText = r.question.answerText
        persist.question = r.question.question
        persist.choices = r.question.choices
        persist.whereAreWe = 'answered'
        checkAnswer()
        putPersistentIntoState()
        return
      }
    }
    // then a question must be active that we haven't answered
    else {
      // were we already here?
      if (persist.whereAreWe === 'questionPage' && persist.qNum === r.qNum) {
        console.log('unanswered active question already known - ignore')
        return // nothing changed
      }
      else {
        // this is a live question & we haven't answered it
        // is this the first time we've seen this question?
        if (persist.qNum === r.qNum) {
          console.log('unanswered known question')
          printPersist(persist)
          printState()
          // setWhereAreWe('questionPage')
          return // yes, nothing changed, ignore
        }
        else {
          // this is a new question we haven't answered that we haven't seen before
          console.log('new unanswered question')
          persist.qNum = r.qNum
          persist.question = r.question.question
          persist.choices = r.question.choices
          persist.time = r.question.time
        }
        persist.whereAreWe = 'questionPage'
        putPersistentIntoState()
      }
    }
  }

  /*
    Functions
  */
  const printState = () => {
    console.log('\n-----------------\nCURRENT STATE\n-----------------')
    console.log('question text', question)
    console.table('choices',choices)
    console.log('answerText',answerText)
    console.log('userWasCorrect', userWasCorrect)
    console.log('userChoice', userChoice)
    console.log('userChoiceText',userChoiceText)
    console.log('qNum ', qNum)
    console.log('time ', time)
    console.log('page we are on:',whereAreWe)
  }

  const printPersist = (p = persist) => {
    console.table(p)
  }

  const submitAnswer = userChose => {
    clearInterval(persist.timer)
    const host = window.location.pathname.substring(window.location.pathname.indexOf('-')+1)
    gameAPI.submitAnswer(host, qNum, userChose)
    .then(res => setState(res.data))
    .catch(err => console.log(err))
  }

  const gameTimer = (startTime = false) => {
    let elapsed = 0
    startTime = startTime || time || 180
    const t = setInterval(() => {
      elapsed++
      let remaining = startTime - elapsed
      persist.time = remaining
      setTime(remaining)
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
      if (startTime <= elapsed) {
        clearInterval(t)
        clearInterval(persist.timer)
        clearInterval(timer)
        clearInterval(stateTimer)
        persist.whereAreWe = 'waitScreen'
        setWhereAreWe(persist.whereAreWe)
      }
    }, 1000)
    // persist.timer = t
    setStateTimer(t)
  }

  /*
    Local components
  */
  const DnePage = () => {
    return (
      <div style={{ borderRadius: '5px', maxWidth: '420px', margin: 'auto'}}>
        <div>
          <h1 style={{ padding: '15px', fontFamily: 'Bangers', fontSize: '25px', textAlign: 'center'}}>I couldn't find this game, and I know everything.</h1>
          <h1 style={{ padding: '15px', fontFamily: 'Bangers', fontSize: '25px', textAlign: 'center'}}>So you are WRONG!!!</h1>
          <h3 style={{ padding: '15px', fontFamily: 'Bangers', fontSize: '25px', textAlign: 'center'}}>P.S. Make sure you spelled the host's name correctly</h3>
        </div>
      </div>
    )
  }

  const QuestionPage = () => {
    if (!timer) {
      setTimer(true)
      console.log('here')
      gameTimer(time)
    }
    return (
      <div style={{ borderRadius: '5px', maxWidth: '420px', margin: 'auto'}}>
        <div style={{ borderRadius: '5px', margin: 'auto', maxWidth: "420px", height: 'auto' }}>
          <div style={{ display: 'block', width: '25%', margin: 'auto' }}>
            {time}
            <Pie
              data = {timerData}
              options = {pieOptions}
              redraw = {false}
              width = {200}
          />

          </div>
          <div>
            <h1 style={{ textAlign: 'center'}}>Question: { qNum + 1 }</h1>
            <div style={{ padding: '10px',}}>
              <p style={{ textAlign: 'center'}}>{question}</p>
              <button
                className="btn btn-success btn-large btn-block mb-4"
                onClick={() => submitAnswer('A')}
              >{choices[0]}</button>
              <button
                className="btn btn-success btn-large btn-block mb-4"
                onClick={() => submitAnswer('B')}
              >{choices[1]}</button>
              <button
                className="btn btn-success btn-large btn-block mb-4"
                onClick={() => submitAnswer('C')}
              >{choices[2]}</button>
              <button
                className="btn btn-success btn-large btn-block mb-4"
                onClick={() => submitAnswer('D')}
              >{choices[3]}</button>

            </div>
          </div>
        </div>
        {/* <Visibility /> */}
      </div>
    )
  }

  const AnsweredPage = () => {
    return (
      <div style={{ borderRadius: '5px', maxWidth: '420px', margin: 'auto'}}>
        <div style={{ borderRadius: '5px', margin: 'auto', maxWidth: "420px", height: 'auto' }}>
          <div>
            <h1 style={{ textAlign: 'center'}}>Question: { qNum + 1 }</h1>
            <div style={{ padding: '10px',}}>
              <h3 style={{ textAlign: 'center'}}>{question}</h3>
              <p>You chose "{userChoiceText}"".</p>
              <p>If you're right it's FAME and FORTUNE. If you're wrong...</p>
              <p>Well, I guess you just don't get any points.</p>
              <p>Either way, sit tight and we'll find out</p>
            </div>
          </div>
        </div>
      </div>
    )

  }

  const GameOverPage = () => {
    return (
      <div style={{ borderRadius: '5px', maxWidth: '420px', margin: 'auto'}}>
        <div>
          <h1 style={{ padding: '15px', fontFamily: 'Bangers', fontSize: '25px', textAlign: 'center', color: 'white'}}>GAME OVER!</h1>
          <DidUserAnswer />
        </div>
      </div>
    )
  }

  const WaitScreenPage = () => {
    clearInterval(persist.timer)
    setTimer(false)
    return (
      <div style={{ borderRadius: '5px', maxWidth: '420px', margin: 'auto'}}>
        <div>
          <DidUserAnswer />
        </div>
      </div>
    )
  }

  const PreGamePage = () => {
    return (
      <div style={{ borderRadius: '5px', maxWidth: '420px', margin: 'auto'}}>
          <div>
            <h1 style={{ padding: '15px', fontFamily: 'Bangers', textAlign: 'center'}}>This is the PREGAME! DRINK UP!</h1>
            <h3 style={{ padding: '15px', fontFamily: 'Bangers', textAlign: 'center'}}>We start when I say we start</h3>
          </div>
      </div>
    )
  }

  const DidUserAnswer = () =>  {

    const block = []

    if (userChoiceText === '') {
      block.push(
        <div key={1}>You didn't answer! No points for you!</div>
      )
    }
    else {
      const rightWrong = answerText === userChoiceText? 'Right!!!' : 'Wrong!!!'
      block.push(
        <div key={1}>
          <div key={3}>You chose : "{userChoiceText}"</div>
          <div key={2}>The answer was : "{answerText}"</div>
          <div key={4}>You were {rightWrong}</div>
        </div>
      )
    }
    return block
  }

  const LocalRouter = () => {
    const pages = {
      dne: <DnePage />,
      questionPage: <QuestionPage />,
      answered: <AnsweredPage />,
      gameOver: <GameOverPage />,
      waitScreen: <WaitScreenPage />,
      preGame: <PreGamePage />,
    }
    return pages[whereAreWe]
  }


  /*
    Main screen body
  */
  return (
    <div>
      <button onClick={() => printState()}>Print State</button>
      <LocalRouter />
    </div>
  )
}

export default User;

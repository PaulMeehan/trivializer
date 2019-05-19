
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gameAPI from '../../utils/gameAPI';
import Pusher from 'pusher-js';
import Visibility from '../../components/Visibility/Visibility.js';


const User = ({ userId }) => {
  const [host, setHost] = useState()
  const [qNum, setQNum] = useState()
  const [question, setQuestion] = useState()
  const [choices, setChoices] = useState()
  const [answerText, setAnswerText] = useState()
  const [userChoice, setUserChoice] = useState()
  const [userChoiceText, setUserChoiceText] = useState()
  const [userWasCorrect, setUserWasCorrect] = useState()
  const [time, setTime] = useState()
  const [whereAreWe, setWhereAreWe] = useState()
  // need persist memory because for some reason
  // the state variables get reset when pusher sends
  // data into setState
  const persist = {
    host: null,
    qNum: null,
    question: null,
    choices: null,
    answerText: null,
    userChoice: null,
    userChoiceText: null,
    userWasCorrect: null,
    time: null,
    timer: null,
    whereAreWe: null
  }


  useEffect( () => {
    // call for current question
    const hostname = window.location.pathname.substring(window.location.pathname.indexOf('-')+1)
    setHost(hostname)
    gameAPI.getCurrentQuestion(hostname)
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
    // TODO: change the binding to hostname from window.location.href
    game.bind(hostname, setState)

  }, [])

  const printState = () => {
    console.log('\n-----------------\nCURRENT STATE\n-----------------')
    console.log('Host:',host)
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

  const setState = r => {
    /*
      Function & Variable Farm
    */
    const putPersistentIntoState = () => {
      setHost(persist.host)
      setQNum(persist.qNum)
      setQuestion(persist.question)
      setChoices(persist.choices)
      setAnswerText(persist.answerText)
      setUserChoice(persist.userChoice)
      setUserChoiceText(persist.userChoiceText)
      setTime(persist.time)
      setWhereAreWe(persist.whereAreWe)
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
      console.log("let's find out it we're right")
      const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
      const choice = findChoice(true)
      const choiceText = r.question.choices[alphabet.indexOf(choice)]
      persist.userChoiceText = choiceText
      persist.userWasCorrect = r.question.answerText = choiceText
      console.log('you were right',r.question.answerText === choiceText)
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
          persist.choices = null
          persist.userChoice = null
          persist.userChoiceText = null
          persist.userWasCorrect = false
        }
        persist.whereAreWe = 'waitScreen'
        putPersistentIntoState()
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


  return (
    <div>
      <button onClick={() => printState()}>Print State</button>
      <div>User page</div>
    </div>
  )
}

export default User;

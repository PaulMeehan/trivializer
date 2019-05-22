import React, {useState, useEffect} from 'react';
import './Admin.css';
import gameAPI from '../../utils/gameAPI'
import { Link } from 'react-router-dom';

const defaultQuestionTime = 30

const GameMasterAdmin = () => {

  const [questions, setQuestions] = useState([]);
  const [newQ, setNewQ] = useState();
  const [newA1, setNewA1] = useState();
  const [newA2, setNewA2] = useState();
  const [newA3, setNewA3] = useState();
  const [newA4, setNewA4] = useState();
  const [newCorrect, setNewCorrect] = useState();

  useEffect(() => {
    gameAPI.getQuestions()
      .then(res => {
        console.log('***\nHERE\n***\n',res)
        // test whether or not we have something to draw
        let test = res.data.hasOwnProperty('game') && res.data.game.hasOwnProperty('length')
        if (test) test = true && res.data.game.length > 0
        // if all tests passed then we have something to draw
        if (test) {
          setQuestions(res.data.game)
        }
        else {
          console.log('bad data')
          // we don't have any data - don't try to draw anything
          return
        }
      })
      .catch(err => console.log(err))
  }, [])

  const deleteQuestion = id => {
    const tempQuestions = []
    // don't use splice - it wasn't working on when length = 1. The ghetto method doesn't break
    for (let i = 0; i < questions.length; i++) {
      if (i !== id) tempQuestions.push(questions[i])
    }
    setQuestions(tempQuestions)
    gameAPI.setQuestions(tempQuestions)
      .then(res => setQuestions(res.data.game))
      .catch(err => console.log(err))
  }

  const handleInputChange = event => {
    const updateAppropriateState = {
      questionText: setNewQ,
      answerA: setNewA1,
      answerB: setNewA2,
      answerC: setNewA3,
      answerD: setNewA4,
      correctAnswer: setNewCorrect
    }
    updateAppropriateState[event.target.name](event.target.value)
  }

  const addQuestion = () => {
    if (!newCorrect) return
    let tempQuestions = questions && questions.length > 0 ? [...questions] : []
    const newQuestion = {
      question: newQ,
      choices: [newA1, newA2, newA3, newA4],
      answer: newCorrect,
      time: defaultQuestionTime
    }
    tempQuestions.push(newQuestion)
    gameAPI.setQuestions(tempQuestions)
      .then((res) => {
        setQuestions(res.data.game)
        document.getElementById("addQuestionForm").reset();
      })
      .catch(err => console.log(err))
  }

  /*
    Component
  */
  const AdminGameDiv = (q, i) => {
    return (
      <div className="row border mb-3 p-3" key={i*100}>
        <div className="col-md-1" key={i*100 + 1}>
          <h1 key={i*100 + 2}>{i + 1}.</h1>
        </div>
        <div className="col-md-4" key={i*100 + 3}>
          <h4 key={i*100 + 4}>{q.question}</h4>
        </div>
        <div className="col-md-4" key={i*100 + 5}>
          <p className={ (q.answer === "A") ? "correctAnswer" : "" } key={i*100 + 6}>A. {q.choices[0]}</p>
          <p className={ (q.answer === "B") ? "correctAnswer" : "" } key={i*100 + 7}>B. {q.choices[1]}</p>
          <p className={ (q.answer === "C") ? "correctAnswer" : "" } key={i*100 + 8}>C. {q.choices[2]}</p>
          <p className={ (q.answer === "D") ? "correctAnswer" : "" } key={i*100 + 9}>D. {q.choices[3]}</p>
        </div>
        <div className="col-md-3" key={i*100 + 10}>
          <button
            key={i*100 + 11}
            onClick={() => deleteQuestion(i)}
            className="btn btn-danger"
          >Delete Question</button>
        </div>
      </div>
    )
  }

  const DrawAdminGameDiv = last => {
    last = last || false
    let block = [], q, test

    // test whether or not we have anything to draw
    test = questions.hasOwnProperty('length') && questions.length > 0
    if (!test) {
      // we don't - return an empty div (have to return something)
      return <div></div>
    }
    // we have something to draw

    // check whether or not we're supposed to just draw the last element
    if (last === true) {
      const qNum = Math.max(questions.length - 1, 0)
      q = questions[qNum]
      if (q) block.push(AdminGameDiv(q,qNum))
      return block
    }
    // Nope, we want all the elements, and we know we have at least 1
    for (let i = 0; i < questions.length; i++) {
      q = questions[i]
      block.push(AdminGameDiv(q,i))
    }
    return block
  }

  return(
    <div className="container">
      {/* header div */}
      <div className="row">
        <div className="col-md-12">
          <Link to="/live-game" className="btn btn-success btn-large btn-block mb-4"><h2>Start Your Game</h2></Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 p-0">
          <div className="header">
            <h2>Add Question to Game:</h2>
          </div>
          <div className="border p-4">
            <h4>Question Text:</h4>
            <form id="addQuestionForm">
              <textarea id="questionText" name="questionText" className="form-control mb-3" onChange={handleInputChange}></textarea>
              <h4>Answers (Don't Forget to Select Correct Answer):</h4>
              <table width="100%">
                <tbody>
                  <tr>
                    <td></td>
                    <td className="text-center">Answer Text:</td>
                    <td className="text-center">Correct?</td>
                  </tr>
                  <tr>
                    <td>A.</td>
                    <td><input type="text" id="answerA" name="answerA" className="form-control" onChange={handleInputChange}></input></td>
                    <td className="text-center"><input type="radio" name="correctAnswer" value="A" onChange={handleInputChange}></input></td>
                  </tr>
                  <tr>
                    <td>B.</td>
                    <td><input type="text" id="answerB" name="answerB" className="form-control" onChange={handleInputChange}></input></td>
                    <td className="text-center"><input type="radio" name="correctAnswer" value="B"  onChange={handleInputChange}></input></td>
                  </tr>
                  <tr>
                    <td>C.</td>
                    <td><input type="text" id="answerC" name="answerC" className="form-control" onChange={handleInputChange}></input></td>
                    <td className="text-center"><input type="radio" name="correctAnswer" value="C"  onChange={handleInputChange}></input></td>
                  </tr>
                  <tr>
                    <td>D.</td>
                    <td><input type="text" id="answerD" name="answerD" className="form-control" onChange={handleInputChange}></input></td>
                    <td className="text-center"><input type="radio" name="correctAnswer" value="D"  onChange={handleInputChange}></input></td>
                  </tr>
                </tbody>
              </table>
            </form>
            <button onClick={() => addQuestion()} className="btn btn-success btn-block mt-3">Add Question to Game</button>
          </div>
        </div> {/* close md-4 col */}
        <div className="col-md-1"></div>
        <div className="col-md-7 p-0 m-0">

          {/* Most recent question */}
          <div className="header">
            <h2>Last Question Added:</h2>
          </div>
          <div className="border p-3 m-0 mb-5">
              <div className="container">
                {DrawAdminGameDiv(true)}
              </div>
          </div>

          {/* All saved questions */}
          <div className="header">
            <h2>All Saved Questions:</h2>
          </div>
          <div className="border p-3 m-0">
              <div className="container">
                <DrawAdminGameDiv />
              </div>
          </div>

        </div>
      </div>
      <div className="row border mt-4">
        <div className="col-md-12"></div>
      </div>
    </div>
  )
}

export default GameMasterAdmin;
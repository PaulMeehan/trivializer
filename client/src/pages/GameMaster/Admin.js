import React, {useState, useEffect} from 'react';
import './Admin.css';
import AdminGameDiv from "../../components/Admin/AdminGameDiv";
import gameAPI from '../../utils/gameAPI'
import { Link } from 'react-router-dom'

const defaultQuestionTime = 180

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
      .then(res => setQuestions(res.data.game))
      .catch(err => console.log(err))
  }, [])

  const deleteQuestion = id => {
    const tempQuestions = [...questions]
    setQuestions(tempQuestions.splice(id,1))
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
    console.log ("In addQuestion");
    console.log (newCorrect);
    if (!newCorrect) return
    const tempQuestions = [...questions]
    const newQuestion = {
      question: newQ,
      choices: [newA1, newA2, newA3, newA4],
      answer: newCorrect,
      time: defaultQuestionTime
    }
    tempQuestions.push(newQuestion)
    gameAPI.setQuestions(tempQuestions)
      .then(res => setQuestions(res.data.game))
      .catch(err => console.log(err))
  }

  return(
    <div className="container">
      {/* header div */}
      <div className="row">
        <div className="col-md-12">
          <h1>Your Game:</h1>
        </div>
      </div>
      {/* new uestion div */}
      <div className="row mt-4">
        <div className="col-md-7 border">
          <h2>Add Question to Game:</h2>
          <h4>Question Text:</h4>
          <form id="addQuestionForm">
            <textarea id="questionText" name="questionText" onChange={handleInputChange}></textarea>
            <h4>Question Answers (Don't Forget to Select Correct Answer):</h4>
            <table>
              <tbody>
                <tr>
                  <td>A.</td>
                  <td><input type="text" id="answerA" name="answerA" onChange={handleInputChange}></input></td>
                  <td><input type="radio" name="correctAnswer" value="A" onChange={handleInputChange}></input></td>
                </tr>
                <tr>
                  <td>B.</td>
                  <td><input type="text" id="answerB" name="answerB" onChange={handleInputChange}></input></td>
                  <td><input type="radio" name="correctAnswer" value="B"  onChange={handleInputChange}></input></td>
                </tr>
                <tr>
                  <td>C.</td>
                  <td><input type="text" id="answerC" name="answerC" onChange={handleInputChange}></input></td>
                  <td><input type="radio" name="correctAnswer" value="C"  onChange={handleInputChange}></input></td>
                </tr>
                <tr>
                  <td>D.</td>
                  <td><input type="text" id="answerD" name="answerD" onChange={handleInputChange}></input></td>
                  <td><input type="radio" name="correctAnswer" value="D"  onChange={handleInputChange}></input></td>
                </tr>
              </tbody>
            </table>
          </form>
          <button onClick={() => addQuestion()} className="btn btn-success">Add Question to Game</button>
        </div>
        <div className="col-md-1">
          {/* spacer div */}
        </div>
        <div className="col-md-4 border">
          {/* <a href="/live-game" className="btn btn-success">Start Your Game</a> */}
          <Link to="/live-game" className="btn btn-success">Start Your Game</Link>
        </div>
      </div>
      {/* saved questions div */}
      <div className="row border mt-4">
        <div className="col-md-12">
          <h2>Saved Questions:</h2>
          <div className="container">
          {questions?
            (
              questions.map( (question, i) => {
                return (
                  <AdminGameDiv
                    realQNumber = {i}
                    qNumber = {i + 1}
                    key = {question.question}
                    qText = {question.question}
                    a1 = {question.choices[0]}
                    a2 = {question.choices[1]}
                    a3 = {question.choices[2]}
                    a4 = {question.choices[3]}
                    correct = {question.answer}
                    deleteQuestion = {deleteQuestion}
                  />
                )
              })
            ) : (
              <h4>No current questions</h4>
            ) }
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameMasterAdmin;
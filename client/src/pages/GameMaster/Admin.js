import React, {useState, useEffect} from 'react';
import './Admin.css';
import AdminGameDiv from "../../components/Admin/AdminGameDiv";
import gameAPI from '../../utils/gameAPI'
import { Link } from 'react-router-dom';

const defaultQuestionTime = 180

const GameMasterAdmin = () => {

  const [questions, setQuestions] = useState([]);
  const [newQ, setNewQ] = useState();
  const [newA1, setNewA1] = useState();
  const [newA2, setNewA2] = useState();
  const [newA3, setNewA3] = useState();
  const [newA4, setNewA4] = useState();
  const [newCorrect, setNewCorrect] = useState();
  const [questionCount, setQuestionCount] = useState();

  useEffect(() => {
    gameAPI.getQuestions()
      .then(function(res) {
        setQuestions(res.data.game)
        setQuestionCount(res.data.game.length -1)
      })
      .catch(err => console.log(err))
  }, [])

  const deleteQuestion = id => {
    const tempQuestions = [...questions]
    setQuestions(tempQuestions.splice(id,1))
    gameAPI.setQuestions(tempQuestions)
      .then(function(res) {
        setQuestions(res.data.game)
        setQuestionCount(res.data.game.length -1)
      })
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
    const tempQuestions = [...questions]
    const newQuestion = {
      question: newQ,
      choices: [newA1, newA2, newA3, newA4],
      answer: newCorrect,
      time: defaultQuestionTime
    }
    tempQuestions.push(newQuestion)
    gameAPI.setQuestions(tempQuestions)
      .then(function(res) {
        setQuestions(res.data.game)
        setQuestionCount(res.data.game.length -1)
      })
      .catch(err => console.log(err))
  }

  console.log({questions})

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

          <div className="header">
            <h2>Last Question Added:</h2>
          </div>
          <div className="border p-3 m-0 mb-5">
              <div className="container">

                { (questions[questionCount]) ?

                <AdminGameDiv
                  realQNumber = {questionCount}
                  qNumber = {questionCount + 1}
                  key = {questions[questionCount].question}
                  qText = {questions[questionCount].question}
                  a1 = {questions[questionCount].choices[0]}
                  a2 = {questions[questionCount].choices[1]}
                  a3 = {questions[questionCount].choices[2]}
                  a4 = {questions[questionCount].choices[3]}
                  correct = {questions[questionCount].answer}
                  deleteQuestion = {deleteQuestion}
                />

                :

                ""

                }

                {/* <div className="row border mt-3 p-3">
                  <div className="col-md-1">
                    <h1>{questionCount}.</h1>
                  </div>
                  <div className="col-md-4">
                    <h4>{ (questions[questionCount]) ? questions[questionCount].question : ""}</h4>
                  </div>
                  {/* <div className="col-md-4">
                    <p className={ (questions[questions.length].answer == "A") ? "correctAnswer" : "" }>A. {questions[questions.length].choices[0]}</p>
                    <p className={ (questions[questions.length].answer == "B") ? "correctAnswer" : "" }>B. {questions[questions.length].choices[1]}</p>
                    <p className={ (questions[questions.length].answer == "C") ? "correctAnswer" : "" }>C. {questions[questions.length].choices[2]}</p>
                    <p className={ (questions[questions.length].answer == "D") ? "correctAnswer" : "" }>D. {questions[questions.length].choices[3]}</p>
                  </div> */}
                  {/* <div className="col-md-3"> */}
                    {/* <button
                      onClick={() => props.deleteQuestion(props.realQNumber)}
                      className="btn btn-light"
                    >Delete Question</button> */}
                  {/* </div>
                </div> */}
              </div>
          </div> {/* close border wrapper div */}

          <div className="header">
            <h2>All Saved Questions:</h2>
          </div>
          <div className="border p-3 m-0">
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
          </div> {/* close border wrapper div */}

        </div> {/* close md-7 col */}
      </div>
      {/* new uestion div */}
      
      {/* saved questions div */}
      <div className="row border mt-4">
        <div className="col-md-12">
          
        </div>
      </div>
    </div>
  )
}

export default GameMasterAdmin;
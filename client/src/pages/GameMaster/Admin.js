import React, {useState, useEffect} from 'react';
import './Admin.css';
import AdminGameDiv from "../../components/Admin/AdminGameDiv";
import axios from "axios";
import gameAPI from '../../utils/gameAPI'
// const API = require('../../utils/gameAPI')

const defaultQuestionTime = 180
const preQuestions = [
  {
    question: "According to a Beatles song, who kept her face in a jar by the door?",
    choices: ["Eleanor Rigby", "Loretta Martin", "Molly Jones", "Lady Madonna"],
    answer: 0,
    time: defaultQuestionTime
  },
  {
    question: "What is the stage name of English female rapper Mathangi Arulpragasam, who is known for the song &quot;Paper Planes&quot;?",
    choices: ["K.I.A.", "C.I.A.", "M.I.A.", "A.I.A."],
    answer: 2,
    time: defaultQuestionTime
  },
  {
    question: "Which one of these Rammstein songs has two official music videos?",
    choices: ["Du Hast", "Benzin", "Mein Teil", "Du Riechst So Gut"],
    answer: 3,
    time: defaultQuestionTime
  },
  {
    question: "Which rock band released the album &quot;The Bends&quot; in March 1995?",
    choices: ["Nirvana", "Radiohead", "Lemonheads", "U2"],
    answer: 1,
    time: defaultQuestionTime
  },
  {
    question: "Which band recorded the album &quot;Parallel Lines&quot;?",
    choices: ["The Police", "Coldplay", "Paramore", "Blondie"],
    answer: 3,
    time: defaultQuestionTime
  },
  {
    question: "Which of these aliases has NOT been used by electronic musician Aphex Twin?",
    choices: ["Burial", "Caustic Window", "Bradley Strider", "GAK"],
    answer: 0,
    time: defaultQuestionTime
  }
]

const GameMasterAdmin = () => {

  const [questions, setQuestions] = useState(preQuestions);
  // const [questions, setQuestions] = useState();
  const [newQ, setNewQ] = useState();
  const [newA1, setNewA1] = useState();
  const [newA2, setNewA2] = useState();
  const [newA3, setNewA3] = useState();
  const [newA4, setNewA4] = useState();
  const [newCorrect, setNewCorrect] = useState();

  const getQuestions = () => {
    // /api/questions
    // GET request
    console.log("getQuestions triggered");
    gameAPI.getQuestions()
      .then(res => {
        console.log(res.data);
        // setQuestions(res.data.questions);
      })
      .catch(err => console.log(err))
  }

  useEffect( () => {
    // 1st arg: callback
    // 2nd arg: array of variables to watch
    // if empty, runs once.
    getQuestions()
    }, []
  )

  const deleteQuestion = (id) => {
    console.log("deleteQuestion triggered");
    const tempQuestions = [...questions];
    const throwAway = tempQuestions.splice(id,1);
    setQuestions(tempQuestions);
    // console.log(questions)
    // not sure why it will write throwAway to state but not tempQuestions
    gameAPI.setQuestions(tempQuestions)
      .then(res => {
        console.log("positive response to delete question");
        console.log(res.data);
        // getQuestions();
      })
      .catch(err => console.log(err))
  }

  const handleInputChange = event => {
    // console.log(event.target.name + " change detected")
    const name = event.target.name;
    const value = event.target.value;
    const updateAppropriateState = {
      questionText: setNewQ,
      answerA: setNewA1,
      answerB: setNewA2,
      answerC: setNewA3,
      answerD: setNewA4,
      correctAnswer: setNewCorrect
    }
    updateAppropriateState[name](value)
  }

  const printState = () => {
    console.log(newQ,"\n",newA2,"\n",newA3,"\n",newA4,"\n",newCorrect);
    console.log(questions)
  }

  const addQuestion = () => {
    // event.preventDefault();
    const tempQuestions = [...questions];
    const newQuestion = {
      question: newQ,
      choices: [newA1, newA2, newA3, newA4],
      answer: newCorrect,
      time: defaultQuestionTime
    }
    tempQuestions.push(newQuestion)
    console.log(tempQuestions)
    setQuestions(tempQuestions)
    gameAPI.setQuestions(tempQuestions)
      .then(response => {
        console.log("positive response to delete question");
        console.log(response);
        // getQuestions();
      })
      .catch(err => {
        console.log(err);
      })
  }

  const startGame = () => {
      // /api/next
      gameAPI.nextQuestion()
  }

  return(
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1>Your Game:</h1>
        </div>
      </div>
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
          <button onClick={() => addQuestion()}>Add Question to Game</button>
        </div>
        <div className="col-md-1">
          {/* spacer div */}
        </div>
        <div className="col-md-4 border">
          <button onClick={() => startGame()}>Start Your Game</button>
          <button onClick={() => printState()}>Print State</button>
        </div>
      </div>
      <div className="row border mt-4">
        <div className="col-md-12">
          <h2>Saved Questions:</h2>
          <div className="container">
            {
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
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameMasterAdmin;
import React, {useState, useEffect} from 'react'
import './Admin.css'
import {Pie} from "react-chartjs-2"
import AdminLiveQDiv from "../../components/Admin/AdminLiveQDiv"
import axios from 'axios'
import gameAPI from '../../utils/gameAPI'

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

  const [questions, setQuestions] = useState(preQuestions)
  const [currentQNumber,setCurrentQNumber] = useState(2)
  const [isActive,setIsActive] = useState()
  const [timerData, setTimerData] = useState(baseTimerData); // not doing anything at the moment

  const getQuestions = () => {
      console.log("getQuestions triggered");
      gameAPI.getQuestions()
        .then(response => {
            console.log(response.data);
            setQuestions(response.data.questions);
            setIsActive(response.data.isActive);
            setCurrentQNumber(response.data.qNum);
            // response.data.time
        })
        .catch(err => console.log(err))
  }

  useEffect( () => {
      // getQuestions() 
  },[]
  // 1st arg: callback
  // 2nd arg: array of variables to watch
      // if empty, runs once. 
  )

  const launchQuestion = () => {
      axios.post("/api/next","")
          .then(response => {
              console.log("positive response from DB");
              getQuestions();
          })
          .catch(err => {
              console.log(err);
          })
  }

  const showAnswer = () => {
      axios.post("/api/end","")
          .then(response => {
              console.log("positive response from DB");
              getQuestions();
          })
          .catch(err => {
              console.log(err);
          })
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
  

  

  return(

      <div className="container">
      
          <div className="row mt-4">
          
              <div className="col-md-12">
                  <div className="container">
                      <button
                          className="btn btn-success btn-lg btn-block"
                          onClick={() => launchQuestion()}
                      >Start Game</button>
                      {questions.map( (item, index) => (
                          <AdminLiveQDiv
                              realQNumber = {index}
                              qNumber = {index + 1}
                              key = {item[0]}
                              qText = {item[0]}
                              a1 = {item[1]}
                              a2 = {item[2]}
                              a3 = {item[3]}
                              a4 = {item[4]}
                              timerData = {timerData}
                              currentQNumber = {currentQNumber}
                              launchQuestion = {launchQuestion}
                              showAnswer = {showAnswer}
                          />
                      ))}
                  </div>
              </div>

          </div>



      </div>

  ) 

}

export default GameMasterLiveGame;
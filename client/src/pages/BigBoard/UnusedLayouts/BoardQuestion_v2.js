import React, {useState, useEffect} from 'react';
import {Pie, Bar} from "react-chartjs-2";
import '../../pages/BigBoard/BigBoard.css';
import LiveQuestion from "../../../components/BigBoard/LiveQuestion";
import PostQuestion from '../../../components/BigBoard/PostQuestion';
import NotStarted from '../../../components/BigBoard/NotStarted';
import gameAPI from '../../../utils/gameAPI'
import Pusher from 'pusher-js'

const defaultQuestionTime = 30

const fakeTimerData = {
    datasets: [
        {
            data: [
                15,
                0
            ],
            backgroundColor: [
                "#34edaf",
                "#ed4634"
            ]
        }
    ]
}

    

const BoardQuestion = (props) => {

    


    // TODO: update this to sync up with the slight tweaks dave made to the structure, specifically around gameActive and isActive
    const [boardBlob, setBoardBlob] = useState(
        {
            question: { // question data for the current question
                question: "",
                choices: ["", "", "", ""],
                answer: "",
                answerText: "",
                time: defaultQuestionTime
            },
            isActive: false, // is the question live or post?
            gameActive: false, // is the game active
            totalQ: 0, // the total # of questions in the game
            qNum: 0, // The true question number. We'll do the +1 on the front end where needed
            ansRcvd: [ // this array should update as answers are received
            ],
            barData: { // everything to build out the post-question bar graph
                labels: [ // populated based on current question
                    "", // A.
                    "", // B.
                    "", // C.
                    "" // D.
                ],
                datasets: [
                    {
                        data: [ // the number of submissions for each answer
                            0, // A.
                            0, // B. 
                            0, // C.
                            0 // D.
                        ],
                        backgroundColor: [ // set colors for the 'post' bar graph
                            // correct answer color: #34edaf
                            // wrong answer color: #ed4634
                            "#34edaf", // A.
                            "#ed4634", // B.
                            "#ed4634", // C.
                            "#ed4634" // D.
                        ]
                    }
                ]
            } // close barData
        }
    );

/// ======================================================
/// ======================================================
/// DAVE TIME STUFF

    const [time, setTime] = useState()
    const [timer, setTimer] = useState()
    const [timerData, setTimerData] = useState(fakeTimerData); // TODO: stop using fake data

    const gameTimer = (startTime = false) => {
        let elapsed = 0
        startTime = startTime || time || boardBlob.game[0].time
        const t = setInterval(() => {
          elapsed++
          setTime(startTime - elapsed)
        //   gameAPI.setTime(startTime - elapsed)
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

    const endQuestion = () => {
        clearInterval(timer)
        console.log("boardBlob in endQuestion()")
        console.log(boardBlob);
        console.log(boardBlob.game)
        // reset the time on this question first, then call endQuestion
        let time, q = boardBlob.qNum - 1
        // if (boardBlob.qNum - 1 <= 0) q = boardBlob.qNum + 1
        // if (boardBlob.game.length <= 1) time = 30

        // if (Object.keys(boardBlob.game).length <= 1) time = 30

        if(boardBlob.totalQ = 1) q=boardBlob.qNum +1

        else {
          time = boardBlob.game[q].time
        }
      }

/// ======================================================
/// ======================================================

    // const [timerData, setTimerData] = useState(fakeTimerData); // TODO: stop using fake data
    const [timesUp, setTimesUp] = useState(false);
    const [pieOptions, setPieOptions] = useState( // TODO: had to create this separate state object b/c answerData.options wouldn't work
        {
            responsive: true,
            maintainAspectRatio: false,
        }
    );
    const [barOptions, setBarOptions] = useState(
        {
            legend: {
                display: false,
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: "#ffffff",
                        fontSize: 30,
                        fontFamily: "'Bangers', sans-serif"
                    },
                    gridLines: {
                        color: "#ffffff"
                    }      
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        fontColor: "#ffffff",
                        fontSize: 30,
                        stepSize: 1,
                    },
                    gridLines: {
                        color: "#ffffff"
                    }     
                }]
            }
        }
    )

    // timerData / setTimerData is the state name
    // const fakeTimerData = {
    //     datasets: [
    //         {
    //             data: [
    //                 15,
    //                 0
    //             ],
    //             backgroundColor: [
    //                 "#34edaf",
    //                 "#ed4634"
    //             ]
    //         }
    //     ]
    // }

    useEffect( () => {
        console.log("useEffect() triggered");
        console.log("username");
        // console.log(props.userID);
        gameAPI.getCurrentQuestion(props.userID)
            .then(function(res) {
                console.log('response received');
                // console.log(res.data)
                setBoardBlob(res.data)
                setTimerData({
                    datasets: [
                        {
                            data: [
                                res.data.question.time,
                                0
                            ],
                            backgroundColor: [
                                "#34edaf",
                                "#ed4634"
                            ]
                        }
                    ]
                })
                // timerControl()
                gameTimer(res.data.question.time)
            })
            // .then(res => setBoardBlob(res.data))
            .catch(err => console.log(err))
        // PUSHER
        Pusher.logToConsole = false
        const pusher = new Pusher('e5795cf1dfac2a8aee31', {
            cluster: 'us2',
            forceTLS: true
        })
        const game = pusher.subscribe('game-question')
        console.log("=== PUSHER ===")
        console.log(props.userID);
        game.bind(props.userID,function(data){
            // console.log(data)
            setBoardBlob(data)
            console.log("data.question.time = " + data.question.time)
            console.log("timerData.datasets[0].data[0] = " + timerData.datasets[0].data[0])
            if (data.isActive === true) {
                gameTimer(data.question.time)
            }
            if (data.isActive === false) {
                endQuestion();
            }
            // if ( Math.abs(data.question.time - timerData.datasets[0].data[0]) > 10 ) {
            //     console.log("running setTimerData b/c time different too large")
            //     setTimerData({
            //         datasets: [
            //             {
            //                 data: [
            //                     data.question.time - 2,
            //                     0
            //                 ],
            //                 backgroundColor: [
            //                     "#34edaf",
            //                     "#ed4634"
            //                 ]
            //             }
            //         ]
            //     })
            // }
        })
    },[])


    const decrementTimer = () => {
        console.log("decrement check");
        console.log("timerData.datasets[0].data[0] = " + timerData.datasets[0].data[0])
        console.log("boardBlob.isActive = " + boardBlob.isActive)
        if ( (timerData.datasets[0].data[0] > 0) && (boardBlob.isActive === true) )  {
        // if ( (boardBlob.isActive === true) )  {
            console.log("IF condition met")
            let currentTime = [ timerData.datasets[0].data[0], timerData.datasets[0].data[1] ];
            console.log("currentTime = " + currentTime)
            currentTime = [(currentTime[0] - 1),(currentTime[1] + 1)]
            console.log("currentTime = " + currentTime)
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
                    ]
                }
            )
        } else {
            console.log("ELSE condition met")
            setTimesUp(true);
        }
    }

    const timerControl = () => {
        const timerInterval = setInterval(decrementTimer,1000);
    }

    return(

        <div>
            
            <p>timerData.datasets[0].data[0]: {timerData.datasets[0].data[0]}</p>
            <p>timerData.datasets[0].data[1]: {timerData.datasets[0].data[1]}</p>

            {(boardBlob.gameActive === true) ? <h1 className="text-center mt-3 question p-3 mb-4">({boardBlob.qNum + 1}/{boardBlob.totalQ}) {boardBlob.question.question}</h1> : ""}

            {(boardBlob.gameActive === false) ? 

                // WHAT TO SHOW IF GAME IS NOT RUNNING

                <NotStarted
                    userID = {props.userID}
                />                

                :

                // WHAT TO SHOW IF GAME IS RUNNING
                // START NESTED TERNARY
                (boardBlob.isActive === true) ?

                    <LiveQuestion 
                        ans1 = {boardBlob.question.choices[0]}
                        ans2 = {boardBlob.question.choices[1]}
                        ans3 = {boardBlob.question.choices[2]}
                        ans4 = {boardBlob.question.choices[3]}
                        ansRcvd = {boardBlob.ansRcvd}
                        timesUp = {timesUp} // TODO: need to update this one
                        timerData = {timerData} // TODO: need to update this one
                        timerControl = {timerControl} // TODO: need to update this one
                        question = {boardBlob.question}
                        qNum = {boardBlob.qNum}
                        pieOptions = {pieOptions}
                    />
        
                    :
        
                    <PostQuestion
                        ans1 = {boardBlob.question.choices[0]}
                        ans2 = {boardBlob.question.choices[1]}
                        ans3 = {boardBlob.question.choices[2]}
                        ans4 = {boardBlob.question.choices[3]}
                        ansLetter = {boardBlob.question.answer}
                        correctAnswerText = {boardBlob.question.answerText}
                        barData = {boardBlob.barData}
                        barOptions = {barOptions}
                    />
        
                // close nested ternary

            } {/* close main ternary */}
                
        </div>
    )

}

export default BoardQuestion;
import React, {useState, useEffect} from 'react';
import {Pie, Bar} from "react-chartjs-2";
import '../../pages/BigBoard/BigBoard.css';
// import './BoardQuestion.css';
import LiveQuestion from "../../components/BigBoard/LiveQuestion";
import PostQuestion from '../../components/BigBoard/PostQuestion';
import gameAPI from '../../utils/gameAPI'

const defaultQuestionTime = 180

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

    console.log('username:');
    console.log(props.userID);

    // TODO: onload, need to pull all questions
    // TODO: get the current question #
    // TODO: get if the question is active

    const decrementTimer = () => {
        console.log("decrement run");
        if (timerData.datasets[0].data[0] > 0) {
            let currentTime = [ timerData.datasets[0].data[0], timerData.datasets[0].data[1] ];
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
                    ]
                }
            )
        } else {
            setTimesUp(true);
        }
    }

    const timerControl = () => {
        const timerInterval = setInterval(decrementTimer,1000);
    }

    // const toggleStatus = () => {
    //     if ( qStatus === "live" ) {
    //         setQStatus("post")
    //     }
    //     if ( qStatus === "post" ) {
    //         setQStatus("live")
    //     }
    // }
    
    // const [boardBlob, setBoardBlob] = useState(
    //     {
    //         question: { // question data for the current question
    //             question: "According to a Beatles song, who kept her face in a jar by the door?",
    //             choices: ["Eleanor Rigby", "Loretta Martin", "Molly Jones", "Lady Madonna"],
    //             answer: "A",
    //             answerText: "Eleanor Rigby",
    //             time: defaultQuestionTime
    //         },
    //         qStatus: "live", // should be "live" or "post"
    //         totalQ: 15, // the total # of questions in the game
    //         qNum: 3, // The true question number. We'll do the +1 on the front end where needed
    //         ansRcvd: [ // this array should update as answers are received
    //             ["I am Smarticus","A"],
    //             ["The Quizzard of Oz","B"],
    //             ["Team Sewer Cougar","C"],
    //             ["The Decepticons","D"],
    //             ["#AlternativeFacts","D"],
    //             ["Taking Care of Quizness","C"],
    //             ["Multiple Scoregasms","B"],
    //             ["Rebel Scum","A"]
    //         ],
    //         barData: { // everything to build out the post-question bar graph
    //             labels: [ // populated based on current question
    //                 "Eleanor Rigby", // A.
    //                 "Loretta Martin", // B.
    //                 "Molly Jones", // C.
    //                 "Lady Madonna" // D.
    //             ],
    //             datasets: [
    //                 {
    //                     data: [ // the number of submissions for each answer
    //                         2, // A.
    //                         4, // B. 
    //                         1, // C.
    //                         1 // D.
    //                     ],
    //                     backgroundColor: [ // set colors for the 'post' bar graph
    //                         // correct answer color: #34edaf
    //                         // wrong answer color: #ed4634
    //                         "#34edaf", // A.
    //                         "#ed4634", // B.
    //                         "#ed4634", // C.
    //                         "#ed4634" // D.
    //                     ]
    //                 }
    //             ]
    //         } // close barData
    //     }
    // );

    const [boardBlob, setBoardBlob] = useState(
        {
            question: { // question data for the current question
                question: "",
                choices: ["", "", "", ""],
                answer: "",
                answerText: "",
                time: defaultQuestionTime
            },
            qStatus: "", // should be "live" or "post"
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

    // const [boardBlob, setBoardBlob] = useState();

    // const [numTeams, setNumTeams] = useState();
    // const [questions, setQuestions] = useState(preQuestions); // TODO: stop using fake data
    // const [qStatus, setQStatus] = useState("post"); // TODO: stop using fake data
    // const [qNum, setQNum] = useState(2); // TODO: stop using fake data
    // const [ansRcvd, setAnsRcvd] = useState(fakeResponses); // TODO: stop using fake data
    // const [correctAnswerText, setCorrectAnswerText] = useState();
    const [timerData, setTimerData] = useState(fakeTimerData); // TODO: stop using fake data
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

    useEffect( () => {
        console.log("useEffect() triggered");
        console.log("username");
        console.log(props.userID);
        gameAPI.getCurrentQuestion(props.userID)
            .then(function(res) {
                console.log('response received');
                console.log(res.data)
                setBoardBlob(res.data)
            })
            // .then(res => setBoardBlob(res.data))
            .catch(err => console.log(err))
    },[])

    return(

        <div>

            <h1 className="text-center mt-3 question p-3 mb-4">({boardBlob.qNum + 1}/{boardBlob.totalQ}) {boardBlob.question.question}</h1>

            { (boardBlob.isActive === true) ?

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

            }

            {/* <button
                onClick={() => toggleStatus()}
            >toggle qStatus</button> */}

        </div>
    )

}

export default BoardQuestion;
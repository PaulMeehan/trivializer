import React, {useState, useEffect} from 'react';
import {Pie, Bar} from "react-chartjs-2";
import '../../pages/BigBoard/BigBoard.css';
// import './BoardQuestion.css';
import LiveQuestion from "../../components/BigBoard/LiveQuestion";
import PostQuestion from '../../components/BigBoard/PostQuestion';

const defaultQuestionTime = 180
const preQuestions = [
    {
      question: "According to a Beatles song, who kept her face in a jar by the door?",
      choices: ["Eleanor Rigby", "Loretta Martin", "Molly Jones", "Lady Madonna"],
      answer: "A",
      time: defaultQuestionTime
    },
    {
      question: "What is the stage name of English female rapper Mathangi Arulpragasam, who is known for the song &quot;Paper Planes&quot;?",
      choices: ["K.I.A.", "C.I.A.", "M.I.A.", "A.I.A."],
      answer: "C",
      time: defaultQuestionTime
    },
    {
      question: "Which one of these Rammstein songs has two official music videos?",
      choices: ["Du Hast", "Benzin", "Mein Teil", "Du Riechst So Gut"],
      answer: "D",
      time: defaultQuestionTime
    },
    {
      question: "Which rock band released the album &quot;The Bends&quot; in March 1995?",
      choices: ["Nirvana", "Radiohead", "Lemonheads", "U2"],
      answer: "B",
      time: defaultQuestionTime
    },
    {
      question: "Which band recorded the album &quot;Parallel Lines&quot;?",
      choices: ["The Police", "Coldplay", "Paramore", "Blondie"],
      answer: "D",
      time: defaultQuestionTime
    },
    {
      question: "Which of these aliases has NOT been used by electronic musician Aphex Twin?",
      choices: ["Burial", "Caustic Window", "Bradley Strider", "GAK"],
      answer: "A",
      time: defaultQuestionTime
    }
  ]

    const fakeResponses = [
        ["I am Smarticus","A"],
        ["The Quizzard of Oz","B"],
        ["Team Sewer Cougar","C"],
        ["The Decepticons","D"],
        ["#AlternativeFacts","D"],
        ["Taking Care of Quizness","C"],
        ["Multiple Scoregasms","B"],
        ["Rebel Scum","A"]
    ]

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

    

const BoardQuestion = () => {

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

    const toggleStatus = () => {
        if ( qStatus === "live" ) {
            setQStatus("post")
        }
        if ( qStatus === "post" ) {
            setQStatus("live")
        }
    }
    
    const [numTeams, setNumTeams] = useState();
    const [questions, setQuestions] = useState(preQuestions); // TODO: stop using fake data
    const [qStatus, setQStatus] = useState("post"); // TODO: stop using fake data
    const [qNum, setQNum] = useState(2); // TODO: stop using fake data
    const [ansRcvd, setAnsRcvd] = useState(fakeResponses); // TODO: stop using fake data
    const [timerData, setTimerData] = useState(fakeTimerData); // TODO: stop using fake data
    const [timesUp, setTimesUp] = useState(false);
    const [pieOptions, setPieOptions] = useState( // TODO: had to create this separate state object b/c answerData.options wouldn't work
        {
            responsive: true,
            maintainAspectRatio: false,
        }
    );
    const [correctAnswerText, setCorrectAnswerText] = useState();
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
    const [barData, setBarData] = useState(
        // fakeBarGraph
        {
            labels: [
                questions[qNum].choices[0],
                questions[qNum].choices[1],
                questions[qNum].choices[2],
                questions[qNum].choices[3]
            ],
            datasets: [
                {
                    data: [
                        2,
                        4,
                        1,
                        1
                    ],
                    backgroundColor: [
                        "#ed4634",
                        "#34edaf",
                        "#ed4634",
                        "#ed4634"
                    ]
                }
            ]
        }
    ); // TODO: stop using fake data
    const [pointsWon, setPointsWon] = useState(); // TODO: stop using fake data

    useEffect( () => {
        console.log("useEffect() triggered");
        if (questions[qNum].answer === "A") {
            setCorrectAnswerText(questions[qNum].choices[0])
        } else if (questions[qNum].answer === "B") {
            setCorrectAnswerText(questions[qNum].choices[1])
        } else if (questions[qNum].answer === "C") {
            setCorrectAnswerText(questions[qNum].choices[2])
        } else if (questions[qNum].answer === "D") {
            setCorrectAnswerText(questions[qNum].choices[3])
        }
        console.log(correctAnswerText);
    },[])

    return(

        <div>

            <h1 className="text-center mt-3 question p-3 mb-4">({qNum + 1}/{questions.length}) {questions[qNum].question}</h1>

            { (qStatus === "live") ?

            <LiveQuestion 
                ans1 = {questions[qNum].choices[0]}
                ans2 = {questions[qNum].choices[1]}
                ans3 = {questions[qNum].choices[2]}
                ans4 = {questions[qNum].choices[3]}
                ansRcvd = {ansRcvd}
                timesUp = {timesUp}
                timerData = {timerData}
                pieOptions = {pieOptions}
                timerControl = {timerControl}
                questions = {questions}
                qNum = {qNum}
            />

            :

            <PostQuestion
                ans1 = {questions[qNum].choices[0]}
                ans2 = {questions[qNum].choices[1]}
                ans3 = {questions[qNum].choices[2]}
                ans4 = {questions[qNum].choices[3]}
                ansLetter = {questions[qNum].answer}
                correctAnswerText = {correctAnswerText}
                barData = {barData}
                barOptions = {barOptions}
            />

            }

            <button
                onClick={() => toggleStatus()}
            >toggle qStatus</button>

        </div>
    )

}

export default BoardQuestion;
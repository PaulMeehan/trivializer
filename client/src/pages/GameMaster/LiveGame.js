import React, {useState, useEffect} from 'react';
import './Admin.css';
import {Pie} from "react-chartjs-2";
import AdminLiveQDiv from "../../components/Admin/AdminLiveQDiv";

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

    let baseTimerData = {
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

    const [currentQNumber,setCurrentQNumber] = useState(0);
    const [questions, setQuestions] = useState(preQuestions);
    const [timerData, setTimerData] = useState(baseTimerData);

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
    

    const launchQuestion = (qNum) => {
        // clearInterval(timerInterval);
        setCurrentQNumber(qNum);
        setTimerData(baseTimerData);
        timerControl();
    }

    return(

        <div className="container">

            <div className="row">
            
                <div className="col-md-12">
                    <h1>Your Game is Live!</h1>
                </div>

            </div>
        
            <div className="row border mt-4">
            
                <div className="col-md-12">
                    <div className="container">
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
                            />
                        ))}
                    </div>
                </div>

            </div>



        </div>

    ) 

}



    




export default GameMasterLiveGame;
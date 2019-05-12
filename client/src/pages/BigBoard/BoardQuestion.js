import React, {useState, useEffect} from 'react';
import {Pie} from "react-chartjs-2";
import '../../pages/BigBoard/BigBoard.css';
import LiveQuestion from "../../components/BigBoard/LiveQuestion"

// state = {
    //     url: "http://trivializer.com/g/username",
    //     qTotal: 15,
    //     qMultiple: 11,
    //     qTF: 1,
    //     qOpen: 3,
    //     timerData: {
    //         labels: [
    //             'Time Remaining',
    //         ],
    //         datasets: [
    //             {
    //                 data: [
    //                     27,
    //                     33
    //                 ],
    //                 backgroundColor: [
    //                     "#34edaf",
    //                     "#ed4634"
    //                 ]
    //             }
    //         ],
    //         options: {
    //             responsive: true
    //         }
    //     }
    // }

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

    const fakeResponses = [
        "I am Smarticus",
        "The Quizzard of Oz",
        "Team Sewer Cougar",
        "The Decepticons",
        "#AlternativeFacts",
        "Taking Care of Quizness",
        "Multiple Scoregasms",
        "Rebel Scum"
    ]

const BoardQuestion = () => {
    
    const [questions, setQuestions] = useState(preQuestions); // TODO: stop using fake data
    const [qStatus, setQStatus] = useState("live"); // TODO: stop using fake data
    const [qNum, setQNum] = useState(2); // TODO: stop using fake data
    const [ansRcvd, setAnsRcvd] = useState(fakeResponses); // TODO: stop using fake data

    return(

        
        <div>

            <h1 className="text-center mt-3 question p-3 mb-4">({qNum + 1}/{questions.length}) {questions[qNum][0]}</h1>

            {/* <LiveQuestion 
                
            /> */}

            <div className="liveQuestion">
                <h2 className="text-center mb-4">Possible Answers:</h2>
                <h3>A. {questions[qNum][1]}</h3>
                <h3>B. {questions[qNum][2]}</h3>
                <h3>C. {questions[qNum][3]}</h3>
                <h3>D. {questions[qNum][4]}</h3>
            </div>

            {/* <div className="container">
                        {questions.map( (item, index) => (
                            <AdminGameDiv
                                realQNumber = {index}
                                qNumber = {index + 1}
                                key = {item[0]}
                                qText = {item[0]}
                                a1 = {item[1]}
                                a2 = {item[2]}
                                a3 = {item[3]}
                                a4 = {item[4]}
                                correct = {item[5]}
                                deleteQuestion = {deleteQuestion}
                            />
                        ))}
                    </div> */}

            <div className="liveTeams">

                <h2 className="text-center mb-4">Teams Submitted:</h2>
                <h4>1. I am Smarticus</h4>
                <h4>2. The Quizzard of Oz</h4>
                <h4 className="firstCorrect">3. Team Sewer Cougar</h4>
                <h4>4. The Decepticons</h4>
                <h4>5. #AlternativeFacts</h4>
                <h4>6. Taking Care of Quizness</h4>
                <h4>7. Multiple Scoregasms</h4>
                <h4>8. Rebel Scum</h4>
            </div>

            <div className="liveTimer">
                <h2 className="text-center mb-4">Time Remaining:</h2>
                <Pie 
                    // data= {this.state.timerData}
                />
            </div>

            

        </div>
    )

}

export default BoardQuestion;
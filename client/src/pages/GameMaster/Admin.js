import React, {useState, useEffect} from 'react';
import './Admin.css';
import AdminGameDiv from "../../components/Admin/AdminGameDiv";


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





const GameMasterAdmin = () => {

    const [questions, setQuestions] = useState(preQuestions);
    const [newQ, setNewQ] = useState();
    const [newA1, setNewA1] = useState();
    const [newA2, setNewA2] = useState();
    const [newA3, setNewA3] = useState();
    const [newA4, setNewA4] = useState();
    const [newCorrect, setNewCorrect] = useState();


    const deleteQuestion = (id) => {
        // TODO: replace w/ actual route request
        let tempQuestions = questions;
        let throwAway = tempQuestions.splice(id,1);
        console.log(throwAway);
        console.log(tempQuestions);
        setQuestions(tempQuestions);
        // not sure why it will write throwAway to state but not tempQuestions
    }

    const handleInputChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        console.log(event.target.name + " change detected")
        if (name === "questionText") {
            setNewQ(value);
        } else if (name === "answerA") {
            setNewA1(value);
        } else if (name === "answerB") {
            setNewA2(value);
        } else if (name === "answerC") {
            setNewA3(value);
        } else if (name === "answerD") {
            setNewA4(value);
        } else if (name === "correctAnswer") {
            setNewCorrect(value);
        }
    };

    const printState = () => {
        console.log(newQ);
        console.log(newA1);
        console.log(newA2);
        console.log(newA3);
        console.log(newA4);
        console.log(newCorrect);
    }

    const addQuestion = () => {
        // event.preventDefault();
        let tempQuestions = questions;
        let newAddition = [
            newQ,
            newA1,
            newA2,
            newA3,
            newA4,
            newCorrect
        ];
        tempQuestions.push(newAddition);
        console.log(tempQuestions);
        setQuestions(tempQuestions);
        // ^^ why does this not work?
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
                                <td><input type="radio" name="correctAnswer" value="a" onChange={handleInputChange}></input></td>
                            </tr>
                            <tr>
                                <td>B.</td>
                                <td><input type="text" id="answerB" name="answerB" onChange={handleInputChange}></input></td>
                                <td><input type="radio" name="correctAnswer" value="b"  onChange={handleInputChange}></input></td>
                            </tr>
                            <tr>
                                <td>C.</td>
                                <td><input type="text" id="answerC" name="answerC" onChange={handleInputChange}></input></td>
                                <td><input type="radio" name="correctAnswer" value="c"  onChange={handleInputChange}></input></td>
                            </tr>
                            <tr>
                                <td>D.</td>
                                <td><input type="text" id="answerD" name="answerD" onChange={handleInputChange}></input></td>
                                <td><input type="radio" name="correctAnswer" value="d"  onChange={handleInputChange}></input></td>
                            </tr>
                            </tbody>
                        </table>
                        </form>
                        <button
                            onClick={() => addQuestion()}
                        >Add Question to Game</button>
                    
                    
                </div>
                <div className="col-md-1">
                    {/* spacer div */}
                </div>
                <div className="col-md-4 border">
                    <button 
                        onClick={() => printState()}
                    >Start Your Game</button>
                </div>
            
            </div>

        
            <div className="row border mt-4">
            
                <div className="col-md-12">
                    <h2>Saved Questions:</h2>
                    <div className="container">
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
                    </div>
                </div>

            </div>



        </div>

    ) 

}



    




export default GameMasterAdmin;
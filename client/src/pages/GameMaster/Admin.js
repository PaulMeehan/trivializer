import React, {useState, useEffect} from 'react';
import './Admin.css';

const GameMasterAdmin = () => {

    const [questions, setQuestions] = useState([])


    return(

        <div className="container">

            <div className="row">
            
                <div class="col-md-12">
                    <h1>Your Game:</h1>
                </div>

            </div>

            <div className="row mt-4">
            
                <div className="col-md-7 border">
                    <h2>Add Question to Game:</h2>
                    <h4>Question Text:</h4>
                    <form id="addQuestionForm">
                    <textarea id="questionText"></textarea>
                        <h4>Question Answers (Don't Forget to Select Correct Answer):</h4>
                        <table>
                            <tr>
                                <td>A.</td>
                                <td><input type="text" id="answerA"></input></td>
                                <td><input type="radio" name="correctAnswer" value="a"></input></td>
                            </tr>
                            <tr>
                                <td>B.</td>
                                <td><input type="text" id="answerB"></input></td>
                                <td><input type="radio" name="correctAnswer" value="b"></input></td>
                            </tr>
                            <tr>
                                <td>C.</td>
                                <td><input type="text" id="answerC"></input></td>
                                <td><input type="radio" name="correctAnswer" value="c"></input></td>
                            </tr>
                            <tr>
                                <td>D.</td>
                                <td><input type="text" id="answerD"></input></td>
                                <td><input type="radio" name="correctAnswer" value="d"></input></td>
                            </tr>
                        </table>
                        <button>Add Question to Game</button>
                    </form>
                    
                </div>
                <div className="col-md-1">
                    {/* spacer div */}
                </div>
                <div className="col-md-4 border">
                    <button>Start Your Game</button>
                </div>
            
            </div>

        
            <div className="row border mt-4">
            
                <div className="col-md-12">
                    <h2>Saved Questions:</h2>
                    <div className="container">
                        <div className="row border mt-3 p-3">
                            <div className="col-md-2">
                                <h1>1.</h1>
                            </div>
                            <div className="col-md-4">
                                <h4>This is the text of the question</h4>
                            </div>
                            <div className="col-md-4">
                                <p>A. Answer Text</p>
                                <p className="correctAnswer">B. Answer Text</p>
                                <p>C. Answer Text</p>
                                <p>D. Answer Text</p>
                            </div>
                            <div className="col-md-2">
                                <button>Delete Question</button>
                            </div>
                        </div>
                        <div className="row border mt-3 p-3">
                            <div className="col-md-2">
                                <h1>2.</h1>
                            </div>
                            <div className="col-md-4">
                                <h4>This is the text of the question</h4>
                            </div>
                            <div className="col-md-4">
                                <p>A. Answer Text</p>
                                <p>B. Answer Text</p>
                                <p className="correctAnswer">C. Answer Text</p>
                                <p>D. Answer Text</p>
                            </div>
                            <div className="col-md-2">
                                <button>Delete Question</button>
                            </div>
                        </div>
                        <div className="row border mt-3 p-3">
                            <div className="col-md-2">
                                <h1>3.</h1>
                            </div>
                            <div className="col-md-4">
                                <h4>This is the text of the question</h4>
                            </div>
                            <div className="col-md-4">
                                <p className="correctAnswer">A. Answer Text</p>
                                <p>B. Answer Text</p>
                                <p>C. Answer Text</p>
                                <p>D. Answer Text</p>
                            </div>
                            <div className="col-md-2">
                                <button>Delete Question</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>



        </div>

    ) 

}



    




export default GameMasterAdmin;
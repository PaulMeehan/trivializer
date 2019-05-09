import React, {useState, useEffect} from 'react';
import './Admin.css';
import {Pie} from "react-chartjs-2";

let baseTimerData = {
    labels: [
        'Time Remaining',
    ],
    datasets: [
        {
            data: [
                27,
                33
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

const GameMasterLiveGame = () => {

    const [questions, setQuestions] = useState([]);
    const [timerData, setTimerData] = useState(baseTimerData);

    return(

        <div className="container">

            <div className="row">
            
                <div class="col-md-12">
                    <h1>Your Game is Live!</h1>
                </div>

            </div>
        
            <div className="row border mt-4">
            
                <div className="col-md-12">
                    <div className="container">
                        <div className="row border mt-3 p-3 deadQuestion">
                            <div className="col-md-2">
                                <h1>1.</h1>
                            </div>
                            <div className="col-md-4">
                                <h4>This is the text of the question</h4>
                            </div>
                            <div className="col-md-4">
                                <p>A. Answer Text</p>
                                <p>B. Answer Text</p>
                                <p>C. Answer Text</p>
                                <p>D. Answer Text</p>
                            </div>
                            <div className="col-md-2">

                            </div>
                        </div>
                        <div className="row border mt-3 p-3">
                            <div className="col-md-1">
                                <h1>2.</h1>
                            </div>
                            <div className="col-md-3">
                                <h4>This is the text of the question</h4>
                            </div>
                            <div className="col-md-3">
                                <p>A. Answer Text</p>
                                <p>B. Answer Text</p>
                                <p>C. Answer Text</p>
                                <p>D. Answer Text</p>
                            </div>
                            <div className="col-md-2">
                                <button className="btn-success btn">Launch Question</button>
                                <button className="btn-danger btn mt-4">Show Answer</button>
                            </div>
                            <div className="col-md-3">
                                <Pie 
                                    data= {timerData}
                                />
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
                                <p>A. Answer Text</p>
                                <p>B. Answer Text</p>
                                <p>C. Answer Text</p>
                                <p>D. Answer Text</p>
                            </div>
                            <div className="col-md-2">

                            </div>
                        </div>
                    </div>
                </div>

            </div>



        </div>

    ) 

}



    




export default GameMasterLiveGame;
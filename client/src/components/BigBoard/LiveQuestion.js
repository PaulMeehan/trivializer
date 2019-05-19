import React from "react";
import {Pie} from "react-chartjs-2";
// import './LiveQuestion.css';

const LiveQuestion = (props) => {

return (

    <div className="liveContainer">
            {/* Why does this class not work? */}

        <div className="liveQuestion">
            <h2 className="text-center mb-4">Possible Answers:</h2>
            <h3>A. {props.ans1}</h3>
            <h3>B. {props.ans2}</h3>
            <h3>C. {props.ans3}</h3>
            <h3>D. {props.ans4}</h3>
        </div>

        <div className="liveTeams">

            <h2 className="text-center mb-4">Teams Submitted:</h2>
            {props.ansRcvd.map( (item, index) => (
                <h4 className={ (item[1] === props.question.answer) ? "firstCorrect" : "" }>{index +1}. {item[0]}</h4>
            ))}

        </div>

        <div className="liveTimer">
            {/* { !props.timesUp ? <h2 className="text-center">Time Remaining:</h2> : <h2 className="text-center mb-4">Time's Up!!!</h2> } */}
            <h2 className="text-center">Time Remaining:</h2>
            {/* <h2 className="text-center mb-4">Time Remaining:</h2> */}
            {/* <div id="pieHolder"> */}
                {/* { !timesUp ? <Pie data = {timerData} options = {pieOptions} /> : <h2 className="text-center">Time's Up!</h2> } */}
                <Pie 
                    data = {props.timerData}
                    width = {100}
                    // height = {600}
                    options = {props.pieOptions}
                />
            {/* </div> */}
            {/* <button 
                onClick={() => props.timerControl()}
            >Decrement Counter</button> */}
        </div>

    </div>

)

}

export default LiveQuestion;
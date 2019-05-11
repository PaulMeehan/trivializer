import React from "react";
import {Pie} from "react-chartjs-2";

const AdminLiveQDiv = (props) => {

return (

<div className={ (props.currentQNumber === props.realQNumber) ? "row border mt-3 p-3" : "row border mt-3 p-3 deadQuestion" }>

            <div className="col-md-1">
                <h1>{props.qNumber}.</h1>
            </div>
            <div className="col-md-3">
                <h4>{props.qText}</h4>
            </div>
            <div className="col-md-3">
                <p>A. {props.a1}</p>
                <p>B. {props.a2}</p>
                <p>C. {props.a3}</p>
                <p>D. {props.a4}</p>
            </div>
            <div className={ (props.currentQNumber === props.realQNumber) ? "col-md-2" : "col-md-2 hidden" }>
                <button className="btn-success btn" onClick={() => props.launchQuestion()}>Launch Question</button>
                <button className="btn-danger btn mt-4" onClick={() => props.showAnswer()}>Show Answer</button>
            </div>
            <div className={ (props.currentQNumber === props.realQNumber) ? "col-md-3" : "col-md-3 hidden" }>
                <Pie 
                    data= {props.timerData}
                />
            </div>

</div>

)

}

export default AdminLiveQDiv;


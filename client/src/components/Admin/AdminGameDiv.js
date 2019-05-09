import React from "react";

const AdminGameDiv = (props) => {

return (
    <div className="row border mt-3 p-3">
        <div className="col-md-2">
            <h1>{props.qNumber}.</h1>
        </div>
        <div className="col-md-4">
            <h4>{props.qText}</h4>
        </div>
        <div className="col-md-4">
            <p className={ (props.correct == "A") ? "correctAnswer" : "" }>A. {props.a1}</p>
            <p className={ (props.correct == "B") ? "correctAnswer" : "" }>B. {props.a2}</p>
            <p className={ (props.correct == "C") ? "correctAnswer" : "" }>C. {props.a3}</p>
            <p className={ (props.correct == "D") ? "correctAnswer" : "" }>D. {props.a4}</p>
        </div>
        <div className="col-md-2">
            <button 
                onClick={() => props.deleteQuestion(props.realQNumber)}
            >Delete Question</button>
        </div>
    </div>

)

}

export default AdminGameDiv;


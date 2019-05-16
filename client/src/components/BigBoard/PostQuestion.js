import React from "react";
import {Bar} from "react-chartjs-2";
// import './PostQuestion.css';

const PostQuestion = (props) => {

return (

    <div className="postContainer">

        <h1 className="text-center">Answer: {props.ansLetter}. {props.correctAnswerText}</h1>

        <div className="postAnswers">
            <Bar
                data = {props.barData} 
                height = {window.innerHeight * .4}
                options = {props.barOptions}
            />
        </div>
    
    </div>
    
)

}

export default PostQuestion;
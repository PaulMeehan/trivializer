import React, {useState, useEffect} from 'react';
import {HorizontalBar} from "react-chartjs-2";
import axios from 'axios';


const StatsBoard = () => {

// /api/scoreboard
// qTotal: // total # of questions
// currentQestion: // current question
// scores: [ ["team name",5],["other team",3] ]
// gameOver: true/false

// need to add in logic to show "game over"

    const [answerData, setAnswerData] = useState();

    const getStats = () => { // pull questions from DB
        // /api/scoreboard
        // GET request
        console.log("getStats triggered");
        axios.get("/api/scoreboard")
            .then(response => {
                console.log(response.data.answerData);
                setAnswerData(response.data.answerData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect( () => {
        getStats()
    },[])

    // state = {
    //     url: "http://trivializer.com/g/username",
    //     qTotal: 15,
    //     qMultiple: 11,
    //     qTF: 1,
    //     qOpen: 3,
    //     answerData: {
    //         labels: [
    //             'I am Smarticus',
    //             'The Quizzard of Oz',
    //             'Team Sewer Cougar',
    //             'The Decepticons',
    //             '#AlternativeFacts',
    //             'Taking Care of Quizness',
    //             'Multiple Scoregasms',
    //             'Rebel Scum',
    //         ],
    //         datasets: [
    //             {
    //                 data: [
    //                     6,
    //                     4,
    //                     8,
    //                     2,
    //                     5,
    //                     8,
    //                     3,
    //                     7
    //                 ],
    //                 backgroundColor: [
    //                     "#ed4634",
    //                     "#ed4634",
    //                     "#34edaf",
    //                     "#ed4634",
    //                     "#ed4634",
    //                     "#34edaf",
    //                     "#ed4634",
    //                     "#ed4634"
    //                 ]
    //             }
    //         ],
    //         options: {
    //             responsive: true,
    //             scales: {
    //                 xAxes: [{
    //                     ticks: {
    //                         beginAtZero: true,
    //                         min: 0,
    //                         max: 15,
    //                     }      
    //                 }]
    //             }
    //         }
    //     }
    // }

    return(
        <div>

            <h1>Stats!!</h1>

            <HorizontalBar
                data= {answerData} 
                options={answerData.options}
            />

        </div>
    )
}



export default StatsBoard;
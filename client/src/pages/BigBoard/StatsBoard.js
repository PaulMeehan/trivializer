import React, {useState, useEffect} from 'react';
import {HorizontalBar, defaults} from "react-chartjs-2";
import axios from 'axios';
import './BigBoard.css';

// defaults.global.defaultFontFamily = "'PT Sans', sans-serif"
// defaults.global.defaultFontColor = 'white';
// defaults.global.defaultFontSize = 30;
// Chart.defaults.global.legend.display = false;
// Chart.defaults.global.elements.line.tension = 0;


const fakeAnswerData =  {
            labels: [
                'I am Smarticus',
                'The Quizzard of Oz',
                'Team Sewer Cougar',
                'The Decepticons',
                '#AlternativeFacts',
                'Taking Care of Quizness',
                'Multiple Scoregasms',
                'Rebel Scum',
                'Another Team',
                'And Another'
            ],
            datasets: [
                {
                    data: [
                        6,
                        4,
                        8,
                        2,
                        5,
                        8,
                        3,
                        7,
                        3,
                        4
                    ],
                    backgroundColor: [
                        "#F634FF",
                        "#F634FF",
                        "#34edaf",
                        "#F634FF",
                        "#F634FF",
                        "#34edaf",
                        "#F634FF",
                        "#F634FF",
                        "#F634FF",
                        "#F634FF"
                    ]
                }
            ],
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            max: 15,
                        }      
                    }]
                }
            }
        }

const StatsBoard = () => {

// /api/scoreboard
// qTotal: // total # of questions
// currentQestion: // current question
// answerData: // will come across as complete object for use with chart.js
// gameOver: true/false

// need to add in logic to show "game over"

    const [answerData, setAnswerData] = useState();
    // TODO: why does answerData.options work for a class, but not when using useState();
    const [options, setOptions] = useState( // TODO: had to create this separate state object b/c answerData.options wouldn't work
        {
            legend: {
                display: false,
            },
            responsive: true,
            maintainAspectRatio: false,
            // aspectRatio: "4:1",
            scales: {
                xAxes: [{
                    position: "top",
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 15,
                        fontColor: "#ffffff",
                        fontSize: 30,
                        stepSize: 1,
                    },
                    gridLines: {
                        color: "#ffffff"
                    }      
                }],
                yAxes: [{
                    ticks: {
                        fontColor: "#ffffff",
                        fontSize: 30,
                        fontFamily: "'Bangers', sans-serif"
                    },
                    gridLines: {
                        color: "#ffffff"
                    } 
                }]
            }
        }
    );
    
    

    const logState = () => {
        console.log("answerData:");
        console.log(answerData);
        console.log("answerData.options:");
        console.log(answerData.options);
    }

    const getStats = () => { // pull questions from DB
        // /api/scoreboard
        // GET request

        // REAL VERSION: //
        // console.log("getStats triggered");
        // axios.get("/api/scoreboard")
        //     .then(response => {
        //         console.log(response.data.answerData);
        //         setAnswerData(response.data.answerData);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })

        // FAKE VERSION: //
        setAnswerData(fakeAnswerData);
        

    }

    useEffect( () => {
        console.log("useEffect() triggered");
        getStats()
        console.log("answerData:");
        console.log(answerData);

    },[])

    return(
        <div>

            {/* <h1 className="text-center mt-3">Game Stats</h1> */}
            {/* <button onClick={() => logState()}>console.log state</button> */}

            <HorizontalBar
                data={answerData} 
                // options = {answerData.options} // TODO: why doesn't this work?
                options={options}
            />

        </div>
    )
}



export default StatsBoard;
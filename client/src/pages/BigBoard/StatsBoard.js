import React, {useState, useEffect} from 'react';
import {HorizontalBar} from "react-chartjs-2";
// import axios from 'axios';
import './BigBoard.css';
import gameAPI from '../../utils/gameAPI'

// defaults.global.defaultFontFamily = "'PT Sans', sans-serif"
// defaults.global.defaultFontColor = 'white';
// defaults.global.defaultFontSize = 30;
// Chart.defaults.global.legend.display = false;
// Chart.defaults.global.elements.line.tension = 0;



const StatsBoard = () => {

    const [statsBlob, setStatsBlob] = useState(
        {
            barOptions: {
                legend: {
                    display: false, // static value
                },
                responsive: true, // static value
                maintainAspectRatio: false, // static value
                scales: {
                    xAxes: [{
                        position: "top", // static value
                        ticks: {
                            beginAtZero: true, // static value
                            min: 0, // static value
                    // ############ //
                            max: 1, // THIS VALUE NEEDS TO BE SET TO THE TOTAL # OF QUESTIONS FOR THE GAME!!
                    // ############ //
                            fontColor: "#ffffff", // static value
                            fontSize: 30, // static value
                            stepSize: 1, // static value
                        },
                        gridLines: {
                            color: "#ffffff" // static value
                        }      
                    }],
                    yAxes: [{
                        ticks: {
                            fontColor: "#ffffff", // static value
                            fontSize: 30, // static value
                            fontFamily: "'Bangers', sans-serif" // static value
                        },
                        gridLines: {
                            color: "#ffffff" // static value
                        } 
                    }]
                }
            },
            answerData: {
                labels: [ // an array of all the team names
                    '',
                ],
                datasets: [
                    {
                        data: [ // corresponding current scores for the teams listed in the labels array
                            0,
                        ],
                        backgroundColor: [ // for the team(s) in the lead, set the color to #34edaf
                            "#F634FF",
                        ]
                    }
                ],
            }
        }
    );


    const updatedBarOptions = {
        legend: {
            display: false, // static value
        },
        responsive: true, // static value
        maintainAspectRatio: false, // static value
        scales: {
            xAxes: [{
                position: "top", // static value
                ticks: {
                    beginAtZero: true, // static value
                    min: 0, // static value
                    fontColor: "#ffffff", // static value
                    fontSize: 30, // static value
                    stepSize: 1, // static value
                },
                gridLines: {
                    color: "#ffffff" // static value
                }      
            }],
            yAxes: [{
                ticks: {
                    fontColor: "#ffffff", // static value
                    fontSize: 30, // static value
                    fontFamily: "'Bangers', sans-serif" // static value
                },
                gridLines: {
                    color: "#ffffff" // static value
                } 
            }]
        }
    }



    // SAVED COPY OF WHAT A POPULATED statsBlob LOOKS LIKE
    // const [statsBlob, setStatsBlob] = useState(
    //     {
    //         barOptions: {
    //             legend: {
    //                 display: false, // static value
    //             },
    //             responsive: true, // static value
    //             maintainAspectRatio: false, // static value
    //             scales: {
    //                 xAxes: [{
    //                     position: "top", // static value
    //                     ticks: {
    //                         beginAtZero: true, // static value
    //                         min: 0, // static value
    //                 // ############ //
    //                         max: 15, // THIS VALUE NEEDS TO BE SET TO THE TOTAL # OF QUESTIONS FOR THE GAME!!
    //                 // ############ //
    //                         fontColor: "#ffffff", // static value
    //                         fontSize: 30, // static value
    //                         stepSize: 1, // static value
    //                     },
    //                     gridLines: {
    //                         color: "#ffffff" // static value
    //                     }      
    //                 }],
    //                 yAxes: [{
    //                     ticks: {
    //                         fontColor: "#ffffff", // static value
    //                         fontSize: 30, // static value
    //                         fontFamily: "'Bangers', sans-serif" // static value
    //                     },
    //                     gridLines: {
    //                         color: "#ffffff" // static value
    //                     } 
    //                 }]
    //             }
    //         },
    //         answerData: {
    //             labels: [ // an array of all the team names
    //                 'I am Smarticus',
    //                 'The Quizzard of Oz',
    //                 'Team Sewer Cougar',
    //                 'The Decepticons',
    //                 '#AlternativeFacts',
    //                 'Taking Care of Quizness',
    //                 'Multiple Scoregasms',
    //                 'Rebel Scum',
    //                 'Another Team',
    //                 'And Another'
    //             ],
    //             datasets: [
    //                 {
    //                     data: [ // corresponding current scores for the teams listed in the labels array
    //                         6,
    //                         4,
    //                         8,
    //                         2,
    //                         5,
    //                         8,
    //                         3,
    //                         7,
    //                         3,
    //                         4
    //                     ],
    //                     backgroundColor: [ // for the team(s) in the lead, set the color to #34edaf
    //                         "#F634FF",
    //                         "#F634FF",
    //                         "#34edaf",
    //                         "#F634FF",
    //                         "#F634FF",
    //                         "#34edaf",
    //                         "#F634FF",
    //                         "#F634FF",
    //                         "#F634FF",
    //                         "#F634FF"
    //                     ]
    //                 }
    //             ],
    //         }
    //     }
    // );
    
    

    // const logState = () => {
    //     console.log("answerData:");
    //     console.log(answerData);
    //     console.log("answerData.options:");
    //     console.log(answerData.options);
    // }

    // const getStats = () => { // pull questions from DB
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
        // setAnswerData(fakeAnswerData);
        

    // }

    useEffect( () => {
        console.log("useEffect() triggered");
        // getStats()
        gameAPI.getScoreBoard()
            .then(function(res){
                console.log("\n\ngetScoreBoard() Response:")
                console.log(res.data)
                setStatsBlob(res.data)
            })

    },[])

    return(
        <div>

            {/* <h1 className="text-center mt-3">Game Stats</h1> */}
            {/* <button onClick={() => logState()}>console.log state</button> */}

            <HorizontalBar
                data={statsBlob.answerData} 
                height = {window.innerHeight * .8}
                // options = {answerData.options} // TODO: why doesn't this work?
                options={updatedBarOptions}
            />

        </div>
    )
}



export default StatsBoard;
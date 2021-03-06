import React, {Component} from 'react';
import {HorizontalBar} from "react-chartjs-2";

class BoardGameOver extends Component {

    state = {
        url: "http://trivializer.com/g/username",
        qTotal: 15,
        qMultiple: 11,
        qTF: 1,
        qOpen: 3,
        answerData: {
            labels: [
                'I am Smarticus',
                'The Quizzard of Oz',
                'Team Sewer Cougar',
                'The Decepticons',
                '#AlternativeFacts',
                'Taking Care of Quizness',
                'Multiple Scoregasms',
                'Rebel Scum',
            ],
            datasets: [
                {
                    data: [
                        12,
                        8,
                        15,
                        4,
                        10,
                        14,
                        6,
                        13
                    ],
                    backgroundColor: [
                        "#ed4634",
                        "#ed4634",
                        "#34edaf",
                        "#ed4634",
                        "#ed4634",
                        "#ed4634",
                        "#ed4634",
                        "#ed4634"
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
    }

    render() {

        return(
            <div>

                <h1>Winner: Team Sewer Cougar !!!</h1>

                <HorizontalBar
                    data= {this.state.answerData} 
                    options={this.state.answerData.options}
                />

            </div>
        )
    }


}

export default BoardGameOver;
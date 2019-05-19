import React, {Component} from 'react';
import {Pie, Bar} from "react-chartjs-2";

const styles = {
    postAnswers: {
        width: "45%",
        height: "80%",
        float: "left",
        margin: 0,
        marginLeft: "5%",
        padding: 20
    },
    postTeams: {
        width: "45%",
        height: "80%",
        float: "left",
        margin: 0,
        marginRight: "5%",
        padding: 20
    },
    firstCorrect: {
        backgroundColor: "green",
        color: "#ffffff",
    },
    postTable: {
        width: "90%",
        height: "80%",
        float: "left",
        margin: 0,
        marginLeft: "5%",
        marginRight: "5%",
        padding: 20
    },

}



class BoardQOpenPost extends Component {
    
    state = {
        url: "http://trivializer.com/g/username",
        qTotal: 15,
        qMultiple: 11,
        qTF: 1,
        qOpen: 3,
        numOfTeams: 8,
        answerData: {
            labels: [
                'True',
                'False',
            ],
            datasets: [
                {
                    data: [
                        2,
                        6,
                    ],
                    backgroundColor: [
                        "#ed4634",
                        "#34edaf",
                    ]
                }
            ],
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            max: 8,
                        }      
                    }]
                }
            }
        }
    }

    render() {

        return(
            <div>

                <h1>(3/15) Which actor played Thor and Fat Thor in the Marvel Cinematic Universe?</h1>

                <h1>Answer: Chris Hemsworth</h1>

                <div style={styles.postTable}>
                    <table>
                        <tr>
                            <td>I am Smarticus</td>
                            <td>Chris Hemsworth</td>
                            <td>+1</td>
                        </tr>
                        <tr style={styles.firstCorrect}>
                            <td>The Quizzard of Oz</td>
                            <td>Chris Hemsworth</td>
                            <td>+1</td>
                        </tr>
                        <tr>
                            <td>Team Sewer Cougar</td>
                            <td>Liam Hemsworth</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>The Decepticons</td>
                            <td>David Hasselhoff</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>#AlternativeFacts</td>
                            <td>...</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Taking Care of Quizness</td>
                            <td>Liam Hemsworth</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Multiple Scoregasms</td>
                            <td>Chris Hemsworth</td>
                            <td>+2</td>
                        </tr>
                        <tr>
                            <td>Rebel Scum</td>
                            <td>Chris Hemsworth</td>
                            <td>+1</td>
                        </tr>
                    </table>
                </div>

            </div>
        )
    }


}

export default BoardQOpenPost;
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
        padding: 10
    },

}



class BoardQMultiPost extends Component {
    
    state = {
        url: "http://trivializer.com/g/username",
        qTotal: 15,
        qMultiple: 11,
        qTF: 1,
        qOpen: 3,
        numOfTeams: 8,
        answerData: {
            labels: [
                'Little Richard',
                'Carl Perkins',
                'Elvis Presley',
                'Jerry Lee Lewis'
            ],
            datasets: [
                {
                    data: [
                        2,
                        4,
                        1,
                        1
                    ],
                    backgroundColor: [
                        "#ed4634",
                        "#34edaf",
                        "#ed4634",
                        "#ed4634"
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

                <h1>(1/15) Who wrote the song "Blue Suede Shoes"?</h1>

                <h1>B. Carl Perkins</h1>

                <div style={styles.postAnswers}>
                    <Bar
                        data= {this.state.answerData} 
                        options={this.state.answerData.options}
                    />
                </div>

                <div style={styles.postTeams}>
                    <h3>Right Answers:</h3>
                    {/* <table>
                        <tr>
                            <td></td>
                        </tr>
                    </table> */}
                    <h4>Multiple Scoregasms <span>+1</span></h4>
                    <h4>Taking Care of Quizness <span>+1</span></h4>
                    <h4>Team Sewer Cougar <span>+2</span></h4>
                    <h4>The Decepticons <span> +1</span></h4>
                </div>

            </div>
        )
    }


}

export default BoardQMultiPost;
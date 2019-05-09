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



class BoardQTFLive extends Component {
    
    state = {
        url: "http://trivializer.com/g/username",
        qTotal: 15,
        qMultiple: 11,
        qTF: 1,
        qOpen: 3,
        numOfTeams: 8,
        timerData: {
            labels: [
                'Time Remaining',
            ],
            datasets: [
                {
                    data: [
                        27,
                        33
                    ],
                    backgroundColor: [
                        "#34edaf",
                        "#ed4634"
                    ]
                }
            ],
            options: {
                responsive: true
            }
        }
    }

    render() {

        return(
            <div>

                <h1>(2/15) True or False: Pete Best is considered the "fifth Beatle."</h1>

                <div style={styles.postAnswers}>
                    <h3>Teams Submitted:</h3>
                    <h4>1. I am Smarticus</h4>
                    <h4>2. The Quizzard of Oz</h4>
                    <h4 style={styles.firstCorrect}>3. Team Sewer Cougar</h4>
                    <h4>4. The Decepticons</h4>
                    <h4>5. #AlternativeFacts</h4>
                    <h4>6. Taking Care of Quizness</h4>
                    <h4>7. Multiple Scoregasms</h4>
                    <h4>8. Rebel Scum</h4>
                </div>

                <div style={styles.postTeams}>
                    <h3>Time Remaining:</h3>
                    <Pie 
                        data= {this.state.timerData}
                    />
                </div>

            </div>
        )
    }


}

export default BoardQTFLive;
import React, {Component} from 'react';
import {Pie} from "react-chartjs-2";

const styles = {
    liveQuestion: {
        width: "30%",
        height: "80%",
        float: "left",
        margin: 0,
        marginLeft: "5%",
        padding: 20
    },
    liveTeams: {
        width: "30%",
        height: "80%",
        float: "left",
        margin: 0,
        padding: 20
    },
    liveTimer: {
        width: "30%",
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



class BoardQMultiLive extends Component {
    
    state = {
        url: "http://trivializer.com/g/username",
        qTotal: 15,
        qMultiple: 11,
        qTF: 1,
        qOpen: 3,
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

                <h1>(1/15) Who wrote the song "Blue Suede Shoes"?</h1>

                <div style={styles.liveQuestion}>
                    <h3>Possible Answers:</h3>
                    <h4>A. Little Richard</h4>
                    <h4>B. Carl Perkins</h4>
                    <h4>C. Elvis Presley</h4>
                    <h4>D. Jerry Lee Lewis</h4>
                </div>

                <div style={styles.liveTeams}>
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

                <div style={styles.liveTimer}>
                    <h3>Time Remaining:</h3>
                    <Pie 
                        data= {this.state.timerData}
                    />
                </div>

                

            </div>
        )
    }


}

export default BoardQMultiLive;
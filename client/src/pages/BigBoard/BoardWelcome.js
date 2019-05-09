import React, {Component} from 'react';
import QRCode from 'qrcode.react';

class BoardWelcome extends Component {

    state = {
        url: "http://trivializer.com/g/username",
        qTotal: 15,
        qMultiple: 11,
        qTF: 1,
        qOpen: 3
    }

    render() {

        return(
            <div>

                <h1>Welcome to Trivia</h1>

                <h3>Use one device for your team. Scan this QR code, or go to {this.state.URL}</h3>
                
                <QRCode value={this.state.url} />

                <h3>Game Overview:</h3>

                <ul>
                    <li>{this.state.qTotal} Questions
                        <ul>
                        <li>{this.state.qMultiple} Multiple Choice</li>
                        <li>{this.state.qTF} True/False</li>
                        <li>{this.state.qOpen} Open-Ended</li>
                        </ul>
                    </li>
                    <li>3 Minutes Per Question</li>
                    <li>Bonuses for the first correct answer!</li>
                </ul>


            </div>
        )
    }


}

export default BoardWelcome;
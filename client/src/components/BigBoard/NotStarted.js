import React from "react";
import QRCode from 'qrcode.react';

const NotStarted = (props) => {

return (

    <div>

                <h1>Welcome to Trivia</h1>

                <h3>Use one device for your team. Scan this QR code, or go to {"http://trivializer.com/play/" + props.userID}</h3>
                
                <QRCode value={"http://trivializer.com/play/" + props.userID} />

                {/* <h3>Game Overview:</h3>

                <ul>
                    <li>{props.qTotal} Questions
                        <ul>
                        <li>{props.qMultiple} Multiple Choice</li>
                        <li>{props.qTF} True/False</li>
                        <li>{props.qOpen} Open-Ended</li>
                        </ul>
                    </li>
                    <li>3 Minutes Per Question</li>
                    <li>Bonuses for the first correct answer!</li>
                </ul> */}


            </div>

)

}

export default NotStarted;
import React from "react";
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';

const NotStarted = (props) => {

return (

    <div>

                <h1 className="text-center mt-3 question p-3 mb-4">Welcome to Trivia!!!</h1>

                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-4 border">
                        <h2 className="text-center">RULES</h2>
                        <ol>
                            <li>Use one device per team to submit answers.</li>
                            <li>Maximum of five people per team.</li>
                            <li>All questions are multiple choice.</li>
                            <li>Bonus points are earned for submitting the first correct answer.</li>
                            <li>No cheating!</li>
                        </ol>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-4 border text-center">
                        <h2 className="text-center">HOW TO PLAY</h2>
                        <p>Using your mobile device, scan this QR code:</p>
                        <QRCode value={"http://trivializer.com/play-" + props.userID} />
                        <p className="mt-3">or go to:</p>
                        <Link className="whiteLink" to={"/play-" + props.userID}><h3>{"http://trivializer.com/play-" + props.userID}</h3></Link>
                    </div>
                    <div className="col-md-1"></div>
                </div>

                {/* <h3>Use one device for your team. Scan this QR code, or go to {"http://trivializer.com/play/" + props.userID}</h3> */}
                
                

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
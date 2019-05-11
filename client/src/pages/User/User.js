import React, {useState, useEffect} from 'react';
import axios from 'axios';

const User = () => {


    let preQuestions = [
        [
            "According to a Beatles song, who kept her face in a jar by the door?",
            "Eleanor Rigby",
            "Loretta Martin",
            "Molly Jones",
            "Lady Madonna",
            "A"
        ],
        [
            "What is the stage name of English female rapper Mathangi Arulpragasam, who is known for the song &quot;Paper Planes&quot;?",
            "K.I.A.",
            "C.I.A.",
            "M.I.A.",
            "A.I.A.",
            "C"
        ],
        [
            "Which one of these Rammstein songs has two official music videos?",
            "Du Hast",
            "Benzin",
            "Mein Teil",
            "Du Riechst So Gut",
            "D"
        ],
        [
            "Which rock band released the album &quot;The Bends&quot; in March 1995?",
            "Nirvana",
            "Radiohead",
            "Lemonheads",
            "U2",
            "B"
        ],
        [
            "Which band recorded the album &quot;Parallel Lines&quot;?",
            "The Police",
            "Coldplay",
            "Paramore",
            "Blondie",
            "D"
        ],
        [
            "Which of these aliases has NOT been used by electronic musician Aphex Twin?",
            "Burial",
            "Caustic Window",
            "Bradley Strider",
            "GAK",
            "A"
        ]
    ]
    
    const [questions, setQuestions] = useState(preQuestions);
    const [currentQNumber,setCurrentQNumber] = useState(); 
    const [isActive,setIsActive] = useState();
    // const [timerData, setTimerData] = useState(baseTimerData); // not doing anything at the moment
    const [choice, setChoice] = useState();

    const getQuestions = () => { // pull questions from DB
        // /api/questions
        // GET request
        console.log("getQuestions triggered");
        axios.get("/api/questions")
            .then(response => {
                console.log(response.data);
                setQuestions(response.data.questions);
                setIsActive(response.data.isActive);
                setCurrentQNumber(response.data.qNum);
                // response.data.time
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect( () => {
        getQuestions();
    },[]);

    


        return(
            <div style={{ fontFamily: 'karmatic arcade', margin: '0', background: "#eee", maxWidth: "420px", height: 'auto' }}>
                 <div style={{ display: 'block', width: '25%', margin: 'auto' }}><img src="https://img.icons8.com/color/96/000000/alarm-clock.png" alt=""/>
                </div>
            <div>   
                {/* <h1 className='question'>Question: { this.state.questionNumber } </h1> */}
                {/* <p>{ this.state.questionText }</p> */}
                <p>This is question text</p>
            <ul>
                {/* <li><button onClick={clickHandler}>{ this.state.answerA } </button></li>
                <li><button onClick={clickHandler}>{ this.state.answerB } </button></li>
                <li><button onClick={clickHandler}>{ this.state.answerC } </button></li>
                <li><button onClick={clickHandler}>{ this.state.answerD } </button></li> */}
                <li><button> A. Answer</button></li>
                <li><button> B. Answer</button></li>
                <li><button> C. Answer</button></li>
                <li><button> D. Answer</button></li>
                {/* <li><button onClick={submitHandler}>Submit</button></li> */}
                <li><button>Submit</button></li>
            </ul>
            </div>
            <footer>Trivializer</footer>
            </div>
        );


    }



export default User;
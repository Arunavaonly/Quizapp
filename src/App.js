import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import "./App.css";
import "@fontsource/karla/700.css";
import "@fontsource/karla/400.css";
import correct from "./correct.mp3";
import levelUpGif from "./level-up.gif"

// Function to shuffle an array in place
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function App() {
  const [count, setCount] = useState(0);
  const [quizdata, setQuizdata] = useState();
  const [ques, setQues] = useState(
    "Welcome to the Quiz Master, click on the button above to start the quiz"
  );
  const [text, setText] = useState("Start Quiz");
  const [answers, setAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [answerSelected, setAnswerSelected] = useState(false);
  const [answeredQues, setAnsweredQues] = useState(0);
  const [paraContent, setParaContent] = useState("");
  const[level, setLevel] = useState(1)
  const[difficulty, setDifficulty] = useState("Easy")
  const [levelUp, setLevelUp] = useState(false);
  const[showLevelUpGif, setShowLevelUpGif] = useState(false);
  const[type, setType] = useState("True/False")



  useEffect(() => {
    async function fetchData(url) {
  if (level ===1){
    url = "https://opentdb.com/api.php?amount=1&difficulty=easy&type=boolean"
  }
  else if (level ===2){
    url = "https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple"
    setDifficulty("Medium")
    setType("Multiple Choice")
  }
  else{
    url = "https://opentdb.com/api.php?amount=1&difficulty=hard"
    setDifficulty("Hard")
    setType("Any")
  }
      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("data fetched from" + url)
        if (
          data.results[0].question.includes("&quot") === true ||
          data.results[0].question.includes("#") === true
        ) {
          fetchData();
        } else {
          setQuizdata(data.results);
        }
      
      } catch (err) {
        console.error("Error fetching quiz data:", err);
      }
    }

    fetchData();
  }, [count, level]);

  
  const handleClick = () => {
    try{
      setQues(quizdata[0].question);
    setText("Next");
    setCount((prevcount) => prevcount + 1);
    setCorrectAnswer(quizdata[0].correct_answer);
    // Combine incorrect and correct answers into a single array
    const allAnswers = [
      ...quizdata[0].incorrect_answers,
      quizdata[0].correct_answer,
    ];

    // Shuffle the array
    shuffleArray(allAnswers);

    // Set the first four shuffled answers to state variables

    setAnswers(allAnswers.slice(0, 4));

    setSelectedAnswer(null);
    setAnswerSelected(false);
    document.getElementById("question").style.outline = "none"
    document.getElementById("para").style.display = "none";

    }
    catch (err){
      console.log(err)
    }
    
  };
  // function to blink the outline of question block for each click
  const blink = ()=>{
    setTimeout(()=>{
      document.getElementById("question").style.outline = ""}, 200)

  }

  const checkAnswer = () => {
    if (selectedAnswer === correctAnswer) {
      // Update player's score for correct answer
      setParaContent("Congrats!\nYou have selected the correct answer");
      // Play correct answer audio
      const audio = new Audio(correct);
      audio.play();
      setScore((prevscore) => prevscore + 1);
      if (score +1 === 10) {
        setLevelUp(true); // Set levelUp to true if the user levels up
      }
  
      
    } else {
      setScore((prevscore) => prevscore -1)
      setParaContent(
        `Incorrect Answer\nThe correct answer is ${correctAnswer}`
      );
    }
  };

  useEffect(() => {
    if (selectedAnswer !== null) {
      checkAnswer();
    }
    //eslint-disable-next-line
  }, [selectedAnswer]);

  const showAnswer = () => {
    setAnswerSelected(true);
    setAnsweredQues((prevcount) => prevcount + 1);
    document.getElementById("para").style.display = "block";

  };
  useEffect(() => {
    if (levelUp === true) {
      setLevel(prevLevel => prevLevel + 1);
      setLevelUp(false); // Reset levelUp back to false after updating the level
      setShowLevelUpGif(true)
      setScore(0)
      setTimeout(()=>{
        setShowLevelUpGif(false)
      },1000)
    }
  }, [levelUp]);

  



  return (
    <div className="App">
      <NavBar level ={level} difficulty = {difficulty} type ={type} />
      <div className="center-div">
        <header className="App-header">Quiz Master</header>
        <button className="btn" type="button" onClick={()=>{
          handleClick();
          blink();
        }}>
          {text}
        </button>
        <p className="score"> Player's Score: {score} </p>
        <p>{answeredQues} questions answered</p>
      </div>
      <div className="next-div">
        <b>
          Question No {count}.<br />
          <p className="question" id ="question">{ques}</p>
        </b>

        <div className="last-div">
          {answers.map((answer, index) => (
            <button
              key={index}
              className={`btn-ans ${
                selectedAnswer === answer
                  ? answer === correctAnswer
                    ? "green-button"
                    : "red-button"
                  : ""
              }`}
              id="btn-ans"
              type="button"
              onClick={
                answerSelected
                  ? null
                  : () => {
                      showAnswer();
                      setSelectedAnswer(answer);
                    }
              }
            >
              <b>{answer}</b>
            </button>
          ))}
          <p className="para" id="para">
            {paraContent}
          </p>
        </div>
      </div>
            {/* Render GIF overlay if showLevelUpOverlay is true */}
            {showLevelUpGif && (
        <div className="level-up-overlay">
          <img src={levelUpGif} alt="Level Up" />
        </div>
      )}
      <footer className="footer"><small><b>Copyright &copy; by Arunava Kar arunavakaronly@gmail.com</b></small></footer>
    </div>
  );
}

export default App;

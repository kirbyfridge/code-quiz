// all the questions used within the quiz
// each questions contains a title (question to be displayed),
// choices for said question, & the answer
var questions = [
    {
        title: "Commonly used data types DO NOT include:",
        choices: ["strings", "booleans", "alerts", "numbers"],
        answer: "alerts"
    },
    {
        title: "The condition in an if / else statement is enclosed within ____.",
        choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
        answer: "parentheses"
    },
    {
        title: "Arrays in Javascript can be used to store ____.",
        choices: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        answer: "all of the above"
    },
    {
        title: "String values must be enclosed within ____ when being assigned to variables.",
        choices: ["commas", "curly brackets", "quotes", "parenthesis"],
        answer: "quotes"
    },
    {
        title: "A very useful tool for used during development and debugging for printing content to the debugger is:",
        choices: ["Javascript", "terminal / bash", "for loops", "console log"],
        answer: "console log"
    },
    {
        title: "Which built-in method removes the last element from an array and returns that element?",
        choices: ["last()", "get()", "pop()", "none of the above"],
        answer: "pop()"
    },
    {
        title: "Which built-in method returns the calling string value converted to lower case?",
        choices: ["toLowerCase()", "toLower()", "changeCase(case)", "none of the above"],
        answer: "toLowerCase()"
    },
    {
        title: "Which of the following function of Number object returns the number's value",
        choices: ["toString()", "valueOf()", "toLocaleString()", "toPrecision()"],
        answer: "valueOf()"
    },
    {
        title: "Which of the following function of Array object joins all elements of an array into a string?",
        choices: ["concat()", "join()", "pop()", "map()"],
        answer: "join()"
    },
    {
        title: "What type of scripting language is JavaScript?",
        choices: ["Client-side", "Server-side", "all of the above", "none of the above"],
        answer: "all of the above"
    }
];

// getting all elements needed within index
var main = document.getElementById("whiteBox")
var startButton = document.getElementById("quizStart");
var timerNumber = document.getElementById("timerNumber");
var scoreCount = document.getElementById("scoreDIV");
var introInst = document.getElementById("introInst");
var questionsDIV = document.getElementById("questionsDIV");
var choicesList = document.getElementById("choicesUL");
var answerState = document.getElementById("answerState");
var gameOverScreen = document.getElementById("gameOver");
var finalScore = document.getElementById("finalScore");
var scoreComment = document.getElementById("scoreComment");
var submitScore = document.getElementById("submitScore");
var insertButton = document.getElementById("insertButton");
var highScoreTable = document.getElementById("hsData");

// high scores array either parses the 'highScores' item in local storage
// only if it exists, or it is empty 
var highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// score start value
var totalScore = 0;

//  time start & end values
var timeGiven = 60;
var timeUp = 0;

// current question (first starting at zero)
// questions array is empty until shuffles questions are pushed to it
var currentQuestion = 0;
var questionsArray = []

// updates the timer so it goes down by one each second
// if the time given is less than time up (zero), then it will stop 
// the timer & proceed to game over
function countdown() {
    interval = setInterval(function() {
        timerNumber.textContent = timeGiven;
        timeGiven--;
        if(timeGiven < timeUp) {
            stopCountdown();
            gameOver();
        }
    }, 1000);
};

// stops the timer by clearing the interval
function stopCountdown() {
    clearInterval(interval);
};

// hides content without deleting its contents
// easy way to hide instructions when quiz starts
function hide(element) {
    element.style.display = "none";
};

// shows hidden content previously hidden
// brings back the intructions when quiz is restarted
function show(element) {
    element.style.display = "block";
};

// displays high scores within modal which can be opened through the nav bar
// it first checks if highScores is within the user's local storage
// if it does not exist, it will display a message, encouraging the user to play
// if not, it will load high scores
function showHighScores(highScores) {
    highScores = JSON.parse(localStorage.getItem('highScores'));

    if (highScores == undefined) {
        highScoreTable.innerHTML = "Play & add your score to the leader board!"
    } else {
        loadHighScores(highScores)
    }
}

// immediately loads high scores performs functions to show high scores so if 
// the person has already played, it would display right away
showHighScores();

// shuffles questions randomly so each time the user takes the quiz, there
// will be a new order each time for a more fun, challenging experience
// if the current question is 0, each of these shuffled questions will be pushed 
// into the empty array then it will load the first question & return now filled questions array
// if else, then it will load the current questions array (to avoid question repeat)
function getRandom() {
    var shuffledQuestions = questions.sort(() => Math.random() - 0.5);

    if (currentQuestion == 0) {
        for(var i in shuffledQuestions) {
            questionsArray.push(shuffledQuestions[i]);
        }

        loadQuestion(shuffledQuestions);
        return questionsArray;
    } else {
        loadQuestion(questionsArray);
    }
};

// loads individual questions depending on what the current question number is
// if the current question is over 9 (meaning it exceeds the amounts of questions),
// it will prompt the timer to stop & a game over
// else, it will load the current question from the now shuffled questions array
// as well as each choice, making a button for each
function loadQuestion(questionsArray) {
    if (currentQuestion > 9) {
        stopCountdown();
        gameOver();
    } else {
        questionsDIV.innerHTML = questionsArray[currentQuestion].title;

        for (var i=0; i < 4; i++) {
            var choiceButton = document.createElement("button");
            choiceButton.classList.add("btn");
            choiceButton.innerText = questionsArray[currentQuestion].choices[i];
            choicesList.append(choiceButton);
        }   
    }
};

// for each question, it will clear both the question & choices field
// to make way for the next question to load
// then will add 1 to the current question & return it
function nextQuestion(currentQuestion) {
    questionsDIV.innerHTML = "";
    choicesList.innerHTML = "";

    currentQuestion++;;
    return currentQuestion;
}

// when user gets prompted with a game over, 
// questions, choices, & answer state fields will be cleared
// then will show that the game is indeed over & show the user's final score
// depending on the user's score, they will be prompted with different comments
// it will then create a retry button, which will allow the user to reset the quiz
// and create a submit score button, which will bring them to save their current score
function gameOver() {
    questionsDIV.innerHTML = "";
    choicesList.innerHTML = "";
    answerState.innerHTML = "";

    gameOverScreen.innerHTML = "GAME OVER";
    finalScore.innerHTML = "Your final score is " + totalScore;

    if (totalScore <= 0) {
        scoreComment.innerHTML = "Do you even know how to code?";
    } else if (totalScore > 0 && totalScore < 5) {
        scoreComment.innerHTML = "Come on... You can do better.";
    } else if (totalScore > 5 && totalScore < 7) {
        scoreComment.innerHTML = "Keep studying & you'll improve!";
    } else if (totalScore > 7 && totalScore < 9) {
        scoreComment.innerHTML = "Good job! You really know your stuff!";
    } else if (totalScore == 10) {
        scoreComment.innerHTML = "Congratulations! You're a JavaScript master!"
    }

    var retryButton = document.createElement("button");
    retryButton.classList.add("btn");
    retryButton.classList.add("btn-primary");
    retryButton.id = "retryButton";
    retryButton.innerHTML = "Retry"
    insertButton.appendChild(retryButton);

    retryButton.addEventListener("click", reset);

    var submitScore = document.createElement("button");
    submitScore.classList.add("btn");
    submitScore.classList.add("btn-primary");
    submitScore.id = "submitScore";
    submitScore.innerHTML = "Submit Score"
    insertButton.appendChild(submitScore);

    submitScore.addEventListener("click", inputInitials);
};

// when reseting the quiz, it will clear all necessary fields,
// reset displayed score & timer
// as well as resetting the values of time given, score, current question,
// erase all questions within the questions array
// then it will show the instructions to allow the user to play again
function reset() {
    gameOverScreen.innerHTML = "";
    finalScore.innerHTML = "";
    scoreComment.innerHTML = "";
    insertButton.innerHTML = ""

    scoreCount.innerHTML = "Score: 0";
    timerNumber.innerHTML = "60"

    timeGiven = 60;
    totalScore = 0;
    currentQuestion = 0;
    questionsArray.length = 0;

    show(introInst);
}

// when submitting score, user is prompted to input their initials
// all necessary fields are cleared,
// then an input field is created (min char length = 1, max char length = 3)
// a button is also created to submit said score
// when clicked, it uses the user's input (initials in uppercase) as their name, 
// as well as their current score
// it will then push this newly added data to the high scores,
// then it will sort these scores, & locallys save said data
// then it will go back to the starting screen, 
// show the high scores table in the modal, 
// and clear all necessary fields
function inputInitials() {
    gameOverScreen.innerHTML = "Submit Score";
    scoreComment.innerHTML = "";
    insertButton.innerHTML = ""

    var initialsInputDIV = document.createElement("div");

    var initialsInput = document.createElement("input");
    initialsInput.id = "inputInitials";
    initialsInput.setAttribute("minlength", "1");
    initialsInput.setAttribute("maxlength", "3");
    initialsInput.placeholder = "Type your initials here";
    initialsInputDIV.appendChild(initialsInput);
    main.appendChild(initialsInputDIV);

    var addScoreDIV = document.createElement("div");
    addScoreDIV.id = "submitScore";
    addScoreDIV.classList.add("col");
    addScoreDIV.classList.add("text-center");

    var addScore = document.createElement("button");
    addScore.classList.add("btn");
    addScore.classList.add("btn-primary");
    addScore.setAttribute("data-toggle", "modal");
    addScore.setAttribute("data-target", "#modalCenter");
    addScore.innerHTML = "Submit"
    addScore.addEventListener("click", function() {
        var newScore = {
            name: initialsInput.value.toUpperCase(),
            score: totalScore
        }

        highScores.push(newScore);
        highScores.sort((a,b) =>  b.newScore - a.newScore);
        localStorage.setItem('highScores', JSON.stringify(highScores));

        reset();
        loadHighScores(highScores);
        initialsInputDIV.innerHTML = "";
        addScoreDIV.innerHTML = "";

        return highScores
    });

    addScoreDIV.appendChild(addScore)
    main.appendChild(addScoreDIV);
}

// loads high scores in a table (if quiz has been previously taken)
// first clears the table in order to refresh with any new data
// then creates header, including place number, name, & score
// then makes a hover table using locally stored data from the user
// it first sorts the scores in order from highest to lowest
function loadHighScores(highScores) {
    highScoreTable.innerHTML = "";

    highScoreTable.classList.add("table");
    highScoreTable.classList.add("table-hover");

    var tableHead = document.createElement("thead");
    var tableRow = document.createElement("tr");
    var tableNumber = document.createElement("th");
    var tableName = document.createElement("th");
    var tableScore = document.createElement("th");
    tableNumber.setAttribute("scope", "col");
    tableName.setAttribute("scope", "col");
    tableScore.setAttribute("scope", "col");

    tableNumber.innerHTML = "#"
    tableName.innerHTML = "Name"
    tableScore.innerHTML = "Score"

    tableRow.appendChild(tableNumber);
    tableRow.appendChild(tableName);
    tableRow.appendChild(tableScore);
    tableHead.appendChild(tableRow);

    var tableBody = document.createElement("tbody");

    highScores.sort(function(a,b) {
        return b.score - a.score;
        })

    highScores.forEach(function(highScores) {
        var hsRow = document.createElement("tr");
        var hsPlace = document.createElement("th");
        hsPlace.setAttribute("scope", "row");
        var hsName = document.createElement("td");
        var hsScore = document.createElement("td");

        hsPlace.textContent = ""; 
        hsName.textContent = highScores.name;
        hsScore.textContent = highScores.score;

        hsRow.appendChild(hsPlace);
        hsRow.appendChild(hsName);
        hsRow.appendChild(hsScore);
        tableBody.appendChild(hsRow);
    })

    highScoreTable.appendChild(tableHead);
    highScoreTable.appendChild(tableBody)
}

// click event when starting the quiz
// it hides the instructions,
// starts the countdown,
// & gets random questions
startButton.addEventListener("click", function() {
    hide(introInst);
    countdown();
    getRandom();
});

// click event when chosing from each questions' choices
// if the clicked choice is equal to the answer,
// user score goes up by 1, answer state will show they are correct,
// and displayed score will be updated
// if it is incorrect, user's score goes down by 1, 
// time will be reduced by 5 seconds,
// and answer state will show they are incorrect as well as the correct answer
// as well as updating the current displayed score
// then it will move onto the next question
choicesList.addEventListener("click", function(answer) {
    if (answer.target.innerHTML === questionsArray[currentQuestion].answer) {
        totalScore += 1;
        answerState.innerHTML = "Correct!"
        scoreCount.innerHTML = "Score: " + totalScore;
    } else {
        totalScore -= 1;
        timeGiven -= 5;
        answerState.innerHTML = "Wrong. The correct answer was " + questionsArray[currentQuestion].answer + ".";
        scoreCount.innerHTML = "Score: " + totalScore;
    }

    currentQuestion++;
    nextQuestion(questionsArray);
    getRandom(questionsArray)
});
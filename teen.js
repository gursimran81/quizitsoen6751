const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));//Making the HTML collection of P tags as array of choice this is where we add the chpices
console.log(choices);
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
let currentQuestion = {};// Current question of the available question.
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = []; //getting questions from the API.

//I need category
const categoryVal  = localStorage.getItem("categoryVal");
const categoryText = localStorage.getItem("categoryText");
//need to update the category
const user = localStorage.getItem("userType");
var difficulty = localStorage.getItem("difficulty")||"";
//easy for a child

localStorage.setItem("difficulty",difficulty);
const url = `https://opentdb.com/api.php?amount=10&category=${categoryVal}&difficulty=${difficulty}`;
const urls = `https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple`;
fetch(
    url
)
    .then(res => { //THIS IS THE RESPONSE FROMT THE SERVER which returns THE JSON OF THE OUTPUT
        return res.json();
    })
    .then(loadedQuestions => { //THIS OUPUT BASICALLY HAS ALL THE QUESTIONS, SO FOR EACH QUESTION WE DO STUFF
        console.log(loadedQuestions);
        console.log(loadedQuestions.results);
        //ITERATING through an array of loadedquestions and transforming them.
        questions = loadedQuestions.results.map(loadedQuestion => { //MAPPING THE JSON THAT WE got from the API into another format, that related to our HTML
            //CREATING a formatted question OBJECT
            const formattedQuestion = {
                question: loadedQuestion.question,
                type: loadedQuestion.type
            };
    //CReating an answer choices array in the map to have all the incorrect answers
            const answerChoices = [...loadedQuestion.incorrect_answers];

            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            //ADDING THE CORRECT anser inside the answer choices array
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion["choice" + (index + 1)] = choice;
            });

            return formattedQuestion; //Returning the Formatted Question Object
        });

        startGame();
    })
    .catch(err => {
        console.error(err);
    });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    console.log(categoryVal+categoryText+user+difficulty);
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions]; //spreading out the questions that we get from the API to available Question array.
    console.log(availableQuesions);
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        //go to the end page
        return window.location.assign("end.html");
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length); //Getting a quesition index to display

    //getting the current question to DISPLAY  out of all of the available questions.
    currentQuestion = availableQuesions[questionIndex];
    //storing the current question to display in currentQuestion Array.
    console.log(currentQuestion);
    question.innerText = currentQuestion.question;
//========THIS IS WHERE THE CHOICES ARE PRINTED ON THE OPTIONS.
//Iterating through each choice .Here choice variable has the reference to a p tag in the HTML collection.

    
    //BASED ON THE TYPE OF QUESTION WE GET, UPDATING THE UI
    console.log(currentQuestion.type);
    
    
    if (currentQuestion.type==='boolean'){
        document.getElementById("extra1").style.display = "none";
        document.getElementById("extra2").style.display = "none";
        let count = 1;
        choices.forEach(choice=>{
            choice.innerText = currentQuestion["choice"+count];
            count++;
        });

    }
    else {
        document.getElementById("extra1").style.display = "flex";
        document.getElementById("extra2").style.display = "flex";
        choices.forEach(choice => {
            const number = choice.dataset["number"]; //it will be either 1,2,3 or 4 from data-number property.
            console.log(number);
            choice.innerText = currentQuestion["choice" + number];
        });

    }
    //REMOVING THE QUESTION, ONCE ASKED
    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

//ADDING LISTENERS TO ALL OF THE CHOICES..
choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

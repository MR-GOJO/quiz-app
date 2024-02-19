const quizForm = document.getElementById("quizForm");
const difficultySelect = document.getElementById("difficulty");
const quizQuestion = document.getElementById("quizQuestion");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const feedbackElement = document.getElementById("feedback");
const nextQuestionButton = document.getElementById("nextQuestion");
const scoreboard = document.getElementById("scoreboard");
const correctAnswersElement = document.getElementById("correctAnswers");
const incorrectAnswersElement = document.getElementById("incorrectAnswers");
const resetScoreButton = document.getElementById("resetScore");
const refreshButton = document.getElementById("refreshButton");
const finalMessage = document.getElementById("final-message");

refreshButton.addEventListener("click", function () {
  resetQuiz();
});

let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let userAnswered = false;

function fetchQuestions(difficulty) {
  fetch(
    `https://quizapi.io/api/v1/questions?apiKey=kaCYVunTkDUxMT86FXK1udzeR9xkuVXEkNfiOt1T&limit=10&difficulty=${difficulty}`
  )
    .then((response) => response.json())
    .then((data) => {
      questions = data;
      showQuestion();
    })
    .catch((error) => console.error("Error fetching questions:", error));
}

function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  answersElement.innerHTML = "";
  for (const key in currentQuestion.answers) {
    if (currentQuestion.answers[key]) {
      const answerButton = document.createElement("button");
      answerButton.textContent = currentQuestion.answers[key];
      answerButton.addEventListener("click", () => checkAnswer(key));
      answersElement.appendChild(answerButton);
    }
  }
  quizQuestion.style.display = "block";
  quizForm.style.display = "none";
  nextQuestionButton.style.display = userAnswered ? "block" : "none";

  if (currentQuestionIndex === questions.length - 1 && userAnswered) {
    finalMessage.style.display = "block";
  } else {
    finalMessage.style.display = "none";
  }
}

function checkAnswer(selectedAnswer) {
  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect =
    currentQuestion.correct_answers[selectedAnswer + "_correct"] === "true";
  if (isCorrect) {
    feedbackElement.textContent = "Correct!";
    correctAnswers++;
  } else {
    feedbackElement.textContent = "Incorrect!";
    incorrectAnswers++;
  }
  updateScoreboard();
  userAnswered = true;
  nextQuestionButton.style.display = "block";
  const answerButtons = answersElement.querySelectorAll("button");
  answerButtons.forEach((button) => {
    if (button.textContent === currentQuestion.answers[selectedAnswer]) {
      button.classList.add("selected");
    }
    button.disabled = true;
  });
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    feedbackElement.textContent = "";
    showQuestion();
    nextQuestionButton.style.display = "none";
  } else {
    quizQuestion.style.display = "none";
    scoreboard.style.display = "flex";
    nextQuestionButton.style.display = "none";
    feedbackElement.textContent = "Quiz finished!";
  }
}

function updateScoreboard() {
  correctAnswersElement.textContent = correctAnswers;
  incorrectAnswersElement.textContent = incorrectAnswers;
  // Save scores to localStorage
  localStorage.setItem(
    "quizScores",
    JSON.stringify({ correctAnswers, incorrectAnswers })
  );
}

function resetScore() {
  correctAnswers = 0;
  incorrectAnswers = 0;
  updateScoreboard();
}

quizForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const difficulty = difficultySelect.value;
  fetchQuestions(difficulty);
});

function resetQuiz() {
  currentQuestionIndex = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  feedbackElement.textContent = "";
  nextQuestionButton.style.display = "none";
  quizForm.style.display = "flex";
  quizQuestion.style.display = "none";
  scoreboard.style.display = "flex";
  updateScoreboard();

  userAnswered = false;

  finalMessage.style.display = "none";
}

function loadScoreFromLocalStorage() {
  // Load scores from localStorage
  const scores = JSON.parse(localStorage.getItem("quizScores"));
  if (scores) {
    correctAnswers = scores.correctAnswers || 0;
    incorrectAnswers = scores.incorrectAnswers || 0;
    updateScoreboard();
  }
}

nextQuestionButton.addEventListener("click", nextQuestion);

resetScoreButton.addEventListener("click", resetScore);

window.addEventListener("load", loadScoreFromLocalStorage);

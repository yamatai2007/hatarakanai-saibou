document.addEventListener("DOMContentLoaded", function () {
    let groupName = "";
    let antigenCount = 0;
    let selectedLevel = null;
    let selectedAnswer = null;
    let correctAnswer = "";
    let targetCount = 0;
    let totalScore = 0;

    const levels = {
        1: { question: "赤血球はどれ？", answers: ["トマト", "赤血球", "消防車"], correct: "赤血球" },
        2: { question: "細菌を倒すのは？", answers: ["自衛隊", "白血球", "血小板"], correct: "白血球" },
        3: { question: "赤血球が運ぶのは？", answers: ["タンパク質", "水素", "酸素"], correct: "酸素" },
        4: { question: "出血した際、止血する物質は？", answers: ["フィブリン", "フィブリノーゲン", "絆創膏"], correct: "フィブリン" },
        5: { question: "抗原提示とは？", answers: ["食作用", "抗原提示", "細菌提示"], correct: "抗原提示" }
    };

    function updateScore() {
        totalScore = (antigenCount + (selectedLevel ? selectedLevel : 0)) * targetCount;
        document.getElementById("totalScore").textContent = `あなたのグループの得点は ${totalScore} 点です！`;
    }

    function sendToSpreadsheet() {
        const url = "https://script.google.com/macros/s/AKfycbwX8xho1OCc2c6N14JrjCDx7DworvzaSc5CrFjShbHJaVokJCmpyXNolJQEzWilVB7K/exec";
        const data = {
            timestamp: new Date().toLocaleString(),
            groupName: groupName,
            antigenCount: antigenCount,
            selectedLevel: selectedLevel,
            correct: selectedAnswer === correctAnswer ? "正解" : "不正解",
            targetCount: targetCount,
            totalScore: totalScore
        };

        fetch(url, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).catch(err => console.error("データ送信エラー:", err));
    }

    document.getElementById("groupSubmit").addEventListener("click", function () {
        groupName = document.getElementById("groupName").value.trim();
        if (groupName) {
            document.getElementById("groupSection").style.display = "none";
            document.getElementById("antigenSection").style.display = "block";
        }
    });

    document.getElementById("antigenSubmit").addEventListener("click", function () {
        antigenCount = parseInt(document.getElementById("antigenCount").value, 10) || 0;
        document.getElementById("antigenSection").style.display = "none";
        document.getElementById("levelSelection").style.display = "block";
    });

    document.querySelectorAll(".levelButton").forEach(button => {
        button.addEventListener("click", function () {
            document.querySelectorAll(".levelButton").forEach(b => b.classList.remove("selected"));
            this.classList.add("selected");
            selectedLevel = parseInt(this.getAttribute("data-level"), 10);
            document.getElementById("levelSelection").style.display = "none";
            document.getElementById("quizSection").style.display = "block";
            displayQuiz(selectedLevel);
        });
    });

    function displayQuiz(level) {
        const quiz = levels[level];
        correctAnswer = quiz.correct;
        document.getElementById("quizQuestion").textContent = quiz.question;
        const options = document.getElementById("quizOptions");
        options.innerHTML = "";

        quiz.answers.forEach(answer => {
            const button = document.createElement("div");
            button.classList.add("quiz-option");
            button.textContent = answer;
            button.addEventListener("click", function () {
                selectedAnswer = answer;
                showConfirmMessage(answer);
            });
            options.appendChild(button);
        });
    }

    function showConfirmMessage(answer) {
        const confirmBox = document.getElementById("confirmMessage");
        confirmBox.innerHTML = `
            <p>この回答でよろしいですか？</p>
            <strong>${answer}</strong>
            <button id="confirmYes">はい</button>
            <button id="confirmNo">いいえ</button>
        `;
        confirmBox.style.display = "block";

        document.getElementById("confirmYes").addEventListener("click", function () {
            confirmBox.style.display = "none";
            showResult();
        });

        document.getElementById("confirmNo").addEventListener("click", function () {
            confirmBox.style.display = "none";
        });
    }

    function showResult() {
        document.getElementById("quizSection").style.display = "none";
        document.getElementById("resultSection").style.display = "block";

        if (selectedAnswer === correctAnswer) {
            document.getElementById("resultMessage").textContent = "正解！";
        } else {
            document.getElementById("resultMessage").textContent = "不正解...";
        }

        document.getElementById("resultExplanation").textContent = `正解は「${correctAnswer}」です。`;
    }

    document.getElementById("nextToTarget").addEventListener("click", function () {
       

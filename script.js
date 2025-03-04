let step = 1;
let antigenCount = 0;
let selectedDifficulty = 0;
let correctAnswer = "";
let finalScore = 0;

// 次のステップに進む
function nextStep(next) {
    document.getElementById(`step${step}`).classList.add("hidden");
    document.getElementById(`step${next}`).classList.remove("hidden");
    step = next;
}

// 抗原の数を変更
function adjustAntigen(change) {
    antigenCount += change;
    if (antigenCount < 0) antigenCount = 0;
    document.getElementById("antigenCount").textContent = antigenCount;
}

// 難易度を選択
function selectDifficulty(level) {
    selectedDifficulty = level;
    alert(`レベル${level}を選択しました！`);
}

// クイズの正解判定
function checkAnswer(selected) {
    if (selected === correctAnswer) {
        alert("正解！");
    } else {
        alert("不正解...");
    }
    nextStep(5);
}

// スコアを計算
function calculateScore() {
    let targetCount = document.getElementById("targetCount").value;
    finalScore = (antigenCount + selectedDifficulty) * targetCount;
    document.getElementById("finalScore").textContent = `${finalScore}点`;
    nextStep(6);
}

// スプレッドシートに送信
function sendToSpreadsheet() {
    let groupName = document.getElementById("groupName").value;
    let targetCount = document.getElementById("targetCount").value;

    let data = {
        time: new Date().toLocaleString(),
        group: groupName,
        antigen: antigenCount,
        difficulty: selectedDifficulty,
        targets: targetCount,
        score: finalScore
    };

    fetch("https://script.google.com/macros/s/AKfycbwX8xho1OCc2c6N14JrjCDx7DworvzaSc5CrFjShbHJaVokJCmpyXNolJQEzWilVB7K/exec", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => alert("送信完了！"))
    .catch(error => alert("エラーが発生しました"));
}

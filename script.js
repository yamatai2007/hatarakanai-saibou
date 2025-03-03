// ゲームデータを保持するオブジェクト
let gameData = {
  groupName: '',
  antigenCount: 0,
  quizDifficulty: 0,
  quizAnswer: '',
  quizCorrect: false,
  targetCount: 0,
  quizPoints: 0,
  antigenPoints: 0,
  totalScore: 0,
  timestamp: ''
};

let selectedOption = null; // ユーザーが選択した回答を保持

// 各レベルのクイズデータ
const quizQuestions = {
  1: {
    question: "赤血球はどれ？",
    options: [
      { text: "トマト", image: "トマト.jpeg", correct: false },
      { text: "赤血球", image: "赤血球.jpg", correct: true },
      { text: "消防車", image: "消防車.jpg", correct: false }
    ],
    explanation: "赤血球は血液中にあり、酸素を運ぶ役割を担っています。"
  },
  2: {
    question: "細菌を倒すのは？",
    options: [
      { text: "自衛隊", image: "自衛隊.jpeg", correct: false },
      { text: "白血球", image: "白血球.png", correct: true },
      { text: "血小板", image: "血小板.png", correct: false }
    ],
    explanation: "白血球は免疫細胞であり、細菌やウイルスと戦います。"
  },
  3: {
    question: "赤血球が運ぶのは？",
    options: [
      { text: "タンパク質", image: "タンパク質.png", correct: false },
      { text: "水素", image: "水素.jpg", correct: false },
      { text: "酸素", image: "酸素.jpg", correct: true }
    ],
    explanation: "赤血球は酸素を運ぶため、体中に必要な酸素を供給します。"
  },
  4: {
    question: "出血した際、傷口を防いで止血する血液凝固の役割を果たす物質はなに？",
    options: [
      { text: "フィブリン", image: "フィブリン.jpg", correct: true },
      { text: "フィブリノーゲン", image: "フィブリノーゲン.jpg", correct: false },
      { text: "絆創膏", image: "絆創膏.png", correct: false }
    ],
    explanation: "フィブリンは血液凝固に関与し、出血を防ぐ働きをします。"
  },
  5: {
    question: "樹状細胞やマクロファージ、B細胞が、遺物を認識しそれを取り込んで分解して、一部を細胞の表面に提示するはたらきをなんというか？",
    options: [
      { text: "食作用", correct: false },
      { text: "抗原提示", correct: true },
      { text: "細菌提示", correct: false },
      { text: "免疫応答", correct: false }
    ],
    explanation: "抗原提示は免疫応答を誘導する重要なプロセスです。"
  }
};

let currentQuizLevel = 0; // 現在のクイズ難易度

// ページ（セクション）の表示・非表示を切り替える
function navigate(section) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => sec.style.display = 'none');
  document.getElementById('section-' + section).style.display = 'block';
}

// スタートボタン
document.getElementById('btn-start').addEventListener('click', () => {
  navigate('group');
});

// グループ名の保存
function saveGroupName() {
  const groupNameInput = document.getElementById('groupName');
  if (groupNameInput.value.trim() === '') {
    alert('グループ名を入力してください');
    return;
  }
  gameData.groupName = groupNameInput.value.trim();
  navigate('antigen');
}

// 抗原数の調整
function changeAntigen(delta) {
  const input = document.getElementById('antigenCount');
  let value = parseInt(input.value) || 0;
  value += delta;
  if (value < 0) value = 0;
  input.value = value;
}

function saveAntigen() {
  const count = parseInt(document.getElementById('antigenCount').value) || 0;
  gameData.antigenCount = count;
  // 抗原数に応じたポイント計算
  if (count === 0) gameData.antigenPoints = 1;
  else if (count <= 5) gameData.antigenPoints = 2;
  else if (count <= 10) gameData.antigenPoints = 3;
  else if (count <= 15) gameData.antigenPoints = 4;
  else gameData.antigenPoints = 5;
  navigate('quiz-difficulty');
}

// クイズ難易度選択
function selectDifficulty(level, btnElement) {
  gameData.quizDifficulty = level;
  currentQuizLevel = level;
  // 選択状態を視覚的に表示
  const btns = document.querySelectorAll('.difficulty-btn');
  btns.forEach(btn => btn.classList.remove('selected'));
  btnElement.classList.add('selected');
  // 次へボタンを有効化
  document.getElementById('btn-difficulty-next').disabled = false;
}

// クイズ画面に移行したときの処理
function loadQuizQuestion() {
  const quizData = quizQuestions[currentQuizLevel];
  document.getElementById('quiz-question').innerText = quizData.question;
  const optionsContainer = document.getElementById('quiz-options');
  optionsContainer.innerHTML = '';
  selectedOption = null;
  quizData.options.forEach(option => {
    const div = document.createElement('div');
    div.className = 'option';
    if (option.image) {
      const img = document.createElement('img');
      img.src = option.image;
      img.alt = option.text;
      div.appendChild(img);
    }
    const span = document.createElement('span');
    span.innerText = option.text;
    div.appendChild(span);
    div.addEventListener('click', () => { showConfirmation(option); });
    optionsContainer.appendChild(div);
  });
  // 確認とフィードバックの非表示
  document.getElementById('quiz-confirmation').style.display = 'none';
  document.getElementById('quiz-feedback').style.display = 'none';
  navigate('quiz');
}

// 回答確認用のオーバーレイ表示
function showConfirmation(option) {
  selectedOption = option;
  const confirmationDiv = document.getElementById('quiz-confirmation');
  const confirmationText = document.getElementById('confirmation-text');
  let content = `この回答「${option.text}」でよろしいですか？`;
  if (option.image) {
    content += "（画像で確認）";
  }
  confirmationText.innerText = content;
  confirmationDiv.style.display = 'flex'; // オーバーレイ表示
}

// ユーザーが確認で「はい」「いいえ」を選んだ場合の処理
function confirmAnswer(isConfirmed) {
  const confirmationDiv = document.getElementById('quiz-confirmation');
  if (isConfirmed) {
    gameData.quizAnswer = selectedOption.text;
    gameData.quizCorrect = selectedOption.correct;
    gameData.quizPoints = selectedOption.correct ? gameData.quizDifficulty : 0;
    const feedbackDiv = document.getElementById('quiz-feedback');
    const feedbackText = document.getElementById('feedback-text');
    if (selectedOption.correct) {
      feedbackText.innerText = "正解！ " + quizQuestions[currentQuizLevel].explanation;
    } else {
      feedbackText.innerText = "不正解。 " + quizQuestions[currentQuizLevel].explanation;
    }
    feedbackDiv.style.display = 'block';
    confirmationDiv.style.display = 'none';
  } else {
    // 「いいえ」の場合はオーバーレイを閉じ、再度選択可能に
    confirmationDiv.style.display = 'none';
  }
}

// 「次へ」ボタンでクイズから的の数入力画面へ
function nextAfterQuiz() {
  navigate('target');
}

// 的の数の調整
function changeTarget(delta) {
  const input = document.getElementById('targetCount');
  let value = parseInt(input.value) || 0;
  value += delta;
  if (value < 0) value = 0;
  input.value = value;
}

function saveTarget() {
  const count = parseInt(document.getElementById('targetCount').value) || 0;
  gameData.targetCount = count;
  calculateScore();
  showResult();
  navigate('result');
}

// 得点計算： (抗原ポイント + クイズポイント) × 的の数
function calculateScore() {
  gameData.totalScore = (gameData.antigenPoints + gameData.quizPoints) * gameData.targetCount;
  gameData.timestamp = new Date().toISOString();
}

// 結果表示
function showResult() {
  document.getElementById('result-message').innerText = `あなたのグループの得点は ${gameData.totalScore} 点です！`;
}

// Googleスプレッドシート連携
// 送信データ：送った時間、グループ名、抗原数、クイズの選択難易度、正誤、的の数、合計得点
function submitData() {
  const endpoint = "https://script.google.com/macros/s/AKfycbwX8xho1OCc2c6N14JrjCDx7DworvzaSc5CrFjShbHJaVokJCmpyXNolJQEzWilVB7K/exec";
  const params = new URLSearchParams({
    timestamp: gameData.timestamp,
    groupName: gameData.groupName,
    antigenCount: gameData.antigenCount,
    quizDifficulty: gameData.quizDifficulty,
    quizCorrect: gameData.quizCorrect,
    targetCount: gameData.targetCount,
    totalScore: gameData.totalScore
  });
  
  fetch(`${endpoint}?${params.toString()}`)
    .then(response => response.text())
    .then(result => {
      alert("データ送信完了！");
      navigate('start');
    })
    .catch(error => {
      console.error("Error:", error);
      alert("データの通信に失敗しました。");
    });
}

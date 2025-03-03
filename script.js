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

// ページ（セクション）の表示・非表示を切り替える関数
function navigate(section) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => sec.style.display = 'none');
  document.getElementById('section-' + section).style.display = 'block';
}

// スタートボタンの動作
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
function selectDifficulty(level) {
  gameData.quizDifficulty = level;
  currentQuizLevel = level;
  // 難易度選択後、次へボタンを有効化
  document.getElementById('btn-difficulty-next').disabled = false;
}

// クイズ画面に移行したときに問題をロード
function loadQuizQuestion() {
  const quizData = quizQuestions[currentQuizLevel];
  document.getElementById('quiz-question').innerText = quizData.question;
  const optionsContainer = document.getElementById('quiz-options');
  optionsContainer.innerHTML = '';
  quizData.options.forEach(option => {
    const div = document.createElement('div');
    div.className = 'option';
    // 画像がある場合は画像を表示
    if (option.image) {
      const img = document.createElement('img');
      img.src = option.image;
      img.alt = option.text;
      div.appendChild(img);
    }
    const span = document.createElement('span');
    span.innerText = option.text;
    div.appendChild(span);
    // クリック時に「selected」クラスを付与
    div.addEventListener('click', (e) => { selectQuizOption(option, e.currentTarget); });
    optionsContainer.appendChild(div);
  });
  // フィードバック部分を非表示に
  document.getElementById('quiz-feedback').style.display = 'none';
  navigate('quiz');
}

// 選択肢がクリックされた時の処理（選択状態を視覚的に表示）
function selectQuizOption(option, selectedElem) {
  // 全ての選択肢から "selected" クラスを削除
  let options = document.querySelectorAll('.option');
  options.forEach(opt => opt.classList.remove('selected'));
  selectedElem.classList.add('selected');
  
  gameData.quizAnswer = option.text;
  gameData.quizCorrect = option.correct;
  gameData.quizPoints = option.correct ? gameData.quizDifficulty : 0;
  const feedbackDiv = document.getElementById('quiz-feedback');
  const feedbackText = document.getElementById('feedback-text');
  if (option.correct) {
    feedbackText.innerText = "正解！ " + quizQuestions[currentQuizLevel].explanation;
  } else {
    feedbackText.innerText = "不正解。 " + quizQuestions[currentQuizLevel].explanation;
  }
  feedbackDiv.style.display = 'block';
}

// 「次へ」ボタンでクイズ画面から次の画面に進む
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

// 得点の計算： (抗原ポイント + クイズポイント) × 的の数
function calculateScore() {
  gameData.totalScore = (gameData.antigenPoints + gameData.quizPoints) * gameData.targetCount;
  gameData.timestamp = new Date().toISOString();
}

// 結果の表示
function showResult() {
  document.getElementById('result-message').innerText = `あなたのグループの得点は ${gameData.totalScore} 点です！`;
}

// Googleスプレッドシート連携（実際の送信）
function submitData() {
  const url = "https://script.google.com/macros/s/AKfycbwX8xho1OCc2c6N14JrjCDx7DworvzaSc5CrFjShbHJaVokJCmpyXNolJQEzWilVB7K/exec";
  // データ送信前にタイムスタンプ更新
  gameData.timestamp = new Date().toISOString();
  
  fetch(url, {
    method: "POST",
    mode: "no-cors", // レスポンスは取得できませんが、送信は可能
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(gameData)
  })
  .then(() => {
    alert("データを送信しました！");
    navigate('start');
  })
  .catch(error => {
    console.error("送信エラー:", error);
    alert("データ送信に失敗しました。");
  });
}

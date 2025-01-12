const studyCards = document.querySelector('.study-cards');
const flipCard = document.querySelector('.flip-card');
const wordFront = document.querySelector('#card-front h1');
const wordBack = document.querySelector('#card-back h1');
const useBack = document.querySelector('#card-back span');
const backBtn = document.querySelector('#back');
const nextBtn = document.querySelector('#next');
const examBtn = document.querySelector('#exam');
const examMode = document.querySelector('#exam-mode');
const examField = document.querySelector('#exam-cards');
const studyMode = document.querySelector('#study-mode');
const controlBtns = document.querySelector('.slider-controls');
const currentWord = document.querySelector('#current-word');
const wordsProgress = document.querySelector('#words-progress');
const shuffleBtn = document.querySelector('#shuffle-words');
const correctPercent = document.querySelector('#correct-percent');
const examProgress = document.querySelector('#exam-progress');
const timer = document.querySelector('#time');
const resultsDesk = document.querySelector('.results-modal');
const resultsContent = document.querySelector('.results-content');
const recordedTime = document.querySelector('#timer');
const wordStats = document.querySelector('#word-stats');

const words = [{
        rus: 'яблоко',
        eng: 'apple',
        use: 'apples are rich with vitamin C'
    },
    {
        rus: 'кот',
        eng: 'cat',
        use: 'on average, a cat will sleep for 16 hours a day'
    },
    {
        rus: 'дом',
        eng: 'home',
        use: 'home - it’s where the heart is'
    },
    {
        rus: 'друг',
        eng: 'friend',
        use: 'friends can help you feel more comfortable'
    },
    {
        rus: 'книга',
        eng: 'book',
        use: 'the world’s smallest book is Teeny Ted from Turnip Town'
    }
]

let n = 0;
wordsProgress.value = 20;
let timerMode = 'off';
const timerClock = timer.innerText.split(':');

let minutes = timerClock[0];
let seconds = timerClock[1];
let timerRun;

localStorage.clear();

renderStudyCards();

shuffleBtn.addEventListener('click', (event) => {
    shuffleWords(words);
    renderStudyCards();
});

flipCard.addEventListener('click', () => {
    flipCard.classList.toggle('active');
});

controlBtns.addEventListener('click', (event) => {

    if (event.target === nextBtn) {
        n += 1;
    } else if (event.target === backBtn) {
        n -= 1;
    };

    wordFront.textContent = words[n].eng;
    wordBack.textContent = words[n].rus;
    useBack.textContent = words[n].use;

    if (n === words.length - 1) {
        nextBtn.disabled = true;
    } else if (n < words.length - 1 && n > 0) {
        nextBtn.disabled = false;
        backBtn.disabled = false;
    } else if (n === 0) {
        backBtn.disabled = true;
    };

    currentWord.textContent = n + 1;
    wordsProgress.value = ((n + 1) * 100) / 5;

    if (event.target === examBtn) {
        examMode.classList.remove('hidden');
        studyMode.classList.add('hidden');
        studyCards.classList.add('hidden');
        n = 0;

        const testWords = [];

        words.forEach(function(item) {
            testWords.push(item.rus);
            testWords.push(item.eng);
            shuffleWords(testWords);
        });

        const examCards = new DocumentFragment();
        for (let testWord of testWords) {
            const testCard = document.createElement('div');
            testCard.textContent = testWord;
            testCard.classList.add('card');
            examCards.append(testCard);
        };
        examField.append(examCards);
    }
});

let firstWord;
let secondWord;

examField.addEventListener('click', (event) => {

    if (event.target.classList.contains('card') && !event.target.classList.contains('fade-out')) {

        timeCount();

        if (!firstWord && !secondWord) {
            firstWord = event.target;
            event.target.classList.add('correct');

        } else if (firstWord && !secondWord) {
            secondWord = event.target;

            if (checkCompatibility(firstWord, secondWord)) {
                n++;
                correctPercent.textContent = `${(n * 100) / 5}%`;
                examProgress.value = (n * 100) / 5;
                secondWord.classList.add('correct');
                firstWord.classList.add('fade-out');
                secondWord.classList.add('fade-out');
                firstWord = '';
                secondWord = '';
            } else {
                event.target.classList.add('wrong');
                setTimeout(() => {
                    firstWord.classList.remove('correct');
                    secondWord.classList.remove('wrong');
                    firstWord = '';
                    secondWord = '';
                }, 500);
            }
        }
    }
});

function checkCompatibility(firstItem, secondItem) {

    let rusIndex = words.findIndex((item) => item.rus === firstItem.textContent);
    let engIndex = words.findIndex((item) => item.eng === secondItem.textContent);

    if (rusIndex < 0 || engIndex < 0) {
        rusIndex = words.findIndex((item) => item.rus === secondItem.textContent);
        engIndex = words.findIndex((item) => item.eng === firstItem.textContent);
    }

    if (engIndex >= 0) {
        saveData(engIndex);
    }

    return rusIndex === engIndex;
}

function shuffleWords(arr) {
    let number;
    let change;

    for (let i = arr.length - 1; i > 0; i--) {
        number = Math.floor(Math.random() * (i + 1));
        change = arr[number];
        arr[number] = arr[i];
        arr[i] = change;
    }

    return arr;
}

function renderStudyCards() {
    wordFront.textContent = words[n].eng;
    wordBack.textContent = words[n].rus;
    useBack.textContent = words[n].use;
}

function timeCount() {
    if (timerMode === 'off') {

        timerMode = 'on';
        timerRun = setInterval(() => {

            if (examProgress.value === 100) {

                stopExam();

            } else {

                seconds++;

                if (seconds > 59) {
                    seconds = '00';
                    minutes++;
                } else if (seconds < 10) {
                    seconds = '0' + seconds;
                };

                timer.innerText = `${minutes}:${seconds}`;
            }

        }, 1000);
    };
}

function stopExam() {

    clearInterval(timerRun);
    timerMode = 'off';
    resultsDesk.classList.remove('hidden');
    recordedTime.textContent = `${minutes}:${seconds}`;

    for (let i = 0; i < 5; i++) {

        const resultCard = wordStats.content.cloneNode(true);
        resultCard.querySelector('.word span').textContent = localStorage.key(i);
        resultCard.querySelector('.attempts span').textContent = localStorage.getItem(localStorage.key(i));
        resultsContent.append(resultCard);
    }

    localStorage.clear();
}

function saveData(index) {

    let counter = localStorage.getItem(`${words[index].eng}`);
    counter++;
    localStorage.setItem(`${words[index].eng}`, counter);
}
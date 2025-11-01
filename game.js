// Game State
let currentLevel = null;
let currentQuestion = 0;
let score = 0;
let selectedAnswers = [];
let totalQuestions = 5;

// Level Configuration
const levelConfig = {
    easy1: {
        name: "Easy 1",
        wordsToFind: 1,
        totalOptions: 4,
        questionsPerLevel: 5
    },
    easy2: {
        name: "Easy 2",
        wordsToFind: 2,
        totalOptions: 6,
        questionsPerLevel: 5
    },
    easy3: {
        name: "Easy 3",
        wordsToFind: 3,
        totalOptions: 8,
        questionsPerLevel: 5
    },
    medium1: {
        name: "Medium 1",
        wordsToFind: 4,
        totalOptions: 10,
        questionsPerLevel: 5
    },
    medium2: {
        name: "Medium 2",
        wordsToFind: 5,
        totalOptions: 12,
        questionsPerLevel: 5
    },
    medium3: {
        name: "Medium 3",
        wordsToFind: 6,
        totalOptions: 14,
        questionsPerLevel: 5
    },
    hard1: {
        name: "Hard 1",
        wordsToFind: 7,
        totalOptions: 16,
        questionsPerLevel: 5
    },
    hard2: {
        name: "Hard 2",
        wordsToFind: 8,
        totalOptions: 18,
        questionsPerLevel: 5
    },
    hard3: {
        name: "Hard 3",
        wordsToFind: 9,
        totalOptions: 20,
        questionsPerLevel: 5
    }
};

// Sample Tibetan words with English translations
const wordBank = [
    { tibetan: "བཀྲ་ཤིས།", english: "Hello", category: "greetings" },
    { tibetan: "ཐུགས་རྗེ་ཆེ།", english: "Thank you", category: "greetings" },
    { tibetan: "རྒྱལ་ཁ།", english: "Country", category: "nouns" },
    { tibetan: "ཆུ།", english: "Water", category: "nouns" },
    { tibetan: "མེ།", english: "Fire", category: "nouns" },
    { tibetan: "རླུང་།", english: "Wind", category: "nouns" },
    { tibetan: "ས།", english: "Earth", category: "nouns" },
    { tibetan: "ནམ་མཁའ།", english: "Sky", category: "nouns" },
    { tibetan: "ཉི་མ།", english: "Sun", category: "nouns" },
    { tibetan: "ཟླ་བ།", english: "Moon", category: "nouns" },
    { tibetan: "སྐར་མ།", english: "Star", category: "nouns" },
    { tibetan: "རི།", english: "Mountain", category: "nouns" },
    { tibetan: "མཚོ།", english: "Lake", category: "nouns" },
    { tibetan: "ཁ་ལག", english: "Food", category: "nouns" },
    { tibetan: "ཇ།", english: "Tea", category: "nouns" },
    { tibetan: "བོད།", english: "Tibet", category: "places" },
    { tibetan: "ལྷ་ས།", english: "Lhasa", category: "places" },
    { tibetan: "དགོན་པ།", english: "Monastery", category: "places" },
    { tibetan: "སློབ་གྲྭ།", english: "School", category: "places" },
    { tibetan: "གཞིས་ཀ།", english: "Home", category: "places" },
    { tibetan: "དགའ་བ།", english: "Happy", category: "adjectives" },
    { tibetan: "སྡུག་པ།", english: "Sad", category: "adjectives" },
    { tibetan: "བཟང་པོ།", english: "Good", category: "adjectives" },
    { tibetan: "ངན་པ།", english: "Bad", category: "adjectives" },
    { tibetan: "ཆེ་བ།", english: "Big", category: "adjectives" }
];

// Get shuffled array
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize game
function initGame() {
    const levelButtons = document.querySelectorAll('.level-btn');
    levelButtons.forEach(btn => {
        btn.addEventListener('click', () => startLevel(btn.dataset.level));
    });

    document.getElementById('check-btn').addEventListener('click', checkAnswer);
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('back-to-levels-btn').addEventListener('click', showLevelSelection);
    document.getElementById('retry-btn').addEventListener('click', () => startLevel(currentLevel));
    document.getElementById('next-level-btn').addEventListener('click', nextLevel);
    document.getElementById('return-levels-btn').addEventListener('click', showLevelSelection);
}

// Show level selection screen
function showLevelSelection() {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById('level-selection').classList.add('active');
}

// Start a level
function startLevel(levelId) {
    currentLevel = levelId;
    currentQuestion = 0;
    score = 0;
    const config = levelConfig[levelId];
    totalQuestions = config.questionsPerLevel;
    
    document.getElementById('current-level').textContent = `Level: ${config.name}`;
    document.getElementById('score').textContent = `Score: 0`;
    
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById('game-screen').classList.add('active');
    
    loadQuestion();
}

// Load a question
function loadQuestion() {
    const config = levelConfig[currentLevel];
    selectedAnswers = [];
    
    // Hide feedback and next button
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');
    document.getElementById('check-btn').classList.remove('hidden');
    
    // Select random correct words
    const shuffledWords = shuffle(wordBank);
    const correctWords = shuffledWords.slice(0, config.wordsToFind);
    
    // Create wrong options
    const wrongWords = shuffledWords.slice(config.wordsToFind, config.totalOptions);
    
    // Display question
    const questionText = config.wordsToFind === 1 
        ? 'Select the correct word:' 
        : `Select the ${config.wordsToFind} correct words:`;
    document.getElementById('question').textContent = questionText;
    
    // Display words to find
    const wordsDisplay = document.getElementById('words-display');
    wordsDisplay.innerHTML = '';
    correctWords.forEach(word => {
        const chip = document.createElement('div');
        chip.className = 'word-chip';
        chip.textContent = word.english;
        wordsDisplay.appendChild(chip);
    });
    
    // Display options (shuffled correct and wrong answers)
    const allOptions = shuffle([...correctWords, ...wrongWords]);
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    allOptions.forEach((word, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = word.tibetan;
        button.dataset.word = word.tibetan;
        button.dataset.english = word.english;
        button.dataset.isCorrect = correctWords.some(w => w.tibetan === word.tibetan);
        
        button.addEventListener('click', () => toggleOption(button));
        optionsContainer.appendChild(button);
    });
    
    // Store correct answers for checking
    window.currentCorrectAnswers = correctWords.map(w => w.tibetan);
}

// Toggle option selection
function toggleOption(button) {
    if (button.disabled) return;
    
    const config = levelConfig[currentLevel];
    
    if (button.classList.contains('selected')) {
        button.classList.remove('selected');
        const index = selectedAnswers.indexOf(button.dataset.word);
        if (index > -1) selectedAnswers.splice(index, 1);
    } else {
        // Check if we can select more
        if (selectedAnswers.length < config.wordsToFind) {
            button.classList.add('selected');
            selectedAnswers.push(button.dataset.word);
        }
    }
}

// Check answer
function checkAnswer() {
    const config = levelConfig[currentLevel];
    
    if (selectedAnswers.length !== config.wordsToFind) {
        alert(`Please select exactly ${config.wordsToFind} word(s)`);
        return;
    }
    
    // Disable all buttons
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    // Check if all selected answers are correct
    const allCorrect = selectedAnswers.every(ans => 
        window.currentCorrectAnswers.includes(ans)
    ) && selectedAnswers.length === window.currentCorrectAnswers.length;
    
    // Update button states
    buttons.forEach(btn => {
        if (btn.dataset.isCorrect === 'true') {
            btn.classList.add('correct');
        } else if (selectedAnswers.includes(btn.dataset.word)) {
            btn.classList.add('incorrect');
        }
    });
    
    // Show feedback
    const feedback = document.getElementById('feedback');
    feedback.classList.remove('hidden');
    
    if (allCorrect) {
        score++;
        feedback.className = 'feedback correct';
        feedback.textContent = '✓ Correct! Well done!';
    } else {
        feedback.className = 'feedback incorrect';
        const correctEnglish = window.currentCorrectAnswers
            .map(tibetan => {
                const word = wordBank.find(w => w.tibetan === tibetan);
                return word ? word.english : '';
            })
            .join(', ');
        feedback.textContent = `✗ Incorrect. The correct answers were: ${correctEnglish}`;
    }
    
    // Update score display
    document.getElementById('score').textContent = `Score: ${score}`;
    
    // Show next button or finish
    document.getElementById('check-btn').classList.add('hidden');
    document.getElementById('next-btn').classList.remove('hidden');
}

// Next question
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion >= totalQuestions) {
        showResults();
    } else {
        loadQuestion();
    }
}

// Show results
function showResults() {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById('results-screen').classList.add('active');
    
    const accuracy = Math.round((score / totalQuestions) * 100);
    document.getElementById('final-score').textContent = `Score: ${score} / ${totalQuestions}`;
    document.getElementById('accuracy').textContent = `Accuracy: ${accuracy}%`;
    
    // Show/hide next level button based on current level
    const levels = Object.keys(levelConfig);
    const currentIndex = levels.indexOf(currentLevel);
    const nextLevelBtn = document.getElementById('next-level-btn');
    
    if (currentIndex < levels.length - 1) {
        nextLevelBtn.classList.remove('hidden');
    } else {
        nextLevelBtn.classList.add('hidden');
    }
}

// Next level
function nextLevel() {
    const levels = Object.keys(levelConfig);
    const currentIndex = levels.indexOf(currentLevel);
    
    if (currentIndex < levels.length - 1) {
        startLevel(levels[currentIndex + 1]);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

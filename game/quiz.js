/**
 * 2 Truths and a Lie Game
 * Find the lie in each round!
 */

class QuizGame {
    constructor() {
        // Each round has 2 truths and 1 lie
        this.rounds = [
            {
                statements: [
                    { text: "Kamand completed her Master's at University of Oulu, Finland", isLie: false },
                    { text: "Kamand's Master's thesis is about Distributed Artificial Intelligence", isLie: false },
                    { text: "Kamand completed her Master's degree in 2023", isLie: true }
                ]
            },
            {
                statements: [
                    { text: "Kamand currently works at Nordhealth as a Veterinary Data Migration Specialist", isLie: false },
                    { text: "Kamand started her current role in February 2025", isLie: false },
                    { text: "Kamand migrates data for dental clinics", isLie: true }
                ]
            },
            {
                statements: [
                    { text: "Kamand taught Python at Code School Finland", isLie: false },
                    { text: "Kamand was a speaker at Oulu International School", isLie: false },
                    { text: "Kamand taught JavaScript at a coding bootcamp in Helsinki", isLie: true }
                ]
            },
            {
                statements: [
                    { text: "Kamand achieved 89% accuracy on a machine learning model", isLie: false },
                    { text: "Kamand has a certificate from University of Alberta", isLie: false },
                    { text: "Kamand published a research paper on blockchain technology", isLie: true }
                ]
            },
            {
                statements: [
                    { text: "Kamand worked as a FinTech Software Developer at Ernyka Holding", isLie: false },
                    { text: "Kamand uses Python and Pydantic for data migrations", isLie: false },
                    { text: "Kamand developed a mobile banking app for a Swedish startup", isLie: true }
                ]
            },
            {
                statements: [
                    { text: "Kamand's Bachelor's degree is in Computer Engineering", isLie: false },
                    { text: "Kamand worked on a stock broker app at Narvan Startup Studio", isLie: false },
                    { text: "Kamand interned at Microsoft during her Bachelor's", isLie: true }
                ]
            },
            {
                statements: [
                    { text: "Kamand is based in Helsinki, Finland", isLie: false },
                    { text: "Kamand has migrated data for clinics in 8+ countries", isLie: false },
                    { text: "Kamand relocated to Finland from Germany", isLie: true }
                ]
            }
        ];
        
        this.currentRound = 0;
        this.score = 0;
        this.totalRounds = 5;
        this.selectedRounds = [];
        this.modal = null;
        
        this.init();
    }
    
    init() {
        this.createModal();
        this.createPlayButton();
        this.bindEvents();
    }
    
    createPlayButton() {
        const educationSection = document.querySelector('#education');
        if (!educationSection) return;
        
        const container = educationSection.querySelector('.container');
        if (!container) return;
        
        if (container.querySelector('.quiz-trigger')) return;
        
        const triggerDiv = document.createElement('div');
        triggerDiv.className = 'quiz-trigger';
        triggerDiv.innerHTML = `
            <button class="play-quiz-btn" id="playQuizBtn">
                <span class="game-icon">🤥</span>
                <span>Wrap Up Game</span>
            </button>
        `;
        container.appendChild(triggerDiv);
    }
    
    createModal() {
        if (document.getElementById('quizModal')) return;
        
        const modalHTML = `
            <div class="quiz-modal" id="quizModal">
                <div class="quiz-container">
                    <button class="quiz-close" id="quizClose">×</button>
                    
                    <div class="quiz-header">
                        <h2 class="quiz-title"><span class="title-emoji">🤥</span> 2 Truths & a Lie</h2>
                        <p class="quiz-subtitle">Find the lie about Kamand!</p>
                    </div>
                    
                    <div class="quiz-game-area" id="quizGameArea">
                        <div class="quiz-stats">
                            <div class="quiz-stat">
                                <div class="quiz-stat-value" id="quizScore">0</div>
                                <div class="quiz-stat-label">Score</div>
                            </div>
                            <div class="quiz-stat">
                                <div class="quiz-stat-value" id="quizQuestion">1/5</div>
                                <div class="quiz-stat-label">Round</div>
                            </div>
                        </div>
                        
                        <div class="quiz-progress">
                            <div class="quiz-progress-bar" id="quizProgressBar"></div>
                        </div>
                        
                        <p class="quiz-instruction">👆 Tap the statement you think is the LIE</p>
                        
                        <div class="quiz-statements" id="quizStatements">
                            <!-- Statements will be inserted here -->
                        </div>
                        
                        <div class="quiz-feedback" id="quizFeedback"></div>
                    </div>
                    
                    <div class="quiz-gameover" id="quizGameover">
                        <div class="quiz-gameover-icon" id="quizGameoverIcon">🎉</div>
                        <h2 class="quiz-gameover-title" id="quizGameoverTitle">Great Job!</h2>
                        <p class="quiz-gameover-message" id="quizGameoverMessage">You're a great lie detector!</p>
                        <p class="quiz-gameover-score">Score: <span id="quizFinalScore">0</span>/50</p>
                        <div class="quiz-gameover-buttons">
                            <button class="quiz-play-again" id="quizPlayAgain">Play Again</button>
                            <button class="quiz-close-btn" id="quizCloseBtn">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('quizModal');
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#playQuizBtn')) {
                this.openGame();
            }
            
            if (e.target.closest('#quizClose')) {
                this.closeGame();
            }
            
            if (e.target.closest('.quiz-statement-btn')) {
                const btn = e.target.closest('.quiz-statement-btn');
                if (!btn.disabled) {
                    const index = parseInt(btn.dataset.index);
                    this.submitAnswer(index);
                }
            }
            
            if (e.target.closest('#quizPlayAgain')) {
                this.restartGame();
            }
            
            if (e.target.closest('#quizCloseBtn')) {
                this.closeGame();
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quiz-modal')) {
                this.closeGame();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.closeGame();
            }
        });
    }
    
    openGame() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.startGame();
    }
    
    closeGame() {
        this.modal.classList.remove('active');
        // Return to games hub only if launched from there
        if (window.launchedFromHub) {
            const gamesHub = document.getElementById('gamesHubModal');
            if (gamesHub) {
                gamesHub.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            window.launchedFromHub = false;
        } else {
            document.body.style.overflow = '';
        }
    }
    
    startGame() {
        this.currentRound = 0;
        this.score = 0;
        
        // Shuffle and select rounds
        const shuffled = [...this.rounds].sort(() => Math.random() - 0.5);
        this.selectedRounds = shuffled.slice(0, this.totalRounds);
        
        document.getElementById('quizGameArea').style.display = 'block';
        document.getElementById('quizGameover').classList.remove('active');
        
        this.updateUI();
        this.showRound();
    }
    
    restartGame() {
        document.getElementById('quizGameover').classList.remove('active');
        this.startGame();
    }
    
    showRound() {
        const round = this.selectedRounds[this.currentRound];
        const statementsContainer = document.getElementById('quizStatements');
        
        // Shuffle statements within the round
        const shuffledStatements = [...round.statements].sort(() => Math.random() - 0.5);
        
        // Store for answer checking
        this.currentStatements = shuffledStatements;
        
        statementsContainer.innerHTML = shuffledStatements.map((stmt, index) => `
            <button class="quiz-statement-btn" data-index="${index}">
                <span class="statement-number">${index + 1}</span>
                <span class="statement-text">${stmt.text}</span>
            </button>
        `).join('');
        
        // Hide feedback
        document.getElementById('quizFeedback').classList.remove('show', 'correct', 'wrong');
    }
    
    submitAnswer(selectedIndex) {
        const selectedStatement = this.currentStatements[selectedIndex];
        const isCorrect = selectedStatement.isLie;
        
        // Disable all buttons
        const buttons = document.querySelectorAll('.quiz-statement-btn');
        buttons.forEach((btn, index) => {
            btn.disabled = true;
            
            // Highlight the actual lie
            if (this.currentStatements[index].isLie) {
                btn.classList.add('is-lie');
            }
            
            // Show if user's selection was correct or wrong
            if (index === selectedIndex) {
                btn.classList.add(isCorrect ? 'correct' : 'wrong');
            }
        });
        
        const feedback = document.getElementById('quizFeedback');
        
        if (isCorrect) {
            this.score += 10;
            feedback.textContent = '🎯 Correct! You found the lie!';
            feedback.classList.add('show', 'correct');
            feedback.classList.remove('wrong');
        } else {
            feedback.textContent = '❌ That was actually true!';
            feedback.classList.add('show', 'wrong');
            feedback.classList.remove('correct');
        }
        
        // Update with completed = true to show this round as done
        this.updateUI(true);
        
        // Move to next round after delay
        setTimeout(() => {
            this.currentRound++;
            
            if (this.currentRound >= this.totalRounds) {
                this.endGame();
            } else {
                this.updateUI();
                this.showRound();
            }
        }, 2000);
    }
    
    updateUI(completed = false) {
        document.getElementById('quizScore').textContent = this.score;
        document.getElementById('quizQuestion').textContent = `${this.currentRound + 1}/${this.totalRounds}`;
        
        // Progress shows completed rounds
        const completedRounds = completed ? this.currentRound + 1 : this.currentRound;
        const progress = (completedRounds / this.totalRounds) * 100;
        document.getElementById('quizProgressBar').style.width = progress + '%';
    }
    
    endGame() {
        document.getElementById('quizGameArea').style.display = 'none';
        
        const gameover = document.getElementById('quizGameover');
        const icon = document.getElementById('quizGameoverIcon');
        const title = document.getElementById('quizGameoverTitle');
        const message = document.getElementById('quizGameoverMessage');
        const finalScore = document.getElementById('quizFinalScore');
        
        finalScore.textContent = this.score;
        
        if (this.score >= 50) {
            icon.textContent = '🏆';
            title.textContent = 'Perfect Lie Detector!';
            message.textContent = 'You caught every lie!';
            this.launchConfetti();
        } else if (this.score >= 40) {
            icon.textContent = '🌟';
            title.textContent = 'Great Detective!';
            message.textContent = 'Almost perfect!';
            this.launchConfetti();
        } else if (this.score >= 30) {
            icon.textContent = '👍';
            title.textContent = 'Good Job!';
            message.textContent = 'You have a keen eye!';
        } else {
            icon.textContent = '🔍';
            title.textContent = 'Keep Investigating!';
            message.textContent = 'Read the portfolio more carefully!';
        }
        
        gameover.classList.add('active');
    }
    
    launchConfetti() {
        const colors = ['#c084fc', '#f472b6', '#a855f7', '#ec4899', '#d946ef'];
        const confettiCount = 80;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.width = (Math.random() * 10 + 5) + 'px';
                confetti.style.height = (Math.random() * 10 + 5) + 'px';
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 4000);
            }, i * 30);
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new QuizGame();
});

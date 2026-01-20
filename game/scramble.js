/**
 * Skill Scramble Game
 * Unscramble tech skills as fast as you can!
 */

class SkillScramble {
    constructor() {
        this.skills = [
            { word: 'PYTHON', hint: 'Popular programming language 🐍' },
            { word: 'FLUTTER', hint: 'Cross-platform mobile framework' },
            { word: 'KOTLIN', hint: 'Android development language' },
            { word: 'PYDANTIC', hint: 'Python data validation library' },
            { word: 'FIREBASE', hint: 'Google cloud platform' },
            { word: 'MYSQL', hint: 'Relational database' },
            { word: 'SPARK', hint: 'Big data processing engine' },
            { word: 'JENKINS', hint: 'CI/CD automation tool' },
            { word: 'DOCKER', hint: 'Containerization platform 🐳' },
            { word: 'SKLEARN', hint: 'Machine learning library' },
            { word: 'PANDAS', hint: 'Data analysis library 🐼' },
            { word: 'MATLAB', hint: 'Numerical computing tool' },
            { word: 'CLOUDFLARE', hint: 'Web security & CDN' },
            { word: 'POSTMAN', hint: 'API testing tool' },
            { word: 'GITHUB', hint: 'Code hosting platform' },
        ];
        
        this.currentWord = null;
        this.scrambledWord = '';
        this.score = 0;
        this.round = 0;
        this.maxRounds = 5;
        this.timePerWord = 15; // seconds
        this.timeLeft = this.timePerWord;
        this.timerInterval = null;
        this.usedWords = [];
        this.revealedLetters = 0;
        this.baseRevealCost = 20;
        
        this.modal = null;
        this.init();
    }
    
    init() {
        this.createModal();
        this.createPlayButton();
        this.bindEvents();
    }
    
    createPlayButton() {
        const skillsSection = document.querySelector('.skills');
        if (!skillsSection) return;
        
        const container = skillsSection.querySelector('.container');
        if (!container) return;
        
        const triggerDiv = document.createElement('div');
        triggerDiv.className = 'scramble-trigger';
        triggerDiv.innerHTML = `
            <button class="play-scramble-btn" id="playScrambleBtn">
                <span class="game-icon">🔀</span>
                <span>Play Skill Scramble!</span>
            </button>
        `;
        container.appendChild(triggerDiv);
    }
    
    createModal() {
        const modalHTML = `
            <div class="scramble-modal" id="scrambleModal">
                <div class="scramble-container">
                    <button class="scramble-close" id="scrambleClose">×</button>
                    
                    <div class="scramble-header">
                        <h2 class="scramble-title"><span class="title-emoji">🔀</span> Skill Scramble</h2>
                        <p class="scramble-subtitle">Unscramble Kamand's skill set!</p>
                    </div>
                    
                    <div class="scramble-stats">
                        <div class="scramble-stat">
                            <div class="scramble-stat-value" id="scrambleScore">0</div>
                            <div class="scramble-stat-label">Score</div>
                        </div>
                        <div class="scramble-stat">
                            <div class="scramble-stat-value" id="scrambleRound">1/10</div>
                            <div class="scramble-stat-label">Round</div>
                        </div>
                    </div>
                    
                    <div class="timer-bar-container">
                        <div class="timer-bar" id="timerBar"></div>
                    </div>
                    
                    <div class="scrambled-word" id="scrambledWord">LOADING</div>
                    
                    <div class="scramble-input-container">
                        <input type="text" class="scramble-input" id="scrambleInput" placeholder="Type your answer..." autocomplete="off" spellcheck="false">
                    </div>
                    
                    <div class="scramble-hint" id="scrambleHint"></div>
                    
                    <div class="hint-buttons">
                        <button class="hint-btn" id="revealFirstBtn">Reveal First Letter (FREE)</button>
                        <button class="skip-btn" id="skipBtn">Reveal Answer (−100 pts)</button>
                    </div>
                    
                    <div class="scramble-gameover" id="scrambleGameover">
                        <div class="gameover-icon" id="gameoverIcon">🎉</div>
                        <h2 class="gameover-title" id="gameoverTitle">Great Job!</h2>
                        <p class="gameover-message" id="gameoverMessage">You unscrambled the skills!</p>
                        <p class="gameover-score">Final Score: <span id="finalScore">0</span></p>
                        <div class="gameover-buttons">
                            <button class="play-again-scramble" id="playAgainScramble">Play Again</button>
                            <button class="close-scramble-btn" id="closeScrambleBtn">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('scrambleModal');
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#playScrambleBtn')) {
                this.openGame();
            }
            
            if (e.target.closest('#scrambleClose')) {
                this.closeGame();
            }
            
            if (e.target.closest('#playAgainScramble')) {
                this.restartGame();
            }
            
            if (e.target.closest('#closeScrambleBtn')) {
                this.closeGame();
            }
            
            if (e.target.closest('#skipBtn')) {
                this.skipWord();
            }
            
            if (e.target.closest('#revealFirstBtn')) {
                this.revealNextLetter();
            }
        });
        
        // Input handling
        const input = document.getElementById('scrambleInput');
        if (input) {
            input.addEventListener('input', (e) => {
                this.checkAnswer(e.target.value);
            });
        }
        
        // Close on backdrop click
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeGame();
            }
        });
        
        // Close on Escape key
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
        this.stopTimer();
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
        this.score = 0;
        this.round = 0;
        this.usedWords = [];
        this.updateStats();
        document.getElementById('scrambleGameover').classList.remove('active');
        this.nextWord();
        document.getElementById('scrambleInput').focus();
    }
    
    restartGame() {
        document.getElementById('scrambleGameover').classList.remove('active');
        this.startGame();
    }
    
    nextWord() {
        this.round++;
        
        if (this.round > this.maxRounds) {
            this.endGame();
            return;
        }
        
        // Get a word we haven't used
        const availableWords = this.skills.filter(s => !this.usedWords.includes(s.word));
        if (availableWords.length === 0) {
            this.endGame();
            return;
        }
        
        this.currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        this.usedWords.push(this.currentWord.word);
        this.scrambledWord = this.scrambleWord(this.currentWord.word);
        
        // Make sure scrambled word is different
        while (this.scrambledWord === this.currentWord.word) {
            this.scrambledWord = this.scrambleWord(this.currentWord.word);
        }
        
        document.getElementById('scrambledWord').textContent = this.scrambledWord;
        document.getElementById('scrambleHint').textContent = `💡 Hint: ${this.currentWord.hint}`;
        document.getElementById('scrambleInput').value = '';
        document.getElementById('scrambleInput').classList.remove('correct', 'wrong');
        
        // Reset reveal button
        this.revealedLetters = 0;
        const revealBtn = document.getElementById('revealFirstBtn');
        revealBtn.disabled = false;
        // First letter is only FREE on round 1 (when user has no points yet)
        if (this.round === 1) {
            revealBtn.textContent = 'Reveal First Letter (FREE)';
        } else {
            revealBtn.textContent = `Reveal First Letter (−${this.baseRevealCost} pts)`;
        }
        
        this.updateStats();
        this.startTimer();
    }
    
    scrambleWord(word) {
        const arr = word.split('');
        const len = arr.length;
        
        // Progressive difficulty: easier at start, harder as rounds increase
        // Round 1: 50%, Round 2: 60%, Round 3: 70%, Round 4: 80%, Round 5: 90%
        const difficultyPercent = 0.4 + (this.round * 0.1);
        const swapCount = Math.floor(len * difficultyPercent);
        
        for (let i = 0; i < swapCount; i++) {
            const idx1 = Math.floor(Math.random() * len);
            const idx2 = Math.floor(Math.random() * len);
            if (idx1 !== idx2) {
                [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
            }
        }
        
        return arr.join('');
    }
    
    checkAnswer(answer) {
        const input = document.getElementById('scrambleInput');
        const cleanAnswer = answer.toUpperCase().trim();
        
        if (cleanAnswer === this.currentWord.word) {
            input.classList.add('correct');
            input.classList.remove('wrong');
            
            // Calculate score based on time left
            const timeBonus = Math.floor(this.timeLeft * 10);
            this.score += 100 + timeBonus;
            
            this.stopTimer();
            this.updateStats();
            
            // Short delay then next word
            setTimeout(() => {
                this.nextWord();
            }, 500);
        } else if (cleanAnswer.length >= this.currentWord.word.length) {
            input.classList.add('wrong');
            input.classList.remove('correct');
            setTimeout(() => {
                input.classList.remove('wrong');
            }, 300);
        }
    }
    
    revealNextLetter() {
        const word = this.currentWord.word;
        
        // Check if all letters are already revealed
        if (this.revealedLetters >= word.length - 1) return;
        
        // First letter is FREE only on round 1, otherwise costs 20, 40, 80...
        let cost;
        if (this.round === 1 && this.revealedLetters === 0) {
            cost = 0; // First letter free on round 1
        } else if (this.revealedLetters === 0) {
            cost = this.baseRevealCost; // First letter costs 20 on later rounds
        } else {
            cost = this.baseRevealCost * Math.pow(2, this.revealedLetters); // 2nd letter: 40, 3rd: 80, etc.
        }
        
        this.revealedLetters++;
        const input = document.getElementById('scrambleInput');
        const revealedPart = word.substring(0, this.revealedLetters);
        
        input.value = revealedPart;
        input.focus();
        
        if (cost > 0) {
            this.score = Math.max(0, this.score - cost);
            this.updateStats();
        }
        
        // Update button with next cost
        const btn = document.getElementById('revealFirstBtn');
        if (this.revealedLetters >= word.length - 1) {
            btn.disabled = true;
            btn.textContent = `Revealed: ${revealedPart}...`;
        } else {
            // After first reveal, next letters cost 40, 80, 160...
            const nextCost = this.baseRevealCost * Math.pow(2, this.revealedLetters);
            btn.textContent = `Reveal Next Letter (−${nextCost} pts)`;
        }
    }
    
    skipWord() {
        // Reveal the answer
        const input = document.getElementById('scrambleInput');
        input.value = this.currentWord.word;
        input.classList.add('wrong');
        
        this.score = Math.max(0, this.score - 100);
        this.updateStats();
        this.stopTimer();
        
        // Show answer for a moment, then next word
        setTimeout(() => {
            this.nextWord();
        }, 1500);
    }
    
    startTimer() {
        this.timeLeft = this.timePerWord;
        const timerBar = document.getElementById('timerBar');
        timerBar.style.width = '100%';
        timerBar.classList.remove('warning');
        
        this.stopTimer();
        
        this.timerInterval = setInterval(() => {
            this.timeLeft -= 0.1;
            const percent = (this.timeLeft / this.timePerWord) * 100;
            timerBar.style.width = `${percent}%`;
            
            if (this.timeLeft <= 5) {
                timerBar.classList.add('warning');
            }
            
            if (this.timeLeft <= 0) {
                this.stopTimer();
                this.score = Math.max(0, this.score - 25);
                this.updateStats();
                this.nextWord();
            }
        }, 100);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateStats() {
        document.getElementById('scrambleScore').textContent = this.score;
        document.getElementById('scrambleRound').textContent = `${Math.min(this.round, this.maxRounds)}/${this.maxRounds}`;
    }
    
    endGame() {
        this.stopTimer();
        
        const gameover = document.getElementById('scrambleGameover');
        const icon = document.getElementById('gameoverIcon');
        const title = document.getElementById('gameoverTitle');
        const message = document.getElementById('gameoverMessage');
        const finalScore = document.getElementById('finalScore');
        
        finalScore.textContent = this.score;
        
        if (this.score >= 500) {
            icon.textContent = '🏆';
            title.textContent = 'Skill Master!';
            message.textContent = 'You really know your tech stack!';
            this.launchConfetti();
        } else if (this.score >= 350) {
            icon.textContent = '🌟';
            title.textContent = 'Great Job!';
            message.textContent = 'Impressive unscrambling skills!';
        } else if (this.score >= 200) {
            icon.textContent = '👍';
            title.textContent = 'Good Effort!';
            message.textContent = 'Keep practicing those tech terms!';
        } else {
            icon.textContent = '💪';
            title.textContent = 'Nice Try!';
            message.textContent = 'Practice makes perfect!';
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
            }, i * 25);
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SkillScramble();
});

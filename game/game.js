/**
 * Migration Memory Game
 * Match the veterinary clinic cards!
 */

class MemoryGame {
    constructor() {
        this.clinics = [
            { name: 'Katse', flag: '🇫🇮', country: 'Finland' },
            { name: 'Hatchmoor', flag: '🇬🇧', country: 'UK' },
            { name: 'Kasarmivet', flag: '🇫🇮', country: 'Finland' },
            { name: 'Orchard Vets', flag: '🇬🇧', country: 'UK' },
            { name: 'Das Conchas', flag: '🇵🇹', country: 'Portugal' },
            { name: 'Dafne Vets', flag: '🇬🇧', country: 'UK' },
            { name: 'KeskiSavon', flag: '🇫🇮', country: 'Finland' },
            { name: 'Magleberg', flag: '🇸🇪', country: 'Sweden' },
        ];
        
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.isLocked = true;
        this.countdownTime = 10;
        
        this.modal = null;
        this.board = null;
        this.countdownOverlay = null;
        this.winScreen = null;
        
        this.init();
    }
    
    init() {
        this.createModal();
        this.createPlayButton();
        this.bindEvents();
    }
    
    createPlayButton() {
        const migrationsSection = document.querySelector('.migrations-cards-row');
        if (!migrationsSection) return;
        
        const triggerDiv = document.createElement('div');
        triggerDiv.className = 'game-trigger';
        triggerDiv.innerHTML = `
            <button class="play-game-btn" id="playGameBtn">
                <span class="game-icon">🎮</span>
                <span>Play Memory Game!</span>
            </button>
        `;
        migrationsSection.appendChild(triggerDiv);
    }
    
    createModal() {
        const modalHTML = `
            <div class="game-modal" id="gameModal">
                <div class="game-container">
                    <button class="game-close" id="gameClose">×</button>
                    
                    <div class="game-header">
                        <h2 class="game-title"><span class="title-emoji">🧠</span> Migration Memory</h2>
                        <p class="game-subtitle">Match the clinic cards!</p>
                    </div>
                    
                    <div class="countdown-display" id="countdownDisplay">
                        <div class="countdown-number" id="countdownNumber">10</div>
                        <div class="countdown-text">seconds to memorize!</div>
                    </div>
                    
                    <div class="game-stats hidden" id="gameStats">
                        <div class="game-stat">
                            <div class="game-stat-value" id="gameScore">0</div>
                            <div class="game-stat-label">Score</div>
                        </div>
                        <div class="game-stat">
                            <div class="game-stat-value" id="gameMoves">0</div>
                            <div class="game-stat-label">Moves</div>
                        </div>
                    </div>
                    
                    <div class="game-board" id="gameBoard"></div>
                    
                    <div class="win-screen" id="winScreen">
                        <div class="win-trophy">🏆</div>
                        <h2 class="win-title">You Won!</h2>
                        <p class="win-message" id="winMessage">Amazing memory skills!</p>
                        <div class="win-buttons">
                            <button class="play-again-btn" id="playAgainBtn">Play Again</button>
                            <button class="close-game-btn" id="closeGameBtn">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        this.modal = document.getElementById('gameModal');
        this.board = document.getElementById('gameBoard');
        this.countdownDisplay = document.getElementById('countdownDisplay');
        this.gameStats = document.getElementById('gameStats');
        this.winScreen = document.getElementById('winScreen');
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#playGameBtn')) {
                this.openGame();
            }
            
            if (e.target.closest('#gameClose')) {
                this.closeGame();
            }
            
            if (e.target.closest('#playAgainBtn')) {
                this.resetGame();
            }
            
            if (e.target.closest('#closeGameBtn')) {
                this.closeGame();
            }
            
            if (e.target.closest('.game-card') && !this.isLocked) {
                this.flipCard(e.target.closest('.game-card'));
            }
        });
        
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
        this.resetGame(false);
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
        this.resetState();
        this.createCards();
        this.renderCards();
        this.showAllCards();
        this.startCountdown();
    }
    
    resetState() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.isLocked = true;
        
        this.updateStats();
        this.winScreen.classList.remove('active');
        this.countdownDisplay.classList.remove('hidden');
        this.gameStats.classList.add('hidden');
    }
    
    createCards() {
        // Select 6 random clinics for 12 cards (6 pairs)
        const shuffledClinics = [...this.clinics].sort(() => Math.random() - 0.5);
        const selectedClinics = shuffledClinics.slice(0, 6);
        
        // Create pairs
        const cardPairs = [];
        selectedClinics.forEach((clinic, index) => {
            cardPairs.push({ ...clinic, id: index, pairId: index });
            cardPairs.push({ ...clinic, id: index + 100, pairId: index });
        });
        
        // Shuffle the cards
        this.cards = cardPairs.sort(() => Math.random() - 0.5);
    }
    
    renderCards() {
        this.board.innerHTML = this.cards.map((card, index) => `
            <div class="game-card" data-index="${index}" data-pair-id="${card.pairId}">
                <div class="game-card-inner">
                    <div class="game-card-front">
                        <span class="game-card-question">?</span>
                    </div>
                    <div class="game-card-back">
                        <span class="game-card-flag">${card.flag}</span>
                        <span class="game-card-name">${card.name}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    showAllCards() {
        const cards = this.board.querySelectorAll('.game-card');
        cards.forEach(card => card.classList.add('flipped'));
    }
    
    hideAllCards() {
        const cards = this.board.querySelectorAll('.game-card');
        cards.forEach(card => {
            if (!card.classList.contains('matched')) {
                card.classList.remove('flipped');
            }
        });
    }
    
    startCountdown() {
        let timeLeft = this.countdownTime;
        const countdownNumber = document.getElementById('countdownNumber');
        countdownNumber.textContent = timeLeft;
        
        const interval = setInterval(() => {
            timeLeft--;
            countdownNumber.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(interval);
                this.countdownDisplay.classList.add('hidden');
                this.gameStats.classList.remove('hidden');
                this.hideAllCards();
                this.isLocked = false;
            }
        }, 1000);
    }
    
    flipCard(cardElement) {
        if (cardElement.classList.contains('flipped') || 
            cardElement.classList.contains('matched') ||
            this.flippedCards.length >= 2) {
            return;
        }
        
        cardElement.classList.add('flipped');
        this.flippedCards.push(cardElement);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            this.checkMatch();
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const pairId1 = card1.dataset.pairId;
        const pairId2 = card2.dataset.pairId;
        
        if (pairId1 === pairId2) {
            // Match found!
            this.matchFound(card1, card2);
        } else {
            // No match
            this.noMatch(card1, card2);
        }
    }
    
    matchFound(card1, card2) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        this.matchedPairs++;
        this.score += 100;
        this.updateStats();
        
        this.flippedCards = [];
        
        // Check for win
        if (this.matchedPairs === 6) {
            setTimeout(() => this.showWin(), 500);
        }
    }
    
    noMatch(card1, card2) {
        this.isLocked = true;
        
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            this.flippedCards = [];
            this.isLocked = false;
        }, 1000);
    }
    
    updateStats() {
        document.getElementById('gameScore').textContent = this.score;
        document.getElementById('gameMoves').textContent = this.moves;
    }
    
    showWin() {
        // Calculate bonus based on moves
        const bonus = Math.max(0, (20 - this.moves) * 10);
        this.score += bonus;
        this.updateStats();
        
        // Update win message
        const message = this.moves <= 8 
            ? `Perfect! Only ${this.moves} moves! 🌟`
            : this.moves <= 12 
            ? `Great job! ${this.moves} moves! 👏`
            : `You did it in ${this.moves} moves! 🎉`;
        
        document.getElementById('winMessage').textContent = message;
        
        // Show win screen
        this.winScreen.classList.add('active');
        
        // Launch confetti!
        this.launchConfetti();
    }
    
    launchConfetti() {
        const colors = ['#c084fc', '#f472b6', '#a855f7', '#ec4899', '#d946ef'];
        const confettiCount = 100;
        
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
            }, i * 20);
        }
    }
    
    resetGame(startNew = true) {
        this.board.innerHTML = '';
        this.winScreen.classList.remove('active');
        
        if (startNew) {
            this.startGame();
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});

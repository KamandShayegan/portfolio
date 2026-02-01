/**
 * Timeline Order Game
 * Arrange Kamand's jobs in chronological order!
 */

class TimelineGame {
    constructor() {
        // Jobs in correct order (newest to oldest - top to bottom)
        this.jobs = [
            {
                id: 5,
                title: 'Veterinary Data Migration Specialist',
                company: 'Nordhealth',
                period: 'February/2025 – Now',
                icon: '🐕',
                startDate: new Date(2025, 1, 1)
            },
            {
                id: 4,
                title: 'AR Collaboration Systems Developer',
                company: 'University of Oulu',
                period: 'November/2024 – May/2025',
                icon: '🥽',
                startDate: new Date(2024, 10, 1)
            },
            {
                id: 3,
                title: 'FinTech Software Developer',
                company: 'Ernyka Holding',
                period: 'December/2022 – June/2023',
                icon: '💰',
                startDate: new Date(2022, 11, 1)
            },
            {
                id: 2,
                title: 'FinTech Mobile Developer',
                company: 'Narvan Startup Studio',
                period: 'April/2021 – October/2022',
                icon: '📈',
                startDate: new Date(2021, 3, 1)
            },
            {
                id: 1,
                title: 'Healthcare Mobile Developer',
                company: 'Erfan Salamat',
                period: 'July/2020 – March/2021',
                icon: '🏥',
                startDate: new Date(2020, 6, 1)
            }
        ];
        
        this.currentOrder = [];
        this.attempts = 0;
        this.isComplete = false;
        this.modal = null;
        this.draggedElement = null;
        
        this.init();
    }
    
    init() {
        this.createModal();
        this.createPlayButton();
        this.bindEvents();
    }
    
    createPlayButton() {
        const experienceSection = document.querySelector('#experience');
        if (!experienceSection) return;
        
        const container = experienceSection.querySelector('.container');
        if (!container) return;
        
        // Check if button already exists
        if (container.querySelector('.timeline-trigger')) return;
        
        const triggerDiv = document.createElement('div');
        triggerDiv.className = 'timeline-trigger';
        triggerDiv.innerHTML = `
            <button class="play-timeline-btn" id="playTimelineBtn">
                <span class="game-icon">📅</span>
                <span>Play Timeline Order!</span>
            </button>
        `;
        container.appendChild(triggerDiv);
    }
    
    createModal() {
        // Check if modal already exists
        if (document.getElementById('timelineGameModal')) return;
        
        const modalHTML = `
            <div class="timeline-game-modal" id="timelineGameModal">
                <div class="timeline-game-container">
                    <button class="timeline-game-close" id="timelineGameClose">×</button>
                    
                    <div class="timeline-game-header">
                        <h2 class="timeline-game-title">
                            <span class="title-emoji">📅</span> Timeline Order
                        </h2>
                        <p class="timeline-game-subtitle">Arrange Kamand's career journey!</p>
                    </div>
                    
                    <div class="timeline-game-instructions">
                        <p><span class="instruction-icon">👆</span> Drag and drop the jobs to arrange them from <strong>newest</strong> (top) to <strong>oldest</strong> (bottom)</p>
                    </div>
                    
                    <div class="timeline-game-stats">
                        <div class="timeline-game-stat">
                            <div class="timeline-game-stat-value" id="timelineAttempts">0</div>
                            <div class="timeline-game-stat-label">Attempts</div>
                        </div>
                        <div class="timeline-game-stat">
                            <div class="timeline-game-stat-value" id="timelineStatus">🎯</div>
                            <div class="timeline-game-stat-label">Status</div>
                        </div>
                    </div>
                    
                    <div class="timeline-blocks-container" id="timelineBlocks">
                        <!-- Job blocks will be inserted here -->
                    </div>
                    
                    <div class="timeline-game-actions">
                        <button class="timeline-check-btn" id="timelineCheckBtn">Check Order ✓</button>
                        <button class="timeline-reset-btn" id="timelineResetBtn">Shuffle Again 🔀</button>
                    </div>
                    
                    <div class="timeline-result" id="timelineResult">
                        <div class="timeline-result-title"></div>
                        <div class="timeline-result-text"></div>
                    </div>
                </div>
                <div class="timeline-confetti" id="timelineConfetti"></div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('timelineGameModal');
    }
    
    bindEvents() {
        // Play button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#playTimelineBtn')) {
                this.openGame();
            }
        });
        
        // Close button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#timelineGameClose')) {
                this.closeGame();
            }
        });
        
        // Close on background click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('timeline-game-modal')) {
                this.closeGame();
            }
        });
        
        // Check button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#timelineCheckBtn')) {
                this.checkOrder();
            }
        });
        
        // Reset button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#timelineResetBtn')) {
                this.resetGame();
            }
        });
        
        // Keyboard close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.closeGame();
            }
        });
    }
    
    openGame() {
        this.resetGame();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
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
    
    resetGame() {
        this.attempts = 0;
        this.isComplete = false;
        this.updateStats();
        this.shuffleAndRender();
        this.hideResult();
        
        // Re-enable check button
        const checkBtn = document.getElementById('timelineCheckBtn');
        if (checkBtn) {
            checkBtn.disabled = false;
            checkBtn.textContent = 'Check Order ✓';
        }
        
        // Remove reveal class from all blocks
        const blocks = document.querySelectorAll('.timeline-job-block');
        blocks.forEach(block => {
            block.classList.remove('correct', 'wrong', 'reveal');
        });
    }
    
    shuffleAndRender() {
        // Create a shuffled copy
        this.currentOrder = [...this.jobs];
        this.shuffleArray(this.currentOrder);
        
        // Make sure it's not already in correct order
        while (this.isCorrectOrder()) {
            this.shuffleArray(this.currentOrder);
        }
        
        this.renderBlocks();
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    renderBlocks() {
        const container = document.getElementById('timelineBlocks');
        container.innerHTML = '';
        
        this.currentOrder.forEach((job, index) => {
            const block = document.createElement('div');
            block.className = 'timeline-job-block';
            block.draggable = true;
            block.dataset.jobId = job.id;
            block.dataset.index = index;
            
            block.innerHTML = `
                <div class="job-block-header">
                    <span class="job-block-icon">${job.icon}</span>
                    <div>
                        <h4 class="job-block-title">${job.title}</h4>
                        <p class="job-block-company">${job.company}</p>
                        <p class="job-block-period">${job.period}</p>
                    </div>
                </div>
                <span class="job-block-drag-handle">⋮⋮</span>
            `;
            
            // Drag events
            block.addEventListener('dragstart', (e) => this.handleDragStart(e, block));
            block.addEventListener('dragend', (e) => this.handleDragEnd(e, block));
            block.addEventListener('dragover', (e) => this.handleDragOver(e, block));
            block.addEventListener('dragleave', (e) => this.handleDragLeave(e, block));
            block.addEventListener('drop', (e) => this.handleDrop(e, block));
            
            // Touch events for mobile
            block.addEventListener('touchstart', (e) => this.handleTouchStart(e, block), { passive: false });
            block.addEventListener('touchmove', (e) => this.handleTouchMove(e, block), { passive: false });
            block.addEventListener('touchend', (e) => this.handleTouchEnd(e, block));
            
            container.appendChild(block);
        });
    }
    
    handleDragStart(e, block) {
        this.draggedElement = block;
        block.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', block.dataset.index);
    }
    
    handleDragEnd(e, block) {
        block.classList.remove('dragging');
        this.draggedElement = null;
        
        // Remove drag-over from all blocks
        document.querySelectorAll('.timeline-job-block').forEach(b => {
            b.classList.remove('drag-over');
        });
    }
    
    handleDragOver(e, block) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        if (block !== this.draggedElement) {
            block.classList.add('drag-over');
        }
    }
    
    handleDragLeave(e, block) {
        block.classList.remove('drag-over');
    }
    
    handleDrop(e, block) {
        e.preventDefault();
        block.classList.remove('drag-over');
        
        if (!this.draggedElement || block === this.draggedElement) return;
        
        const fromIndex = parseInt(this.draggedElement.dataset.index);
        const toIndex = parseInt(block.dataset.index);
        
        // Swap in currentOrder array
        [this.currentOrder[fromIndex], this.currentOrder[toIndex]] = 
        [this.currentOrder[toIndex], this.currentOrder[fromIndex]];
        
        // Re-render with animation
        this.renderBlocks();
    }
    
    // Touch handling for mobile
    handleTouchStart(e, block) {
        this.touchStartY = e.touches[0].clientY;
        this.draggedElement = block;
        block.classList.add('dragging');
    }
    
    handleTouchMove(e, block) {
        if (!this.draggedElement) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const elementsUnder = document.elementsFromPoint(touch.clientX, touch.clientY);
        const targetBlock = elementsUnder.find(el => 
            el.classList.contains('timeline-job-block') && el !== this.draggedElement
        );
        
        // Remove drag-over from all
        document.querySelectorAll('.timeline-job-block').forEach(b => {
            b.classList.remove('drag-over');
        });
        
        if (targetBlock) {
            targetBlock.classList.add('drag-over');
            this.touchTargetBlock = targetBlock;
        }
    }
    
    handleTouchEnd(e, block) {
        block.classList.remove('dragging');
        
        if (this.touchTargetBlock && this.touchTargetBlock !== block) {
            const fromIndex = parseInt(block.dataset.index);
            const toIndex = parseInt(this.touchTargetBlock.dataset.index);
            
            // Swap in currentOrder array
            [this.currentOrder[fromIndex], this.currentOrder[toIndex]] = 
            [this.currentOrder[toIndex], this.currentOrder[fromIndex]];
            
            this.renderBlocks();
        }
        
        document.querySelectorAll('.timeline-job-block').forEach(b => {
            b.classList.remove('drag-over');
        });
        
        this.draggedElement = null;
        this.touchTargetBlock = null;
    }
    
    isCorrectOrder() {
        for (let i = 0; i < this.currentOrder.length; i++) {
            if (this.currentOrder[i].id !== this.jobs[i].id) {
                return false;
            }
        }
        return true;
    }
    
    checkOrder() {
        if (this.isComplete) return;
        
        this.attempts++;
        this.updateStats();
        
        const blocks = document.querySelectorAll('.timeline-job-block');
        let allCorrect = true;
        
        blocks.forEach((block, index) => {
            const jobId = parseInt(block.dataset.jobId);
            const correctJob = this.jobs[index];
            
            // Add reveal class to show dates
            block.classList.add('reveal');
            
            if (jobId === correctJob.id) {
                block.classList.remove('wrong');
                block.classList.add('correct');
            } else {
                block.classList.remove('correct');
                block.classList.add('wrong');
                allCorrect = false;
            }
        });
        
        if (allCorrect) {
            this.isComplete = true;
            this.showSuccess();
            this.launchConfetti();
            
            const checkBtn = document.getElementById('timelineCheckBtn');
            checkBtn.disabled = true;
            checkBtn.textContent = '🎉 Complete!';
        } else {
            this.showError();
            
            // Remove wrong/correct classes after a delay to let user try again
            setTimeout(() => {
                blocks.forEach(block => {
                    block.classList.remove('correct', 'wrong', 'reveal');
                });
            }, 2000);
        }
    }
    
    updateStats() {
        document.getElementById('timelineAttempts').textContent = this.attempts;
        document.getElementById('timelineStatus').textContent = this.isComplete ? '✅' : '🎯';
    }
    
    showSuccess() {
        const result = document.getElementById('timelineResult');
        result.classList.remove('error');
        result.classList.add('success', 'show');
        result.querySelector('.timeline-result-title').textContent = '🎉 Perfect!';
        
        const attemptsText = this.attempts === 1 ? 'first try' : `${this.attempts} attempts`;
        result.querySelector('.timeline-result-text').textContent = 
            `You got the timeline right on your ${attemptsText}!`;
    }
    
    showError() {
        const result = document.getElementById('timelineResult');
        result.classList.remove('success');
        result.classList.add('error', 'show');
        result.querySelector('.timeline-result-title').textContent = '❌ Not quite!';
        result.querySelector('.timeline-result-text').textContent = 
            'Some jobs are out of order. Keep trying!';
        
        // Hide error after a moment
        setTimeout(() => {
            this.hideResult();
        }, 2000);
    }
    
    hideResult() {
        const result = document.getElementById('timelineResult');
        result.classList.remove('show', 'success', 'error');
    }
    
    launchConfetti() {
        const container = document.getElementById('timelineConfetti');
        const colors = ['#c084fc', '#f472b6', '#4ade80', '#facc15', '#60a5fa', '#f87171'];
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 10 + 5}px;
                    height: ${Math.random() * 10 + 5}px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}%;
                    top: -20px;
                    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                    animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
                    transform: rotate(${Math.random() * 360}deg);
                `;
                container.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 5000);
            }, i * 30);
        }
    }
}

// Add confetti animation styles
const confettiStyles = document.createElement('style');
confettiStyles.textContent = `
    @keyframes confettiFall {
        to {
            top: 100vh;
            transform: rotate(720deg) translateX(${Math.random() * 200 - 100}px);
        }
    }
`;
document.head.appendChild(confettiStyles);

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TimelineGame();
});

/** 🌙 Lunar's Ultimate Valentine Jigsaw Script */

const coupleImageUrl = '/image.png'; // ใส่ URL รูปคู่ของคุณตรงนี้
const puzzleRows = 3;
const puzzleCols = 3;
const totalPieces = puzzleRows * puzzleCols;

const scenes = { s1: document.getElementById('scene1'), s2: document.getElementById('scene2'), s3: document.getElementById('scene3') };
const playBtn = document.getElementById('playBtn');
const continueBtn = document.getElementById('continueBtn');
const bgMusic = document.getElementById('bgMusic');
const slotsContainer = document.getElementById('puzzle-slots');
const piecesContainer = document.getElementById('pieces-container');
const finalPhoto = document.getElementById('finalPhoto');

// ตั้งค่ารูปภาพในหน้าสุดท้าย
finalPhoto.src = coupleImageUrl;

// พื้นหลังหัวใจลอย
function createFloatingHearts() {
    const heartBg = document.getElementById('heartBg');
    const hearts = ['❤️', '💖', '🌸', '✨', '💕'];
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart-shape';
        heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heartBg.appendChild(heart);
        setTimeout(() => heart.remove(), 6000);
    }, 600);
}
createFloatingHearts();

playBtn.addEventListener('click', () => {
    bgMusic.play().catch(() => {});
    bgMusic.volume = 0.2;
    scenes.s1.classList.remove('active');
    scenes.s2.classList.add('active');
    initPuzzle();
});

continueBtn.addEventListener('click', () => {
    scenes.s2.classList.remove('active');
    scenes.s3.classList.add('active');
});

function initPuzzle() {
    slotsContainer.innerHTML = '';
    piecesContainer.innerHTML = '';
    for (let i = 0; i < totalPieces; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.index = i;
        slotsContainer.appendChild(slot);
    }

    const indices = [...Array(totalPieces).keys()].sort(() => Math.random() - 0.5);
    indices.forEach(i => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.dataset.index = i;
        piece.style.backgroundImage = `url(${coupleImageUrl})`;
        const row = Math.floor(i / puzzleCols), col = i % puzzleCols;
        piece.style.backgroundPosition = `-${col * 80}px -${row * 80}px`;
        addDragEvents(piece);
        piecesContainer.appendChild(piece);
    });
}

function addDragEvents(el) {
    let offX, offY, isDragging = false;

    const start = (e) => {
        isDragging = true;
        el.classList.add('dragging');
        const t = e.type === 'touchstart' ? e.touches[0] : e;
        const r = el.getBoundingClientRect();
        offX = t.clientX - r.left;
        offY = t.clientY - (r.top / 1.5);
        el.style.position = 'fixed';
        move(e);
    };

    const move = (e) => {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();
        const t = e.type === 'touchmove' ? e.touches[0] : e;
        el.style.left = (t.clientX - offX) + 'px';
        el.style.top = (t.clientY - offY) + 'px';
    };

    const end = () => {
        if (!isDragging) return;
        isDragging = false;
        el.classList.remove('dragging');

        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;

        let snapped = false;
        document.querySelectorAll('.slot').forEach(slot => {
            const sr = slot.getBoundingClientRect();
            if (cx > sr.left && cx < sr.right && cy > sr.top && cy < sr.bottom && !slot.hasChildNodes()) {
                slot.appendChild(el);
                el.style.position = 'static';
                snapped = true;
            }
        });

        if (!snapped) {
            piecesContainer.appendChild(el);
            el.style.position = 'static';
        }
        checkWin();
    };

    el.addEventListener('mousedown', start);
    el.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('mousemove', move, { passive: false });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);
}

function checkWin() {
    let correct = 0;
    document.querySelectorAll('.slot').forEach(slot => {
        if (slot.firstChild && slot.dataset.index === slot.firstChild.dataset.index) correct++;
    });
    
    if (correct === totalPieces) {
        setTimeout(() => {
            continueBtn.style.display = 'inline-block';
        }, 300);
    } else {
        continueBtn.style.display = 'none';
    }
}
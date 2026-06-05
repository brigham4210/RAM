document.addEventListener("DOMContentLoaded", () => {
    const cardEl = document.getElementById("flip-card");
    const questionEl = document.getElementById("question-text");
    const answerListEl = document.getElementById("answer-list");
    const cardPositionEl = document.getElementById("card-position");
    const starredCountEl = document.getElementById("starred-count");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const starBtn = document.getElementById("star-btn");
    const shuffleBtn = document.getElementById("shuffle-btn");
    const jumpInput = document.getElementById("jump-input");
    const jumpBtn = document.getElementById("jump-btn");

    let cards = [];
    let currentIndex = 0;
    let starred = new Set();

    const renderCard = () => {
        if (!cards.length) {
            questionEl.textContent = "No cards loaded.";
            answerListEl.innerHTML = "";
            cardPositionEl.textContent = "Card 0 of 0";
            starredCountEl.textContent = "Starred: 0";
            return;
        }

        const current = cards[currentIndex];
        questionEl.textContent = current.question;

        answerListEl.innerHTML = "";
        current.answers.forEach((answer) => {
            const li = document.createElement("li");
            li.textContent = answer;
            answerListEl.appendChild(li);
        });

        cardPositionEl.textContent = `Card ${currentIndex + 1} of ${cards.length}`;
        starredCountEl.textContent = `Starred: ${starred.size}`;
        starBtn.classList.toggle("is-active", starred.has(current.id));
        starBtn.textContent = starred.has(current.id) ? "Starred" : "Star";
        jumpInput.value = String(currentIndex + 1);
    };

    const resetFlip = () => {
        cardEl.classList.remove("is-flipped");
    };

    const nextCard = () => {
        if (!cards.length) return;
        currentIndex = (currentIndex + 1) % cards.length;
        resetFlip();
        renderCard();
    };

    const prevCard = () => {
        if (!cards.length) return;
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        resetFlip();
        renderCard();
    };

    const toggleStar = () => {
        if (!cards.length) return;
        const id = cards[currentIndex].id;
        if (starred.has(id)) {
            starred.delete(id);
        } else {
            starred.add(id);
        }
        renderCard();
    };

    const shuffleCards = () => {
        if (!cards.length) return;

        const currentId = cards[currentIndex].id;
        for (let i = cards.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        currentIndex = cards.findIndex((card) => card.id === currentId);
        resetFlip();
        renderCard();
    };

    const jumpToCard = () => {
        if (!cards.length) return;
        const requested = Number.parseInt(jumpInput.value, 10);
        if (Number.isNaN(requested) || requested < 1 || requested > cards.length) {
            jumpInput.value = String(currentIndex + 1);
            return;
        }
        currentIndex = requested - 1;
        resetFlip();
        renderCard();
    };

    const normalizeCards = (raw) => {
        cards = Object.entries(raw)
            .map(([id, item]) => ({
                id,
                question: item.Q,
                answers: Array.isArray(item.A) ? item.A : []
            }))
            .sort((a, b) => Number(a.id) - Number(b.id));
    };

    const loadCards = async () => {
        try {
            if (window.QUIZZES_DATA && typeof window.QUIZZES_DATA === "object") {
                normalizeCards(window.QUIZZES_DATA);
                currentIndex = 0;
                renderCard();
                return;
            }

            const response = await fetch("quizzes.json", { cache: "no-store" });
            if (!response.ok) {
                throw new Error(`Could not load quizzes.json (status ${response.status})`);
            }

            const raw = await response.json();
            normalizeCards(raw);

            currentIndex = 0;
            renderCard();
        } catch (error) {
            questionEl.textContent = "Could not load flash cards.";
            answerListEl.innerHTML = "";
            cardPositionEl.textContent = "Card 0 of 0";
            starredCountEl.textContent = "Starred: 0";
            console.error(error);
        }
    };

    cardEl.addEventListener("click", () => {
        cardEl.classList.toggle("is-flipped");
    });
    nextBtn.addEventListener("click", nextCard);
    prevBtn.addEventListener("click", prevCard);
    starBtn.addEventListener("click", toggleStar);
    shuffleBtn.addEventListener("click", shuffleCards);
    jumpBtn.addEventListener("click", jumpToCard);
    jumpInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            jumpToCard();
        }
    });

    window.addEventListener("keydown", (event) => {
        if (event.target === jumpInput) return;

        if (event.key === "ArrowRight") {
            nextCard();
        } else if (event.key === "ArrowLeft") {
            prevCard();
        } else if (event.key.toLowerCase() === "f") {
            cardEl.classList.toggle("is-flipped");
        } else if (event.key.toLowerCase() === "s") {
            toggleStar();
        }
    });

    loadCards();
});

// روابط الصور
const uniqueCards = [
    'https://i.postimg.cc/qMkBGqDj/gpt1732802836469.png',
    'https://i.postimg.cc/kGN4gt1t/gpt1732802738661.png',
    'https://i.postimg.cc/kgT2SKnQ/gpt1732802701359.png',
    'https://i.postimg.cc/fRz3kBhW/gpt1732802656444.png',
];

const duplicateCards = Array(28).fill('https://i.postimg.cc/nhT38P84/gpt1732802399621.png');

// رابط الموسيقى (مع تعديل dl=0 إلى row=1)
let musicUrl = "https://www.dropbox.com/scl/fi/0837dv1d6nmmwcfhq2lk4/Liars-bar-music.mp3?rlkey=js7b85xvb3a137xxl4y12405j&st=bxhmci6c&raw=1";
musicUrl = musicUrl.replace("dl=0", "row=1"); // تعديل الرابط تلقائيًا

// روابط الصوتيات
const soundUrls = [
    "https://www.dropbox.com/scl/fi/k7m08mb5bkbhscy8czvtx/.mp3?rlkey=rs03wwfv32xfyj7j1sw1001j5&raw=1", // الصوت الأول
    "https://www.dropbox.com/scl/fi/c6ieebkjqj5bt3nozp5a5/.mp3?rlkey=s35nytcxmr8ano30o33hd0c0b&raw=1"  // الصوت الثاني
];

// تشغيل الموسيقى
function playBackgroundMusic() {
    const audio = new Audio(musicUrl);
    audio.loop = true; // التكرار
    audio.play();
}

// دمج الأوراق
const fullDeck = [...uniqueCards, ...duplicateCards];

// اختيار أوراق عشوائية
function shuffleDeck() {
    const selectedUniqueCount = Math.floor(Math.random() * 3) + 1;
    const selectedUnique = uniqueCards.sort(() => 0.5 - Math.random()).slice(0, selectedUniqueCount);
    const remainingCards = duplicateCards.sort(() => 0.5 - Math.random()).slice(0, 8 - selectedUniqueCount);
    return [...selectedUnique, ...remainingCards].sort(() => 0.5 - Math.random());
}

// عرض الأوراق على الشاشة
function displayCards(cards) {
    const deckElement = document.querySelector('.deck');
    deckElement.innerHTML = '';
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.style.backgroundImage = `url(${card})`;
        cardElement.dataset.image = card;
        deckElement.appendChild(cardElement);
    });
}

// إضافة ورقة إلى القائمة
function addToPlayedCards(cardImage) {
    const playedCardsContainer = document.getElementById('played-cards');
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.style.backgroundImage = `url(${cardImage})`;
    playedCardsContainer.appendChild(cardElement);
}

// تشغيل صوت الإنذار لمدة 3 ثوانٍ
function playAlarmSound() {
    const alarmSound = document.getElementById('alarm-sound');
    alarmSound.play();
    setTimeout(() => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }, 3000);
}

// عرض رسالة قصيرة
function showMessage(message) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = message;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}

// زر "جرب حظك"
const tryYourLuckButton = document.getElementById('try-your-luck');

// عرض الصورة أثناء تشغيل الصوت
function showOverlayImage() {
    const overlayImage = document.createElement('div');
    overlayImage.id = 'overlay-image';
    overlayImage.style.position = 'fixed';
    overlayImage.style.top = '50%';
    overlayImage.style.left = '50%';
    overlayImage.style.transform = 'translate(-50%, -50%)';
    overlayImage.style.backgroundImage = 'url(https://i.postimg.cc/0Qg0s0cP/Screenshot-Chrome.jpg)';
    overlayImage.style.backgroundSize = 'cover';
    overlayImage.style.width = '300px';
    overlayImage.style.height = '300px';
    overlayImage.style.zIndex = '9999';
    document.body.appendChild(overlayImage);
}

// إخفاء الصورة
function hideOverlayImage() {
    const overlayImage = document.getElementById('overlay-image');
    if (overlayImage) {
        overlayImage.remove();
    }
}

// عرض زر "جرب حظك" بعد بدء اللعبة
document.getElementById('start-game').addEventListener('click', () => {
    playBackgroundMusic(); // تشغيل الموسيقى عند بدء اللعبة
    const selectedCards = shuffleDeck();
    displayCards(selectedCards);
    document.getElementById('start-game').style.display = 'none'; // إخفاء زر "ابدأ اللعب"
    document.getElementById('how-to-play').style.display = 'none'; // إخفاء زر "كيفية اللعب"
    tryYourLuckButton.style.display = 'inline-block'; // إظهار زر "جرب حظك"
    showMessage('تم توزيع الأوراق، ابدأ اللعب الآن!');
});

// عند الضغط على "جرب حظك"
tryYourLuckButton.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * soundUrls.length);
    const selectedSound = soundUrls[randomIndex];
    const audio = new Audio(selectedSound);

    // عرض الصورة
    showOverlayImage();

    audio.play();

    // إخفاء الصورة والرسالة بعد انتهاء الصوت
    audio.addEventListener('ended', () => {
        hideOverlayImage();
        if (randomIndex === 0) {
            showMessage('أنت خارج اللعبة');
        } else {
            showMessage('فلت، أنت داخل اللعبة');
        }
    });
});

// عند النقر على ورقة
document.querySelector('.deck').addEventListener('click', (event) => {
    if (event.target.classList.contains('card')) {
        const cardImage = event.target.dataset.image;
        addToPlayedCards(cardImage);
        event.target.classList.add('clicked'); // إضافة التأثير
        setTimeout(() => event.target.remove(), 500); // إزالة الورقة بعد التأثير
        showMessage('لقد اخترت ورقة!');
    }
});

// فتح/إغلاق القائمة
document.getElementById('toggle-played-cards').addEventListener('click', () => {
    const playedCards = document.getElementById('played-cards');
    const cardsOnScreen = document.querySelectorAll('.deck .card');
    playedCards.classList.toggle('active');
    cardsOnScreen.forEach(card => {
        card.classList.toggle('hidden', playedCards.classList.contains('active'));
    });
});

// عند الضغط على الزر الأحمر "اكشف"
document.getElementById('evil-button').addEventListener('click', playAlarmSound);

// عرض وإغلاق نافذة "كيفية اللعب"
const howToPlayButton = document.getElementById('how-to-play');
const modal = document.getElementById('how-to-play-modal');
const closeModal = document.querySelector('.modal .close');

// عند الضغط على زر "كيفية اللعب" لفتح النافذة
howToPlayButton.addEventListener('click', () => {
    modal.style.display = 'flex'; // عرض النافذة
});

// عند الضغط على زر الإغلاق (×) لإغلاق النافذة
closeModal.addEventListener('click', () => {
    modal.style.display = 'none'; // إخفاء النافذة
});

// إغلاق النافذة عند النقر خارجها
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none'; // إخفاء النافذة
    }
});
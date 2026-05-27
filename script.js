// --- Navigation ---
function nextScreen(screenNumber) {
    // Alle Screens verstecken
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    
    // Den gewünschten Screen anzeigen
    const next = document.getElementById(`screen-${screenNumber}`);
    next.classList.remove('hidden');
    next.classList.add('active');
}


// --- Der flüchtende "Nein"-Button ---
const noBtn = document.getElementById('no-btn');

function moveButton() {
    const container = document.querySelector('.button-container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // Berechnet zufällige Positionen innerhalb des Containers
    const maxX = containerRect.width - btnRect.width;
    const maxY = containerRect.height - btnRect.height;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.transform = 'none'; // Entfernt die anfängliche Zentrierung
}

noBtn.addEventListener('mouseover', moveButton);
noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault(); 
    moveButton();
});


// --- Daten sammeln ---
let selectedTime = '';
let selectedFood = '';

function saveDateAndProceed() {
    const timeInput = document.getElementById('time-picker').value;
    
    if(!timeInput) {
        alert('Bitte wähle eine Uhrzeit aus! ⏰');
        return;
    }
    
    selectedTime = timeInput;
    nextScreen(4);
}

function selectFood(element, foodName) {
    // Vorherige Auswahl entfernen
    document.querySelectorAll('.food-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Neue Auswahl setzen
    element.classList.add('selected');
    selectedFood = foodName;
}

function finishSetup() {
    if(!selectedFood) {
        alert('Wir müssen doch was essen! Wähl was aus! 🥺');
        return;
    }
    
    // Finale Nachricht anpassen
    const finalMessage = document.getElementById('final-message');
    finalMessage.innerText = `glad you didn't say no. be ready by ${selectedTime} for ${selectedFood}, I'm coming to get you 🚗`;
    
    nextScreen(5);
}

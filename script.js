// --- Navigation (Unverändert) ---
function nextScreen(screenNumber) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    }); 
    
    const next = document.getElementById(`screen-${screenNumber}`);
    next.classList.remove('hidden');
    next.classList.add('active');
}


// --- Der unbesiegbare flüchtende "Nein"-Button (AKTUALISIERT) ---
const noBtn = document.getElementById('no-btn');
// Wir brauchen den Container, um die Grenzen zu kennen
const buttonContainer = document.querySelector('.button-container'); 

// Globale Funktion zum Bewegen des Buttons an eine zufällige Position
function moveButtonRandomly() {
    // Holen uns die Maße des Containers
    const containerRect = buttonContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // Berechnet zufällige Positionen innerhalb des Containers (abzüglich Buttongröße)
    const maxX = containerRect.width - btnRect.width;
    const maxY = containerRect.height - btnRect.height;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    // Wende neue Position an
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.transform = 'none'; // Entfernt die anfängliche CSS-Zentrierung
}

// --- Sicherheits-Optimierung für Mäuse ---
// Wir tracken die Mausbewegung auf der GESAMTEN SEITE
document.addEventListener('mousemove', (e) => {
    // 1. Holen uns die aktuelle Position des Buttons auf dem Bildschirm
    const btnRect = noBtn.getBoundingClientRect();
    
    // 2. Berechnen den Mittelpunkt des Buttons
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    // 3. Berechnen den Abstand der Maus (e.clientX, e.clientY) zum Button-Mittelpunkt
    // Hier nutzen wir den Satz des Pythagoras: a² + b² = c²
    const distX = e.clientX - btnCenterX;
    const distY = e.clientY - btnCenterY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // 4. Sicherheits-Radius definieren (in Pixeln)
    // Sobald die Maus näher als 80px kommt, flüchtet der Button.
    // Du kannst diesen Wert erhöhen, um es noch schwerer zu machen.
    const securityRadius = 85; 

    // 5. Prüfen, ob die Maus im Radius ist
    if (distance < securityRadius) {
        moveButtonRandomly();
    }
});

// --- Absolute Klick-Sperre (Failsafe) ---
// Falls es jemandem durch pures Glück gelingt, den Button genau im Sprung-Moment zu klicken:
noBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Stoppt den Klick
    alert("Haha, zu langsam! Versuch es erst gar nicht 😉");
    moveButtonRandomly(); // Bewegt ihn trotzdem weg
});


// --- Mobile Touch Avoidance (Unverändert, da 'touchstart' sicher ist) ---
noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault(); 
    moveButtonRandomly();
});


// --- Daten sammeln (Unverändert) ---
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
    document.querySelectorAll('.food-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    element.classList.add('selected');
    selectedFood = foodName;
}

function finishSetup() {
    if(!selectedFood) {
        alert('Wir müssen doch was essen! Wähl was aus! 🥺');
        return;
    }
    
    const finalMessage = document.getElementById('final-message');
    finalMessage.innerText = `glad you didn't say no. be ready by ${selectedTime} for ${selectedFood}, I'm coming to get you 🚗`;
    
    nextScreen(5);
}

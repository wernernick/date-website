// --- Navigation ---
function nextScreen(screenIdentifier) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    
    // Funktioniert jetzt mit Zahlen (1,2,3) oder Wörtern ("queue")
    const next = document.getElementById(`screen-${screenIdentifier}`);
    next.classList.remove('hidden');
    next.classList.add('active');
}

// --- NEU: Warteschlangen-Logik ---
function startQueue() {
    // Wechsle zur Warteschlange
    nextScreen('queue');

    let persons = 17;
    const numberElement = document.getElementById('queue-number');
    
    // Kleiner Gag: Die Zahl verringert sich alle 1,5 Sekunden leicht
    const interval = setInterval(() => {
        if (persons > 1) {
            // Zieht zufällig 1 bis 2 Personen ab
            persons -= Math.floor(Math.random() * 2) + 1; 
            if (persons < 1) persons = 1;
            numberElement.innerText = persons;
        }
    }, 1500);

    // Nach exakt 10 Sekunden (10.000 Millisekunden) geht es zur eigentlichen Seite
    setTimeout(() => {
        clearInterval(interval);
        nextScreen(1);
    }, 10000);
}


// --- Der unbesiegbare flüchtende "Nein"-Button ---
const noBtn = document.getElementById('no-btn');
const buttonContainer = document.querySelector('.button-container'); 

function moveButtonRandomly() {
    const containerRect = buttonContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const maxX = containerRect.width - btnRect.width;
    const maxY = containerRect.height - btnRect.height;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.transform = 'none'; 
}

// Sicherheits-Optimierung für Desktop-Mäuse
document.addEventListener('mousemove', (e) => {
    // Nur aktiv wenn der User sich auf Screen 1 befindet
    if (!document.getElementById('screen-1').classList.contains('active')) return;

    const btnRect = noBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const distX = e.clientX - btnCenterX;
    const distY = e.clientY - btnCenterY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    const securityRadius = 85; 

    if (distance < securityRadius) {
        moveButtonRandomly();
    }
});

// Absolute Klick-Sperre
noBtn.addEventListener('click', (e) => {
    e.preventDefault(); 
    alert("Haha, zu langsam! Versuch es erst gar nicht 😉");
    moveButtonRandomly(); 
});

// Mobile Touch Avoidance
noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault(); 
    moveButtonRandomly();
});


// --- Daten sammeln & E-Mail-Versand ---
let guestName = '';
let selectedDate = '';
let selectedTime = '';
let selectedFood = '';

function saveDateAndProceed() {
    const nameInput = document.getElementById('name-input').value.trim();
    const dateInput = document.getElementById('date-picker').value;
    const timeInput = document.getElementById('time-picker').value;
    
    if(!nameInput) {
        alert('Auf welchen Namen soll die Reservierung laufen? 📝');
        return;
    }
    
    if(!dateInput || !timeInput) {
        alert('Bitte wähle ein Datum und eine Uhrzeit aus! 🗓️⏰');
        return;
    }
    
    guestName = nameInput;
    const dateParts = dateInput.split('-');
    selectedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
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
    finalMessage.innerText = `glad you didn't say no, ${guestName}. be ready by ${selectedDate} at ${selectedTime} for ${selectedFood}, I'm coming to get you 🚗`;
    
    const formspreeUrl = "https://formspree.io/f/xdajprkv"; 

    fetch(formspreeUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "Betreff": `Neues Date mit ${guestName} gebucht! 💕`,
            "Name": guestName,
            "Datum": selectedDate,
            "Uhrzeit": selectedTime,
            "Essen": selectedFood
        })
    }).then(response => {
        console.log("Daten erfolgreich an Formspree gesendet!");
    }).catch(error => {
        console.error("Fehler beim Senden:", error);
    });
    
    nextScreen(5);
}

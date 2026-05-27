// --- Navigation ---
function nextScreen(screenNumber) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    
    const next = document.getElementById(`screen-${screenNumber}`);
    next.classList.remove('hidden');
    next.classList.add('active');
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

// Sicherheits-Optimierung für Desktop-Mäuse (Abstands-Tracking)
document.addEventListener('mousemove', (e) => {
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

// Absolute Klick-Sperre (Failsafe)
noBtn.addEventListener('click', (e) => {
    e.preventDefault(); 
    alert("Haha, zu langsam! Versuch es erst gar nicht 😉");
    moveButtonRandomly(); 
});

// Mobile Touch Avoidance für Smartphones
noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault(); 
    moveButtonRandomly();
});


// --- Daten sammeln & E-Mail-Versand ---
let selectedDate = '';
let selectedTime = '';
let selectedFood = '';

function saveDateAndProceed() {
    const dateInput = document.getElementById('date-picker').value;
    const timeInput = document.getElementById('time-picker').value;
    
    if(!dateInput || !timeInput) {
        alert('Bitte wähle ein Datum und eine Uhrzeit aus! 🗓️⏰');
        return;
    }
    
    // Datum in das deutsche Format (DD.MM.YYYY) umwandeln
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
    
    // Text auf der Bestätigungsseite dynamisch anpassen
    const finalMessage = document.getElementById('final-message');
    finalMessage.innerText = `glad you didn't say no. be ready by ${selectedDate} at ${selectedTime} for ${selectedFood}, I'm coming to get you 🚗`;
    
    // Formspree-Endpunkt mit deiner ID
    const formspreeUrl = "https://formspree.io/f/xdajprkv"; 

    // POST-Request an Formspree senden
    fetch(formspreeUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "Betreff": "Neues Date gebucht! 💕",
            "Datum": selectedDate,
            "Uhrzeit": selectedTime,
            "Essen": selectedFood
        })
    }).then(response => {
        console.log("Daten erfolgreich an Formspree gesendet!");
    }).catch(error => {
        console.error("Fehler beim Senden:", error);
    });
    
    // Sofort den letzten Screen anzeigen
    nextScreen(5);
}

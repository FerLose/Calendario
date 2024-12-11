async function saveEvent() {
    const selectedDate = document.querySelector('.selected')?.dataset.date;
    const eventInfo = document.getElementById('event-info').value;

    if (!selectedDate || !eventInfo) {
        alert('Por favor, selecciona una fecha y escribe un evento.');
        return;
    }

    try {
        await firebaseUtils.saveEventToFirebase(selectedDate, eventInfo);
        alert('Evento guardado correctamente.');
        renderCalendar();
    } catch (error) {
        console.error('Error al guardar el evento:', error);
        alert('Hubo un problema al guardar el evento.');
    }
}

async function renderCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthEl = document.getElementById('current-month');
    const currentYearEl = document.getElementById('current-year');
    calendarDays.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    currentMonthEl.textContent = currentDate.toLocaleDateString('es-ES', { month: 'long' }).toUpperCase();
    currentYearEl.textContent = year;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = (firstDay === 0 ? 6 : firstDay - 1);

    const allEvents = await firebaseUtils.loadEvents(); // Cargar eventos desde Firebase

    for (let i = 0; i < offset; i++) {
        calendarDays.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        const fullDate = `${year}-${month + 1}-${day}`;
        dayEl.textContent = day;
        dayEl.dataset.date = fullDate;

        if (allEvents[fullDate]) {
            dayEl.classList.add('has-event');
        }

        dayEl.addEventListener('click', () => selectDate(fullDate));
        calendarDays.appendChild(dayEl);
    }
}
document.getElementById('save-event').addEventListener('click', saveEvent);
renderCalendar();

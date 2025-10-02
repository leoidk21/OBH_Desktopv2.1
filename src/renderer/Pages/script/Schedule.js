console.log("SchedulePage.js is loaded!");

// Your initializeCalendar function (keep as is)
function initializeCalendar() {
    console.log("Attempting to initialize calendar...");

    const scheduleContent = document.querySelector('.schedule-content');

    if (!scheduleContent) {
        console.log("Schedule content not loaded yet");
        return false;
    }

    const calendarGrid = scheduleContent.querySelector('.calendar-grid');
    const timeline = scheduleContent.querySelector('.timeline');
    const dateTitle = scheduleContent.querySelector('.date-title');
    const monthNav = scheduleContent.querySelector('.month-nav');
    
    console.log("Calendar grid in section:", !!calendarGrid);
    console.log("Timeline in section:", !!timeline);
    console.log("Date title in section:", !!dateTitle);
    console.log("Month nav in section:", !!monthNav);
    
    if (calendarGrid && timeline && dateTitle && monthNav) {
        console.log("All required elements found - initializing calendar");
        new FunctionalCalendar();
        return true;
    } else {
        console.log("Some elements still not found in schedule section");
        return false;
    }
}

// ADD THIS PART - The observer that watches for schedule content
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            // Check if schedule content was added
            const scheduleContent = document.querySelector('.schedule-content');
            if (scheduleContent && !window.calendarInitialized) {
                console.log("Schedule content detected by observer - initializing calendar");
                if (initializeCalendar()) {
                    window.calendarInitialized = true;
                    observer.disconnect(); // Stop watching once initialized
                }
            }
        }
    });
});

// ADD THIS PART - Start watching when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded - checking for schedule content");
    
    // Try immediate initialization (in case schedule is already there)
    if (initializeCalendar()) {
        window.calendarInitialized = true;
        console.log("Calendar initialized immediately");
    } else {
        // If not ready, start watching for DOM changes
        console.log("Starting MutationObserver to watch for schedule content");
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});

// ADD THIS PART - Global function for manual triggering (backup method)
window.initializeScheduleCalendar = function() {
    console.log("Manual calendar initialization called");
    if (!window.calendarInitialized) {
        if (initializeCalendar()) {
            window.calendarInitialized = true;
            return true;
        }
    }
    return false;
};

class FunctionalCalendar {
    constructor() {
        this.currentDate = new Date(2025, 5, 16); // June 16, 2025
        this.selectedDate = new Date(2025, 5, 16);
        this.today = new Date();
        
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        this.init();
    }
    
    init() {
        console.log("Initializing FunctionalCalendar...");
        this.bindEvents();
        this.addClickEventsToExistingCells();
        this.loadEventsForDate(this.selectedDate);
        console.log("FunctionalCalendar initialized successfully!");
    }
    
    bindEvents() {
        console.log("Binding events...");
        
        const prevArrow = document.querySelector('.nav-arrow:first-child');
        const nextArrow = document.querySelector('.nav-arrow:last-child');
        
        console.log("Previous arrow found:", !!prevArrow);
        console.log("Next arrow found:", !!nextArrow);
        
        if (prevArrow) {
            prevArrow.addEventListener('click', () => {
                console.log("Previous month clicked");
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.renderCalendar();
            });
        }
        
        if (nextArrow) {
            nextArrow.addEventListener('click', () => {
                console.log("Next month clicked");
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.renderCalendar();
            });
        }
    }
    
    addClickEventsToExistingCells() {
        const calendarCells = document.querySelectorAll('.calendar-cell:not(.other-month):not(.calendar-header-cell)');
        console.log("Found calendar cells:", calendarCells.length);
        
        calendarCells.forEach((cell, index) => {
            console.log(`Adding click to cell ${index + 1}: ${cell.textContent}`);
            cell.addEventListener('click', () => {
                const day = parseInt(cell.textContent);
                if (!isNaN(day)) {
                    console.log(`Date selected: ${this.currentDate.getMonth() + 1}/${day}/${this.currentDate.getFullYear()}`);
                    this.selectDate(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
                }
            });
        });
    }
    
    renderCalendar() {
        this.updateMonthDisplay();
        this.generateCalendarDays();
    }
    
    updateMonthDisplay() {
        const monthDisplay = document.querySelector('.month-nav span:nth-child(2)');
        
        if (!monthDisplay) {
            console.warn("Month display element not found");
            return;
        }
        
        const monthName = this.monthNames[this.currentDate.getMonth()];
        const year = this.currentDate.getFullYear();
        
        if (this.isSelectedMonth()) {
            monthDisplay.textContent = `${monthName} ${this.selectedDate.getDate()}, ${year}`;
        } else {
            monthDisplay.textContent = `${monthName} ${year}`;
        }
    }
    
    generateCalendarDays() {
        const calendarGrid = document.querySelector('.calendar-grid');
        
        if (!calendarGrid) {
            console.error("Calendar grid not found");
            return;
        }
        
        const existingCells = calendarGrid.querySelectorAll('.calendar-cell');
        existingCells.forEach(cell => cell.remove());
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        let startDayOfWeek = (firstDay.getDay() + 6) % 7;
        
        const prevMonth = new Date(year, month, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const cell = this.createDayCell(day, 'other-month', year, month - 1);
            calendarGrid.appendChild(cell);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            let classes = '';
            
            if (this.isSelectedDate(year, month, day)) {
                classes += 'today ';
            }
            
            if (this.isToday(year, month, day)) {
                classes += 'actual-today ';
            }
            
            const cell = this.createDayCell(day, classes, year, month);
            calendarGrid.appendChild(cell);
        }
        
        const totalCells = calendarGrid.children.length - 7;
        const remainingCells = Math.max(0, 42 - totalCells);
        
        for (let day = 1; day <= remainingCells; day++) {
            const cell = this.createDayCell(day, 'other-month', year, month + 1);
            calendarGrid.appendChild(cell);
        }
    }
    
    createDayCell(day, classes, year, month) {
        const cell = document.createElement('div');
        cell.className = `calendar-cell ${classes}`.trim();
        cell.textContent = day;
        
        if (!classes.includes('other-month')) {
            cell.addEventListener('click', () => {
                console.log(`Date selected: ${month + 1}/${day}/${year}`);
                this.selectDate(year, month, day);
            });
        }
        
        return cell;
    }
    
    selectDate(year, month, day) {
        document.querySelectorAll('.calendar-cell.today').forEach(cell => {
            cell.classList.remove('today');
        });
        
        this.selectedDate = new Date(year, month, day);
        this.currentDate = new Date(year, month, day);
        
        const dateTitle = document.querySelector('.date-title');
        if (dateTitle) {
            const monthName = this.monthNames[month];
            dateTitle.textContent = `${monthName} ${day}, ${year}`;
        }
        
        const allCells = document.querySelectorAll('.calendar-cell');
        allCells.forEach(cell => {
            if (cell.textContent == day && !cell.classList.contains('other-month')) {
                cell.classList.add('today');
            }
        });
        
        this.renderCalendar();
        this.loadEventsForDate(this.selectedDate);
    }
    
    loadEventsForDate(date) {
        const events = this.getEventsForDate(date);
        this.renderEvents(events);
    }
    
    getEventsForDate(date) {
        const sampleEvents = {
            '2025-6-16': [
                {
                    time: '9:00 AM',
                    endTime: '10:00 AM',
                    title: 'Ceremony',
                    description: 'The ceremony will take place at St. Patrick\'s chapel.',
                    duration: '1 hour',
                    type: 'ceremony'
                },
                {
                    time: '11:00 AM',
                    endTime: '12:00 PM',
                    title: 'Photoshoot',
                    description: 'Outdoor photoshoot in the Central Park.',
                    duration: '1 hour',
                    type: 'photoshoot'
                },
                {
                    time: '1:00 PM',
                    endTime: '3:00 PM',
                    title: 'Reception',
                    description: 'Drinks and dancing at Garden Hotel',
                    duration: '2 hours',
                    type: 'reception'
                }
            ],
            '2025-6-17': [
                {
                    time: '10:00 AM',
                    endTime: '11:30 AM',
                    title: 'Team Meeting',
                    description: 'Weekly team sync and project updates.',
                    duration: '1.5 hours',
                    type: 'meeting'
                }
            ],
            '2025-6-18': [
                {
                    time: '2:00 PM',
                    endTime: '4:00 PM',
                    title: 'Client Presentation',
                    description: 'Present quarterly results to stakeholders.',
                    duration: '2 hours',
                    type: 'presentation'
                }
            ]
        };
        
        const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        return sampleEvents[dateKey] || [];
    }
    
    renderEvents(events) {
        const timeline = document.querySelector('.timeline');
        
        if (!timeline) {
            console.error("Timeline element not found");
            return;
        }
        
        const existingSlots = timeline.querySelectorAll('.time-slot');
        existingSlots.forEach(slot => slot.remove());
        
        const existingNoEvents = timeline.querySelectorAll('.no-events');
        existingNoEvents.forEach(msg => msg.remove());
        
        if (events.length === 0) {
            const noEventsDiv = document.createElement('div');
            noEventsDiv.className = 'no-events';
            noEventsDiv.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No events scheduled for this date.</p>';
            timeline.appendChild(noEventsDiv);
            return;
        }
        
        const timeSlots = this.generateTimeSlots(events);
        
        timeSlots.forEach((slot, index) => {
            const timeSlotDiv = document.createElement('div');
            timeSlotDiv.className = 'time-slot';
            
            const timeLabelDiv = document.createElement('div');
            timeLabelDiv.className = 'time-label';
            timeLabelDiv.textContent = slot.time;
            
            const timeRangeDiv = document.createElement('div');
            timeRangeDiv.className = 'time-range';
            
            const eventDiv = document.createElement('div');
            
            if (slot.event) {
                eventDiv.className = `event-card ${slot.event.type}`;
                eventDiv.innerHTML = `
                    <div class="event-title">${slot.event.title}</div>
                    <div class="event-description">${slot.event.description}</div>
                    <div class="event-duration">
                        <span class="duration-time">${slot.event.time} - ${slot.event.endTime}</span>
                        <span class="duration-length">${slot.event.duration}</span>
                    </div>
                `;
            }
            
            timeSlotDiv.appendChild(timeLabelDiv);
            timeSlotDiv.appendChild(timeRangeDiv);
            timeSlotDiv.appendChild(eventDiv);
            
            timeline.appendChild(timeSlotDiv);
        });
    }
    
    generateTimeSlots(events) {
        const slots = [];
        const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'];
        
        times.forEach(time => {
            const event = events.find(e => e.time === time);
            slots.push({
                time: time,
                event: event || null
            });
        });
        
        return slots;
    }
    
    isSelectedDate(year, month, day) {
        return this.selectedDate.getFullYear() === year &&
                this.selectedDate.getMonth() === month &&
                this.selectedDate.getDate() === day;
    }
    
    isToday(year, month, day) {
        const today = new Date();
        return today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === day;
    }
    
    isSelectedMonth() {
        return this.currentDate.getFullYear() === this.selectedDate.getFullYear() &&
                this.currentDate.getMonth() === this.selectedDate.getMonth();
    }
}
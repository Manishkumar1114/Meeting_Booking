document.addEventListener('DOMContentLoaded', function() {
  const timeSlotsContainer = document.querySelector('.time-slots');
  const bookedMeetingsContainer = document.getElementById('bookedMeetings');
  const bookingForm = document.getElementById('bookingForm');
  const bookingFormSubmit = document.getElementById('bookingFormSubmit');
  const timeSlotInput = document.getElementById('timeSlot');

  // Fetch available slots and booked meetings
  function loadData() {
    fetch('/api/slots')
      .then(response => response.json())
      .then(data => {
        displayTimeSlots(data.slots);
        displayBookedMeetings(data.bookedMeetings);
      });
  }

  // Display time slots
  function displayTimeSlots(slots) {
    timeSlotsContainer.innerHTML = '';
    for (let time in slots) {
      const button = document.createElement('button');
      button.textContent = `${time} - ${slots[time].available} Available`;
      button.onclick = () => openForm(time);
      timeSlotsContainer.appendChild(button);
    }
  }

  // Display booked meetings
  function displayBookedMeetings(meetings) {
    bookedMeetingsContainer.innerHTML = '';
    if (meetings.length > 0) {
      const ul = document.createElement('ul');
      meetings.forEach(meeting => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${meeting.name}</strong> has a meeting at <strong>${meeting.time}</strong>.
          Join here: <a href="${meeting.meetingLink}">${meeting.meetingLink}</a>
          <button onclick="deleteMeeting('${meeting.id}')">Delete</button>`;
        ul.appendChild(li);
      });
      bookedMeetingsContainer.appendChild(ul);
    } else {
      bookedMeetingsContainer.textContent = 'No meetings booked yet.';
    }
  }

  // Open booking form
  function openForm(time) {
    timeSlotInput.value = time;
    bookingForm.style.display = 'block';
  }

  // Handle booking form submission
  bookingFormSubmit.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(bookingFormSubmit);
    const jsonData = Object.fromEntries(formData.entries());

    fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(data.message);
        loadData(); // Reload the data
      } else {
        alert(data.message);
      }
    });
  });

  // Delete a meeting
  window.deleteMeeting = function(id) {
    fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        loadData(); // Reload the data after deletion
      }
    });
  };

  // Load initial data
  loadData();
});

const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); 


let slots = {
  '2:00 PM': { available: Math.floor(Math.random() * 5), bookings: [] },
  '2:30 PM': { available: Math.floor(Math.random() * 5), bookings: [] },
  '3:00 PM': { available: Math.floor(Math.random() * 5), bookings: [] },
};

// Array to store all booked meetings
let bookedMeetings = [];

// API to get available time slots 
app.get('/api/slots', (req, res) => {
  res.json({ slots, bookedMeetings });
});

// API to book a meeting
app.post('/api/book', (req, res) => {
  const { name, email, time } = req.body;
  const meetingLink = `https://meet.google.com/`;

 
  if (slots[time].available > 0) {
    // Add the booking
    slots[time].bookings.push({ name, email, meetingLink });
    slots[time].available--;

    // Store the booked meeting with a unique id for deletion later
    const newMeeting = { id: name, email, time, meetingLink };
    bookedMeetings.push(newMeeting);

    res.json({ success: true, bookedMeetings, message: 'Booking successful' });
  } else {
    res.json({ success: false, message: `Sorry, no slots available for ${time}.` });
  }
});

// API to delete a booking
app.post('/api/delete', (req, res) => {
  const { id } = req.body;

  
  bookedMeetings = bookedMeetings.filter(meeting => meeting.id !== id);

  res.json({ success: true, bookedMeetings });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

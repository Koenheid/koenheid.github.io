<script>
var timerInterval; // Declare timerInterval variable in the global scope

// Function to load records from localStorage and display them
function loadRecords() {
   var records = JSON.parse(localStorage.getItem('recordsList')) || [];
   records.forEach(function(record) {
       createRecordElement(record.mlAmount, record.timeString, record.dateString);
   });
}

// Function to create a record element and append it to the list
function createRecordElement(mlAmount, timeString, dateString) {
   var recordItem = document.createElement('div');
   recordItem.classList.add('record-item');
   recordItem.textContent = `🧪 ${mlAmount}mL 🕰️  ${timeString} | ${dateString}`;
   document.getElementById('recordsList').appendChild(recordItem);
}

// Updated saveAmount function to save records to localStorage
function saveAmount() {
   var mlAmount = document.getElementById('mlInput').value;
   if (mlAmount) {
   var currentDate = new Date();
   var day = currentDate.toLocaleString('en-GB', { day: '2-digit' });
   var month = currentDate.toLocaleString('en-GB', { month: '2-digit' });
   var year = currentDate.toLocaleString('en-GB', { year: 'numeric' });
   var hours = currentDate.getHours().toString().padStart(2, '0');
   var minutes = currentDate.getMinutes().toString().padStart(2, '0');
   var seconds = currentDate.getSeconds().toString().padStart(2, '0');
   var weekday = currentDate.toLocaleString('en-GB', { weekday: 'long' });

   var timeString = `${hours}:${minutes}:${seconds}`;
   var dateString = `${weekday} ${day}/${month}/${year}`;

   // Record the current time as the time of the last log entry.
   localStorage.setItem('lastLogEntryTime', currentDate.toISOString());

   // Save the record in localStorage
   var records = JSON.parse(localStorage.getItem('recordsList')) || [];
   records.push({ mlAmount: mlAmount, timeString: timeString, dateString: dateString });
   localStorage.setItem('recordsList', JSON.stringify(records));

   // Create and append the new record element
   createRecordElement(mlAmount, timeString, dateString);

   document.getElementById('mlInput').value = ''; // Clear input
   } else {
   alert('Net als je buis, dit even invullen graag!');
   }

   // Clear any existing timer intervals before setting a new one
   clearInterval(timerInterval);

   // Update the timer display every second
   timerInterval = setInterval(updateTimerDisplay, 1000);
}

// Function to export the data to CSV
function exportToCSV() {
   var records = JSON.parse(localStorage.getItem('recordsList')) || [];
   var csvContent = "data:text/csv;charset=utf-8,";
   csvContent += "Record ID,Amount (mL),Timestamp\r\n"; // Header row

   records.forEach(function(record, index) {
       var row = (index + 1) + ',' + record.mlAmount + ',' + record.dateString + ' ' + record.timeString;
       csvContent += row + "\r\n";
   });

   var encodedUri = encodeURI(csvContent);
   var link = document.createElement("a");
   link.setAttribute("href", encodedUri);
   link.setAttribute("download", "LoeiLog.csv");
   document.body.appendChild(link); // Required for FF

   link.click(); // This will download the data file named "LoeiLog.csv".
}

// Function to clear all data
function clearData() {
   if (confirm('Je volledige 🐄LoeiLog📓 wordt gewist, weet je het zeker?')) {
       // Clear localStorage
       localStorage.removeItem('recordsList');
       localStorage.removeItem('lastLogEntryTime'); // Remove the timestamp of the last log entry
   
       // Clear displayed list
       document.getElementById('recordsList').innerHTML = '';

       // Reset the timer display without starting the timer
       resetTimerDisplay();		
   }
}

   function resetTimerDisplay() {
   // Stop the existing timer
   clearInterval(timerInterval);

   // Set lastTimestamp to null to indicate no active timer
   localStorage.removeItem('lastLogEntryTime'); // Ensure this key is removed from localStorage

   // Reset the timer display to show the message
   document.getElementById('timerDisplay').textContent = `Klap eerst een buis om de timer te beginnen!`;
}
   
function updateTimerDisplay() {
 // Retrieve the last log entry time from localStorage
 let lastLogEntryTime = localStorage.getItem('lastLogEntryTime');
   if (lastLogEntryTime) {
   lastLogEntryTime = new Date(lastLogEntryTime);
   } else {
   // If no time is recorded, use the current time
   lastLogEntryTime = new Date();
   
   // Calculate the time difference
   let now = new Date();
   let elapsed = now - lastLogEntryTime; // difference in milliseconds

   // Convert milliseconds into hours, minutes, and seconds
   let seconds = Math.floor(elapsed / 1000);
   let minutes = Math.floor(seconds / 60);
   seconds = seconds % 60;
   let hours = Math.floor(minutes / 60);
   minutes = minutes % 60;

    // Update the timer display with the elapsed time
    document.getElementById('timerDisplay').textContent = `Loeitijd sinds je laatste buis: ${hours}h ${minutes}m ${seconds}s`;

   // If no lastLogEntryTime is found, stop the timer and set the default message
   clearInterval(timerInterval);
   document.getElementById('timerDisplay').textContent = `Klap je eerste buis om de timer te beginnen!`;
}

// What happens when the page loads
window.onload = function() {
loadRecords(); // Call loadRecords on page load to display existing records 
updateTimerDisplay(); 
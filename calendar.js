// calendar-setup.js (or inside <script> tags once in your HTML)

(function() {
    // Load the main Google Calendar scheduling script once
    const script = document.createElement('script');
    script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js';
    script.async = true;
    document.head.appendChild(script);

    // Wait for the window to fully load and the Google script to be available
    window.addEventListener('load', function() {
        const buttons = document.querySelectorAll('.book-appointment-button');
        buttons.forEach(button => {
            if (window.calendar && window.calendar.schedulingButton) {
                // Apply the scheduling button to each target element
                calendar.schedulingButton.load({
                    // *** YOUR UNIQUE URL AND SETTINGS HERE ***
                    url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1Hnt2H7elTyWTDyBO7ftlA4I1y1X0l7afOPftbqevAPmxroHa-qg1YX4zhFGpUrL-LFY9qYXI0?gv=true',
                    color: '#0B8043',
                    label: button.getAttribute('data-label') || 'Book an appointment', // Allows overriding the label
                    target: button,
                });
            }
        });
        const visionButtons = document.querySelectorAll('.vision-talk-button');
        visionButtons.forEach(button => {
              if (window.calendar && window.calendar.schedulingButton) {
                  // Apply the scheduling button to each target element
                  calendar.schedulingButton.load({
                      // *** YOUR UNIQUE URL AND SETTINGS HERE ***
                      url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3nirHONfHOvuOy1M0z1z5hi7QLwGvcMGeODgtDULztNFR2Xkmm3NELS1G-7DaXgjz8FXIpLXxs?gv=true',
                      color: '#0B8043',
                      label: button.getAttribute('data-label') || 'Book an appointment', // Allows overriding the label
                      target: button,
                  });
              }
        });
    });
})();
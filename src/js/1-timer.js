import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const inputDatetimePicker = document.querySelector('#datetime-picker');
const buttonDataStart = document.querySelector('[data-start]');
const dataDaysEl = document.querySelector('[data-days]');
const dataHoursEl = document.querySelector('[data-hours]');
const dataMinutesEl = document.querySelector('[data-minutes]');
const dataSecondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let intervalBack = null;

buttonDataStart.disabled = true;

flatpickr(inputDatetimePicker, {
  enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      userSelectedDate = selectedDates[0]; 
      
      if(userSelectedDate <= new Date()) {
        buttonDataStart.disabled = true;

        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
        });
      } else {
        buttonDataStart.disabled = false;

        iziToast.success({
          title: 'Success',
          message: 'Correct date!',
        });
      }
    },
});

  function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  
    return { days, hours, minutes, seconds };
  }
  
  const addLeadingZero = value => value.toString().padStart(2, '0');

  buttonDataStart.addEventListener('click', () => {
    buttonDataStart.disabled = true;
    inputDatetimePicker.disabled = true;

    intervalBack = setInterval(() => {
      const nowData = new Date();
      const timeResult = userSelectedDate - nowData;

      const { days, hours, minutes, seconds } = convertMs(timeResult);

      dataDaysEl.textContent = addLeadingZero(days);
      dataHoursEl.textContent = addLeadingZero(hours);
      dataMinutesEl.textContent = addLeadingZero(minutes);
      dataSecondsEl.textContent = addLeadingZero(seconds);

      const addTimerStop = [days, hours, minutes, seconds].every(
        value => value === 0
      );

      if(addTimerStop) {
        clearInterval(intervalBack);
        inputDatetimePicker.disabled = false;
      }
    }, 1000);
  });

  
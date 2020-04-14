$('document').ready(function(){
  startClock();
});

function startClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock(){
  var clock = document.getElementById('clock');

  var date = new Date();

  var day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  clock.children[0].innerHTML = day;

  var month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  clock.children[1].innerHTML = month;

  var year = date.getFullYear();
  if (year < 10) {
    year = '0' + year;
  }
  clock.children[2].innerHTML = year;

  var hours = date.getHours();
  if (hours < 10) {
    hours = '0' + hours;
  }
  clock.children[4].innerHTML = hours;

  var minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  clock.children[5].innerHTML = minutes;

  var seconds = date.getSeconds();
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  clock.children[6].innerHTML = seconds;
}

$(document).ready(function(){
 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB3Idf2JxJoe4nucdBWUri1Bh6VFPq0h-A",
    authDomain: "train-station-37f50.firebaseapp.com",
    databaseURL: "https://train-station-37f50.firebaseio.com",
    storageBucket: "train-station-37f50.appspot.com",
    messagingSenderId: "988014342680"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database
  var database = firebase.database();

    //Button for adding new employee
  $("#submitButton").on("click", function() {

  //Gets the users data
      var train = $("#trainNameInput").val().trim();
      var destination = $("#destinationInput").val().trim();
      var start = $("#startInput").val().trim();
      var frequency = $("#frequencyInput").val().trim();

      // Stores the data into the database
      database.ref().push({
          train: train,
          destination: destination,
          start: start,
          frequency: frequency
      });    
          
       $("form").trigger("reset");   
       
      // Return "false" so the page doesnt refresh
      return false;
    });

  // when it gets new data, render the data onto the page
  database.ref().on("child_added", function(childSnapshot) {
  var now = moment();
    var start = moment().startOf('day').hour((childSnapshot.val().start).substring(0,2)).minute((childSnapshot.val().start).substring(3,5));
    var difference = Math.abs(start.diff(now, 'minutes'));
    
    var comesInAt = Math.ceil(difference/childSnapshot.val().frequency) * childSnapshot.val().frequency - difference;
    
    if (comesInAt < 0) {
        var result = Number(childSnapshot.val().frequency) + comesInAt;
        console.log(result);

    }
    else {
        var result = comesInAt;
        console.log(result);
    }
    var nextTrain = moment().add(result, 'minutes');
    var nextTrain2 = nextTrain.hours();
    var nextTrainMinutes = nextTrain.minutes();
  $('#train-table').append("<tr><td>" +childSnapshot.val().train +"</td><td>"
   +childSnapshot.val().destination +"</td><td>" +childSnapshot.val().frequency +"</td><td>" +nextTrain2 +":" +nextTrainMinutes +"</td><td>" +result +" min.</td></tr>");
  
  });

  // Curent Time Display
  var datetime = null,
          date = null;

  var update = function () {
      date = moment(new Date())
      datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
  };

  $(document).ready(function(){
      datetime = $('#displayCurrentTime')
      update();
      setInterval(update, 1000);
  });


});
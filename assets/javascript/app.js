var firebaseConfig = {
  apiKey: "AIzaSyBqU8IMH1jvLX-rTuvkBfvGUKnb_TS-hqk",
  authDomain: "trilogytrainscheduler.firebaseapp.com",
  databaseURL: "https://trilogytrainscheduler.firebaseio.com",
  projectId: "trilogytrainscheduler",
  storageBucket: "trilogytrainscheduler.appspot.com",
  messagingSenderId: "989072623055",
  appId: "1:989072623055:web:97f2bec20db99388057eba",
  measurementId: "G-RTV6PE50CB"
};

firebase.initializeApp(firebaseConfig);

getHour = () => {
  var today = new Date();
  return today.getHours();
};

getMinute = () => {
  var today = new Date();
  return today.getMinutes();
};

let database = firebase.database();
database.ref().on("value", function(snapshot) {
  console.log(snapshot.val());
  $("#trains tr").remove();
  let i = 0;
  if (snapshot.val() != null) {
    for (var key in snapshot.val().Trains) {
      console.log(i);
      console.log(key);
      trains = document.getElementById("trains");
      let row = trains.insertRow(i);
      tname = row.insertCell(0);
      tdest = row.insertCell(1);
      tfreq = row.insertCell(2);
      tna = row.insertCell(3);
      tma = row.insertCell(4);
      i += 1;
      tname.innerHTML = snapshot.val().Trains[key].NAME;
      tdest.innerHTML = snapshot.val().Trains[key].DEST;
      tfreq.innerHTML = snapshot.val().Trains[key].FREQ;

      let done = false;
      let startTime = snapshot.val().Trains[key].FST;

      startTime1 = startTime.slice(0, 2);
      startTime2 = startTime.slice(2, 4);
      startTime1 = parseInt(startTime1);
      startTime2 = parseInt(startTime2);
      startTime = startTime1 * 60 + startTime2;
      // let startH = parseInt(startTime.slice(0, 2));
      // console.log(startH);
      // let startM = parseInt(startTime.slice(2, 4));
      // console.log(startM);

      console.log(startTime);
      console.log(getHour() * 60 + getMinute());

      while (done === false) {
        if (startTime < getHour() * 60 + getMinute()) {
          startTime += parseInt(snapshot.val().Trains[key].FREQ);

          console.log(startTime);
        } else {
          done = true;
          let remainder = startTime / 60;
          remainder = remainder.toFixed(2);
          p = remainder.toString().split(".");
          p1 = p[1];
          console.log(remainder);
          console.log(p1);

          remainder = (p1 / 100) * 60;
          remainder = remainder.toFixed(0);
          console.log(remainder);
          if (remainder.toString().length === 1) {
            remainder = "0" + remainder.toString();
          }

          console.log(remainder);
          let nextTrain = Math.floor(startTime / 60) + ":" + remainder;
          console.log(nextTrain);
          console.log(nextTrain.slice(0, 2));
          if (nextTrain.slice(0, 2) >= 12) {
            a = nextTrain.slice(0, 2) - 12 + ":" + remainder + "PM";
            console.log(a);
            nextTrain = a;
            tna.innerHTML = nextTrain;
          } else {
            console.log(nextTrain + "AM");
            nextTrain = nextTrain + "AM";
            tna.innerHTML = nextTrain;
          }
        }
      }

      console.log(startTime);
      console.log(getHour() * 60 + getMinute());

      tma.innerHTML = startTime - (getHour() * 60 + getMinute());
    }
  }
});

$("#submit").on("click", function(event) {
  event.preventDefault();
  var newTrain = {
    name: $("#name")
      .val()
      .trim(),
    dest: $("#destination")
      .val()
      .trim(),
    fst: $("#fst")
      .val()
      .trim(),
    freq: $("#frequency")
      .val()
      .trim()
  };
  database
    .ref("Trains")
    .child(newTrain.name)
    .set({
      NAME: newTrain.name,
      DEST: newTrain.dest,
      FST: newTrain.fst,
      FREQ: newTrain.freq
    });

  // database.ref().on("value", function(snapshot) {
  //   for (var key in snapshot.val().Trains) {
  //     console.log(key);
  //     trains = document.getElementById("trains");
  //     let row = trains.insertRow(i);
  //     tname = row.insertCell(0);
  //     tdest = row.insertCell(1);
  //     tfreq = row.insertCell(2);
  //     i += 1;
  //     tname.innerHTML = snapshot.val().Trains[key].NAME;
  //     tdest.innerHTML = snapshot.val().Trains[key].DEST;
  //     tfreq.innerHTML = snapshot.val().Trains[key].FREQ;
  //     console.log(tname);
  //     console.log;

  //     jeff = snapshot.val().Trains;
  //   }
});
i = 0;

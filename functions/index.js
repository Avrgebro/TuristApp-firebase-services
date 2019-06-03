const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.getPlaces = functions.https.onRequest((request, response) => {
  var db = admin.firestore();
  var places = [];

  db.collection('Places').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
      var place = {
        "id": doc.id,
        "description": doc.data().Description,
        "hours": doc.data().Horario,
        "image": doc.data().Image,
        "location": doc.data().Location,
        "name": doc.data().Name,
        "tags": doc.data().Tags
      }
      places = places.concat(place)
    });
    response.send(JSON.stringify(places))
    return places
  })
  .catch(err => {
    console.log(err)
  })
});

exports.getActivities = functions.https.onRequest((request, response) => {
  var db = admin.firestore();
  var activities = [];

  db.collection('Activities').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
      var activity = {
        "id": doc.data().id,
        "name": doc.data().name
      }
      activities = activities.concat(activity)
    });
    response.send(JSON.stringify(activities))
    return activities
  })
  .catch(err => {
    console.log(err)
  })
});

exports.getPlacesByIndex = functions.https.onRequest((request, response) => {
  var db = admin.firestore();
  var places = [];
  var aux = request.url.slice(1);
  var indexes = aux.split(",")
  db.collection('Places').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
      var place = {
        "id": doc.id,
        "description": doc.data().Description,
        "hours": doc.data().Horario,
        "image": doc.data().Image,
        "location": doc.data().Location,
        "name": doc.data().Name,
        "tags": doc.data().Tags
      }
      places = places.concat(place)
    });
    places = places.filter(function(item){
      return indexes.indexOf(item.id) > -1;
    });
    response.send(JSON.stringify(places))
    //response.send(request.url)
    return places
  })
  .catch(err => {
    console.log(err)
  })
});

exports.writeTrainingData = functions.https.onRequest((request, response) => {
  var db = admin.firestore()
  db.collection("Profiles").add({
    data: request.url.slice(1)
  })
  .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
    response.send(docRef.id)
    return docRef.id
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
});

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.addUserMessage = functions.database.ref('/messages/{messageId}')
    .onWrite(event => {
        const messageKey = event.data.key;
        const messageVal = event.data.val();

       // admin.database().ref('user-messages/'+messageVal.userFromId+'/'+messageVal.userToId).child(messageKey).set(messageVal.message);    
        admin.database().ref('user-messages/'+messageVal.userToId+'/new-messages/').child(messageKey).set(messageVal);

    })

var connect = require('connect');
var firebase=require("firebase");
 var config = {
    apiKey: "AIzaSyDZYOUJ0Tpcefd2VH5FfxVr6-cHs9GH2Sk",
    authDomain: "team-project-4b390.firebaseapp.com",
    databaseURL: "https://team-project-4b390.firebaseio.com",
    storageBucket: "team-project-4b390.appspot.com",
    messagingSenderId: "419203777598"
  };
firebase.initializeApp(config);
var database = firebase.database();
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8080, function(){
    console.log('Server running on 8080...');

});
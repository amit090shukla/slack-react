import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
var config = {
  apiKey: "AIzaSyB3pU0_jE60dZmOvFrOKpApuE6AJVN390A",
  authDomain: "react-slack-clone-fe665.firebaseapp.com",
  databaseURL: "https://react-slack-clone-fe665.firebaseio.com",
  projectId: "react-slack-clone-fe665",
  storageBucket: "react-slack-clone-fe665.appspot.com/",
  messagingSenderId: "488743264146"
};
firebase.initializeApp(config);

export default firebase;

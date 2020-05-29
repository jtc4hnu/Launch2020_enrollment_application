import React, { useState } from 'react';
import './App.css';

import LandingPage from "./landingPage.js";
import DataDisplay from "./dataDisplay.js";

import firebase from "firebase";

firebase.initializeApp(
  {
    apiKey: process.env.REACT_APP_DatabaseAPIKey,
    authDomain: process.env.REACT_APP_AuthDomain,
    databaseURL: process.env.REACT_APP_DataBaseURL,
    projectId: process.env.REACT_APP_ProjectID,
    storageBucket: process.env.REACT_APP_StorageBucket,
    messagingSenderId: process.env.REACT_APP_MessageSenderID,
    appId: process.env.REACT_APP_AppID
  }
);
const AUTH = firebase.auth();
const DATABASE = firebase.firestore();

function App() {
  const [account, setAccount] = useState(false);

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      setAccount(user.uid);
    }
    else {
      setAccount(false);
    }
  })

  return (
    <div className="App">
      <h1>Thomas Jefferson Elementary School
        {
          account &&
          <button className="SignOut" onClick={() => AUTH.signOut()}>Sign Out</button>
        }
      </h1>

      {account ?
        <DataDisplay auth={AUTH} database={DATABASE} account={account} /> : <LandingPage auth={AUTH} database={DATABASE} />}
    </div>
  );
}

export default App;

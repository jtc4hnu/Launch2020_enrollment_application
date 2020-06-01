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
const AUTH2 = firebase.initializeApp({
  apiKey: process.env.REACT_APP_DatabaseAPIKey,
  authDomain: process.env.REACT_APP_AuthDomain,
  databaseURL: process.env.REACT_APP_DataBaseURL,
  projectId: process.env.REACT_APP_ProjectID,
  storageBucket: process.env.REACT_APP_StorageBucket,
  messagingSenderId: process.env.REACT_APP_MessageSenderID,
  appId: process.env.REACT_APP_AppID
}, "Secondary").auth();
const DATABASE = firebase.firestore();

function App() {
  const [account, setAccount] = useState(false);

  firebase.auth().onAuthStateChanged(user => {
    setAccount(user ? user : false);
  })

  return (
    <div className="App">
      <header>
        {
          account &&
          <div className="SignOut">
            <div>{account.email}</div>

            <button onClick={() => AUTH.signOut()}> Sign Out</button>
          </div>
        }
        <b>Thomas Jefferson Elementary</b>
        {
          account ?
            <div>School Database</div>
            :
            <div>Sign in Page</div>
        }
      </header>

      {
        account ?
          <DataDisplay auth2={AUTH2} database={DATABASE} account={account.uid} />
          :
          <LandingPage auth={AUTH} database={DATABASE} />
      }

      <footer>
        <div>
          <div>School Phone: 434-TOM-JEFF</div>
          <div>School Email: tjes@tjes.k12.va.us</div>
        </div>

        <div>
          <div>Site Issues? Contact jtc4hnu@virginia.edu</div>
        </div>
      </footer>
    </div>
  );
}

export default App;

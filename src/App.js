import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig)

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false,
  })

  //sign in button working
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
  .then(result => {
    const {email, displayName, photoURL} = result.user;

    const isSignedInUser = {
      isSignedIn: true,
      name: displayName,
      email: email,
      photo: photoURL
    }
    setUser(isSignedInUser)
    // console.log(email, displayName, photoURL);
    // console.log(result.user);
  })
  .catch(err => {
    console.log(err);
    console.log(err.massage);
  })
  }

  const handleSignIOut = () => {
    firebase.auth().signOut()
    .then(result => {
      const signOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
      }
      setUser(signOutUser)
    })
    .catch(err => {
      console.log(err);
    })
  }



  //Handle Submit
  const handleSubmit = (e) => {
    // console.log(user.email, user.password);
   if(newUser && user.email && user.password){
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(res => {
      const newUserInfo = {...user};
      newUserInfo.error = '';
      newUserInfo.success = true;
      setUser(newUserInfo);
      updateUserName(user.name);
    })
    .catch( error => {
      const newUserInfo = {...user};
      newUserInfo.error = error.message;
      newUserInfo.success = false;
      setUser(newUserInfo)
    });
    
   }

   if(!newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(res => {
      const newUserInfo = {...user};
      newUserInfo.error = '';
      newUserInfo.success = true;
      setUser(newUserInfo);
      console.log('sign in user info', res.user);
    })
    .catch(function(error) {
      const newUserInfo = {...user};
      newUserInfo.error = error.message;
      newUserInfo.success = false;
      setUser(newUserInfo)
    });
   }
   e.preventDefault();
  }
 



  //Handle Change
  const handleBlur = (e) => {
    // console.log(e.target.name, e.target.value);

    let isFieldValid = true;

    if (e.target.name === 'email') {
      // const isEmailValid = /\S+@\S+\.\S+/.test(e.target.value);
      // console.log(isEmailValid);
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPassWordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d+/.test(e.target.value);
      // console.log(passwordHasNumber && isPassWordValid);
      isFieldValid = passwordHasNumber && isPassWordValid
    }
    if (isFieldValid) {
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

const updateUserName = name => {
  const user = firebase.auth().currentUser;

  user.updateProfile({
    displayName: name,
    // photoURL: "https://example.com/jane-q-user/profile.jpg"
  }).then(function() {
    // Update successful.
    console.log('user name update successfully');
  }).catch(function(error) {
    // An error happened.
    console.log(error);
  });
}




  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignIOut}>Sign out</button> : <button onClick={handleSignIn}>Sign in</button>
      }
      {
        user.isSignedIn && <div>
                              <p>welcome , {user.name}</p>
                              <p>Your Email: {user.email}</p>
                              <img src={user.photo} alt=""/>
                          </div>
      }

      <h1>Our Own Authentication</h1>
      <form onSubmit={handleSubmit}>
       <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
       <label htmlFor="newUser">New User Sign Up</label>
       <br/>
        {
          newUser &&<input type="text" name='name' onBlur={handleBlur}  placeholder="Your Name"/>
        }
        <br/>
        <input type="text" name="email" onBlur={handleBlur} required placeholder="Your Email Address"/>
        <br/>
        <input type="password" name="password" onBlur={handleBlur} required placeholder="Your Password" id=""/>
        <br/>
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
      </form>
      <p style={{color: 'red', fontSize: '20px'}}>{user.error}</p>
      {
        user.success && <p style={{color: 'green', fontSize: '20px'}}>User {newUser ? "Created" : "Logged In"} Successfully</p>
      }
    </div>
  );
}

export default App;

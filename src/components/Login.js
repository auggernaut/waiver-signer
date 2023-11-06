import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import firebase from 'firebase/app';
// import 'firebase/auth';

// Initialize Firebase
// const firebaseConfig = {
//   // your firebase config here
// };
// firebase.initializeApp(firebaseConfig);

function Login() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    // check if password matches a charter registered during today's date
    // if it does, log in the user anonymously with Firebase
    // await firebase.auth().signInAnonymously();
    navigate('/form');
  };

  return (
    <div>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;

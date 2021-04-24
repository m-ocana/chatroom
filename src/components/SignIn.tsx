import firebase, { auth } from "../services/firebase";

function SignIn() {
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div className="sign-in">
      <p>The Chatroom awaits...</p>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

export default SignIn;

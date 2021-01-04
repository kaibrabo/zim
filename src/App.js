import React, { useState, useRef } from "react";
import firebase from "./firebase";

// Hooks
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

// Icons
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

// CSS
import "./App.css";

// Global
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
    const [user] = useAuthState(auth);
    return (
        <div className="app">
            <header>
                <h1>Zim</h1>
                <SignOut />
            </header>
            <section>{user ? <ChatRoom /> : <SignIn />}</section>
        </div>
    );
}

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    };

    return (
        <div>
            <button onClick={signInWithGoogle}>Google login</button>
        </div>
    );
}

function SignOut() {
    return (
        auth.currentUser && (
            <button onClick={() => auth.signOut()}>logout</button>
        )
    );
}

function ChatRoom(props) {
    const messagesRef = firestore.collection("messages");
    const query = messagesRef.orderBy("createdAt").limit(25);
    const [messages] = useCollectionData(query, { idField: "id" });
    const [formValue, setFormValue] = useState("");
    const dummy = useRef();

    const sendMessage = async (e) => {
        e.preventDefault();
        const { uid, photoURL } = auth.currentUser;
        await messagesRef.add({
            name: auth.currentUser.displayName,
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
        });
        setFormValue("");

        dummy.current.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div>
            <main>
                {messages &&
                    messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                <div ref={dummy}>{}</div>
            </main>

            <form onSubmit={sendMessage}>
                <input
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="...type something"
                />
                <button type="submit">
                    <ArrowUpwardIcon />
                </button>
            </form>
        </div>
    );
}

function ChatMessage(props) {
    const { name, text, uid } = props.message;
    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
    return (
        <div className={`message ${messageClass}`}>
            <p className="user-message">{text}</p>
            <p className="username">{name}</p>
        </div>
    );
}

export default App;

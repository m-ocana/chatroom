import { useState, useRef, useEffect } from "react";
import firebase, { auth, firestore } from "../services/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

type TMessage = {
  id: string;
  uid: string;
  photoURL: string;
  text: string;
};

function ChatMessage({ message }: { message: TMessage }) {
  const { uid, photoURL, text } = message;
  const messageClass = uid === auth.currentUser?.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img alt="avatar" src={photoURL} />
      <p>{text}</p>
    </div>
  );
}

function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData<TMessage>(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const lastMsgRef = useRef<null | HTMLDivElement>(null);

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser || {};

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
  }

  useEffect(() => lastMsgRef?.current?.scrollIntoView({ behavior: "smooth" }), [
    messages,
  ]);

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={lastMsgRef}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type something here..."
        />
      </form>
    </>
  );
}

export default ChatRoom;

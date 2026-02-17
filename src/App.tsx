
import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import "./app.css";
import loveImg from "./assets/love.jpeg";
import song from "./assets/music.mp3";

export default function App() {

  /* ---------------- NAME FROM URL ---------------- */
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name") || "Beautiful";

  /* ---------------- STATES ---------------- */
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [position, setPosition] = useState({ x: 250, y: 380 });
  const [scaleYes, setScaleYes] = useState(1);
  const [typedText, setTypedText] = useState("");
  const [letter, setLetter] = useState("");
  const [noCount, setNoCount] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ---------------- INTRO LOADING ---------------- */
  useEffect(() => {
    setTimeout(() => setLoading(false), 2500);
  }, []);

  /* ---------------- TYPEWRITER INTRO ---------------- */
  const introMsg = `Hey ${name}... I have something important to ask you ❤️`;

  useEffect(() => {
    if (loading) return;
    let i = 0;
    const t = setInterval(() => {
      setTypedText(introMsg.slice(0, i));
      i++;
      if (i > introMsg.length) clearInterval(t);
    }, 50);
    return () => clearInterval(t);
  }, [loading]);

  /* ---------------- MOVE NO BUTTON ---------------- */
  const messages = [
    "Are you sure? 🥺",
    "Really sure? 😭",
    "Think again... 😢",
    "I will be sad... 💔",
    "Last chance 😣",
    "Okay okay... press Yes 😌"
  ];

  const moveNoButton = () => {
    setNoCount(prev => prev + 1);

    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - 70;

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    setPosition({ x: newX, y: newY });
    setScaleYes(prev => prev + 0.18);
  };

  /* ---------------- WHEN YES CLICKED ---------------- */
  useEffect(() => {
    if (!accepted) return;

    // vibration
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }

    // play music safely
    if (audioRef.current) {
      audioRef.current.play().catch(() => { });
    }

    // fireworks confetti
    const duration = 7000;
    const end = Date.now() + duration;

    const firework = () => {
      confetti({
        particleCount: 12,
        spread: 100,
        startVelocity: 40,
        origin: { x: Math.random(), y: Math.random() * 0.6 }
      });

      if (Date.now() < end) requestAnimationFrame(firework);
    };
    firework();

    // typing love letter
    const finalMsg = `I liked you for a long time ${name}...
You make my normal days special.
So today I just wanted to ask...

Will you be mine forever ? ❤️`;

    let i = 0;
    const t = setInterval(() => {
      setLetter(finalMsg.slice(0, i));
      i++;
      if (i > finalMsg.length) clearInterval(t);
    }, 45);

    return () => clearInterval(t);
  }, [accepted, name]);

  /* ---------------- WHATSAPP SHARE ---------------- */
  const share = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=I have a surprise for you ❤️ ${url}`);
  };

  /* ---------------- LOADING SCREEN ---------------- */
  if (loading) {
    return (
      <div className="loading">
        Preparing something special for you 💫
      </div>
    );
  }

  /* ---------------- FINAL SCREEN ---------------- */
  if (accepted) {
    return (
      <div className="surprise">
        <audio ref={audioRef} src={song} loop preload="auto" />

        <h1 className="bigText">YOU SAID YES 💖</h1>

        <div className="card">
          <img src={loveImg} alt="love" />
          <p className="letter">{letter}</p>

          <button className="shareBtn" onClick={share}>
            Share the Happiness 💌
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- QUESTION SCREEN ---------------- */
  return (
    <div className="container">
      <div className="stars"></div>
      <div className="hearts"></div>

      <h2 className="typing">{typedText}</h2>
      <h1 className="title">Kusum, Will you be my Valentine, {name}? 💘</h1>

      <p className="tease">
        {messages[Math.min(noCount, messages.length - 1)]}
      </p>

      <div className="btnArea">
        <button
          className="yesBtn"
          style={{ transform: `scale(${scaleYes})` }}
          onClick={() => setAccepted(true)}
        >
          Yes ❤️
        </button>

        <button
          className="noBtn"
          style={{ left: position.x, top: position.y, position: "absolute" }}
          onMouseEnter={moveNoButton}
          onTouchStart={moveNoButton}
          onClick={moveNoButton}
        >
          No 💔
        </button>
      </div>
    </div>
  );
}


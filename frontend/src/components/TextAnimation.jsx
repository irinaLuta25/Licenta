import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TextAnimation = ({ text, className = "", onComplete }) => {
  const words = text.split(" ");

  const totalLetters = text.replace(/ /g, "").length;
  const [visibleLetterCount, setVisibleLetterCount] = useState(0);

  useEffect(() => {
    if (visibleLetterCount >= totalLetters) {
      if (onComplete) onComplete();
      return;
    }

    const timeout = setTimeout(() => {
      setVisibleLetterCount((prev) => prev + 1);
    }, 35);

    return () => clearTimeout(timeout);
  }, [visibleLetterCount, totalLetters, onComplete]);

  let globalLetterIndex = 0;

  return (
    <h1 className={`${className} whitespace-pre-wrap break-words`}>
      {words.map((word, wordIndex) => {
  const letters = word.split("");

  return (
    <span key={wordIndex} className="inline-block">
      {letters.map((letter, letterIndex) => {
        const index = globalLetterIndex++;
        return (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={index < visibleLetterCount ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            {letter}
          </motion.span>
        );
      })}
      {wordIndex < words.length - 1 && <span>{"\u00A0"}</span>}
    </span>
  );
})}

    </h1>
  );
};

export default TextAnimation;

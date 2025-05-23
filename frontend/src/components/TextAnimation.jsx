import { motion } from "framer-motion";


const TextAnimation = ({ text, className = "" }) => {
  // Spargem în cuvinte, apoi litere
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const wordAnimation = {
    hidden: { opacity: 0, y: "0.25em" },
    visible: {
      opacity: 1,
      y: "0em",
      transition: {
        duration: 0.5,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  return (
    <motion.h1
      className={`${className} leading-snug break-words whitespace-pre-wrap`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          variants={wordAnimation}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
};


export default TextAnimation;
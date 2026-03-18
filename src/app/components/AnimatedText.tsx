import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

// Staggered text animation - Characters appear one by one
export function StaggeredText({ children, className, style, delay = 0 }: AnimatedTextProps) {
  const text = String(children);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.div
      style={{ display: "inline-block", ...style }}
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {text.split("").map((char, index) => (
        <motion.span variants={child} key={index} style={{ display: "inline-block" }}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Fade in from bottom
export function FadeInUp({ children, className, style, delay = 0 }: AnimatedTextProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Float animation - gentle up and down
export function FloatingBox({ children, className, style }: AnimatedTextProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ y: 0 }}
      animate={{
        y: [0, -6, 0],
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      }}
    >
      {children}
    </motion.div>
  );
}

// Scale on hover
export function ScaleOnHover({ children, className, style }: AnimatedTextProps) {
  return (
    <motion.div
      className={className}
      style={style}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
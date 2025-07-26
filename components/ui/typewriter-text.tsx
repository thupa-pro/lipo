"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
  infinite?: boolean;
  startDelay?: number;
  cursor?: boolean;
  cursorClassName?: string;
  onComplete?: () => void;
}

export function TypewriterText({
  texts,
  className,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
  infinite = false,
  startDelay = 0,
  cursor = true,
  cursorClassName,
  onComplete,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (startDelay > 0 && !hasStarted) {
      const timer = setTimeout(() => {
        setHasStarted(true);
      }, startDelay);
      return () => clearTimeout(timer);
    } else {
      setHasStarted(true);
    }
  }, [startDelay, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const currentText = texts[currentIndex];
    
    if (isWaiting) {
      const timer = setTimeout(() => {
        setIsWaiting(false);
        if (infinite) {
          setIsDeleting(true);
        }
      }, pauseTime);
      return () => clearTimeout(timer);
    }

    if (isDeleting) {
      if (displayText.length > 0) {
        const timer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deleteSpeed);
        return () => clearTimeout(timer);
      } else {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      }
    } else {
      if (displayText.length < currentText.length) {
        const timer = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, speed);
        return () => clearTimeout(timer);
      } else {
        if (infinite || currentIndex < texts.length - 1) {
          setIsWaiting(true);
        } else {
          // Final text reached - hide cursor after a delay
          setTimeout(() => setShowCursor(false), 1000);
          onComplete?.();
        }
      }
    }
  }, [
    displayText,
    currentIndex,
    isDeleting,
    isWaiting,
    hasStarted,
    texts,
    speed,
    deleteSpeed,
    pauseTime,
    infinite,
    onComplete,
  ]);

  // Cursor blinking effect
  useEffect(() => {
    if (!cursor || !showCursor) return;
    
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    
    return () => clearInterval(interval);
  }, [cursor, showCursor]);

  return (
    <span className={cn("relative", className)}>
      {displayText}
      {cursor && (
        <span
          className={cn(
            "inline-block w-0.5 h-[1em] ml-1 transition-opacity duration-100",
            showCursor ? "opacity-100" : "opacity-0",
            cursorClassName || "bg-current"
          )}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

interface PremiumTypewriterProps {
  className?: string;
  startDelay?: number;
}

export function PremiumTypewriter({ className, startDelay = 500 }: PremiumTypewriterProps) {
  const [phase, setPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showSecondLine, setShowSecondLine] = useState(false);

  const phases = [
    {
      texts: ["Premium Local Services"],
      className: "text-ai-gradient drop-shadow-lg",
      speed: 85,
      pauseTime: 600,
    },
    {
      texts: ["At Your Fingertips"],
      className: "text-foreground drop-shadow-md",
      speed: 90,
      pauseTime: 1500,
    },
  ];

  const handlePhaseComplete = () => {
    if (phase < phases.length - 1) {
      setTimeout(() => {
        setPhase(phase + 1);
        if (phase === 0) {
          setShowSecondLine(true);
        }
      }, 400);
    } else {
      setIsComplete(true);
    }
  };

  return (
    <div className={cn("space-y-1 lg:space-y-2", className)}>
      {phases.map((phaseConfig, index) => (
        <div
          key={index}
          className={cn(
            "block transition-all duration-700 ease-out",
            index === 1 && !showSecondLine && "opacity-0 transform translate-y-4"
          )}
        >
          {index <= phase && (
            <TypewriterText
              texts={phaseConfig.texts}
              className={cn(
                "text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-tight",
                "transition-all duration-300 ease-out hover:scale-[1.02] hover:drop-shadow-xl",
                phaseConfig.className
              )}
              speed={phaseConfig.speed}
              pauseTime={phaseConfig.pauseTime}
              startDelay={index === 0 ? startDelay : 0}
              infinite={false}
              onComplete={index === phase ? handlePhaseComplete : undefined}
              cursorClassName={cn(
                "typewriter-cursor-gradient w-1 lg:w-1.5 animate-pulse shadow-lg",
                index === 1 && "bg-gradient-to-b from-foreground via-primary to-ai"
              )}
            />
          )}
        </div>
      ))}

      {/* Subtle particle effect when complete */}
      {isComplete && (
        <div className="absolute -inset-4 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-1 h-1 bg-ai rounded-full animate-ping opacity-70" style={{ animationDelay: "0s" }} />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-primary rounded-full animate-ping opacity-60" style={{ animationDelay: "0.5s" }} />
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-trust-primary rounded-full animate-ping opacity-50" style={{ animationDelay: "1s" }} />
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';

// กำหนด interface สำหรับ letter
interface Letter {
  char: string;
  rotation: number;
  transform: string;
}

const CircularText = ({ 
  text = "HELLO WORLD - HELLO WORLD - ", 
  radius = 100,
  duration = 10,
  direction = 'clockwise',
  centerCircleSize = 40 // ขนาดของวงกลมตรงกลาง
}) => {
  // กำหนด type ให้กับ state
  const [letters, setLetters] = useState<Letter[]>([]);

  useEffect(() => {
    const characters = text.split('');
    const degrees = 360 / characters.length;

    const newLetters = characters.map((char, i) => {
      const rotation = degrees * i;
      return {
        char,
        rotation,
        transform: `rotate(${rotation}deg) translate(${radius}px) rotate(-${rotation}deg)`
      };
    });

    setLetters(newLetters);
  }, [text, radius]);

  return (
    <div className="relative w-64 h-64">
      {/* วงกลมตรงกลาง */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
        style={{
          width: `${centerCircleSize}px`,
          height: `${centerCircleSize}px`,
          zIndex: 10
        }}
      />

      {/* Container with animation */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          animation: `spin${direction === 'clockwise' ? '' : 'Reverse'} ${duration}s linear infinite`
        }}
      >
        {/* Rotating text */}
        {letters.map((letter, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold"
            style={{
              transform: letter.transform,
            }}
          >
            {letter.char}
          </span>
        ))}
      </div>

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes spinReverse {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CircularText;
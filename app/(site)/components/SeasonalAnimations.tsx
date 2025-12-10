"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SeasonalAnimations = () => {
  const [season, setSeason] = useState<"christmas" | "newYear" | null>(null);

  useEffect(() => {
    const checkSeason = () => {
      const today = new Date();
      const month = today.getMonth(); // 0-indexed (0 is Jan, 11 is Dec)

      // Christmas: December (Month 11)
      if (month === 11) {
        setSeason("christmas");
        return;
      }

      // Sinhala/Tamil New Year: April (Month 3)
      if (month === 3) {
        setSeason("newYear");
        return;
      }

      setSeason(null);
    };

    checkSeason();
  }, []);

  if (!season) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {season === "christmas" && <SnowAnimation />}
      {season === "newYear" && <FireworksAnimation />}
    </div>
  );
};

const SnowAnimation = () => {
  // Generate random snowflakes
  const snowflakes = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: Math.random() * 5 + 5, // 5-10s
    delay: Math.random() * 5,
    size: Math.random() * 10 + 5, // 5-15px
  }));

  return (
    <>
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute bg-white rounded-full opacity-80"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            top: -20,
          }}
          animate={{
            y: ["0vh", "100vh"],
            x: [0, Math.random() * 20 - 10], // slight horizontal drift
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear",
          }}
        />
      ))}
    </>
  );
};

// Basic Canvas-based Firework implementation
const FireworksAnimation = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 3 + 2;
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity;
        this.alpha = 1;
        this.color = color;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05; // gravity
        this.alpha -= 0.01;
      }
    }

    const colors = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#00ffff",
      "#ff00ff",
    ];

    const createFirework = () => {
      // Random position in the top half of the screen
      const x = Math.random() * canvas.width;
      const y = Math.random() * (canvas.height / 2);
      const color = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < 50; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Trails effect (but problematic with overlay transparency)
      // Since we want transparency, we must use clearRect but trails are tricky.
      // For global overlay, we usually want clear rect.
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Randomly spawn fireworks
      if (Math.random() < 0.03) {
        createFirework();
      }

      particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default SeasonalAnimations;

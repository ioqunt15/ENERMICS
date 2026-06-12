import React, { useEffect, useRef, useState } from 'react';

// Wind turbines spatial layout on the vector map
const TURBINE_POSITIONS = [
  { name: '5호기', x: 80, y: 120, index: 0 },
  { name: '6호기', x: 140, y: 190, index: 1 },
  { name: '7호기', x: 190, y: 100, index: 2 },
  { name: '8호기', x: 230, y: 220, index: 3 },
  { name: '9호기', x: 290, y: 140, index: 4 },
  { name: '10호기', x: 330, y: 240, index: 5 }
];

export default function AnimatedWindStreamlines({ scenario, turbineData = [] }) {
  const canvasRef = useRef(null);
  const [frame, setFrame] = useState(0);
  const particlesRef = useRef([]);

  // Initialize particles once
  useEffect(() => {
    const particles = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 380,
        y: Math.random() * 320,
        length: 15 + Math.random() * 25,
        speedFactor: 0.5 + Math.random() * 1.0,
        opacity: 0.15 + Math.random() * 0.45
      });
    }
    particlesRef.current = particles;
  }, []);

  // Update animation loop
  useEffect(() => {
    let animationId;
    const update = () => {
      setFrame(prev => prev + 1);
      animationId = requestAnimationFrame(update);
    };
    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Get current wind parameters
    let baseSpeed = 4.0;
    let windAngle = Math.PI * 0.25; // Flowing Southeast (from NW)
    let particleColor = 'rgba(16, 185, 129, '; // Emerald default
    let isWarning = false;

    switch (scenario) {
      case 'storm':
        baseSpeed = 16.0;
        windAngle = Math.PI * 0.65; // Flowing SSW (from NNE)
        particleColor = 'rgba(255, 77, 77, '; // Red warning
        isWarning = true;
        break;
      case 'cloudy':
        baseSpeed = 8.5;
        windAngle = Math.PI * 0.20;
        particleColor = 'rgba(0, 240, 255, '; // Cyan
        break;
      case 'heatwave':
        baseSpeed = 1.2;
        windAngle = Math.PI * 0.35;
        particleColor = 'rgba(239, 68, 68, '; // Dark Red/Calm Orange
        break;
      case 'sunny':
      default:
        baseSpeed = 4.5;
        windAngle = Math.PI * 0.25;
        particleColor = 'rgba(16, 185, 129, '; // Emerald
        break;
    }

    // Clear background
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw vector background arrows (static indicator grid)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 20; x < width; x += 60) {
      for (let y = 20; y < height; y += 60) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(windAngle);
        
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(6, 0);
        ctx.lineTo(2, -3);
        ctx.moveTo(6, 0);
        ctx.lineTo(2, 3);
        ctx.stroke();
        
        ctx.restore();
      }
    }

    // Update and draw flowing streamlines particles
    particlesRef.current.forEach(p => {
      // Calculate speeds
      const vx = Math.cos(windAngle) * baseSpeed * p.speedFactor;
      const vy = Math.sin(windAngle) * baseSpeed * p.speedFactor;
      
      // Move particle
      p.x += vx;
      p.y += vy;

      // Wrap boundaries
      if (p.x < -40) p.x = width + 40;
      if (p.x > width + 40) p.x = -40;
      if (p.y < -40) p.y = height + 40;
      if (p.y > height + 40) p.y = -40;

      // Draw particle line
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - Math.cos(windAngle) * p.length, p.y - Math.sin(windAngle) * p.length);
      
      // Speed makes streamlines brighter
      const speedAlpha = Math.min(1.0, (baseSpeed / 12) * 0.4);
      ctx.strokeStyle = `${particleColor}${p.opacity + speedAlpha})`;
      ctx.lineWidth = isWarning ? 1.5 : 1;
      ctx.stroke();
    });

    // Draw Wind Turbines
    TURBINE_POSITIONS.forEach(pos => {
      // Find turbine generation data to set rotation speed
      const turbData = turbineData.find(t => t.id === pos.name) || { generation: 0, windSpeed: 0 };
      const turbineActive = turbData.generation > 0;
      
      // Calculate blade angle based on frame and power output
      // If generation is 0 (cut-out/calm), it stops spinning
      const rotationSpeed = turbineActive ? (turbData.generation / 2000) * 0.25 + 0.03 : 0;
      const bladeAngle = (frame * rotationSpeed) % (Math.PI * 2);

      // Draw Mast (vertical tower)
      ctx.strokeStyle = 'rgba(200, 210, 230, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x, pos.y + 40);
      ctx.stroke();
      
      // Base pedestal
      ctx.fillStyle = 'rgba(200, 210, 230, 0.6)';
      ctx.beginPath();
      ctx.moveTo(pos.x - 4, pos.y + 40);
      ctx.lineTo(pos.x + 4, pos.y + 40);
      ctx.lineTo(pos.x + 2, pos.y + 36);
      ctx.lineTo(pos.x - 2, pos.y + 36);
      ctx.closePath();
      ctx.fill();

      // Draw Blades (3 blades)
      ctx.strokeStyle = turbineActive ? '#ffffff' : 'rgba(150, 160, 180, 0.5)';
      ctx.lineWidth = 1.8;
      
      for (let b = 0; b < 3; b++) {
        const angle = bladeAngle + (b * Math.PI * 2 / 3);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + Math.cos(angle) * 16, pos.y + Math.sin(angle) * 16);
        ctx.stroke();
      }

      // Draw Hub Center
      ctx.fillStyle = turbineActive ? (isWarning ? '#ff4d4d' : '#10b981') : '#6b7280';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 3.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Draw Name Text Badge
      ctx.fillStyle = '#9ca3af';
      ctx.font = '8px monospace';
      ctx.fillText(pos.name, pos.x - 12, pos.y + 52);
      
      // Draw KW Label under turbine
      ctx.fillStyle = turbineActive ? '#ffffff' : '#4b5563';
      ctx.fillText(`${turbData.generation} kW`, pos.x - 18, pos.y - 8);
    });

    // Alert indicators
    if (isWarning) {
      ctx.fillStyle = 'rgba(255, 77, 77, 0.15)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#ff4d4d';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('⚠️ HIGH WIND CUT-OUT SAFEGUARD ENGAGED', 12, 18);
    } else {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
      ctx.font = '9px monospace';
      ctx.fillText('WIND VECTOR STREAMLINES ACTIVE', 12, 18);
    }

  }, [frame, scenario, turbineData]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        width={380}
        height={320}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          borderRadius: '8px'
        }}
      />
    </div>
  );
}

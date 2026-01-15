import { useEffect, useRef, useCallback, useState } from "react";

type WaveBackgroundProps = {
  className?: string;
  /** Maximum wave amplitude in pixels (default: 30) */
  maxAmplitude?: number;
  /** Base amplitude when mouse is away (default: 8) */
  baseAmplitude?: number;
  /** Wave animation speed - lower is slower (default: 0.001) */
  waveSpeed?: number;
  /** Number of wave peaks across the width (default: 2) */
  waveFrequency?: number;
  /** Radius of mouse influence in pixels (default: 300) */
  mouseInfluenceRadius?: number;
  /** Offset to move wave up from bottom edge (default: 50) */
  waveOffset?: number;
};

export const WaveBackground: React.FC<WaveBackgroundProps> = ({
  className = "",
  maxAmplitude = 30,
  baseAmplitude = 8,
  waveSpeed = 0.001,
  waveFrequency = 2,
  mouseInfluenceRadius = 300,
  waveOffset = 50,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const animationRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Mouse tracking with smooth interpolation
  const targetMouseXRef = useRef<number | null>(null); // Raw mouse position
  const smoothMouseXRef = useRef<number>(0); // Interpolated position
  const mouseInfluenceRef = useRef<number>(0); // 0 = no influence, 1 = full influence

  // Track mouse position globally (window level for reliable capture)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Check if mouse is within the container bounds
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        targetMouseXRef.current = e.clientX - rect.left;
      } else {
        targetMouseXRef.current = null;
      }
    }
  }, []);

  // Calculate amplitude based on distance from smoothed mouse position
  const getAmplitudeAtX = useCallback(
    (x: number): number => {
      // Use mouseInfluence to blend between base and max amplitude
      if (mouseInfluenceRef.current <= 0.01) {
        return baseAmplitude;
      }

      const distance = Math.abs(x - smoothMouseXRef.current);
      const normalizedDistance = Math.min(distance / mouseInfluenceRadius, 1);

      // Smooth Gaussian-like falloff for organic curve
      const influence = Math.exp(-normalizedDistance * normalizedDistance * 3);
      const targetAmplitude = baseAmplitude + (maxAmplitude - baseAmplitude) * influence;
      
      // Blend based on how much mouse influence we have
      return baseAmplitude + (targetAmplitude - baseAmplitude) * mouseInfluenceRef.current;
    },
    [baseAmplitude, maxAmplitude, mouseInfluenceRadius]
  );

  // Generate wave path - draws from bottom-left, up along wave, to bottom-right
  const generateWavePath = useCallback(
    (time: number, width: number, height: number): string => {
      const segments = 100;
      const segmentWidth = width / segments;

      // Start at bottom-left corner (below visible area to ensure full coverage)
      let path = `M 0 ${height + 10}`;

      // Draw the wave line along the bottom edge
      for (let i = 0; i <= segments; i++) {
        const x = i * segmentWidth;
        const amplitude = getAmplitudeAtX(x);

        // Create flowing wave with time-based offset
        const basePhase = (x / width) * Math.PI * 2 * waveFrequency;
        const timeOffset = time * waveSpeed;

        // Add secondary wave for more organic motion
        const primaryWave = Math.sin(basePhase + timeOffset);
        const secondaryWave = Math.sin(basePhase * 1.5 + timeOffset * 0.7) * 0.3;

        // Wave position: offset from bottom, amplitude modulated by wave
        const waveY = height - waveOffset - amplitude * (1 + primaryWave + secondaryWave) * 0.5;

        path += ` L ${x} ${waveY}`;
      }

      // Close path: right edge down, across bottom, back to start
      path += ` L ${width} ${height + 10} Z`;

      return path;
    },
    [getAmplitudeAtX, waveFrequency, waveSpeed, waveOffset]
  );

  // Animation loop with smooth interpolation
  useEffect(() => {
    const lerpSpeed = 0.08; // How fast to interpolate (0-1, lower = smoother)
    const influenceFadeSpeed = 0.05; // How fast influence fades in/out

    const animate = (time: number) => {
      // Smoothly interpolate mouse influence
      if (targetMouseXRef.current !== null) {
        // Mouse is in container - fade in influence and lerp position
        mouseInfluenceRef.current += (1 - mouseInfluenceRef.current) * influenceFadeSpeed;
        smoothMouseXRef.current += (targetMouseXRef.current - smoothMouseXRef.current) * lerpSpeed;
      } else {
        // Mouse left container - fade out influence
        mouseInfluenceRef.current += (0 - mouseInfluenceRef.current) * influenceFadeSpeed;
      }

      if (pathRef.current && dimensions.width > 0) {
        const path = generateWavePath(time, dimensions.width, dimensions.height);
        pathRef.current.setAttribute("d", path);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions, generateWavePath]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Add mouse listener at window level for reliable capture
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <>
      {/* Background layer: gradient + texture - BEHIND everything including boids */}
      <div
        ref={containerRef}
        className={`absolute inset-0 h-[95dvh] min-h-[95dvh] select-none pointer-events-none ${className}`}
        style={{ zIndex: -20 }}
      >
        {/* Gradient background layer */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.2,
            background: "linear-gradient(to top left, rgb(var(--bg-vfx1)), rgb(var(--bg-vfx2)))",
          }}
        />

        {/* Texture overlay - very subtle paper texture */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.08,
            backgroundImage: 'url("./static-background-texture.jpg")',
            backgroundRepeat: "repeat",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            mixBlendMode: "overlay",
          }}
        />
      </div>

      {/* Wave SVG - in front of gradient/texture, behind boids */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-[95dvh] pointer-events-none"
        preserveAspectRatio="none"
        style={{ overflow: "visible", zIndex: -15 }}
      >
        {/* Wave shape filled with page background color */}
        <path
          ref={pathRef}
          fill="rgb(var(--background))"
        />
      </svg>
    </>
  );
};

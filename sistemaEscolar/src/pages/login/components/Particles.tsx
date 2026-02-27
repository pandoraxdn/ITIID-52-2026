import {Particle} from "../hooks/useLoginPage";

interface Props {
  arrParticles: Particle[];
}

export const Particles = ({arrParticles}: Props) => {
  {/* Particles */}
  return (
    <div className="particles-container" aria-hidden="true">
      {arrParticles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// ARCHIVO: ParticlesBackground.tsx
// PROPÓSITO: Crea un fondo animado de partículas brillantes que se mueven
//            hacia arriba y parpadean suavemente. Es un componente decorativo
//            que se coloca en la parte posterior de la pantalla (z-index bajo)
//            y no interfiere con la interacción del usuario.
// ============================================

import {useEffect, useRef} from "react";

// ============================================
// DEFINICIÓN DEL TIPO Particle
// ============================================
// Describe la estructura de cada partícula individual en el sistema.
// 
// Propiedades:
// - x, y: posición actual en el canvas (en píxeles).
// - size: tamaño base de la partícula (radio en píxeles).
// - speedX, speedY: velocidad de movimiento en los ejes X e Y (píxeles por fotograma).
// - opacity: opacidad base (entre 0 y 1).
// - pulse: valor actual del efecto de pulsación (ángulo en radianes).
// - pulseSpeed: velocidad de cambio de pulsación.
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

// ============================================
// COMPONENTE ParticlesBackground
// ============================================
// Este componente no recibe props. Se encarga de crear y animar partículas
// en un canvas que ocupa toda la pantalla.
export const ParticlesBackground = () => {
  // useRef nos permite obtener una referencia al elemento <canvas> del DOM
  // para poder dibujar sobre él.
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // useEffect se ejecuta una vez cuando el componente se monta ([] como dependencias)
  // y se encarga de toda la configuración del canvas y la animación.
  useEffect(() => {
    // Obtenemos el elemento canvas y su contexto 2D
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Variable para guardar el ID de la animación (para poder cancelarla al desmontar)
    let animationId: number;

    // Arreglo donde almacenaremos todas las partículas
    const particles: Particle[] = [];

    // Cantidad de partículas que queremos dibujar
    const PARTICLE_COUNT = 200;

    // ============================================
    // FUNCIÓN resize
    // ============================================
    // Ajusta el tamaño del canvas al tamaño actual de la ventana del navegador.
    // Esto asegura que las partículas cubran toda la pantalla incluso si se
    // redimensiona la ventana.
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize(); // Llamada inicial para establecer el tamaño
    window.addEventListener("resize", resize); // Escuchar cambios de tamaño

    // ============================================
    // CREACIÓN DE PARTÍCULAS INICIALES
    // ============================================
    // Generamos PARTICLE_COUNT partículas con valores aleatorios para
    // posición, velocidad, tamaño, etc.
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 3,          // Tamaño entre 3 y 6 píxeles
        speedX: (Math.random() - 0.5) * 0.4,  // Velocidad horizontal pequeña
        speedY: -Math.random() * 0.3 - 0.1,   // Velocidad vertical hacia arriba (negativa)
        opacity: Math.random() * 0.9,         // Opacidad base entre 0 y 0.9
        pulse: Math.random() * Math.PI * 2,    // Ángulo inicial aleatorio
        pulseSpeed: Math.random() * 0.02 + 0.01, // Velocidad de pulsación
      });
    }

    // ============================================
    // FUNCIÓN animate
    // ============================================
    // Es el corazón de la animación. Se ejecuta en cada fotograma y:
    // 1. Limpia el canvas.
    // 2. Actualiza la posición y el pulso de cada partícula.
    // 3. Las dibuja con un efecto de brillo.
    // 4. Solicita el siguiente fotograma.
    const animate = () => {
      // Borra todo el contenido del canvas para redibujar desde cero
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Recorremos todas las partículas
      for (const p of particles) {
        // Actualizar posición según velocidad
        p.x += p.speedX;
        p.y += p.speedY;

        // Actualizar el pulso (ángulo) para el efecto de parpadeo
        p.pulse += p.pulseSpeed;

        // ============================================
        // REAPARICIÓN (WRAP-AROUND)
        // ============================================
        // Cuando una partícula sale de la pantalla, la recolocamos
        // en el lado opuesto para que parezca que hay infinitas partículas.
        // Si sale por arriba (y < -10), reaparece abajo.
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width; // Posición X aleatoria al reaparecer
        }
        // Si sale por la izquierda o derecha, reaparece en el lado contrario.
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        // ============================================
        // CÁLCULO DE OPACIDAD DINÁMICA (PULSO)
        // ============================================
        // Hacemos que la opacidad varíe suavemente usando la función seno.
        // El valor oscila entre 0.6 y 1.0 de la opacidad base.
        const glowOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        // ============================================
        // DIBUJADO DE LA PARTÍCULA (con efecto de brillo)
        // ============================================
        // Primero dibujamos un "glow" (resplandor) alrededor de la partícula
        // usando un gradiente radial que va desde el centro hacia afuera,
        // desde color dorado semitransparente hasta completamente transparente.
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `rgba(184, 150, 12, ${glowOpacity * 0.4})`);
        gradient.addColorStop(1, "rgba(184, 150, 12, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Luego dibujamos el núcleo (core) de la partícula, más brillante y sólido.
        ctx.fillStyle = `rgba(220, 190, 60, ${glowOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Solicitamos al navegador que ejecute la función animate en el próximo fotograma
      animationId = requestAnimationFrame(animate);
    };

    // Iniciamos la animación
    animate();

    // ============================================
    // LIMPIEZA (CUANDO EL COMPONENTE SE DESMONTA)
    // ============================================
    // Esta función se ejecuta cuando el componente desaparece de la pantalla.
    // Cancelamos la animación y removemos el event listener para evitar fugas de memoria.
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []); // El array vacío significa que este efecto solo se ejecuta una vez al montar.

  // ============================================
  // RENDERIZADO
  // ============================================
  // Devolvemos un elemento <canvas> con una referencia y estilos para que
  // ocupe toda la pantalla (fixed inset-0), no reciba eventos del mouse
  // (pointer-events-none) y esté detrás del contenido (z-0).
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{opacity: 0.7}}
    />
  );
};

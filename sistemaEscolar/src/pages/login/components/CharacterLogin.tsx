import characterImg from "@/assets/pandora.png";
export const CharacterLogin = () => {
  return (
    <section className="character-panel" aria-hidden="true">
      <div className="character-scene">
        {/* Aura rings */}
        <div className="aura aura-1" />
        <div className="aura aura-2" />
        <div className="aura aura-3" />
        {/* Glow blob behind character */}
        <div className="character-glow" />
        {/* Character image */}
        <img
          src={characterImg}
          alt="Personaje misterioso"
          className="character-img"
          draggable={false}
        />
      </div>
    </section>
  );
}

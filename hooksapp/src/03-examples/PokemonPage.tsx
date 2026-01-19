import { useCounter } from "../hooks/useCounter";

export const PokemonPage = () => {

  const { counter, increment, decrement } = useCounter();

  return (
    <div
      className="
        bg-gradient
        flex
        flex-col
        items-center
      "
    >
      <h1
        className="
          text-2xl
          font-thin
          text-white
        "
      >
        Pokemon
      </h1>
      <img
        src={ `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${counter}.svg` }
        alt="Bulbasor"
      />
      <div
        className="flex gap-2 "
      >
        <button
          className="bg-violet-500 text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={ decrement }
        >
          Anterior
        </button>
        <button
          className="bg-violet-500 text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={ increment }
        >
          Posterior
        </button>
      </div>
    </div>
  );
};

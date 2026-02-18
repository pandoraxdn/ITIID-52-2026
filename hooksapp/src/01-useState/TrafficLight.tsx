import {useState} from "react";

export const TrafficLight = () => {
  const colors = {
    red: "bg-red-500 animate-pulse",
    yellow: "bg-yellow-500 animate-pulse",
    green: "bg-green-500 animate-pulse",
  }

  //type TrafficLight = "red" | "yellow" | "green";
  type TrafficLight = keyof typeof colors;

  const [ light, setLight ] = useState<TrafficLight>("red");

  const handleClick = ( color: TrafficLight ) => setLight( color );

  return (
    <div
      className="
        min-h-screen
        bg-grandient-to-br
        from-slate-900
        via-gray-900
        to-slate-800
        flex
        items-center
        justify-center
        p-4
      "
    >
      <div
        className="
          flex
          flex-col
          items-center
          space-y-8
        "
      >
        <div
        className={`
          w-32 h-32 ${ (light === "red") ? colors["red"] : "bg-gray-500" } rounded-full
          `}
        />
        <div
        className={`
            w-32 h-32 ${ (light === "yellow") ? colors["yellow"] : "bg-gray-500" } rounded-full
          `}
        />
        <div
        className={`
            w-32 h-32 ${ (light === "green") ? colors["green"] : "bg-gray-500" } rounded-full
          `}
        />
        <div
          className="
            flex
            gap-2
          "
        >
          <button
            className="
              bg-red-500     
              text-white
              px-4
              py-2
              rounded-md
              cursor-pointer
              "
              onClick={ () => handleClick("red") }
          >
            Rojo
          </button>
          <button
            className="
              bg-yellow-500     
              text-white
              px-4
              py-2
              rounded-md
              cursor-pointer
              "
              onClick={ () => handleClick("yellow") }
          >
            Amarillo
          </button>
          <button
            className="
              bg-green-500     
              text-white
              px-4
              py-2
              rounded-md
              cursor-pointer
              "
              onClick={ () => handleClick("green") }
          >
            Verde
          </button>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";

export const TrafficLightEffect = () => {

  const colors = {
    red: "bg-red-500 animate-pulse",
    yellow: "bg-yellow-500 animate-pulse",
    green: "bg-green-500 animate-pulse",
  }

  //type TrafficLight = "red" | "yellow" | "green";
  type TrafficLight = keyof typeof colors;

  const [ light, setLight ] = useState<TrafficLight>("red");

  const handleClick = ( color: TrafficLight ) => setLight( color );

  const [ countDown, setCountDown ] = useState<number>(5);
  const [ date, setDate ] = useState<Date>( new Date );

  useEffect( () => {

    if ( countDown === 0 ) return;

    const intervalId = setInterval( () => {
      setCountDown( prev => prev -1 );
      setDate( new Date );
      //console.log(countDown);
    },1000); 

    return () => {
      clearInterval( intervalId )
    }

  },[ countDown ]);

  useEffect( () => {
    if ( countDown > 0 ) return;
    setCountDown( 5 );
    if( light == "red" ){
      setLight("green");
      return;
    }
    if( light == "yellow" ){
      setLight("red");
      return;
    }
    if( light == "green" ){
      setLight("yellow");
      return;
    }
  },[ countDown, light ]);

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
        <h1
          style={{
            fontSize: 30,
            color: "white"
          }}
        >
          { date.toLocaleTimeString() }
        </h1>
        <h2
          style={{
            fontSize: 25,
            color: "white"
          }}
        >
          CountDown: { countDown }
        </h2>
        <div
          className="
            w-64
            bg-gray-700
            rounded-full
            h-2
          "
        >
          <div
            style={{
              width: `${(countDown / 5) *100}%`
            }}
            className="
              bg-blue-500
              h-2
              rounded-full
              transition-all
              duration-1000
              ease-linear
            "
          />
        </div>
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

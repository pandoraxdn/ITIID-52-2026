import { type  ReactNode } from "react";

export const Container = ( { children }: { children: ReactNode }  ) => {
  return (
    <div
        className="
            bg-pink-100
            flex
            justify-center
            items-center
            h-screen
        "
    >
        <div
            className="
                bg-white
                p-6
                rounded-lg
                shadow
            "
        >
                { children }
        </div>
    </div>
  );
};

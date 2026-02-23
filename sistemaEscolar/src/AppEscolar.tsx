import {RouterProvider} from "react-router-dom";
import {appRouter} from "./router/app.router";

export const AppEscolar = () => {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

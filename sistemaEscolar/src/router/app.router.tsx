import React from "react";
import {createBrowserRouter, Navigate} from "react-router-dom";
import {HomePage} from "../pages/home/HomePage";
import {LoginPage} from "@/pages/login/LoginPage";

import {DashboardRootLayout} from "@/pages/dashboard/components/DashboardRootLayout";
import {DashboardPage} from "@/pages/dashboard/DashboardPage";
import {DashboardIndex} from "@/pages/dashboard/sections/DashboardIndex";
import {Profesores} from "@/pages/dashboard/sections/Profesores";
import {Empleados} from "@/pages/dashboard/sections/Empleados";
import {Alumnos} from "@/pages/dashboard/sections/Alumnos";
import {Roles} from "@/pages/dashboard/sections/Roles";
import {Usuarios} from "@/pages/dashboard/sections/Usuarios";
import {Tutores} from "@/pages/dashboard/sections/Tutores";
import {NotFound} from "@/pages/dashboard/sections/NotFound";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardRootLayout />,
    children: [
      {
        element: <DashboardPage />,
        children: [
          {index: true, element: <DashboardIndex />},
          {path: "profesores", element: <Profesores />},
          {path: "empleados", element: <Empleados />},
          {path: "alumnos", element: <Alumnos />},
          {path: "roles", element: <Roles />},
          {path: "tutores", element: <Tutores />},
          {path: "usuarios", element: <Usuarios />},
          {path: "*", element: <NotFound />},
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

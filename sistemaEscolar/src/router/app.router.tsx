import React from "react";
import {createBrowserRouter, Navigate} from "react-router-dom";
import {HomePage} from "../pages/home/HomePage";
import {LoginPage} from "@/pages/login/LoginPage";

import {DashboardRootLayout} from "@/pages/dashboard/components/DashboardRootLayout";
import {DashboardPage} from "@/pages/dashboard/DashboardPage";
import {DashboardIndex} from "@/pages/dashboard/sections/DashboardIndex";
import {Students} from "@/pages/dashboard/sections/Students";
import {Subjects} from "@/pages/dashboard/sections/Subjects";
import {Profesores} from "@/pages/dashboard/sections/Profesores";
import {Enrollments} from "@/pages/dashboard/sections/Enrollments";
import {Grades} from "@/pages/dashboard/sections/Grades";
import {NotFound} from "@/pages/dashboard/sections/NotFound";
import {Empleados} from "@/pages/dashboard/sections/Empleados";

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
          {path: "alumnos", element: <Students />},
          {path: "materias", element: <Subjects />},
          {path: "profesores", element: <Profesores />},
          {path: "inscripciones", element: <Enrollments />},
          {path: "calificaciones", element: <Grades />},
          {path: "empleados", element: <Empleados />},
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

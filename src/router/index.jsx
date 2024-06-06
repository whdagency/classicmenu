import { createBrowserRouter } from "react-router-dom";
import Home from "@/Home/Home";
export const router = createBrowserRouter([
    {
        path: "/Menu/:slug",
        children: [{ index: true, element: <Home /> }],
      },
]
)
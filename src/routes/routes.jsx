import { createBrowserRouter } from "react-router";
import Main from "../layout/Main";
import Home from "../pages/Home/Home";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <Main/>,
        errorElement: <div>Something went wrong</div>,
        children: [
            {
                path: '/',
                element: <Home/>
            }
        ]
    }
])
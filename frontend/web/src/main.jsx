import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Root from "./screens/root";
import Console from "./screens/console";
import Browse from "./screens/browse";
import Search from "./screens/search";
import Video from "./screens/video";
import { ExternalMedia, LocalMedia } from "./screens/media";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Browse />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/console",
        element: <Console />,
      },
      {
        path: "/media/:mediaId",
        element: <LocalMedia />,
      },
      {
        path: "/external/:tmdbId",
        element: <ExternalMedia />,
      },
      {
        path: "/video/:mediaId",
        element: <Video />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

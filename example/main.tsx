import ReactDOM from "react-dom";
import React from "react";
import { createRoot } from "react-dom/client";

import "./main.css";

import { parseRoutePath } from "../src/path-parser";

import { routerRules } from "./models/router-rules";

import Container from "./pages/container";
import { GenRouterTypeTree } from "./controller/generated-router";

const renderApp = () => {
  const container = document.querySelector(".app");
  const root = createRoot(container); // createRoot(container!) if you use TypeScript

  let routerTree = parseRoutePath(window.location.hash.slice(1), routerRules);

  console.log("tree", routerTree);

  root.render(<Container router={routerTree as any} />);
};

window.onload = renderApp;

window.addEventListener("hashchange", () => {
  renderApp();
});

if (import.meta.hot) {
  import.meta.hot.accept(["./pages/container"], () => {
    renderApp();
  });
}

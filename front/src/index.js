import React from "react";
import {createRoot} from "react-dom/client";
import App from "./app";
import './styles/main.scss';


const root = createRoot(document.getElementById('app'));
root.render(<App />)
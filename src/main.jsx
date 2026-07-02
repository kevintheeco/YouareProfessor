import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { initStorage, loadCFG, initFirebase } from "./core/platform.js";
import { App } from "./views/AppShell.jsx";
import { AcademyApp } from "./views/Academy.jsx";

function Root(){
  const [academy,setAcademy]=useState(/academy/i.test(location.hash));
  useEffect(()=>{const f=()=>setAcademy(/academy/i.test(location.hash));window.addEventListener("hashchange",f);return ()=>window.removeEventListener("hashchange",f);},[]);
  return academy?<div className="academy-skin"><AcademyApp/></div>:<App/>;
}

function boot(){
  loadCFG();initFirebase();
  createRoot(document.getElementById("root")).render(<Root/>);
}
initStorage().then(boot).catch(e=>{console.error("[boot]",e);boot();});

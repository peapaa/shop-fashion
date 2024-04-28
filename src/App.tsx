import React from "react";
import "./App.css";
import AppHeader from "./components/Header";
import PageContent from "./components/PageContent";
import AppFooter from "./components/Footer";
const App: React.FC = () => {
  return (
    <div className="app">
      <AppHeader />
      <PageContent />
      <AppFooter />
    </div>
  );
};

export default App;

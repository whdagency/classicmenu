import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Info from "./Info/infov2";
import Footer from "./Footer/Footerv2";
import Achat from "./Achat/Achatv2";
import Claims from "./Claims/Claimsv2";
import Rate from "./Rating/Rate";
import { APIURL } from "@/lib/ApiKey";
import { Toaster } from "@/components/ui/toaster";
import Home from "./Home/Home";
import { Helmet } from "react-helmet";
import { useMenu } from "./hooks/useMenu";

function App() {
  const {
    customization,
    restos,
    resInfo,
    dishes,
    categories,
    selectedTab,
    setSelectedTab,
    restoSlug,
  } = useMenu();

  return (
    <div
      className="h-screen"
      style={{ backgroundColor: customization.selectedBgColor }}
    >
      <Helmet>
        <title>{restos?.name}</title>
        <meta name="description" content={resInfo?.description} />
        <link
          rel="icon"
          type="image/svg+xml"
          href={`${APIURL}/storage/${resInfo?.logo}`}
          onError={(e) => {
            e.target.src = "/assets/placeholder-image.png";
          }}
        />
      </Helmet>
      <Toaster />
      <Router>
        <div className="h-screen">
          <Routes>
            <Route
              path={`/menu/:restoSlug`}
              element={
                <Home
                  categories={categories}
                  dishes={dishes}
                  resInfo={resInfo}
                  restoId={restos.id}
                  filteredTheme={customization}
                  restoSlug={restoSlug}
                  restos={restos}
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                />
              }
            />
            <Route
              path="/menu/:restoSlug/Rating"
              element={
                <>
                  <Rate infoRes={resInfo} />
                  <Footer slug={restoSlug} customization={customization} />
                </>
              }
            />
            <Route
              path={`/menu/:restoSlug/info`}
              element={
                <>
                  <Info
                    items={restos}
                    customization={customization}
                    infoRes={resInfo}
                  />
                  <Footer slug={restoSlug} customization={customization} />
                </>
              }
            />
            <Route
              path="/menu/:restoSlug/Achat"
              element={
                <>
                  <Achat
                    infoRes={resInfo}
                    resto_id={restos.id}
                    customization={customization}
                  />
                  <Footer slug={restoSlug} customization={customization} />
                </>
              }
            />
            <Route
              path="/menu/:restoSlug/Claims"
              element={
                <>
                  <Claims items={restos} />
                  <Footer slug={restoSlug} customization={customization} />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

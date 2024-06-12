import React from "react";
import Banner from "../Banner/Banner";
import Tab from "../Tabs/Tab";
import Footer from "../Footer/Footerv2";
import { useLocation } from "react-router-dom";
import ThemeOne from "../themes/ThemeOne";

const Home = ({
  filteredTheme,
  restos,
  resInfo,
  restoSlug,
  selectedTab,
  setSelectedTab,
  dishes,
  restoId,
  categories,
  filteredCategories,
}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const extraInfo = queryParams.get("table_id");

  console.log("The extra infor => ", extraInfo);
  console.log({ filteredTheme });
  return (
    <>
      {/* <Banner customization={filteredTheme} items={restos} infoRes={resInfo} />
      <Tab
        infoRes={resInfo}
        filteredCategories={filteredCategories}
        customization={filteredTheme}
        categories={categories}
        resto={restoId}
        tabel_id={extraInfo}
        dishes={dishes}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <Footer
        slug={restoSlug}
        customization={filteredTheme}
        table_id={extraInfo}
      /> */}

      <ThemeOne />
    </>
  );
};

export default Home;

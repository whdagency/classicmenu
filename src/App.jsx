import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { tabAchat } from './constant/page';
import Info from "./Info/infov2";
import Footer from "./Footer/Footerv2";
import Achat from "./Achat/Achatv2";
import Claims from "./Claims/Claimsv2";
import Rate from './Rating/Rate';
import Spinner from "react-spinner-material";
import { axiosInstance } from "../axiosInstance";
import { APIURL } from "@/lib/ApiKey";
import { Toaster } from "@/components/ui/toaster";
import Home from "./Home/Home";
import { Helmet } from "react-helmet";

const defaultColor = {
  selectedTheme: 1,
  selectedBgColor: "#fff",
  selectedHeader: "logo-header",
  selectedLayout: "theme-grid",
  selectedPrimaryColor: "#28509E",
  selectedSecondaryColor: "#6b7280",
  selectedTextColor: "#000",
  selectedIconColor: "#ffffff",
};

function App() {
  const [cartCount, setCartCount] = useState(tabAchat.length);
  const [restos, setRestos] = useState({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selectedTab, setSelectedTab] = useState('All');
  const [resInfo, setResInfo] = useState({});
  const [message, setMessage] = useState('');
  const [customization, setCustomization] = useState(defaultColor);
  const restoSlug = window.location.pathname.split("/")[2];
  
  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const restoResponse = await fetch(`${APIURL}/api/getRestoBySlug/${restoSlug}`);
        const restoData = await restoResponse.json();
        if (restoData && restoData.length > 0) {
          const resto = restoData[0];
          setRestos(resto);

          const [categoryResponse, dishResponse, drinkResponse, infoResponse, customizationResponse] = await Promise.all([
            fetch(`${APIURL}/api/getCategorieByResto/${resto.id}`),
            fetch(`${APIURL}/api/getdishes/${resto.id}${selectedTab !== "All" ? `?category=${selectedTab}` : ""}`),
            fetch(`${APIURL}/api/getdrinks/${resto.id}${selectedTab !== "All" ? `?category=${selectedTab}` : ""}`),
            axiosInstance.get(`/api/infos/${resto.id}`),
            fetch(`${APIURL}/api/customizations/${resto.id}`)
          ]);

          const categoryData = await categoryResponse.json();
          const visibleCategories = categoryData.filter(cat => cat.visibility === 1);
          const visibleCategoryIds = visibleCategories.map(cat => cat.id);
          setCategories(visibleCategories);

          const dishData = await dishResponse.json();
          const drinkData = await drinkResponse.json();
          let combinedData = [];
          const filteredDishes = dishData?.length > 0 && dishData.filter(dish => visibleCategoryIds.includes(dish.category_id)).map(item => ({ ...item, type: 'dish' }));
          const filteredDrinks = drinkData?.length > 0 && drinkData.filter(drink => visibleCategoryIds.includes(drink.category_id)).map(item => ({ ...item, type: 'drink' }));
          if (filteredDishes.length) {
            combinedData.push(...filteredDishes);
          }
          if (filteredDrinks.length) {
            combinedData.push(...filteredDrinks);
          }
          setDishes(combinedData);

          setResInfo(infoResponse.data[0]);
          const customizationData = await customizationResponse.json();
          setCustomization(customizationData[0] || defaultColor);
        } else {
          setMessage('No restaurant found with the provided slug.');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage('Failed to fetch restaurant data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restoSlug]);

  if (loading) {
    return (
      <div className='justify-center items-center flex h-screen'>
        <Spinner size={100} spinnerColor={"#28509E"} spinnerWidth={1} visible={true} />
      </div>
    );
  }

  return (
    <div className="h-screen" style={{ backgroundColor: customization.selectedBgColor }}>
      
      <Helmet>
        <title>{restos?.name}</title>
        <meta name="description" content={resInfo?.description} />
        <link rel="icon" type="image/svg+xml" href={`${APIURL}/storage/${resInfo?.logo}`} />
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
            <Route path="/menu/:restoSlug/Rating" element={<><Rate infoRes={resInfo} /><Footer slug={restoSlug} customization={customization} /></>} />
            <Route path={`/menu/:restoSlug/info`} element={<><Info items={restos} customization={customization} infoRes={resInfo} /><Footer slug={restoSlug} customization={customization} /></>} />
            <Route path="/menu/:restoSlug/Achat" element={<><Achat infoRes={resInfo} resto_id={restos.id} customization={customization} /><Footer slug={restoSlug} customization={customization} /></>} />
            <Route path="/menu/:restoSlug/Claims" element={<><Claims items={restos} /><Footer slug={restoSlug} customization={customization} /></>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

import React, { createContext, useEffect, useState } from "react";
import { APIURL } from "../lib/ApiKey";
import { defaultColor, tabAchat } from "../constant/page";
import { axiosInstance } from "../axiosInstance";
import Spinner from "react-spinner-material";

export const MenuContext = createContext();

const MenuProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(tabAchat.length);
  const [restos, setRestos] = useState({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [resInfo, setResInfo] = useState({});
  const [message, setMessage] = useState("");
  const [customization, setCustomization] = useState(defaultColor);
  const restoSlug = window.location.pathname.split("/")[2];
  const table_id = window.location.search.split("=")[1] || null;

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const restoResponse = await fetch(
          `${APIURL}/api/getRestoBySlug/${restoSlug}`
        );
        const restoData = await restoResponse.json();
        if (restoData && restoData.length > 0) {
          const resto = restoData[0];
          setRestos(resto);

          const [
            categoryResponse,
            dishResponse,
            drinkResponse,
            infoResponse,
            customizationResponse,
          ] = await Promise.all([
            fetch(`${APIURL}/api/getCategorieByResto/${resto.id}`),
            fetch(
              `${APIURL}/api/getdishes/${resto.id}${
                selectedTab !== "All" ? `?category=${selectedTab}` : ""
              }`
            ),
            fetch(
              `${APIURL}/api/getdrinks/${resto.id}${
                selectedTab !== "All" ? `?category=${selectedTab}` : ""
              }`
            ),
            axiosInstance.get(`/api/infos/${resto.id}`),
            fetch(`${APIURL}/api/customizations/${resto.id}`),
          ]);

          const categoryData = await categoryResponse.json();
          const visibleCategories = categoryData.filter(
            (cat) => cat.visibility === 1
          );
          const visibleCategoryIds = visibleCategories.map((cat) => cat.id);
          setCategories(visibleCategories);

          const dishData = await dishResponse.json();
          const drinkData = await drinkResponse.json();
          let combinedData = [];
          const filteredDishes =
            dishData?.length > 0 &&
            dishData
              .filter((dish) => visibleCategoryIds.includes(dish.category_id))
              .map((item) => ({ ...item, type: "dish" }));
          const filteredDrinks =
            drinkData?.length > 0 &&
            drinkData
              .filter((drink) => visibleCategoryIds.includes(drink.category_id))
              .map((item) => ({ ...item, type: "drink" }));
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
          setMessage("No restaurant found with the provided slug.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Failed to fetch restaurant data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restoSlug, selectedTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner
          size={100}
          spinnerColor={"#28509E"}
          spinnerWidth={1}
          visible={true}
        />
      </div>
    );
  }

  const values = {
    table_id,
    restoSlug,
    cartCount,
    setCartCount,
    restos,
    setRestos,
    categories,
    setCategories,
    dishes,
    setDishes,
    selectedTab,
    setSelectedTab,
    resInfo,
    setResInfo,
    message,
    setMessage,
    customization,
    setCustomization,
  };

  return <MenuContext.Provider value={values}>{children}</MenuContext.Provider>;
};

export default MenuProvider;

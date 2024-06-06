import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import {tabAchat} from './constant/page'
// import Banner from "./Banner/Banner";
// import Tab from "./Tabs/Tab";
// import MenuItems from "./MenuItems/MenuItems";
import Info from "./Info/infov2";
import Footer from "./Footer/Footerv2";
import Achat from "./Achat/Achatv2";
import Claims from "./Claims/Claimsv2";
import Rate from './Rating/Rate';
import Spinner from "react-spinner-material";
import { axiosInstance } from "../axiosInstance";
import { APIURL } from "@/lib/ApiKey";
import { Toaster } from "@/components/ui/toaster"
// import { usePublishedTheme } from "@/hooks/usePublishedTheme";
import Home from "./Home/Home";
import { Helmet } from "react-helmet";

function App() {
  const [cartCount, setCartCount] = useState(tabAchat.length);
  const [validSlug, setValidSlug] = useState(false); // State to track the validity of the resto slug
  const [restos, setRestos] = useState([]);
  const [restosslug, setRestosSlug] = useState([]);
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [restoId, setRestoId] = useState(null)
  const [dishes, setDishes] = useState([])
  const [selectedTab, setSelectedTab] = useState('All');
  const [resInfo , setResInfo] = useState([])
  const [message, setMessage] = useState('')
  const restoSlug = window.location.pathname.split("/")[2];
 
  // const extraInfo = 'Test';

  // const [publishedTheme, setPublishedTheme] = usePublishedTheme();
  const [cosumisationDataApi, setCosumisationDataApi] = useState([])

  const fetchCategories = async (id) => 
  {
    // if (!id) return;
    // setLoading(true)
    try{
      const res = await fetch(`${APIURL}/api/getCategorieByResto/${id}`);
      const data = await res.json();
      if (data && data.length) {
        const visibleCategories = data.filter(cat => cat.visibility === 1);
        console.log("The Response of The categories => ", visibleCategories);
        setCategories(visibleCategories);
      } else {
        console.log("No categories found or all categories are not visible");
        setCategories([]); // Set to empty if no visible categories
      }

    }catch(err)
    {
      console.log("the Error => ", err);
    }
    finally{
      setLoading(false)
    }
  }

  const fetchDishes = async (restoId) => {
    if (!restoId) return;
    // setLoading(true);
    try {
      // Fetch visible categories first
      const categoryResponse = await fetch(`${APIURL}/api/getCategorieByResto/${restoId}`);
      const categoriesData = await categoryResponse.json();
      const visibleCategories = categoriesData.filter(cat => cat.visibility === 1);
      const visibleCategoryIds = visibleCategories.map(cat => cat.id);
  
      // Fetch dishes and drinks
      const [dishesResponse, drinksResponse] = await Promise.all([
        fetch(`${APIURL}/api/getdishes/${restoId}${selectedTab !== "All" ? `?category=${selectedTab}` : ""}`),
        fetch(`${APIURL}/api/getdrinks/${restoId}${selectedTab !== "All" ? `?category=${selectedTab}` : ""}`)
      ]);
  
      let combinedData = [];
      const dishesData = await dishesResponse.json();
      const filteredDishes = dishesData?.length > 0 && dishesData.filter(dish => visibleCategoryIds.includes(dish.category_id));

      // Combine and set the filtered data
      if (filteredDishes.length) {
        combinedData.push(...filteredDishes.map(item => ({ ...item, type: 'dish' })));
      }
      const drinksData = await drinksResponse.json();
      const filteredDrinks =drinksData?.length > 0 && drinksData.filter(drink => visibleCategoryIds.includes(drink.category_id));
  
      if (filteredDrinks.length) {
        combinedData.push(...filteredDrinks.map(item => ({ ...item, type: 'drink' })));
      }
  
      setDishes(combinedData);
      if (!combinedData.length) {
        setMessage('No items found.');
      }
    } catch (error) {
      console.error('Error fetching dishes and drinks:', error);
      setMessage('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCostumusation = async (restoId) =>{
    try {
      const costumusationRespnse = await fetch(`${APIURL}/api/customizations/${restoId}`);
      const constumusationData = await costumusationRespnse.json();
      if(constumusationData)
        {
          constumusationData.map(item => {
            setCosumisationDataApi(item);
            // setPublishedTheme(item)
          })
      }
    }catch (error) {
      console.error('Error fetching costumisation:', error);
      setMessage('Failed to fetch costumisation. Please try again.');
    }
  }


const fetchInfo = async (id) => {
  try{ 
    const res = await axiosInstance.get('/api/infos/'+id)
    if(res)
    {
      console.log("The data of Info => ", res);
      let Data = [];
      Data = res.data;
      Data.map(item => {
        setResInfo(item)
      })
    }
  }
  catch(err)
  {
    console.log("the Error => ",err);
  }

}

const defaultColor =  {
  selectedTheme: 1,
  selectedBgColor: "#fff",
  selectedHeader: "logo-header",
  selectedLayout: "theme-grid",
  selectedPrimaryColor: "#28509E",
  selectedSecondaryColor: "	#6b7280",
  selectedTextColor: "#000",
  selectedIconColor: "#ffffff",
};

  const fetchRestosbyslug = async () => {
    // setLoading(true);
    try {
        const response = await fetch(`${APIURL}/api/getRestoBySlug/${restoSlug}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data && data.length > 0) {
            const resto = data[0];
            setRestos(resto);
            setRestoId(resto.id);

            // Fetch categories, dishes, and info concurrently
            await Promise.all([
                fetchCategories(resto.id),
                fetchDishes(resto.id),
                fetchInfo(resto.id),
                fetchCostumusation(resto.id)
            ]);
        } else {
            setMessage('No restaurant found with the provided slug.');
        }
    } catch (error) {
        console.error("Error fetching restos:", error.message);
        setMessage('Failed to fetch restaurant data. Please try again.');
    } finally {
        setLoading(false);
    }
};
function isObjectEmpty(obj) { 
  return Object.keys(obj).length === 0; 
} 

const filteredTheme =isObjectEmpty(cosumisationDataApi) ? defaultColor : cosumisationDataApi ;




useEffect(() => {
  // fetchRestos();
  fetchRestosbyslug();
  fetchDishes(restoId)

}, [restoSlug]); // Fetch restos when the component mounts


useEffect(() => {
  if (selectedTab) {
    fetchDishes(restoId); // Fetch dishes when selectedTab changes
  }
}, [selectedTab, restoId]);
  if(loading)
  { 
    return(
      <div className='justify-center items-center flex  h-screen'>
      <Spinner size={100} spinnerColor={"#28509E"} spinnerWidth={1} visible={true} style={{borderColor: "#28509E", borderWidth: 2}}/>
    </div>
    )
  }

// console.log("The IsValid => ", isValidSlug);
  // if(!isValidSlug)
  // {
  //   return <Navigate to="/not-found" replace />; 
  // }

  console.log("The Resto Infos => ",resInfo);
  return (
    <div className="h-screen " style={{backgroundColor: filteredTheme?.selectedBgColor}}>
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
              <>
                <Home 
                      categories={categories}
                      dishes={dishes}
                      resInfo={resInfo}
                      restoId={restoId}
                      filteredTheme={filteredTheme}
                      restoSlug={restoSlug}
                      restos={restos}
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                />
              </>
            }
          />
          <Route path="/menu/:restoSlug/Rating" element={
            <>
            <Rate infoRes={resInfo}/>
              <Footer slug={restoSlug} customization={filteredTheme} />
            </>
          } />
          <Route path={`/menu/:restoSlug/info`} element={
            <>
            <Info items={restos} customization={filteredTheme} infoRes={resInfo}/>
              <Footer slug={restoSlug} customization={filteredTheme} />
            </>
          } />
          <Route path="/menu/:restoSlug/Achat" element={
            <>
            <Achat infoRes={resInfo} resto_id={restoId}  restoId={restoId} customization={filteredTheme}/>
              <Footer slug={restoSlug} customization={filteredTheme} />
            </>
          } />
          <Route path="/menu/:restoSlug/Claims" element={
            <>
              <Claims items={restos}/>
              <Footer slug={restoSlug} customization={filteredTheme} />
            </>
          } />
        </Routes>
    </div>
    </Router>
    </div>
  );
}

function useValidateSlug(slug, validSlugs) {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (!validSlugs.includes(slug)) {
      setIsValid(false);
      navigate("/not-found", { replace: true }); // Redirects to a "Not Found" page
    }
  }, [slug, validSlugs, navigate]);

  return isValid;
}


export default App;

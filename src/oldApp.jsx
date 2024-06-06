import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import {tabAchat} from './constant/page'
import Banner from "./Banner/Banner";
import Tab from "./Tabs/Tab";
import MenuItems from "./MenuItems/MenuItems";
import Info from "./Info/infov2";
import Footer from "./Footer/Footerv2";
import Achat from "./Achat/Achatv2";
import Claims from "./Claims/Claimsv2";
import Rate from './Rating/Rate';
import Spinner from "react-spinner-material";
import { axiosInstance } from "../../axiosInstance";
import { APIURL } from "../../lib/ApiKey";
import { Toaster } from "@/components/ui/toaster"

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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const extraInfo = queryParams.get('table_id');
  const fetchCategories = async (id) => 
  {
    if (!id) return;
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
    // if (!restoId) return;
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
  
      const dishesData = await dishesResponse.json();
      const drinksData = await drinksResponse.json();
  
      // Filter dishes and drinks based on visible categories
      const filteredDishes = dishesData.filter(dish => visibleCategoryIds.includes(dish.category_id));
      const filteredDrinks = drinksData.filter(drink => visibleCategoryIds.includes(drink.category_id));
  
      // Combine and set the filtered data
      let combinedData = [];
      if (filteredDishes.length) {
        combinedData.push(...filteredDishes.map(item => ({ ...item, type: 'dish' })));
      }
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
  


console.log("The Resto Id => ", dishes);

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
  // const fetchRestosbyslug = async () => {
  //   setLoading(true)
  //   try {
  //     const response = await fetch(`${APIURL}/api/getRestoBySlug/${restoSlug}`);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  //     const data = await response.json();
      
  //     console.log("The Response => ",data);
  //     let Data = [];
  //     Data = data;
  //     const res = await axiosInstance.get('/api/infos/'+Data[0].id)
  //     if(data)
  //     {
  //       Data.map((item) => {
  //         setRestos(item);
  //         fetchCategories(item.id)
  //         setRestoId(item.id)
  //         fetchDishes(item.id)
  //         fetchInfo(item.id)
  //       })
  //       // setLoading(true)
  //       // if(res)
  //       //   {
  //       //     console.log("The data of Info => ", res);
  //       //     let Data = [];
  //       //     Data = res.data;
  //       //     Data.map(item => {
  //       //       setResInfo(item)
  //       //     })
  //       //   }
  //     }
  //     // const isValidSlug = useValidateSlug(restoSlug, Data.map(item => item.slug));

  //     // console.log("The IsValide => ", isValidSlug);
  //     // if(!isValidSlug)
  //     // {
  //     //   return <Navigate to="/not-found" replace />;
  //     // }
  //   } catch (error) {
  //     console.error("Error fetching restos:", error.message);
  //   }
  //   finally{
  //     setLoading(false)
  //   }
  // };

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
                fetchInfo(resto.id)
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

  console.log('The Selected => ', selectedTab);


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
    // <Router>
      <div className="h-screen">
          <Toaster />
          <Routes>
            <Route
              path={`/`}
              element={
                <>
                  <Banner items={restos} infoRes={resInfo}/>
                  <Tab infoRes={resInfo} categories={categories} resto={restoId} tabel_id={extraInfo} dishes={dishes} selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
                  <Footer slug={restoSlug}  table_id={extraInfo}/>
                </>
              }
            />
            <Route path={`/menu/:restoSlug/info`} element={
              <>
              <Info items={restos} infoRes={resInfo}/>
              <Footer slug={restoSlug}  table_id={extraInfo}/>
              </>
            } />
             <Route path={`/menu/:restoSlug/Rating`}  element={
              <>
              <Rate infoRes={resInfo}/>
              <Footer slug={restoSlug}  table_id={extraInfo}/>
              </>
            } />
            <Route path={`/menu/:restoSlug/Achat`}  element={
              <>
              <Achat infoRes={resInfo} resto_id={restoId} tabel_id={extraInfo} restoId={restoId}/>
              <Footer slug={restoSlug}  table_id={extraInfo}/>
              </>
            } />
            <Route path={`/menu/:restoSlug/Claims`} element={
              <>
              <Claims items={restos} table_id={extraInfo}/>
              <Footer slug={restoSlug} table_id={extraInfo}/>
              </>
            } />
          </Routes>
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


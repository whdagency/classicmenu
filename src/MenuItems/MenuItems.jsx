import React, { useState, useEffect, useRef } from 'react';
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "@/components/ui/button";
// import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { tabAchat } from '../constant/page';
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeAll } from '../lib/cartSlice';
import Logo from './waiter-svgrepo-com.svg';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
// import Dettaille from './Dettaille';
import { APIURL } from '../lib/ApiKey';
import { useToast } from "@/components/ui/use-toast"
function MenuItems({ dishes, selectedTab, restoId, infoRes, tabel_id, customization }) {
  const { toast } = useToast()
  const [selectedProp, setSelectedProp] = useState(0); // initialisation de l'état avec 0
  const [searchTerm, setSearchTerm] = useState(""); // état pour stocker la valeur de la recherche
  const [updateFormState, setUpdateFormState] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [newtab, setNewtab] = useState([...tabAchat]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [credenzaOpen, setCredenzaOpen] = useState(false);

  // Initial quantity
  const getQuantity = (itemId) => quantities[itemId] || 1;

  const setQuantity = (itemId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: value > 0 ? value : 1,
    }));
  };

  // Filtrer les éléments en fonction du terme de recherche
  const filteredCategories = dishes.length > 0 && dishes.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    tabAchat.length = 0;
    tabAchat.push(...newtab);
  }, [newtab]);

  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const handleAddItem = (product, quantity) => {
    dispatch(addItem({ product, quantity: quantity, resto_id: restoId }));
  setIsModalOpen(false);
  };

  async function submitOrder() {
    try {
      const notification = {
        title: "New Call For Waiter",
        status: "Waiter",
        resto_id: restoId,
        table_id: tabel_id,
      };
      const responseNotification = await fetch(`https://backend.garista.com/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
      },
        body: JSON.stringify(notification)
      });

      if(response)
      {
          console.log("Nice => ",responseNotification);
      }
      // Handle post-order submission logic here, like clearing the cart or redirecting the user
    } catch (error) {
      console.error('Failed to submit order:', error.message);
    }
  }
  async function submitBille() {
    try {
      const notification = {
        title: "Asking For Bill",
        status: "Bill",
        resto_id: restoId,
        table_id: tabel_id,
      };
      const responseNotification = await fetch(`https://backend.garista.com/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
      },
        body: JSON.stringify(notification)
      });

      if(response)
      {
          console.log("Nice => ",responseNotification);
      }
      // Handle post-order submission logic here, like clearing the cart or redirecting the user
    } catch (error) {
      console.error('Failed to submit order:', error.message);
    }
  }

  const searchInputRef = useRef(null);

  return (
    <>
      <div className='pt-4 mx-auto w-full' style={{backgroundColor: customization?.selectedBgColor}}>
        <form className="md:max-w-[58%] lg:max-w-[40%] xl:max-w-[28%] w-full mx-auto px-4 pb-4">   
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className={`w-4 h-4 `} style={{color:customization?.selectedTextColor,}} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input type="search" ref={searchInputRef} id="default-search" style={{color:customization?.selectedTextColor, '--placeholder-color': customization?.selectedTextColor }} className={`block w-full p-2 ps-10  border border-gray-300 input-placeholder rounded-[.5rem] bg-transparent  dark:bg-gray-700 dark:border-gray-600   input-height-small`}placeholder="Search for your desired food...." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}  />
          </div>
        </form>

         <div className='overflow-x-auto md:max-w-[50%] lg:max-w-[37%] xl:max-w-[26%] mx-auto px-3'>
            <h1 className='pb-2 text-lg text-black font-semibold' style={{color: customization?.selectedTextColor}}>{selectedTab}</h1>
    
            {
              customization?.selectedLayout == "theme-list"
              ?
              <div className='grid gap-5 mb-[100px]  lg:mb-[150px]'>
              {filteredCategories.length > 0 && filteredCategories.map((item, index) => (
                <div className="tabs-container overflow-x-auto" key={index}>
                  <div className="flex gap-4">
                        <Button onClick={() => setIsModalOpen(!isModalOpen)} style={{backgroundColor: customization?.selectedBgColor}} className="h-auto w-full !py-0 px-0">
                          <div key={item.id} className="relative shadow-md rounded-[10px] w-full border-gray-300 border inline-block">
                            <div
                              onClick={() => setSelectedItem(item)}
                              className="tab items-center justify-between flex flex-row h-full w-full overflow-hidden p-1.5 text-lg font-semibold rounded-[8px] cursor-pointer transition-colors"
                            >
                              <img src={`${APIURL}/storage/${item.image}`} alt="Menu Icon" className="w-full object-cover rounded-[10px] h-28 max-w-28" />
                              <div className='text-black flex justify-between items-center py-2 px-3 mr-auto'>
                                <div>
                                  <h2 className="text-[20px] mb-0 text-left uppercase" style={{color: customization?.selectedTextColor}}>{item.name.slice(0, 12)}</h2>
                                  <h2 className="text-[16px] mb-0 text-left" style={{color: customization?.selectedTextColor}}>{item.desc.slice(0, 12)}</h2>
                                  <p className='text-[14px] text-left' style={{color: customization?.selectedTextColor}}>{item.price + " " +infoRes?.currency}</p>
                                </div> 
                              </div>
                                <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent the parent button from being clicked
                                        handleAddItem(item, 1);
                                        toast({
                                          title: `${item.name} added to cart successfully!`,
                                          description: "You can confirm your order in checkout"
                                        })
                                      }}
                                      style={{backgroundColor: customization?.selectedPrimaryColor, }}
                                      className="text-white leading-0 w-[40px] mr-3 h-[40px] flex items-center justify-center rounded-[8px]">
                                      <AiOutlinePlus style={{ color: "#ffffff" }} />
                                </button>
                            </div>
                          </div>
                        </Button>
                  </div>
                </div>
              ))}
            </div>
              :
              <div className='grid grid-cols-2 gap-5 mb-[100px] lg:mb-[150px]'>
              {filteredCategories.length > 0 && filteredCategories.map((item, index) => (
                <div className="tabs-container overflow-x-auto" key={index}>
                  <div className="flex gap-4">
                        <Button onClick={() => setIsModalOpen(!isModalOpen)} style={{backgroundColor: !customization?.selectedBgColor,}} className="h-auto w-full !py-0 px-0 bg-transparent hover:bg-transparent">
                          <div key={item.id} className="relative shadow-md rounded-[10px] w-full border-gray-300 border inline-block">
                            <div
                              onClick={() => setSelectedItem(item)}
                              className="tab items-center justify-center h-full w-full overflow-hidden p-1.5 text-lg font-semibold rounded-[8px] cursor-pointer transition-colors"
                            >
                              <img src={`${APIURL}/storage/${item.image}`} alt="Menu Icon" className="w-full object-cover rounded-[10px] h-32" />
                              <div className='text-black flex justify-between items-center py-2 px-3'>
                                <div>
                                  <h2 className="text-[12px] mb-0 text-left" style={{color: customization?.selectedTextColor}}>{item.name.slice(0, 12)}</h2>
                                  <p className='text-[12px] text-left' style={{color: customization?.selectedTextColor}}>{item.price + " " +infoRes?.currency}</p>
                                </div> 
                                <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent the parent button from being clicked
                                        handleAddItem(item, 1);
                                        toast({
                                          title: `${item.name} added to cart successfully!`,
                                          description: "You can confirm your order in checkout"
                                        })
                                      }}
                                      style={{backgroundColor: customization?.selectedPrimaryColor }}
                                      className="text-white leading-0 w-[30px] h-[30px] flex items-center justify-center rounded-[8px]">
                                      <AiOutlinePlus style={{ color: "#ffffff" }} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Button>
                  </div>
                </div>
              ))}
            </div>
            }

          </div>

        </div>
                  
                <Credenza className={"!bg-white !py-0"} open={isModalOpen} onOpenChange={setIsModalOpen}>
                  {/* <CredenzaTrigger asChild className="h-auto w-full !py-0 !bg-white">
                  </CredenzaTrigger> */}
                  <CredenzaContent className="flex max-h-screen md:w-[50rem]  bg-white md:flex-col md:justify-center ">
                    {selectedItem != null && (
                      <>
                        <CredenzaHeader photo={`${APIURL}/storage/${selectedItem.image}`} className="p-0" />
                        <CredenzaBody className="space-y-4 text-center mt-5 text-sm sm:pb-0 ">
                          <CredenzaTitle>{selectedItem.name}</CredenzaTitle>
                              <p className="m-0 text-neutral-400 w-full text-center flex justify-center items-center">{selectedItem?.desc?.length > 20 ? selectedItem?.desc?.slice(0, 100) + '...' : selectedItem?.desc}</p>
                          <div className='flex items-center justify-center '>
                            <div className="flex items-center gap-2">
                              <Button size="icon" variant="outline" onClick={() => setQuantity(selectedItem.id, getQuantity(selectedItem.id) - 1)}>
                                <MinusIcon className="w-4 h-4" />
                              </Button>
                              <span className="text-base font-medium text-gray-900 dark:text-gray-50">{getQuantity(selectedItem.id)}</span>
                              <Button size="icon" variant="outline" onClick={() => setQuantity(selectedItem.id, getQuantity(selectedItem.id) + 1)}>
                                <PlusIcon className="w-4 h-4" />
                              </Button>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-dot mx-1 " viewBox="0 0 16 16" style={{color: customization?.selectedPrimaryColor }}>
                              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                            </svg>
                            <span>{selectedItem.price + " " +infoRes?.currency }</span>
                          </div>
                        </CredenzaBody>
                        <CredenzaFooter className='grid md:justify-center items-center'>
                          <button
                            type="button"
                            onClick={() => { handleAddItem(selectedItem, getQuantity(selectedItem.id)) }}
                            className={`rounded-[1rem] p-2 transition-all duration-300 border font-medium text-xs md:text-sm flex items-center justify-center gap-1 md:w-[300px]`}
                            style={{backgroundColor: customization?.selectedPrimaryColor }}
                          >
                            <div className={`text-lg font-semibold ${isClicked ? "text-[#28509E]" : "text-white"} `}>{isClicked ? "Added To Your Cart" : `Add to selected: ${(selectedItem.price * getQuantity(selectedItem.id)).toFixed(2) + " " +infoRes?.currency}`}</div>
                          </button>
                          <CredenzaClose asChild>
                            <Button variant="outline bg-black text-white">Close</Button>
                          </CredenzaClose>
                        </CredenzaFooter>
                      </>
                    )}

                  </CredenzaContent>
                </Credenza>
            <AlertDialog>
            <AlertDialogTrigger asChild className={`mb-1 fixed bottom-16 right-2 md:right-[25%] lg:right-[32%] xl:right-[35%] flex-col flex items-end justify-center ${credenzaOpen ? 'hidden' : ''}`}>
            <Button className="h-16 w-16 rounded-full  shadow-lg flex items-center justify-center" size="icon" style={{backgroundColor: customization?.selectedPrimaryColor}}>
            <img src={Logo} alt="Waiter Icon" className="h-12 w-11" />
          </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[80%] md:w-full mx-auto rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Call waiter?</AlertDialogTitle>
                {/* <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription> */}
              </AlertDialogHeader>
              <AlertDialogFooter className='flex !flex-col !justify-center  w-full gap-2'>

                <AlertDialogAction className="w-full !px-0" onClick={submitOrder}>Call Waiter</AlertDialogAction>
                <AlertDialogAction className="w-full !ml-0" onClick={submitBille}>Bring the bill</AlertDialogAction>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    </>
  );
}

function MinusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export default MenuItems;

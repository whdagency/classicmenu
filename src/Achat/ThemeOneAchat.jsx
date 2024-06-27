import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useMenu } from "../hooks/useMenu";
import {
  incrementQuantity,
  decrementQuantity,
  removeItem,
  removeAll,
} from "../lib/cartSlice";
import { APIURL } from "../lib/ApiKey";
import "./Achat.css";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const ThemeOneAchat = ({ activeLink }) => {
  // restaurant menu data
  const { customization, restos, resInfo, table_id } = useMenu();
  const resto_id = restos.id;

  // use state
  const [orderSuccessModalOpen, setOrderSuccessModalOpen] = useState(false);

  // redux state and dispatch
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // order functions
  const totalCost = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // tax calculation
  const tax = 0.002;
  const totalTax = totalCost * tax;

  // total cost
  const totalCostWithTax = totalCost + totalTax;

  const submitOrder = async (cartItems, totalCost) => {
    let cartItemProduct = cartItems.map((item) => ({
      type: item.type, // Assuming all items are dishes
      id: item.id,
      quantity: item.quantity,
    }));

    const order = {
      total: totalCost,
      status: "New",
      table_id: table_id, // Assuming static for now, you may need to adjust this based on your app's logic
      resto_id: resto_id, // Assuming static as well, adjust accordingly
      cartItems: cartItemProduct,
    };

    console.log("The orde is ", order);

    try {
      const response = await fetch(`${APIURL}/api/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorResponse}`);
      }

      const responseData = await response.json();
      console.log("Order submitted:", order, cartItemProduct, responseData);
      if (response) {
        const notification = {
          title: "New Order",
          status: "Order",
          resto_id: resto_id,
          table_id: table_id,
        };

        const formData = new FormData();
        formData.append("title", "New Order");
        formData.append("status", "Order");
        formData.append("resto_id", resto_id);

        const responseNotification = await fetch(
          `${APIURL}/api/notifications`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notification),
          }
        );

        console.log("Nice => ", responseNotification);
        setOrderSuccessModalOpen(false);
        dispatch(removeAll());
      }
      // Handle post-order submission logic here, like clearing the cart or redirecting the user
    } catch (error) {
      console.error("Failed to submit order:", error.message);
    }
  };

  return (
    <Sheet>
      <SheetTrigger>
        <p className="relative">
          <FiShoppingBag
            size={25}
            style={{
              color: activeLink
                ? customization?.selectedPrimaryColor
                : customization?.selectedSecondaryColor,
            }}
            className="text-white"
          />
          <span className="absolute -right-1.5 -top-1 bg-primary-blue size-5 grid place-content-center rounded-full text-white text-[10px] leading-3">
            {cartItems.length}
          </span>
        </p>
      </SheetTrigger>

      <SheetContent className="scrollbar-hide w-full overflow-y-scroll">
        <div className="dark:bg-gray-950 pt-3 bg-white">
          <section className="flex flex-col min-h-screen gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-400">
              <div className="flex items-center gap-2">
                <h2 className="dark:text-gray-50 text-2xl font-extrabold text-gray-900">
                  My Cart
                </h2>
                <div className="w-[1.5px] h-7 bg-gray-500" />
                <span className="font-thic">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </span>
              </div>
              <Button
                variant="link"
                style={{
                  // backgroundColor: customization?.selectedPrimaryColor,
                  color: customization?.selectedTextColor,
                }}
                className="font-thic text-black"
                onClick={() => dispatch(removeAll())}
              >
                Clear Cart
              </Button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center">
                <img
                  src="/assets/empty-cart.png"
                  alt="empty-cart"
                  className="object-contain w-full h-full mx-auto"
                />
                <p className="dark:text-gray-400 text-2xl text-center text-gray-900">
                  Your cart is empty.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col w-full gap-5 pt-5 mb-auto">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} infoRes={resInfo} />
                  ))}
                </div>

                {/* Total & Checkout */}
                <div className="border-t-gray-400 flex flex-col gap-2 pt-4 border-t">
                  <div className="flex items-center justify-between font-thic text-sm font-medium text-gray-600">
                    <p>Subtotal</p>
                    <p>{`${totalCost.toFixed(2)} ${resInfo?.currency}`}</p>
                  </div>
                  <div className="flex items-center justify-between font-thic text-sm font-medium text-gray-600">
                    <p>Tax</p>
                    <p>{`${totalTax.toFixed(2)} ${resInfo?.currency}`}</p>
                  </div>
                  <div className="flex items-center justify-between text-xl font-bold text-black">
                    <p className="uppercase">Total</p>
                    <p>{`${totalCostWithTax.toFixed(2)} ${resInfo?.currency}`}</p>
                  </div>

                  <div className="w-full mt-5">
                    <Button
                      style={{
                        backgroundColor: customization?.selectedPrimaryColor,
                      }}
                      className="w-full px-4 py-2 font-semibold text-white rounded-full"
                      size="lg"
                      onClick={() =>
                        setOrderSuccessModalOpen(!orderSuccessModalOpen)
                      }
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              </>
            )}
          </section>

          <AlertDialog
            open={orderSuccessModalOpen}
            onOpenChange={setOrderSuccessModalOpen}
          >
            <AlertDialogContent className="w-[80%] rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Your order has been successfully submitted
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Thank you for your order! Your items will be delivered
                  shortly.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  autoFocus
                  onClick={() => submitOrder(cartItems, totalCost)}
                >
                  Ok
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ThemeOneAchat;

const CartItem = ({ item, infoRes }) => {
  const dispatch = useDispatch();

  return (
    <div className="grid gap-4 font-thic">
      <ul className="flex flex-col gap-2 list-disc">
        <li className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 font-semibold">
            <span className="text-sm">{item.quantity}x</span>
            <span className="font-thic text-base">{item.name}</span>
          </p>
          <p className="font-thic text-base font-semibold">
            {parseFloat(item.price * item.quantity).toFixed(2)}
          </p>
        </li>
        <li className="flex items-center justify-between gap-2">
          <button
            onClick={() => dispatch(decrementQuantity(item.id))}
            className="hover:bg-gray-200 flex items-center justify-center p-1 bg-gray-100 rounded-full"
          >
            <FiMinus size={15} className="text-gray-700" />
          </button>

          <button
            onClick={() => dispatch(incrementQuantity(item.id))}
            className="hover:bg-gray-200 flex items-center justify-center p-1 bg-gray-100 rounded-full"
          >
            <FiPlus size={15} className="text-gray-700" />
          </button>
        </li>
      </ul>
    </div>
  );
};

// icons
const MinusIcon = (props) => {
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
};

const PlusIcon = (props) => {
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
};

const TrashIcon = (props) => {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
};

{
  /* <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="dark:text-gray-50 text-lg font-semibold text-gray-900">
                Shopping Cart
              </h2>

              <Button
                style={{
                  backgroundColor: customization?.selectedPrimaryColor,
                  //   color: customization?.selectedTextColor,
                }}
                className="font-thic text-white"
                onClick={() => dispatch(removeAll())}
              >
                Clear Cart
              </Button>
            </div>

            {cartItems.length === 0 ? (
              <p className="dark:text-gray-400 mt-2 text-center text-gray-600">
                Your cart is empty.
              </p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} infoRes={resInfo} />
                ))}

                <div className="flex items-center justify-between mb-16">
                  <p className="dark:text-gray-400 text-sm text-gray-700">
                    Total:
                    <span className="dark:text-gray-50 font-medium text-gray-900">
                      {" "}
                      {totalCost.toFixed(2) + " " + resInfo?.currency}
                    </span>
                  </p>

                  <Button
                    onClick={() =>
                      setOrderSuccessModalOpen(!orderSuccessModalOpen)
                    }
                    style={{
                      backgroundColor: customization?.selectedPrimaryColor,
                      //   color: customization?.selectedTextColor,
                    }}
                    className="px-4 py-2 text-white rounded-lg"
                    size="lg"
                  >
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </div> */
}

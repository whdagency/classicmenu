import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useMenu } from "../hooks/useMenu";
import { APIURL } from "../lib/ApiKey";
import { TbMessage2Question } from "react-icons/tb";
import ThemeOneRating from "../Rating/ThemeOneRating";
import ThemeOneClaims from "../Claims/ThemeOneClaims";

const ThemeOneFooter = () => {
  const { customization, table_id, restos, restoSlug } = useMenu();

  // submit bill
  const submitBill = async () => {
    try {
      const notification = {
        title: "Asking For Bill",
        status: "Bill",
        resto_id: restos.id,
        table_id: table_id,
      };
      const responseNotification = await fetch(`${APIURL}/api/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification),
      });

      if (responseNotification) {
        console.log("Nice => ", responseNotification);
      }
      // Handle post-order submission logic here, like clearing the cart or redirecting the user
    } catch (error) {
      console.error("Failed to submit order:", error.message);
    }
  };

  return (
    <footer className="h-14 md:max-w-sm bottom-5 bg-black/70 fixed z-50 flex items-center justify-center w-full max-w-xs gap-5 mx-auto mb-1 rounded">
      <div className="flex items-center justify-around w-full">
        {/* <Claims items={restos} table_id={table_id} /> */}
        <ThemeOneRating />

        <CallWaiter
          customization={customization}
          submitOrder={null}
          submitBill={submitBill}
        />

        <ThemeOneClaims />
      </div>
    </footer>
  );
};

export default ThemeOneFooter;

// Icon Buttons
const FooterButton = ({ icon: Icon, customization, label }) => {
  return (
    <Button
      //   style={{
      // color: customization?.selectedSecondaryColor,
      //   }}
      className={`flex items-center justify-center gap-1.5 bg-transparent hover:bg-transparent`}
    >
      <Icon size={25} />
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
};

// call a waiter
const CallWaiter = ({ customization, submitOrder, submitBill }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
          size="icon"
          style={{ backgroundColor: customization?.selectedPrimaryColor }}
        >
          <img
            src={"/assets/waiter-icon.svg"}
            alt="Waiter Icon"
            className="w-8 h-8"
          />
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
        <AlertDialogFooter className="flex !flex-col !justify-center  w-full gap-4">
          <AlertDialogAction className="w-full !px-0" onClick={submitOrder}>
            Call Waiter
          </AlertDialogAction>
          <AlertDialogAction className="w-full !ml-0" onClick={submitBill}>
            Bring the bill
          </AlertDialogAction>
          <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

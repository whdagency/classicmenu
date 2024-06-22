import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useMenu } from "../hooks/useMenu";
import { APIURL } from "../lib/ApiKey";
import ThemeOneRating from "../Rating/ThemeOneRating";
import ThemeOneClaims from "../Claims/ThemeOneClaims";
import { X } from "lucide-react";

const ThemeOneFooter = () => {
  const { customization, table_id, restos, restoSlug } = useMenu();
  const [openSubmitBillModal, setOpenSubmitBillModal] = useState(false);

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

        setOpenSubmitBillModal(true);
      }
      // Handle post-order submission logic here, like clearing the cart or redirecting the user
    } catch (error) {
      console.error("Failed to submit order:", error.message);
    }
  };

  return (
    <footer className="h-14 md:max-w-sm bottom-5 bg-black/70 fixed z-50 flex items-center justify-center w-full max-w-xs gap-5 mx-auto rounded">
      <div className="flex items-center justify-around w-full">
        <ThemeOneRating />

        <CallWaiter
          customization={customization}
          submitOrder={null}
          submitBill={submitBill}
        />

        <ThemeOneClaims />
      </div>

      <SubmitBillModal
        openSubmitBillModal={openSubmitBillModal}
        setOpenSubmitBillModal={setOpenSubmitBillModal}
      />
    </footer>
  );
};

export default ThemeOneFooter;

// call a waiter
const CallWaiter = ({ customization, submitOrder, submitBill }) => {
  const [openWaiterModal, setOpenWaiterModal] = useState(false);
  return (
    <section>
      <Button
        onClick={() => setOpenWaiterModal((prev) => !prev)}
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

      <div
        className={`flex flex-col ${openWaiterModal ? "transition-transform scale-100 translate-y-0 duration-500" : "transition-transform scale-0 duration-500 translate-y-20"} shadow items-center justify-center gap-3 py-5 px-10 w-[95%] md:w-[80%] mx-auto bg-black/70 absolute bottom-14 left-1/2 transform -translate-x-1/2 rounded-t-full`}
      >
        <div className="flex items-center justify-center w-full gap-1 mt-2 font-sans">
          <div className="flex flex-row items-center justify-center gap-5">
            <div className="flex flex-col items-center justify-center gap-2">
              <Button
                onClick={submitOrder}
                className="hover:bg-gray-200 flex items-center justify-center w-12 h-12 p-2 bg-white rounded-full shadow-lg"
                size="icon"
              >
                <img
                  src={"/assets/call-waiter.svg"}
                  alt="Call Waiter"
                  className="object-cover w-full h-full"
                />
              </Button>
              <p className="text-[10px] font-medium text-white">Call Waiter</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <Button
                onClick={submitBill}
                className="hover:bg-gray-200 flex items-center justify-center w-12 h-12 p-1 bg-white rounded-full shadow-lg"
                size="icon"
              >
                <img
                  src={"/assets/bring-bill.svg"}
                  alt="Waiter Icon"
                  className="object-cover w-full h-full"
                />
              </Button>
              <p className="text-[10px] font-medium text-white">Bring Bill</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <Button
                onClick={() => setOpenWaiterModal((prev) => !prev)}
                className="hover:bg-gray-200 flex items-center justify-center w-12 h-12 p-2 bg-white rounded-full shadow-lg"
                size="icon"
              >
                <X size={25} className="text-black" />
              </Button>
              <p className="text-[10px] font-medium text-white">Cancel</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SubmitBillModal = ({ openSubmitBillModal, setOpenSubmitBillModal }) => {
  return (
    <AlertDialog
      open={openSubmitBillModal}
      onOpenChange={setOpenSubmitBillModal}
    >
      <AlertDialogContent className="w-[80%] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Bill Requested!</AlertDialogTitle>
          <AlertDialogDescription>
            The bill will be sent to you shortly. <br /> Thank you for using our
            service.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            autoFocus
            onClick={() => setOpenSubmitBillModal((prev) => !prev)}
          >
            Ok
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useMenu } from "../hooks/useMenu";
import { APIURL } from "../lib/ApiKey";
import ThemeOneRating from "../Rating/ThemeOneRating";
import ThemeOneClaims from "../Claims/ThemeOneClaims";
import { X } from "lucide-react";

const ThemeOneFooter = () => {
  const { customization, table_id, restos, restoSlug } = useMenu();
  const [openSubmitItemModal, setOpenSubmitItemModal] = useState({
    open: false,
    title: "",
    description: "",
  });

  // get resto id
  const resto_id = restos.id;

  // submit notification for waiter or bill
  const submitNotification = async ({
    type,
    title,
    alertDialogTitle,
    alertDialogDescription,
  }) => {
    try {
      const notification = {
        title: title,
        status: type,
        resto_id: resto_id,
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
        console.log("Notification Response => ", responseNotification);

        setOpenSubmitItemModal({
          open: true,
          // title: "Bill Requested!",
          title: alertDialogTitle,
          description: alertDialogDescription,
          // description: "The bill will be sent to you shortly.",
        });
      }
    } catch (error) {
      console.error("Failed to submit notification:", error.message);
    }
  };

  return (
    <footer
      style={{ backgroundColor: customization?.selectedPrimaryColor }}
      className="h-14 md:max-w-sm bottom-5 fixed z-50 flex items-center justify-center w-full max-w-xs gap-5 mx-auto rounded"
    >
      <div className="flex items-center justify-around w-full">
        <ThemeOneRating />

        <CallWaiter
          customization={customization}
          submitNotification={submitNotification}
        />

        <ThemeOneClaims />
      </div>

      <SubmitItemModal
        openSubmitItemModal={openSubmitItemModal}
        setOpenSubmitItemModal={setOpenSubmitItemModal}
      />
    </footer>
  );
};

export default ThemeOneFooter;

// call a waiter
const CallWaiter = ({ customization, submitNotification }) => {
  const [openWaiterModal, setOpenWaiterModal] = useState(false);
  const modalRef = useRef();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setOpenWaiterModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCallWaiter = () => {
    submitNotification({
      type: "Waiter",
      title: "New Call For Waiter",
      alertDialogTitle: "Waiter Requested!",
      alertDialogDescription: "The waiter will be sent to you shortly.",
    });
  };

  const handleBringBill = () => {
    submitNotification({
      type: "Bill",
      title: "Asking For Bill",
      alertDialogTitle: "Bill Requested!",
      alertDialogDescription: "The bill will be sent to you shortly.",
    });
  };

  return (
    <section ref={modalRef}>
      <Button
        onClick={() => setOpenWaiterModal((prev) => !prev)}
        className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
        size="icon"
        style={{ backgroundColor: customization?.selectedPrimaryColor }}
        id="call-waiter-button"
      >
        <img
          src={"/assets/waiter-icon.svg"}
          alt="Waiter Icon"
          className="w-8 h-8"
          id="call-waiter-button-img"
        />
      </Button>

      <div
        style={{ backgroundColor: customization?.selectedPrimaryColor }}
        className={`flex flex-col ${
          openWaiterModal
            ? "transition-transform scale-100 translate-y-0 duration-500"
            : "transition-transform scale-0 duration-500 translate-y-20"
        } shadow items-center justify-center gap-3 py-5 px-10 w-[95%] md:w-[80%] mx-auto bg-black/70 absolute bottom-14 left-1/2 transform -translate-x-1/2 rounded-t-full`}
      >
        <div className=" flex items-center justify-center w-full gap-1 mt-2">
          <div className="flex flex-row items-center justify-center gap-5">
            <div className="flex flex-col items-center justify-center gap-2">
              <Button
                onClick={handleCallWaiter}
                className="hover:bg-gray-200 flex items-center justify-center w-12 h-12 p-2 bg-white rounded-full shadow-lg"
                size="icon"
                style={{
                  color: customization?.selectedSecondaryColor,
                }}
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
                onClick={handleBringBill}
                className="hover:bg-gray-200 flex items-center justify-center w-12 h-12 p-1 bg-white rounded-full shadow-lg"
                size="icon"
                style={{
                  color: customization?.selectedSecondaryColor,
                }}
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
                style={{
                  color: customization?.selectedSecondaryColor,
                }}
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

const SubmitItemModal = ({ openSubmitItemModal, setOpenSubmitItemModal }) => {
  return (
    <AlertDialog
      open={openSubmitItemModal.open}
      // onOpenChange={() =>
      //   setOpenSubmitItemModal((prev) => ({ ...prev, open: !prev.open }))
      // }
    >
      <AlertDialogContent className="w-[80%] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>{openSubmitItemModal.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {openSubmitItemModal.description} <br /> Thank you for using our
            service.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            autoFocus
            onClick={() =>
              setOpenSubmitItemModal((prev) => ({ ...prev, open: !prev.open }))
            }
          >
            Ok
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

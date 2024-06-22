import React, { useState, useRef } from "react";
import { useMenu } from "../hooks/useMenu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { axiosInstance } from "../axiosInstance";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader, X } from "lucide-react";
import { TbMessage2Question } from "react-icons/tb";
import { APIURL } from "../lib/ApiKey";

// zod schema for the form
const formSchema = z
  .object({
    clamer_name: z.string().optional(),
    description: z.string().min(1, "Message is Required").max(500),
    infos: z.optional(z.string()),
    anonymCheckBox: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.anonymCheckBox && data.infos === "") {
      ctx.addIssue({
        code: "custom",
        message: "Please enter your email or phone number",
        path: ["infos"],
      });
    }

    if (!data.anonymCheckBox && data.clamer_name === "") {
      ctx.addIssue({
        code: "custom",
        message: "Please enter your name",
        path: ["clamer_name"],
      });
    }
  });

const ThemeOneClaims = () => {
  const { restos: items, table_id } = useMenu();
  const [orderSuccessModalOpen, setOrderSuccessModalOpen] = useState(false);
  const [anonymChecked, setAnonymChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clamer_name: "",
      infos: "",
      description: "",
      anonymCheckBox: false,
    },
  });

  const toggleDisabled = () => {
    setAnonymChecked(!anonymChecked); // Toggle checkbox state
    setDisabled(!disabled); // Toggle disabled state
  };

  // submit claim
  const onSubmit = async (data) => {
    try {
      // If the checkbox is checked, send only the description
      const res = await axiosInstance.post("/api/claims", {
        description: data.description,
        clamer_name: data.clamer_name == "" ? "Annonymos" : data.clamer_name,
        email: data.infos == "" ? null : data.infos,
        resto_id: items.id,
      });
      if (res) {
        reset();
        console.log("Return Successfully");
        // toast.success('Event has been created');
        const notification = {
          title: "New Claim",
          status: "Claim",
          resto_id: items.id,
          table_id: table_id,
        };
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
        setOrderSuccessModalOpen(true);
      }
    } catch (err) {
      console.log("The err =>", err);
      Object.entries(response.data.errors).forEach((error) => {
        const [fieldName, errorMessages] = error;
        setError(fieldName, {
          message: errorMessages.join(),
        });
      });
    }
  };

  return (
    <>
      <Drawer>
        <DrawerTrigger className="flex items-center justify-center gap-1.5 bg-transparent hover:bg-transparent">
          <TbMessage2Question size={25} className="text-white" />
          <span className="text-xs font-medium text-white">Claims</span>
        </DrawerTrigger>

        <DrawerContent className="scrollbar-hide ms-auto flex flex-col items-center justify-center w-full h-full max-w-md max-h-screen">
          <DrawerClose className="right-5 top-5 absolute z-10 flex items-center justify-center w-8 h-8 p-1 border border-gray-500 rounded-full">
            <X size={20} className="text-gray-500" />
          </DrawerClose>

          <div className="scrollbar-hide w-full h-screen max-w-md p-6 overflow-y-scroll rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-black/10 flex items-center justify-center w-16 h-16 p-2 rounded-full">
                  <img
                    src="/assets/complaint.svg"
                    alt="Complait"
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
                <h2 className="text-3xl font-bold text-black">Make A Claim</h2>
              </div>
              <p className="dark:text-gray-400 text-center text-gray-800">
                Tell us about your recent experience at our restaurant.
              </p>

              <form
                method="post"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                <div
                  className={`relative w-full ${disabled ? "bg-gray-100" : "bg-gray-200"} rounded`}
                >
                  <input
                    type="text"
                    name="clamer_name"
                    id="clamer_name"
                    disabled={disabled}
                    {...register("clamer_name", {
                      required: disabled ? false : true,
                    })}
                    className="peer focus:outline-none focus:ring-0 focus:border-0 dark:text-gray-300 block w-full py-3 pl-3 pr-10 text-sm text-gray-700 placeholder-transparent bg-transparent border-0 rounded-md"
                    placeholder="your name"
                  />
                  <label
                    htmlFor="clamer_name"
                    className={`left-4 top-1/2 peer-focus:top-0 peer-focus:left-2 peer-focus:text-xs peer-focus:text-gray-700 absolute text-sm font-medium text-gray-700 transition-all transform -translate-y-1/2 ${watch("clamer_name") !== "" ? "-top-0 left-2 text-xs text-gray-700" : ""}`}
                  >
                    Name (optional)
                  </label>
                </div>
                {errors.clamer_name && !getValues("anonymCheckBox") && (
                  <p className="-mt-4 text-sm text-red-600">
                    {errors.clamer_name?.message}
                  </p>
                )}

                <div
                  className={`relative w-full ${disabled ? "bg-gray-100" : "bg-gray-200"} rounded`}
                >
                  <input
                    type="text"
                    name="infos"
                    id="infos"
                    disabled={disabled}
                    {...register("infos", {
                      required: disabled ? false : true,
                    })}
                    className="peer focus:outline-none focus:ring-0 focus:border-0 dark:text-gray-300 block w-full py-3 pl-3 pr-10 text-sm text-gray-700 placeholder-transparent bg-transparent border-0 rounded-md"
                    placeholder="Email or phone"
                  />
                  <label
                    htmlFor="infos"
                    className={`left-4 top-1/2 peer-focus:top-0 peer-focus:left-2 peer-focus:text-xs peer-focus:text-gray-700 absolute text-sm font-medium text-gray-700 transition-all transform -translate-y-1/2 ${watch("infos") !== "" ? "-top-0 left-2 text-xs text-gray-700" : ""}`}
                  >
                    Email or phone
                  </label>
                </div>
                {errors.infos && !getValues("anonymCheckBox") && (
                  <p className="-mt-4 text-sm text-red-600">
                    {errors.infos?.message}
                  </p>
                )}

                <div className="relative flex items-center w-full gap-2 rounded">
                  <Checkbox
                    checked={getValues("anonymCheckBox")}
                    {...register("anonymCheckBox")}
                    onCheckedChange={(value) => {
                      setValue("anonymCheckBox", value);
                      toggleDisabled();
                    }}
                    name="anonymCheckBox"
                    id="anonymCheckBox"
                  />
                  <label
                    htmlFor="anonymCheckBox"
                    className="text-sm text-gray-700"
                  >
                    Submit feedback anonymously
                  </label>
                </div>

                <div className="relative w-full px-4 py-2 bg-gray-200 rounded">
                  <textarea
                    rows={5}
                    type="text"
                    name="description"
                    id="description"
                    {...register("description")}
                    className="peer block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-sm text-gray-700 placeholder-transparent focus:outline-none focus:ring-0 focus:border-0 dark:text-gray-300 bg-transparent"
                    placeholder="Write your thoughts here..."
                  />
                  <label
                    htmlFor="description"
                    className={`left-4 top-1/2 peer-focus:top-0 peer-focus:left-2 peer-focus:text-xs peer-focus:text-gray-700 absolute text-sm font-medium text-gray-700 transition-all transform -translate-y-1/2 ${watch("description") !== "" ? "-top-0 left-2 text-xs text-gray-700" : ""}`}
                  >
                    Write your thoughts here...
                  </label>
                </div>
                {errors.description && (
                  <p className="-mt-4 text-sm text-red-600">
                    {errors.description?.message}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <Button
                    className="hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-offset-gray-800 px-4 py-2 my-4 font-medium text-white bg-gray-900 rounded-md"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader className={"mx-2 my-2 animate-spin"} />
                    )}{" "}
                    Submit Feedback
                  </Button>

                  <Button
                    className="hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-offset-gray-800 px-4 py-2 my-4 font-medium text-white bg-gray-900 rounded-md"
                    type="button"
                    onClick={() => reset()}
                  >
                    Reset
                  </Button>
                </div>
              </form>

              <AlertDialog
                open={orderSuccessModalOpen}
                onOpenChange={setOrderSuccessModalOpen}
              >
                <AlertDialogContent className="w-[80%] rounded-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Your claim has been successfully submitted
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Thank you for your Claim!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction
                      autoFocus
                      onClick={() =>
                        setOrderSuccessModalOpen(!orderSuccessModalOpen)
                      }
                    >
                      Ok
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ThemeOneClaims;

const SmileIcon = (props) => {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
};

import React, { useState, useRef } from "react";
import { useMenu } from "../hooks/useMenu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.jsx";
import { axiosInstance } from "../axiosInstance";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { TbMessage2Question } from "react-icons/tb";
import { APIURL } from "../lib/ApiKey";

// zod schema for the form
const formSchema = z.object({
  clamer_name: z.string().optional(),
  description: z.string().min(1, "Message is Required").max(500),
  infos: z.optional(z.string()),
  anonymCheckBox: z.boolean().default(false),
});

const ThemeOneClaims = () => {
  const { restos: items, table_id } = useMenu();
  const searchInputRef = useRef(null);

  const [orderSuccessModalOpen, setOrderSuccessModalOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const [anonymChecked, setAnonymChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const toggleDisabled = () => {
    setAnonymChecked(!anonymChecked); // Toggle checkbox state
    setDisabled(!disabled); // Toggle disabled state
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clamer_name: "",
      infos: "",
      description: "",
      anonymCheckBox: false,
    },
  });
  const {
    setError,
    formState: { isSubmitting },
    reset,
  } = form;

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
    <Dialog>
      <DialogTrigger className="flex items-center justify-center gap-1.5 bg-transparent hover:bg-transparent">
        <TbMessage2Question size={25} className="text-white" />
        <span className="text-xs font-medium text-white">Claims</span>
      </DialogTrigger>

      <DialogContent className="scrollbar-hide flex flex-col items-center justify-center h-full overflow-y-scroll">
        <div className="w-full h-full max-w-md p-6 rounded-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="md:text-5xl lg:text-6xl dark:text-white mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900">
                Make A{" "}
                <span className="underline underline-offset-3 decoration-8 decoration-[#28509E] dark:decoration-blue-600">
                  Claims
                </span>
              </h1>
              <div className="flex items-center space-x-2">
                <button className="hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 p-2 rounded-full">
                  <SmileIcon className="dark:text-gray-400 w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <p className="dark:text-gray-400 text-gray-600">
              Tell us about your recent experience at our restaurant.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="clamer_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name (optional)</FormLabel>
                          <FormControl>
                            <input
                              className={cn(
                                "flex h-10 w-full rounded-[.5rem] border border-input bg-background px-3 placeholder:text-sm py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              )}
                              ref={searchInputRef}
                              disabled={disabled}
                              placeholder="Enter your name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="infos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-nowrap">
                            Email or phone(optional)
                          </FormLabel>
                          <FormControl>
                            <input
                              className={cn(
                                "flex h-10 w-full rounded-[.5rem] border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-sm"
                              )}
                              ref={searchInputRef}
                              disabled={disabled}
                              placeholder="Email or phone...."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className=" col-span-2">
                    <FormField
                      control={form.control}
                      name="anonymCheckBox"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start mb-4 space-x-2 space-y-0 border-0 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(value) => {
                                field.onChange(value);
                                toggleDisabled();
                              }}
                            />
                          </FormControl>
                          <div className="leading-none">
                            <FormLabel>Submit feedback anonymously</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <textarea
                          className={cn(
                            "flex min-h-[180px]  w-full bg-gray-100 text-gray-900 rounded-md border border-gray-300 px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                          )}
                          placeholder="Write your thoughts here..."
                          value={desc}
                          onChange={(e) => setDesc(e.target.value)}
                          rows={5}
                          ref={searchInputRef}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                </div>
              </form>
            </Form>

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
      </DialogContent>
    </Dialog>
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

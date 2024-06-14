import React from "react";
import { useMenu } from "../hooks/useMenu";
import Spinner from "react-spinner-material";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";
import Trust from "./trustpilot-2.svg";
import Google from "./icons8-google.svg";

const ThemeOneRating = () => {
  const { resInfo } = useMenu();

  if (!resInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner
          size={100}
          spinnerColor={"#28509E"}
          spinnerWidth={1}
          visible={true}
          style={{ borderColor: "#28509E", borderWidth: 2 }}
        />
      </div>
    );
  }

  // get the google business and trustpilot link from the resInfo object
  const { google_buss, trustpilot_link } = resInfo;
  const hasGoogle = google_buss !== null && google_buss !== "";
  const hasTrustpilot = trustpilot_link !== null && trustpilot_link !== "";

  return (
    <Dialog>
      <DialogTrigger className="flex items-center justify-center gap-1.5 bg-transparent hover:bg-transparent">
        <FaRegStar size={25} className="text-white" />
        <span className="text-xs font-medium text-white">Rating</span>
      </DialogTrigger>

      <DialogContent>
        <main className="flex flex-col items-center justify-center h-[80vh] px-4">
          <div className="space-y-6 text-center">
            <h1 className="text-2xl font-bold text-[#333] dark:text-[#f8f8f8]">
              Leave us a review!
            </h1>
            {(hasGoogle || hasTrustpilot) && (
              <p className="text-[#666] dark:text-[#ccc]">
                Tap a button below to share your experience.
              </p>
            )}
            <div className="grid w-full grid-cols-1 gap-4">
              {hasGoogle && (
                <Link
                  className="hover:bg-blue-400 hover:text-white flex items-center justify-center gap-2 px-4 py-6 font-bold text-black transition-colors bg-gray-200 rounded-lg"
                  to={google_buss}
                  target="_blank"
                >
                  <img
                    src={Google}
                    alt="Google Reviews"
                    className="w-8 h-8 mr-2"
                  />
                  Google Reviews
                </Link>
              )}
              {hasTrustpilot && hasGoogle && (
                <p className="text-[#666] dark:text-[#ccc]">Or</p>
              )}
              {hasTrustpilot && (
                <Link
                  className="bg-gray-200 hover:bg-[#009967] hover:text-white text-black font-bold py-6 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  to={trustpilot_link}
                  target="_blank"
                >
                  <img src={Trust} alt="TrustPilot" className="w-8 h-8 mr-2" />
                  Trustpilot Reviews
                </Link>
              )}
              {!hasGoogle && !hasTrustpilot && (
                <p className="text-[#666] dark:text-[#ccc]">
                  We&apos;re working on adding review functionality soon. Stay
                  tuned!
                </p>
              )}
            </div>
          </div>
        </main>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeOneRating;

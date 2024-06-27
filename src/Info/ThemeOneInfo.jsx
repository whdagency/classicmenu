import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useMenu } from "../hooks/useMenu";
import Spinner from "react-spinner-material";
import { APIURL } from "../lib/ApiKey";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaSnapchat,
  FaYoutube,
} from "react-icons/fa";
import { Check, CopyIcon, PhoneIcon } from "lucide-react";
import { Link } from "react-router-dom";

const ThemeOneInfo = ({ activeLink }) => {
  const { customization, resInfo, restos } = useMenu();
  const [passwordCopied, setPasswordCopied] = useState(false);

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

  const socialMediaLinks = [
    { icon: FaFacebook, link: resInfo.facebook },
    { icon: FaInstagram, link: resInfo.instgram },
    { icon: FaTiktok, link: resInfo.tiktok },
    { icon: FaSnapchat, link: resInfo.snapshat },
    { icon: FaYoutube, link: resInfo.youtube },
  ].filter((item) => item.link); // Filter out

  return (
    <Dialog>
      <DialogTrigger>
        <IoInformationCircleOutline
          size={30}
          style={{
            color: activeLink
              ? customization?.selectedPrimaryColor
              : customization?.selectedSecondaryColor,
          }}
          className="text-white"
        />
      </DialogTrigger>

      <DialogContent>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <img
              alt="Restaurant Logo"
              className="mb-4 rounded-full"
              height={80}
              src={`${APIURL}/storage/${resInfo.logo}`}
              style={{ aspectRatio: "80/80", objectFit: "cover" }}
              width={80}
            />
            <h1 className="font-thic mb-2 text-2xl font-bold capitalize">
              {restos.name}
            </h1>
            <div className="flex flex-wrap justify-center py-2 mb-6">
              {socialMediaLinks.map((item, index) => (
                <div
                  key={index}
                  className="mix-blend-difference w-10 h-10 rounded-full border border-1 border-grey/50 grid text-[#28509E] place-content-center mx-2 mb-2"
                >
                  <Link to={item.link} target="_blank">
                    <item.icon
                      size={20}
                      color={customization?.selectedIconColor}
                    />
                  </Link>
                </div>
              ))}
            </div>

            <div className="dark:bg-gray-700 w-full p-4 mb-6 bg-gray-100 rounded-lg">
              <h2 className="mb-2 text-lg font-bold">WiFi Password</h2>
              <div className="flex items-center justify-between">
                <span className="dark:text-gray-300 font-medium text-gray-700">
                  {resInfo.wifi_pass}
                </span>
                <div className="flex space-x-2">
                  <Button
                    className="rounded-full"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(resInfo.wifi_pass);
                      setPasswordCopied(true);
                      setTimeout(() => {
                        setPasswordCopied(false);
                      }, 1000);
                    }}
                  >
                    {passwordCopied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <CopyIcon className="w-5 h-5" />
                    )}
                    <span className="sr-only">Copy WiFi Password</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="dark:text-gray-300 flex items-center mb-4 space-x-2 text-gray-700">
              <PhoneIcon className="w-5 h-5" />
              <span>+212 {resInfo.phone}</span>
            </div>

            <div className="dark:text-gray-300 flex items-center mb-4 space-x-2 text-gray-700">
              <span>Address: {resInfo.address}</span>
            </div>

            <div className="mt-4">
              <p className="dark:text-gray-400 px-2 text-gray-500">
                {resInfo.description}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeOneInfo;

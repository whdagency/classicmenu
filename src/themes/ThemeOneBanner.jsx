import React from "react";
import { APIURL } from "../lib/ApiKey";
import { useMenu } from "../hooks/useMenu";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaSnapchat,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { MapPin, Phone } from "lucide-react";

const ThemeOneBanner = () => {
  const { restos, resInfo, customization } = useMenu();
  const addressAvailable =
    resInfo.address && resInfo.address !== "" ? true : false;

  return (
    <div className="w-full h-full md:h-[35vh] relative">
      {/* Cover Image */}
      <img
        src={`${APIURL}/storage/${resInfo.cover_image}`}
        alt={restos.name}
        loading="lazy"
        className="object-cover w-full h-full"
        onError={(e) => (e.target.src = "/assets/placeholder-image.png")}
      />

      {/* Overlay */}
      <div className="bg-gradient-to-t from-black absolute inset-0 z-10 h-full"></div>

      {/* Social Icons */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex justify-between p-4 text-center">
        <div className="flex items-center gap-2">
          {resInfo.facebook && (
            <Link to={resInfo.facebook} target="_blank">
              <FaFacebook color={customization.selectedIconColor} />
            </Link>
          )}
          {resInfo.instgram && (
            <Link to={resInfo.instgram} target="_blank">
              <FaInstagram color={customization.selectedIconColor} />
            </Link>
          )}
          {resInfo.snapshat && (
            <Link to={resInfo.snapshat} target="_blank">
              <FaSnapchat color={customization.selectedIconColor} />
            </Link>
          )}
          {resInfo.youtube && (
            <Link to={resInfo.youtube} target="_blank">
              <FaYoutube color={customization.selectedIconColor} />
            </Link>
          )}
          {resInfo.tiktok && (
            <Link to={resInfo.tiktok} target="_blank">
              <FaTiktok color={customization.selectedIconColor} />
            </Link>
          )}
        </div>
      </div>

      {/* About Restaurant  */}
      <div className="absolute bottom-0 right-0 z-20 flex justify-between px-4 py-3 text-center">
        <div
          className={`${
            addressAvailable && resInfo.address.length > 20
              ? "flex-col items-end"
              : "flex-row items-center"
          } md:gap-5 md:flex-row md:items-center flex gap-3`}
        >
          {resInfo.phone && (
            <p className="md:text-sm flex items-center gap-2 text-xs text-white">
              <Phone size={18} />:<span>{resInfo.phone}</span>
            </p>
          )}
          {addressAvailable && (
            <p className="md:text-sm flex items-center gap-2 text-xs text-white">
              <MapPin size={18} />:<span>{resInfo.address}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeOneBanner;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { APIURL } from "../lib/ApiKey";
import ThemeOneInfo from "../Info/ThemeOneInfo";
import ThemeOneAchat from "../Achat/ThemeOneAchat";

const ThemeOneHeader = () => {
  const location = useLocation();
  const { restoSlug, restos, resInfo, customization, table_id } = useMenu();

  return (
    <header
      style={{ backgroundColor: customization?.selectedBgColor }}
      className="md:max-w-2xl md:w-full md:top-2 fixed top-0 z-50 flex items-center justify-between w-screen px-5 py-3 mx-auto uppercase bg-white shadow"
    >
      <Link
        to={`/menu/${restoSlug}?table_id=${table_id}`}
        className="flex items-center gap-2 font-bold"
        style={{ color: customization?.selectedPrimaryColor }}
      >
        <img
          src={`${APIURL}/storage/${resInfo.logo}`}
          alt={restos.name}
          loading="lazy"
          className="hidden object-contain w-10 h-10"
          onError={(e) => (e.target.src = "/assets/placeholder-image.png")}
        />
        <span className="font-antic md:text-2xl text-xl text-black">
          {restos.name || "Garista"}
        </span>
      </Link>

      <ul className="flex items-center gap-6">
        <ThemeOneInfo
          activeLink={location.pathname === `/menu/${restoSlug}/info`}
        />

        <ThemeOneAchat
          activeLink={location.pathname === `/menu/${restoSlug}/Achat`}
        />
      </ul>
    </header>
  );
};

export default ThemeOneHeader;

const NavLink = ({ to, activeLink, icon: Icon }) => {
  const { customization } = useMenu();

  return (
    <Link to={to}>
      <Icon
        size={30}
        style={{
          color: activeLink
            ? customization?.selectedPrimaryColor
            : customization?.selectedSecondaryColor,
        }}
        className="text-white"
      />
    </Link>
  );
};

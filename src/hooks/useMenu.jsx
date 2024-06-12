import { useContext } from "react";
import { MenuContext } from "../providers/MenuProvider";

export const useMenu = () => useContext(MenuContext);

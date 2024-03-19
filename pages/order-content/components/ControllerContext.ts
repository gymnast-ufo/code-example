import { createContext } from "react";
import useOrderContentController from "../order-content.controller";

const defaultValue: ReturnType<useOrderContentController> = {};

export const ControllerContext = createContext(defaultValue);

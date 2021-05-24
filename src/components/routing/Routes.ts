import Clients from "../../pages/admin/Clients";
import Lawyers from "../../pages/admin/Lawyers";
import Messages from "../../pages/chat/Messages";
import LawyersList from "../../pages/client/LawyersList";
import Dashboard from "../../pages/dashboard/Dashboard";
import LawyerContracts from "../../pages/lawyer/Contracts";
import ClientContracts from "../../pages/client/Contracts";
import SearchResults from "../../pages/search/SearchResults";
import ChangePassword from "../authenticate/ChangePassword";

export interface IRoute {
  path: string;
  name: string ;
  icon: any;
  component: any;
  layout: string;
}
const Routes: IRoute[] = [
  {
    path: "/change-password",
    name: "",
    icon: null,
    component: ChangePassword,
    layout: "other",
  },
  {
    path: "/search-result",
    name: "",
    icon: null,
    component: SearchResults,
    layout: "other",
  },
  {
    path: "/dashboard",
    name:"Dashboard",
    icon: null,
    component: Dashboard,
    layout: "user",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: null,
    component: Dashboard,
    layout: "lawyer",
  },
  {
    path: "/messages",
    name: "Messages",
    icon: null,
    component: Messages,
    layout: "user",
  },
  {
    path: "/messages",
    name: "Messages",
    icon: null,
    component: Messages,
    layout: "lawyer",
  },
  {
    path: "/lawyer-contracts",
    name: "Contracts",
    icon: null,
    component: LawyerContracts,
    layout: "lawyer",
  },
  {
    path: "/lawyers-list",
    name: "Lawyers",
    icon: null,
    component: LawyersList,
    layout: "user",
  },
  {
    path: "/client-contracts",
    name: "Contracts",
    icon: null,
    component: ClientContracts,
    layout: "user",
  },
  {
    path: "/lawyers",
    name: "Lawyers",
    icon: null,
    component: Lawyers,
    layout: "admin",
  },
  {
    path: "/clients",
    name: "Clients",
    icon: null,
    component: Clients,
    layout: "admin",
  },
];

export default Routes;

export const pathes = Routes.map((route) => route.path);

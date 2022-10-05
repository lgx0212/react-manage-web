import { Navigate } from "react-router-dom";
import Home from "../views/Home";
import Login from "../views/Login";
import Index404 from "../views/404";
import FrontPage from "../views/Home/views/FrontPage";
import RightList from "../views/Home/views/RightManage/RightList";
import RoleList from "../views/Home/views/RightManage/RoleList";
import UserManage from "../views/Home/views/UserManage";

import NewsAdd from "../views/Home/views/NewsManage/NewsAdd";
import NewsDraft from "../views/Home/views/NewsManage/NewsDraft";
import NewsCategory from "../views/Home/views/NewsManage/NewsCategory";
import Audit from "../views/Home/views/AuditManage/Audit";
import AuditList from "../views/Home/views/AuditManage/AuditList";
import Unpublished from "../views/Home/views/PublishManage/Unpublished";
import Published from "../views/Home/views/PublishManage/Published";
import Sunset from "../views/Home/views/PublishManage/Sunset";
import axios from "axios";
import News from "../views/News";
const userinfo = JSON.parse(sessionStorage.getItem('token'))
let rights = []
if (userinfo){
  rights = userinfo.role.rights
}
let allMenu = []
Promise.all([
  axios.get('/api1/rights?&pagepermisson=1'),
  axios.get('/api1/children?&pagepermisson=1')
]).then(res=>{
  allMenu = [...res[0].data,...res[1].data] 
  console.log(allMenu)
  element[1].children = routerGuard()
})
let element = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: sessionStorage.getItem("token") ? (
      <Home />
    ) : (
      <Navigate to={"/login"} />
    ),
    children: [
      {
        path: "/home",
        element: <FrontPage />,
      },
      {
        path: "/home/right-manage/role/list",
        element: <RoleList />,
      },
      {
        path: "/home/right-manage/right/list",
        element: <RightList />,
      },
      {
        path: "/home/user-manage/list",
        element: <UserManage />,
      },
      {
        path: "/home/news-manage/add",
        element: <NewsAdd />,
      },
      {
        path: "/home/news-manage/draft",
        element: <NewsDraft />,
      },
      {
        path: "/home/news-manage/category",
        element: <NewsCategory />,
      },
      {
        path: "/home/audit-manage/audit",
        element: <Audit />,
      },
      {
        path: "/home/audit-manage/list",
        element: <AuditList />,
      },
      {
        path: "/home/publish-manage/unpublished",
        element: <Unpublished />,
      },
      {
        path: "/home/publish-manage/published",
        element: <Published />,
      },
      {
        path: "/home/publish-manage/sunset",
        element: <Sunset />,
      },
      {
        path: "*",
        element: <Index404 />,
      },
    ],
  },
  {
    path: "/news",
    element: <News />,
  },
  {
    path: "/404",
    element: <Index404 />,
  },
  {
    path: "/",
    element: <Navigate to={"/home"} />,
  },
  {
    path: "*",
    element: <Index404 />,
  },
];
function routerGuard(){
  let arr = []
  element[1].children.forEach(item=>{
    let menuObj = []
    allMenu.forEach(menu=>{
      if(menu.key === item.path){
        menuObj = menu
      }
    })
    if(rights.includes(item.path) && menuObj.pagepermisson){
      arr.push(item)
    }
    
  })
  return arr
}

console.log(element)
export default element;

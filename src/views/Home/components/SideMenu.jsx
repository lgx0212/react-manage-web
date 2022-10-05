import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import "./SideMenu.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AppstoreOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
const { Sider } = Layout;

function getItem(key, icon, label, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return { isCollapsed: isCollapsed };
};
export default connect(mapStateToProps)(function SideMenu(props) {
  const currentPath = [useLocation().pathname];
  const currentMenu =
    "/" + currentPath[0].split("/")[1] + "/" + currentPath[0].split("/")[2];
  // console.log(currentMenu);
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();
  //控制菜单显示/隐藏
  // const [collapsed] = useState(false);
  const {
    role: { rights },
  } = JSON.parse(sessionStorage.getItem("token"));
  //点击菜单，收起其他展开的所有菜单，保持菜单聚焦简洁
  // const rootSubmenuKeys = ["/home", "/home/user-manage", "/home/right-manage"];
  // const [openKeys, setOpenKeys] = useState(["/home"]);
  // const onOpenChange = (keys) => {
  //   const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

  //   if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
  //     setOpenKeys(keys);
  //   } else {
  //     setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  //   }
  // };
  const onClick = (e) => {
    navigate(e.key);
  };
  // 处理目录结构
  const iconlist = {
    "/home": <AppstoreOutlined />,
    "/home/user-manage": <AppstoreOutlined />,
    "/home/user-manage/list": <AppstoreOutlined />,
    "/home/right-manage": <AppstoreOutlined />,
    "/home/right-manage/role/list": <AppstoreOutlined />,
    "/home/right-manage/right/list": <AppstoreOutlined />,
  };
  const dfs1 = (list) => {
    const arr = [];
    list.map((item) => {
      if (
        item.children &&
        rights.includes(item.key) &&
        item.children.length !== 0
      ) {
        return arr.push(
          getItem(item.key, iconlist[item.key], item.title, dfs1(item.children))
        );
      } else {
        return (
          item.pagepermisson &&
          rights.includes(item.key) &&
          arr.push(getItem(item.key, iconlist[item.key], item.title))
        );
      }
    });
    return arr;
  };
  useEffect(() => {
    axios.get("/api1/rights?_embed=children&pagepermisson=1").then((res) => {
      setMenu(res.data);
    });
  }, []);
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo">XX管理系统</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={currentPath}
            defaultOpenKeys={[currentMenu]}
            // openKeys={openKeys}
            onClick={onClick}
            // onOpenChange={onOpenChange}
            items={dfs1(menu)}
          />
        </div>
      </div>
    </Sider>
  );
});

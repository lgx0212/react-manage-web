import React from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Dropdown, Menu, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
const { Header } = Layout;
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return { isCollapsed: isCollapsed };
};
const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed",
    };
  },
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(sessionStorage.getItem("token"));
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.antgroup.com"
            >
              {userInfo.role.roleName}
            </a>
          ),
        },
        {
          key: "4",
          danger: true,
          label: (
            <div
              onClick={() => {
                exit();
              }}
            >
              退出
            </div>
          ),
        },
      ]}
    />
  );
  const exit = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {React.createElement(
        props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
        {
          className: "trigger",
          onClick: () => {
            props.changeCollapsed();
          },
        }
      )}
      <div style={{ float: "right" }}>
        欢迎{userInfo.username}回来
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
});

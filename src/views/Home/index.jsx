import React from "react";
import SideMenu from "./components/SideMenu";
import TopHeader from "./components/TopHeader";
import { Outlet } from "react-router-dom";
import "./index.css";
import { Layout } from "antd";
import NProgress from 'nprogress'
import  'nprogress/nprogress.css'
import { useEffect } from "react";
const { Content } = Layout;
export default function Home() {
  NProgress.start()
  useEffect(()=>{
    NProgress.done()
  },[])
  return (
    <Layout>
      <SideMenu />
      <Layout className="site-layout">
        <TopHeader />
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow:'auto'
          }}
        >
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  );
}

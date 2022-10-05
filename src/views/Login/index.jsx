import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import "./index.css";
export default function Login() {
  const navigate = useNavigate();
  const loginForm = useRef();
  const token = sessionStorage.getItem("token"); 
  useEffect(() => {
    if (token) {
      navigate("/home");
    } else {
      loginForm.current.setFieldsValue({
        username:'admin',
        password:'123456'
      })
    }
  }, []);

  const onFinish = (value) => {
    console.log(value);
    axios
      .get(
        `/api1/users?username=${value.username}&password=${value.password}&roleState=true&_expand=role`
      )
      .then((res) => {
        if (res.data.length === 0) {
          message.error("账号或密码错误");
        } else {
          message.success("登录成功");
          sessionStorage.setItem("token", JSON.stringify(res.data[0]));
          setTimeout(() => {
            window.location.reload()
          }, 1000);
        }
      });
  };
  return (
    <div style={{ backgroundColor: "rgb(35,39,65)", height: "100%" }}>
      <div className="login-content">
        <div className="login-title">XXX管理系统</div>
        <Form
          ref={loginForm}
          name="basic"
          labelCol={{
            span: 0,
          }}
          wrapperCol={{
            span: 24,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "请输入用户名",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="UserName" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "请输入密码",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="PassWord" />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 0,
              span: 24,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit">
                登录
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

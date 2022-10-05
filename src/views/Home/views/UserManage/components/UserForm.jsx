import React, { useState, useEffect } from "react";
import { Form, Input, Select } from "antd";
import { forwardRef } from "react";
const { Option } = Select;
const UserForm = forwardRef((props, ref) => {
  const [isDisabled, setisDisabled] = useState(false);
  const userInfo = JSON.parse(sessionStorage.getItem('token'))
  useEffect(()=>{
    setisDisabled(props.isDisabled)
  },[props.isDisabled])
  const regionDisabled = (item)=>{
    if(props.isEdit){
      if(userInfo.roleId === 1){
        return false
      } else {
        return true
      }
    } else {
      if(userInfo.roleId === 1){
        return false
      } else {
        return item.value !== userInfo.region
      }
    }
  }
  const roleDisabled = (item)=>{
    if(props.isEdit){
      if(userInfo.roleId === 1){
        return false
      } else {
        return true
      }
    } else {
      if(userInfo.roleId === 1){
        return false
      } else {
        return item.id !== 3
      }
    }
  }

  return (
    <Form ref={ref} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: "请输入",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: "请输入",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={isDisabled?[]:[
          {
            required: true,
            message: "请选择",
          },
        ]}
      >
        <Select
        disabled={isDisabled}
          style={{
            width: "100%",
          }}
        >
          {props.regionList.map((item) => {
            return (
              <Option disabled={regionDisabled(item)} value={item.value} key={item.id}>
                {item.title}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: "请选择",
          },
        ]}
      >
        <Select
          style={{
            width: "100%",
          }}
          onChange={(value) => {
            if (value === 1) {
              setisDisabled(true);
              ref.current.setFieldsValue({
                region: "",
              });
            } else {
              setisDisabled(false);
            }
          }}
        >
          {props.roleList.map((item) => {
            return (
              <Option disabled={roleDisabled(item)} value={item.id} key={item.id}>
                {item.roleName}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
    </Form>
  );
});
export default UserForm;

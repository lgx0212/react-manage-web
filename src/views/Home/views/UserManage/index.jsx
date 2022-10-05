import React, { useState, useEffect, useRef } from "react";
import { Button, Switch, Table, Modal, message } from "antd";
import axios from "axios";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import UserForm from "./components/UserForm";

const { confirm } = Modal;

export default function UserManage() {
  const [userList, setuserList] = useState([]);
  const [tableLoading, settableLoading] = useState(true);
  const [addVisible, setaddVisible] = useState(false);
  const [editVisible, seteditVisible] = useState(false);
  const [regionList, setregionList] = useState([]);
  const [roleList, setroleList] = useState([]);
  const [isdisabled, setisdisabled] = useState(false);
  const [currentUser, setcurrentUser] = useState({});
  const userInfo = JSON.parse(sessionStorage.getItem('token'))
  const userAddForm = useRef();
  const userEditForm = useRef();
  let filtersRegionList = regionList.map((item) => {
    return {
      text: item.title,
      value: item.value,
    };
  });
  filtersRegionList.unshift({
    text: "全球",
    value: "全球",
  });
  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      filters: filtersRegionList,
      onFilter: (value, record) => {
        if (value === "全球") {
          return record.region === "";
        }
        return record.region === value;
      },
      render: (region) => {
        return region ? region : "全球";
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: (role) => {
        return role.roleName;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      render: (item) => {
        return (
          <Switch
            checked={item.roleState}
            disabled={item.default}
            onChange={() => switchChange(item)}
          ></Switch>
        );
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div style={{ display: item.default ? "none" : "block" }}>
            <Button size="small" type="primary" onClick={() => editUser(item)}>
              编辑
            </Button>
            <Button danger size="small" onClick={() => deleteUser(item)}>
              删除
            </Button>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    getList();
    getRegionList();
    getRoleList();
  }, []);
  const getList = () => {
    settableLoading(true);
    axios.get("/api1/users?_expand=role").then((res) => {
      let userList = []
      if(userInfo.roleId === 1){
        userList = res.data
      } else if (userInfo.roleId === 2){
        userList = [...res.data.filter(item=>item.username === userInfo.username),
          ...res.data.filter(item=>item.region === userInfo.region && item.roleId === 3)]
      }
      setuserList(userList);
      settableLoading(false);
    });
  };
  const switchChange = (item) => {
    axios
      .patch(`/api1/users/${item.id}`, {
        roleState: !item.roleState,
      })
      .then(() => {
        getList();
      });
  };
  const getRegionList = () => {
    axios.get(`/api1/regions`).then((res) => {
      setregionList(res.data);
    });
  };
  const getRoleList = () => {
    axios.get(`/api1/roles`).then((res) => {
      setroleList(res.data);
    });
  };
  const editUser = (item) => {
    setcurrentUser(item);
    if (item.roleId === 1) {
      setisdisabled(true);
    } else {
      setisdisabled(false);
    }
    seteditVisible(true);
    setTimeout(() => {
      userEditForm.current.setFieldsValue(item);
    }, 0);
  };
  const deleteUser = (item) => {
    confirm({
      title: "你确定要删除吗？",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        axios.delete(`/api1/users/${item.id}`).then((res) => {
          message.success("删除成功");
          getList();
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const formAddSubmit = () => {
    userAddForm.current
      .validateFields()
      .then((values) => {
        axios
          .post(`/api1/users`, {
            ...values,
            roleState: true,
            default: false,
          })
          .then(() => {
            userAddForm.current.resetFields();
            message.success("添加成功");
            setaddVisible(false);
            getList();
          });
      })
      .catch((info) => {
        message.error("请补全信息");
      });
  };
  const formEditSubmit = () => {
    userEditForm.current
      .validateFields()
      .then((values) => {
        console.log(values);
        axios
          .patch(`/api1/users/${currentUser.id}`, values)
          .then(() => {
            userEditForm.current.resetFields();
            message.success("修改成功");
            seteditVisible(false);
            getList();
          });
      })
      .catch((info) => {
        message.error("请补全信息");
      });
  };
  return (
    <div>
      <Button type="primary" onClick={() => setaddVisible(true)}>
        添加用户
      </Button>
      <Table
        loading={tableLoading}
        columns={columns}
        dataSource={userList}
        rowKey={(item) => item.id}
      ></Table>
      <Modal
        open={addVisible}
        title="新增用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => setaddVisible(false)}
        onOk={() => formAddSubmit()}
      >
        <UserForm
          ref={userAddForm}
          regionList={regionList}
          roleList={roleList}
        ></UserForm>
      </Modal>
      <Modal
        open={editVisible}
        title="编辑用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => seteditVisible(false)}
        onOk={() => formEditSubmit()}
        destroyOnClose
      >
        <UserForm
          ref={userEditForm}
          regionList={regionList}
          roleList={roleList}
          isDisabled={isdisabled}
          isEdit={true}
        ></UserForm>
      </Modal>
    </div>
  );
}

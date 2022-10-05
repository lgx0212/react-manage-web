import React, { useEffect, useState } from "react";
import { Button, Table, Modal, message, Tree } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
const { confirm } = Modal;

export default function RoleList() {
  const [roleList, setRoleList] = useState([]);
  const [rightList, setRightList] = useState([]);
  const [currentRole, setCurrentRole] = useState([]);
  const [currentId, setCurrentId] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button size="small" type="primary" onClick={() => editRoles(item)}>
              编辑
            </Button>
            <Button size="small" danger onClick={() => deleteRoles(item)}>
              删除
            </Button>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    getList();
    getRightList();
  }, []);
  const getList = () => {
    setTableLoading(true);
    axios.get(`/api1/roles`).then((res) => {
      setRoleList(res.data);
      setTableLoading(false);
    });
  };
  const getRightList = () => {
    axios.get(`/api1/rights?_embed=children`).then((res) => {
      setRightList(res.data);
    });
  };
  const deleteRoles = (item) => {
    confirm({
      title: "你确定要删除吗？",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        axios.delete(`/api1/roles/${item.id}`).then((res) => {
          message.success("删除成功");
          getList();
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const editRoles = (item) => {
    setCurrentRole(item.rights);
    setCurrentId(item.id);
    setIsModalOpen(true);
  };
  const onCheck = (checkedKeys) => {
    setCurrentRole(checkedKeys.checked);
  };
  const handleOk = () => {
    axios
      .patch(`/api1/roles/${currentId}`, {
        rights: currentRole,
      })
      .then(() => {
        message.success("修改成功");
        setIsModalOpen(false);
        getList();
      });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <Table
        loading={tableLoading}
        columns={columns}
        dataSource={roleList}
        rowKey={(item) => item.id}
      ></Table>
      <Modal
        destroyOnClose
        title="权限分配"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          checkStrictly
          checkedKeys={currentRole}
          onCheck={onCheck}
          treeData={rightList}
        />
      </Modal>
    </div>
  );
}

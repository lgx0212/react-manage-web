import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message } from "antd";
import axios from "axios";
import ShowNews from "../../../components/ShowNews";

export default function Audit() {
  const [tableLoading, settableLoading] = useState(true);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [showDraftItem, setshowDraftItem] = useState({});
  const [auditList, setauditList] = useState([]);
  const userInfo = JSON.parse(sessionStorage.getItem("token"));
  const columns = [
    {
      title: "新闻标题",
      render: (item) => {
        return (
          <span
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => {
              showDraft(item);
            }}
          >
            {item.title}
          </span>
        );
      },
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: (value) => {
        return value.title;
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              size="small"
              type="primary"
              onClick={() => handleAudit(item, 2, 1)}
            >
              通过
            </Button>
            <Button size="small" danger onClick={() => handleAudit(item, 3, 0)}>
              驳回
            </Button>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    getList();
  }, []);
  const getList = () => {
    settableLoading(true);
    axios.get(`/api1/news?auditState=1&_expand=category`).then((res) => {
      let list = res.data;
      if (userInfo.roleId === 1) {
        setauditList(list);
      } else {
        setauditList([
          ...list.filter((item) => item.author === userInfo.username),
          ...list.filter(
            (item) => item.region === userInfo.region && item.roleId === 3
          ),
        ]);
      }
      settableLoading(false);
    });
  };
  const showDraft = (item) => {
    setshowDraftItem(item);
    setisModalOpen(true);
  };
  const handleAudit = (item, auditState, publishState) => {
    axios
      .patch(`/api1/news/${item.id}`, { auditState, publishState })
      .then(() => {
        if (publishState === 1) {
          message.success("已通过");
        } else if (publishState === 0) {
          message.success("已驳回");
        }
        getList();
      });
  };
  return (
    <div>
      <Table
        loading={tableLoading}
        columns={columns}
        dataSource={auditList}
        rowKey={(item) => item.id}
      ></Table>
      <Modal
        width="80%"
        destroyOnClose
        title="查看"
        open={isModalOpen}
        onOk={() => {
          setisModalOpen(false);
        }}
        onCancel={() => {
          setisModalOpen(false);
        }}
      >
        <ShowNews showDraftItem={showDraftItem}></ShowNews>
      </Modal>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "antd";
import ShowNews from "../../components/ShowNews";
export default function CommonList(prop) {
  const [dataList, setdataList] = useState([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [showDraftItem, setshowDraftItem] = useState({});
  const [type, settype] = useState("");
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
            {type === "unpublished" && (
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  release(item);
                }}
              >
                发布
              </Button>
            )}
            {type === "published" && (
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  offline(item);
                }}
              >
                下线
              </Button>
            )}
            {type === "Sunset" && (
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  online(item);
                }}
              >
                重新上线
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    setdataList(prop.dataList);
    settype(prop.type);
  }, [prop]);

  const showDraft = (item) => {
    setshowDraftItem(item);
    setisModalOpen(true);
  };
  const release = (item) => {
    prop.release(item);
  };
  const offline = (item) => {
    prop.offline(item);
  };
  const online = (item) => {
    prop.online(item);
  };
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataList}
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

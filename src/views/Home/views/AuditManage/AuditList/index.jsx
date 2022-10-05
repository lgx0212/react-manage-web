import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Tag, Modal, message, Form, Input, Select } from "antd";
import axios from "axios";
import MyEditor from "../../../../components/MyEditor";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ShowNews from "../../../components/ShowNews";

const { Option } = Select;
const { confirm } = Modal;

export default function AuditList() {
  const [tableLoading, settableLoading] = useState(true);
  const [auditList, setauditList] = useState([]);
  const [showDraftItem, setshowDraftItem] = useState({});
  const [editDraftItem, seteditDraftItem] = useState({});
  const [isModalOpen, setisModalOpen] = useState(false);
  const [editModalOpen, seteditModalOpen] = useState(false);
  const [categories, setcategories] = useState([]);
  const [editorContent, seteditorContent] = useState([]);

  const editorRef = useRef();
  const editFormRef = useRef();
  const userInfo = JSON.parse(sessionStorage.getItem("token"));
  const auditStateList = ["未审核", "审核中", "已通过", "未通过"];
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
      title: "审核状态",
      dataIndex: "auditState",
      render: (value) => {
        return (
          <Tag color={value === 1 ? "orange" : value === 2 ? "green" : "red"}>
            {auditStateList[value]}
          </Tag>
        );
      },
    },

    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            {item.auditState === 1 ? (
              <Button size="small" type="primary" onClick={()=>revoke(item)}>
                撤销
              </Button>
            ) : item.auditState === 2 ? (
              <Button size="small" type="primary" onClick={()=>release(item)}>
                发布
              </Button>
            ) : (
              <Button size="small" type="primary" onClick={()=>editNews(item)}>
                修改
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    getList();
    axios.get("/api1/categories").then((res) => {
      setcategories(res.data);
    });
  }, []);
  const getList = () => {
    settableLoading(true);
    axios
      .get(
        `/api1/news?author=${userInfo.username}&auditState_ne=0&publishState_lte=1&_expand=category`
      )
      .then((res) => {
        console.log(res);
        setauditList(res.data);
        settableLoading(false);
      });
  };
  const showDraft = (item)=>{
    setshowDraftItem(item);
    setisModalOpen(true);
  }
  const revoke = (item)=>{
    axios.patch(`/api1/news/${item.id}`,{auditState:0}).then(res=>{
      message.success('撤销成功')
      getList()
    })
  }
  const release = (item)=>{
    axios.patch(`/api1/news/${item.id}`,{publishState:2}).then(res=>{
      message.success('发布成功')
      getList()
    })
  }
  const editNews = (item)=>{
    seteditDraftItem(item)
    seteditModalOpen(true)
    setTimeout(() => {
      editFormRef.current.setFieldsValue({
        title: item.title,
        categoryId: item.categoryId,
      });
      editorRef.current.editEditor(item.content);
      console.log(editorRef);
    }, 0);
  }
  const onFinish = (value) => {
    console.log(value);
    const obj = {
      title: value.title,
      categoryId: value.categoryId,
      content: editorContent,
    };
    axios.patch(`/api1/news/${editDraftItem.id}`, obj).then(() => {
      seteditModalOpen(false);
      getList();
    });
  };
  const editContent = (value) => {
    seteditorContent(value);
    if (value === "" || value === "<p><br></p>") {
      editFormRef.current.setFieldsValue({
        content: "",
      });
      return;
    }
    editFormRef.current.setFieldsValue({
      content: value,
    });
  };
  const submitNews = () => {
    confirm({
      title: "你确定要提交吗？",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        axios
          .patch(`/api1/news/${editDraftItem.id}`, {
            auditState: 1,
          })
          .then(() => {
            seteditModalOpen(false);
            getList();
          });
      },
      onCancel() {
        console.log("Cancel");
      },
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
        onOk={()=>{setisModalOpen(false)}}
        onCancel={()=>{setisModalOpen(false)}}
      >
        <ShowNews showDraftItem={showDraftItem}></ShowNews>
      </Modal>
      <Modal
        width="80%"
        destroyOnClose
        title="编辑"
        open={editModalOpen}
        onCancel={()=>{seteditModalOpen(false)}}
        footer={null}
      >
        <Form
          ref={editFormRef}
          onFinish={onFinish}
          name="basic"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 20,
          }}
        >
          <Form.Item
            label="新闻标题"
            name="title"
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
            label="新闻分类"
            name="categoryId"
            rules={[
              {
                required: true,
                message: "请选择",
              },
            ]}
          >
            <Select>
              {categories.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="新闻内容"
            name="content"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
          >
            <MyEditor
              editContent={(value) => editContent(value)}
              ref={editorRef}
            ></MyEditor>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 16,
              span: 8,
            }}
          >
            <div style={{ float: "right" }}>
              <Button
                style={{ margin: " 0 5px" }}
                onClick={() => seteditModalOpen(false)}
              >
                取消
              </Button>
              <Button
                style={{ margin: " 0 5px" }}
                type="primary"
                htmlType="submit"
              >
                保存
              </Button>
              <Button
                style={{ margin: " 0 5px" }}
                danger
                onClick={() => submitNews()}
              >
                提交
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

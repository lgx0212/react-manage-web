import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Table,
  Modal,
  message,
  Form,
  Input,
  Select,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import MyEditor from "../../../../components/MyEditor";
import ShowNews from "../../../components/ShowNews";
const { confirm } = Modal;
const { Option } = Select;
export default function NewsDraft() {
  const [draftList, setdraftList] = useState([]);
  const [showDraftItem, setshowDraftItem] = useState({});
  const [editDraftItem, seteditDraftItem] = useState({});
  const [isModalOpen, setisModalOpen] = useState(false);
  const [editModalOpen, seteditModalOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [categories, setcategories] = useState([]);
  const [editorContent, seteditorContent] = useState([]);

  const editorRef = useRef();
  const editFormRef = useRef();

  const userInfo = JSON.parse(sessionStorage.getItem("token"));
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
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
      title: "分类",
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
            <Button size="small" type="primary" onClick={() => editDraft(item)}>
              编辑
            </Button>
            <Button size="small" danger onClick={() => deleteDraft(item)}>
              删除
            </Button>
            <Button size="small" onClick={() => submitNews(item)}>
              提交
            </Button>
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
    setTableLoading(true);
    axios
      .get(
        `/api1/news?author=${userInfo.username}&auditState=0&_expand=category`
      )
      .then((res) => {
        setdraftList(res.data);
        setTableLoading(false);
      });
  };
  const deleteDraft = (item) => {
    confirm({
      title: "你确定要删除吗？",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        axios.delete(`/api1/news/${item.id}`).then((res) => {
          message.success("删除成功");
          getList();
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const editDraft = (item) => {
    seteditDraftItem(item);
    seteditModalOpen(true);
    setTimeout(() => {
      editFormRef.current.setFieldsValue({
        title: item.title,
        categoryId: item.categoryId,
      });
      editorRef.current.editEditor(item.content);
      console.log(editorRef);
    }, 0);
  };
  const onFinish = (value) => {
    console.log(value);
    const obj = {
      title: value.title,
      categoryId: value.categoryId,
      content: editorContent,
      auditState: 0,
      publishState: 0,
    };
    axios.patch(`/api1/news/${editDraftItem.id}`, obj).then(() => {
      seteditModalOpen(false);
      getList();
    });
  };
  const showDraft = (item) => {
    setshowDraftItem(item);
    setisModalOpen(true);
  };
  const handleOk = () => {
    setisModalOpen(false);
  };
  const handleCancel = () => {
    setisModalOpen(false);
  };
  const editHandleOk = () => {};
  const editHandleCancel = () => {
    seteditModalOpen(false);
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
  const submitNews = (item) => {
    confirm({
      title: "你确定要提交吗？",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        axios
          .patch(`/api1/news/${item ? item.id : editDraftItem.id}`, {
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
        dataSource={draftList}
        rowKey={(item) => item.id}
      ></Table>
      <Modal
        width="80%"
        destroyOnClose
        title="查看"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ShowNews showDraftItem={showDraftItem}></ShowNews>
      </Modal>
      <Modal
        width="80%"
        destroyOnClose
        title="编辑"
        open={editModalOpen}
        onOk={editHandleOk}
        onCancel={editHandleCancel}
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
                onClick={() => editHandleCancel()}
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

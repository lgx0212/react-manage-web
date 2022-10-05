import React, { useState, useEffect, useRef } from "react";
import { Button, PageHeader, Steps, Form, Input, Select, message } from "antd";
import axios from "axios";
import MyEditor from "../../../../components/MyEditor";
const { Step } = Steps;
const { Option } = Select;
export default function NewsAdd() {
  const [currentStep, setcurrentStep] = useState(0);
  const [categories, setcategories] = useState([]);
  const [baseContent, setbaseContent] = useState({});
  const [editorContent, seteditorContent] = useState("");
  const newsRef = useRef();
  const editorRef = useRef();
  const userInfo = JSON.parse(sessionStorage.getItem("token"));
  useEffect(() => {
    axios.get("/api1/categories").then((res) => {
      setcategories(res.data);
    });
  }, []);
  const previous = () => {
    setcurrentStep(currentStep * 1 - 1);
  };
  const nextStep = () => {
    if (currentStep === 0) {
      newsRef.current
        .validateFields()
        .then((res) => {
          setbaseContent(res);
          setcurrentStep(currentStep * 1 + 1);
        })
        .catch(() => {
          message.error("请补全信息");
        });
    } else if(currentStep === 1){
      console.log(editorContent)
      if(editorContent === '' || editorContent.trim() === '<p><br></p>'){
        message.error("请输入内容");
      } else {
        setcurrentStep(currentStep * 1 + 1);
      }
    } else {
      setcurrentStep(currentStep * 1 + 1);
    }
  };
  const editContent = (value) => {
    seteditorContent(value);
  };
  const handleSave = (auditState) => {
    axios
      .post("/api1/news", {
        title: baseContent.title,
        categoryId: baseContent.categoryId,
        content: editorContent,
        region: userInfo.region ? userInfo.region : "全球",
        author: userInfo.username,
        roleId: userInfo.roleId,
        auditState: auditState,
        publishState: 0,
        createTime: Date.now(),
        star: 0,
        view: 0,
        publishTime: 0,
      })
      .then(() => {
        message.success(auditState === 0 ? "保存草稿成功" : "提交审核成功");
        //清空数据
        setcurrentStep(0);
        setbaseContent([]);
        seteditorContent("");
        editorRef.current.resetEditor();
        newsRef.current.setFieldsValue({
          title: "",
          categoryId: "",
        });
      });
  };
  return (
    <div>
      <PageHeader className="site-page-header" title="撰写新闻" subTitle="" />
      <Steps current={currentStep}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或提交审核" />
      </Steps>
      <div
        style={{
          display: currentStep === 0 ? "block" : "none",
          margin: "10px",
        }}
      >
        <Form
          ref={newsRef}
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
        </Form>
      </div>
      <div
        style={{
          display: currentStep === 1 ? "block" : "none",
          margin: "10px",
        }}
      >
        <MyEditor
          ref={editorRef}
          editContent={(value) => editContent(value)}
        ></MyEditor>
      </div>
      <div
        style={{
          display: currentStep === 2 ? "block" : "none",
          margin: "10px",
        }}
      ></div>
      <div>
        {currentStep > 0 && (
          <Button
            type="primary"
            style={{ margin: "0 5px" }}
            onClick={() => previous()}
          >
            上一步
          </Button>
        )}
        {currentStep < 2 && (
          <Button
            type="primary"
            style={{ margin: "0 5px" }}
            onClick={() => nextStep()}
          >
            下一步
          </Button>
        )}
        {currentStep === 2 && (
          <span>
            <Button
              type="primary"
              style={{ margin: "0 5px" }}
              onClick={() => handleSave(0)}
            >
              保存草稿箱
            </Button>
            <Button
              danger
              style={{ margin: "0 5px" }}
              onClick={() => handleSave(1)}
            >
              提交审核
            </Button>
          </span>
        )}
      </div>
    </div>
  );
}

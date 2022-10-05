import React, { useEffect, useState } from "react";
import { Button, Table, Tag, Modal,message,Switch } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
const { confirm } = Modal;
export default function RightList() {
  const [rightList, setRightList] = useState();
  const [tableLoading, setTableLoading] = useState(true);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "权限名称",
      dataIndex: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render: (key) => {
        return <Tag color="orange">{key}</Tag>;
      },
    },
    {
      title: "开关",
      render: (item) => {
        return <Switch style={{display:item.pagepermisson === undefined?'none':''}} checked={item.pagepermisson} onChange={()=>switchChange(item)}/>
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button size="small" danger onClick={() => deleteRight(item)}>
              删除
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
    setTableLoading(true);
    axios.get("/api1/rights?_embed=children").then((res) => {
      const list = res.data;
      list.forEach((item) => {
        if (item.children.length === 0) {
          item.children = "";
        }
      });
      setRightList(list);
      setTableLoading(false);
    });
  };
  const deleteRight = (item) => {
    confirm({
      title: "你确定要删除吗？",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        if(item.grade === 1){
          axios.delete(`/api1/rights/${item.id}`).then((res) => {
            message.success('删除成功');
            getList();
          });
        } else {
          axios.delete(`/api1/children/${item.id}`).then((res) => {
            message.success('删除成功');
            getList();
          });
        }
        
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const switchChange = (item)=>{
    if(item.grade === 1){
      axios.patch(`/api1/rights/${item.id}`,{
        pagepermisson:item.pagepermisson?0:1
      }).then(()=>{
        getList();
      })
    } else {
      axios.patch(`/api1/children/${item.id}`,{
        pagepermisson:item.pagepermisson?0:1
      }).then(()=>{
        getList();
      })
    }
  }
  return (
    <div>
      <Table loading={tableLoading} dataSource={rightList} columns={columns} />
    </div>
  );
}

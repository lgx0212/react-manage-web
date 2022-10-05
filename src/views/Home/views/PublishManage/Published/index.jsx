import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonList from "../CommonList";
import { message } from "antd";
export default function Published() {
  const [dataList, setdataList] = useState([]);
  const userInfo = JSON.parse(sessionStorage.getItem("token"));
  useEffect(() => {
    getList();
  }, []);
  const offline = (item)=>{
    console.log(item)
    axios.patch(`/api1/news/${item.id}`,{publishState:3}).then(()=>{
      message.success('下线成功')
      getList()
    })
  }
  const getList = () => {
    axios
      .get(
        `/api1/news?author=${userInfo.username}&publishState=2&_expand=category`
      )
      .then((res) => {
        setdataList(res.data);
      });
  };
  return (
    <div>
      <CommonList dataList={dataList} type={'published'} offline={(item)=>offline(item)}></CommonList>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonList from "../CommonList";
import { message } from "antd";
export default function Sunset() {
  const [dataList, setdataList] = useState([]);
  const userInfo = JSON.parse(sessionStorage.getItem("token"));
  useEffect(() => {
    getList();
  }, []);
  const online = (item)=>{
    console.log(item)
    axios.patch(`/api1/news/${item.id}`,{publishState:2}).then(()=>{
      message.success('上线成功')
      getList()
    })
  }
  const getList = () => {
    axios
      .get(
        `/api1/news?author=${userInfo.username}&publishState=3&_expand=category`
      )
      .then((res) => {
        setdataList(res.data);
      });
  };
  return (
    <div>
      <CommonList dataList={dataList} type={'Sunset'} online={(item)=>online(item)}></CommonList>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Descriptions } from "antd";
import moment from "moment";

export default function ShowNews(prop) {
  const [showDraftItem, setshowDraftItem] = useState({});
  const auditList = ["未审核", "审核中", "已通过", "未通过"];
  const publishList = ["未发布", "待发布", "已上线", "已下线"];
  useEffect(() => {
    setshowDraftItem(prop.showDraftItem);
  }, [prop]);
  return (
    <div>
      <Descriptions column={4} title={showDraftItem.title}>
        <Descriptions.Item label="新闻分类">
          {showDraftItem.category?.title}
        </Descriptions.Item>
        <Descriptions.Item label="创建者">
          {showDraftItem.author}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {moment(showDraftItem.createTime).format("YYYY-MM-DD HH:mm:ss")}
        </Descriptions.Item>
        <Descriptions.Item label="发布时间">
          {showDraftItem.publishTime
            ? moment(showDraftItem.publishTime).format("YYYY-MM-DD HH:mm:ss")
            : ""}
        </Descriptions.Item>
        <Descriptions.Item label="区域">
          {showDraftItem.region}
        </Descriptions.Item>
        <Descriptions.Item label="审核状态">
          {auditList[showDraftItem.auditState]}
        </Descriptions.Item>
        <Descriptions.Item label="发布状态">
          {publishList[showDraftItem.publishState]}
        </Descriptions.Item>
        <Descriptions.Item label="访问数量">
          {showDraftItem.view}
        </Descriptions.Item>
        <Descriptions.Item label="点赞数量">
          {showDraftItem.star}
        </Descriptions.Item>
        <Descriptions.Item label="评论数量">{0}</Descriptions.Item>
      </Descriptions>
      内容：
      <div
        dangerouslySetInnerHTML={{
          __html: showDraftItem.content,
        }}
      ></div>
    </div>
  );
}

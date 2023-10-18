import React from "react";
import "./upload.css";
import {
  InboxOutlined,
  FileJpgOutlined,
  PullRequestOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload, Button, Image } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
const { Dragger } = Upload;

const DemoPage = () => {
  const props: UploadProps = {
    name: "file",
    multiple: true,
    // action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    // onChange(info) {
    //   const { status } = info.file;
    //   if (status !== "uploading") {
    //     console.log(info.file, info.fileList);
    //   }
    //   if (status === "done") {
    //     message.success(`${info.file.name} file uploaded successfully.`);
    //   } else if (status === "error") {
    //     message.error(`${info.file.name} file upload failed.`);
    //   }
    // },
    // onDrop(e) {
    //   console.log("Dropped files", e.dataTransfer.files);
    // },
    // progress: {},
  };

  const fileList: UploadFile[] = [
    // {
    //   uid: "0",
    //   name: "xxx.png",
    //   status: "uploading",
    //   percent: 33,
    // },
    // {
    //   uid: "-1",
    //   name: "yyy.png",
    //   status: "done",
    //   url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    //   thumbUrl:
    //     "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    // },
    {
      uid: "-2",
      name: "zzz.png",
      status: "error",
    },
  ];

  return (
    <div className="w-[800px]">
      <Upload
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        listType="picture"
        defaultFileList={[...fileList]}
      >
        <Dragger {...props} className="block h-fit w-fit">
          <Button
            icon={<PullRequestOutlined />}
            className="absolute right-[16px] top-0"
            onClick={(e) => {
              // 阻止上传事件
              e.stopPropagation();
              console.log("aaa");
            }}
          >
            配置数据清洗规则
          </Button>
          {/* <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p > */}
          <Image
            className="my-[16px] h-[98px] w-[140px]"
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            preview={false}
          />
          <p className="ant-upload-text">
            <a className="text-[#2C72D7] hover:text-[#2C72D7]">点击</a>
            或将文件拖至此处上传
          </p>
          <p className="ant-upload-hint absolute bottom-0 left-[50%] m-0 translate-x-[-50%]">
            支持文件类型：
            <FileJpgOutlined /> CSV 文件 ｜ <FileJpgOutlined /> Excel 文件
          </p>
        </Dragger>
      </Upload>
    </div>
  );
};

export default DemoPage;

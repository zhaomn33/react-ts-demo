import React from "react";
import "./upload.scss";
import {
  FileJpgOutlined,
  PullRequestOutlined,
  CloseCircleFilled
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload, Button, Image, Progress } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import icon_csv from '../../assets/icon_csv.svg'
import icon_excel from '../../assets/icon_excel.svg'
import icon_upload_default from '../../assets/icon_upload_default.svg'
const { Dragger } = Upload;

const DemoPage = () => {
  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    accept: '.csv, .xlsx, .png, .tsx',
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList,'uploading');
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    itemRender(originNode: React.ReactElement, file: UploadFile, fileList: object[], actions: { download:()=>void, preview:()=>void, remove:()=>void }) {
      return (
        <DraggableUploadListItem
          originNode={originNode}
          file={file}
          fileList={fileList}
          remove={actions.remove}
        />
      )
    },
    // customRequest(info) {
    //   console.log(info,'su-info');
    // },
  };

  interface DraggableUploadListItemProps {
    originNode: React.ReactElement;
    file: UploadFile;
    fileList: object[];
    download?: () => void;
    preview?: () => void;
    remove?: () => void;
  }

  const handelFormat = (percent:number|undefined, successPercent:number|undefined) => {
    console.log(percent,successPercent,'percent,successPercent');
    return <div/>
  }

  const statusType = {
    'error': 'exception',
    'done': 'success',
    'uploading': 'active',
    'removed': 'normal',
  }
  
  const DraggableUploadListItem = ({ originNode, file, fileList, remove }: DraggableUploadListItemProps) => {
    console.log(originNode, file, fileList, 'file');
    
    return (
      <div className="w-[800px] h-[68px] px-[16px] flex justify-between items-center">
        <img
          src={file.name.includes('.png') ? icon_csv : icon_excel}
          className="w-[44px] h-[44px] border-[1px] border-dashed border-[#aaa]"
        />
        <div className="w-[663px]">
          <div className="flex justify-between">
            <span className="w-full text-[#3A86EF] text-[14px]">{file.name}</span>
            <span>{ file.percent + "%" }</span>
          </div>
          <Progress
            className="w-full m-0"
            percent={file.percent}
            status={statusType[file.status]??'exception'}
            showInfo={false}
            format={handelFormat}
          />
        </div>
        <CloseCircleFilled
          style={{ fontSize: '21px', color: '#C4C8D1' }}
          className="ml-[16px]"
          onClick={remove}
        />
      </div>
    );
  };

  return (
    <div className="w-[800px]">
      <Dragger
        {...props}
        className="block h-fit w-fit cursor-default"
      >
        <Button
          icon={<PullRequestOutlined />}
          className="absolute right-[16px] top-0 bg-[#fff]"
          onClick={(e) => {
            // 阻止默认上传事件
            e.stopPropagation();
            console.log("aaa");
          }}
        >
          配置数据清洗规则
        </Button>
        <Image
          className="h-[98px] w-[140px]"
          src={icon_upload_default}
          preview={false}
        />
        <p className="ant-upload-text !text-[14px]">
          <a className="text-[#2C72D7] hover:text-[#2C72D7] cursor-pointer">点击</a>
          或将文件拖至此处上传
        </p>
        <p className="ant-upload-hint absolute bottom-0 left-[50%] m-0 translate-x-[-50%] !text-[12px]">
          支持文件类型：<FileJpgOutlined /> CSV 文件 ｜ <FileJpgOutlined /> Excel 文件
        </p>
      </Dragger>
    </div>
  );
};

export default DemoPage;

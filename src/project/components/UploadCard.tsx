import React, { useState } from "react";
import { message, Upload, Button, Image, Progress } from "antd";
import { FileJpgOutlined, PullRequestOutlined, CloseCircleFilled } from "@ant-design/icons";
import type { UploadProps } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import icon_csv from '../../assets/icon_csv.svg'
import icon_excel from '../../assets/icon_excel.svg'
import icon_upload_default from '../../assets/icon_upload_default.svg'
import "./upload.scss";

const { Dragger } = Upload;

const DemoPage = () => {
  // 最大文件 2GB
  const maxFileSize = 1024 * 1024 * 1024 * 2
  const [socketId, setSocketId] = useState('')
  
  /**
   * @description: 文件切片
   * @param {UploadFile} file 文件
   * @param {Number} LENGTH 切割大小
   * @return {Array[Blob]}
  */
  // LENGTH = 1024 * 1024 * 50
  const fileSlice = (file: UploadFile, LENGTH = 1024): Array<Blob> => {
    console.log(file,'slice-file');
    
    const piece = LENGTH
    const totalSize = file.size ?? 0
    let start = 0 // 每次上传的开始字节
    let end = start + piece
    const chunks = [] // 切片集合

    // console.log(file.slice(0,20),'Blob-slice');

    while (start < totalSize) {
      // 根据长度截取每次需要上传的数据
      // File对象继承自Blob对象，因此包含slice方法
      const blob = file.slice(start, end)

      console.log(blob,'--blod切片');
      
      chunks.push(blob)

      start = end
      end = start + piece
    }

    console.log(chunks,'--chunk集合');

    return chunks
  }

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    accept: '.csv, .xlsx, .png, .tsx',
    itemRender(originNode, file, fileList, actions: { download:()=>void, preview:()=>void, remove:()=>void }) {
      return (
        <DraggableUploadListItem
          originNode={originNode}
          file={file}
          fileList={fileList}
          remove={actions.remove}
        />
      )
    },
    onChange(info) {
      const { status } = info.file;

      // console.log(info,'onchange-info');

      // console.log(info.file, info.fileList,'uploading');
      // if (status !== "uploading") {
      //   message.info('loading');
      // }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    // beforeUpload(file, fileList) {
    //   console.log(file, fileList,'beforeUpload');
    //   // 文件大小超过2GB，请联系管理员后台上传
    //   if (file.size! > maxFileSize) {
    //     message.error('文件大小超过2GB，请联系管理员后台上传')
    //     return
    //   }

    //   const chunks = fileSlice(file)
    //   // AbortController 控制器对象，允许中止一个或多个web请求
    //   const controller = new AbortController()

    //   // console.log(chunks,'----ch--');
      
    // },
    onDrop(e) {
      console.log(e.dataTransfer.files, "Dropped files");
    },
    customRequest(info) {
      console.log(info, 'customRequest-info');
      if (info.file.size! > maxFileSize) {
        message.error('文件大小超过2GB，请联系管理员后台上传111')
        return
      }

      const chunks = fileSlice(info.file)

      console.log(chunks,'----ch--');
    },
  };

  interface DraggableUploadListItemFunProps {
    download?: () => void;
    preview?: () => void;
    remove?: () => void;
  }

  interface DraggableUploadListItemProps extends DraggableUploadListItemFunProps{
    originNode?: React.ReactElement;
    file: UploadFile;
    fileList?: object[];
  }

  const handelFormat = (percent:number|undefined, successPercent:number|undefined) => {
    console.log(percent,successPercent,'percent,successPercent');
    return <div>111</div>
  }

  const statusType = {
    'error': 'exception',
    'done': 'success',
    'uploading': 'active',
    'removed': 'normal',
  }
  
  const DraggableUploadListItem = ({ originNode, file, fileList, remove }: DraggableUploadListItemProps) => {
    // console.log(originNode, file, fileList, 'file');
    
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

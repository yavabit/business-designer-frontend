import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useCallback } from "react";

import style from "./style.module.scss";
import { Button, Flex, message, Upload, type UploadProps } from "antd";
import { AiOutlineUpload } from "react-icons/ai";

export default function ExampleNode({ data }: NodeProps) {
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);

  const props: UploadProps = {
    name: "file",
    action: "",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className={style["example-node"]} style={data.style ?? {}}>
      <Flex vertical>
        <div>
          <label htmlFor="text">Заголовок:</label>
          <input
            id="text"
            name="text"
            onChange={onChange}
            className="nodrag"
            value={data.value as string}
          />
        </div>

        <Upload {...props}>
          <Button icon={<AiOutlineUpload />}>Click to Upload</Button>
        </Upload>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </Flex>
    </div>
  );
}

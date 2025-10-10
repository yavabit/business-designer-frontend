import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";
import { CiStopwatch } from "react-icons/ci";
import { InputNumber, Select } from "antd";
import { memo, useEffect, useState } from "react";
import useDataNode from "@hooks/useDataNode";

interface FieldType extends NodeCustomData {
  type?: string;
}

const RangePickerStyles = {
  width: "100%",
  marginTop: 10,
};

const timeOptions = [
  {
    value: "seconds",
    label: "секунд",
  },
  {
    value: "minutes",
    label: "минут",
  },
  {
    value: "hours",
    label: "часов",
  },
  {
    value: "days",
    label: "дней",
  },
];

export const WaitNode = memo((props: NodeProps<Node<NodeCustomData>>) => {
  const [openSelect, setOpenSelect] = useState(false);
  const [delay, setDelay] = useState({ value: "0", type: "minutes" });

  const { setDataNode, getDataNode } = useDataNode<FieldType>();
  const nodeData = getDataNode();

  useEffect(() => {
    if (!nodeData) return;

    const { value, type } = nodeData;

    if (!nodeData || !value || !type) return;

    setDelay({
      value,
      type,
    });
  }, [nodeData]);

  const handleDelayChange = (value: string | null) => {
    if (value) {
      setDelay((prev) => ({ ...prev, value }));
      setDataNode({
        data: {
          value: value.toString(),
        },
      });
    } else {
      setDelay((prev) => ({ ...prev, value: "0" }));
      setDataNode({
        data: {
          value: "0",
        },
      });
    }
  };

  const handleDelayTypeChange = (val: string) => {
    setDelay((prev) => ({ ...prev, type: val }));
    setDataNode({
      data: {
        type: val,
      },
    });
  };

  const selectAfter = (
    <Select
      value={delay.type}
      style={{ width: 80 }}
      options={timeOptions}
      onClick={(e) => {
        e.stopPropagation();
        setOpenSelect(!openSelect);
      }}
      onChange={handleDelayTypeChange}
      open={openSelect}
    />
  );

  useEffect(() => {
    setOpenSelect(false);
  }, [props]);

  return (
    <NodeWrapper
      node={props}
      handleBottom={false}
      handleTop={false}
      icon={<CiStopwatch />}
    >
      <div style={{ ...RangePickerStyles }}>
        <InputNumber
          size="small"
          addonAfter={selectAfter}
          formatter={(value) => {
            const num = parseInt(
              value?.toString().replace(/\D/g, "") || "0",
              10
            );
            return isNaN(num) ? "0" : num.toString();
          }}
          onClick={(e) => e.stopPropagation()}
          onChange={handleDelayChange}
          controls={false}
          value={delay.value}
					type="number"
        />
      </div>
    </NodeWrapper>
  );
});

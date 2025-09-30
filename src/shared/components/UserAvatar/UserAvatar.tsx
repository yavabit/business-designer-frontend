import getInitials from "@shared/utils/getInitials";
import stringToHslColor from "@shared/utils/stringToHslColor";
import { Avatar, Popover } from "antd";

const UserAvatar = ({ label }: { label: string }) => {
  return (
    <Popover content={label} trigger="hover" placement="bottom">
      <Avatar
        style={{
          backgroundColor: stringToHslColor(label),
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {label && getInitials(label)}
      </Avatar>
    </Popover>
  );
};

export default UserAvatar;

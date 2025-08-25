import { Avatar, Typography, Space } from 'antd';
import styles from './NodeCard.module.scss'
const { Text } = Typography;

type NodeListCardProps = INodeItem & {style?: React.CSSProperties, className?: string}

export const NodeListCard = ({ icon, name, description, style, className }: NodeListCardProps) => {
  return (
    <div style={{ padding: 12, ...style }} className={`${styles['node-card']} ${className ?? ''}`}>
      <Space align='start'>
        <Avatar icon={icon} shape="square" size="large" style={{marginRight: 5}}/>
        <div className={`${styles['node-card__text']} ${className}`}>
          <Text strong style={{ display: 'block' }}>{name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{description}</Text>
        </div>
      </Space>
    </div>
  );
};
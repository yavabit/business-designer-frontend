import { Card, Radio, Space, type RadioChangeEvent } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./CardRadioGroup.module.scss";
import { useState } from "react";

export type RadioGroupOptionsType = {
	value: string;
	label: React.ReactNode;
	icon: React.ReactNode;
	description: React.ReactNode;
};

type CardRadioGroupType = {
	options: RadioGroupOptionsType[];
	value?: string;
	onChange?: (e: RadioChangeEvent) => void;
	style?: React.CSSProperties;
};

export const CardRadioGroup = ({
	options,
	value,
	onChange,
	style
}: CardRadioGroupType) => {
	const [isHovered, setIsHovered] = useState<{ card: null | number; hide: boolean }>({ card: null, hide: true });

	return (
		<Radio.Group
			value={value}
			onChange={onChange}
			block
			className={styles.radioGroup}
			style={{...style}}
		>
			<Space direction="horizontal" size="middle">
				{options.map((option, i) => (
					<motion.div
						key={i}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: i * 0.07 }}
						whileHover={{
							y: -5,
							transition: { type: "spring", stiffness: 300, damping: 15 },
						}}
						onHoverStart={() => setIsHovered({ card: i, hide: false })}
						onHoverEnd={() => setIsHovered({ card: null, hide: true })}
					>
						<Radio key={option.value} value={option.value}>
							<Card
								size="default"
								style={{
									width: 200,
									height: 220,
									cursor: "pointer",
									border:
										value === option.value
											? "2px solid #1890ff"
											: "1px solid #d9d9d9",
								}}
								hoverable
							>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 44, marginBottom: 8 }}>
										{option.icon}
									</div>
									<div style={{ fontSize: 18, marginBottom: 8 }}>
										{option.label}
									</div>
									<AnimatePresence>
										{isHovered.card != null && isHovered.card === i && (
											<motion.div
												initial={{ opacity: 0, y: 10, height: 0 }}
												animate={{ opacity: 1, y: 0, height: "auto" }}
												exit={{ opacity: 0, y: 10, height: 0 }}
												transition={{ duration: 0.3 }}
												style={{
													fontSize: 12,
													overflow: "hidden",
												}}
											>
												{option.description}
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</Card>
						</Radio>
					</motion.div>
				))}
			</Space>
		</Radio.Group>
	);
};

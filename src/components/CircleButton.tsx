import * as React from "react"
import * as ReactDOM from "react-dom"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
import * as styles from "../styles"

interface CircleButtonProps {
	onClick: React.MouseEventHandler<HTMLDivElement>
	header?: string
	label?: string
}

export function CircleButton(props: CircleButtonProps) {
	return (
		<div
			style={{
				height: 100 * styles.scale,
				width: 100 * styles.scale,
				borderRadius: 100 * styles.scale,
				background: styles.blue,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				margin: `${20 * styles.scale}px auto`,
			}}
			onClick={props.onClick}
		>
			{props.header && (
				<div
					style={{ textTransform: "uppercase", fontSize: 16 * styles.scale }}
				>
					{props.header}
				</div>
			)}
			{props.label && (
				<div
					style={{
						fontSize: 18 * styles.scale,
						fontWeight: 800,
					}}
				>
					{props.label}
				</div>
			)}
		</div>
	)
}

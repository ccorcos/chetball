import * as React from "react"
import * as ReactDOM from "react-dom"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
import { Menu } from "./Menu"
import * as styles from "../styles"
import {
	routeToMain,
	handlePurchaseNoAds,
	handleRestorePurchases,
} from "../actions"
import { BackButton } from "./BackButton"

export class PurchaseMenu extends Component {
	view() {
		return (
			<Menu marginTop={"20vh"}>
				<BackButton />
				<div style={{ marginTop: 10 }}>
					<RectButton
						highlight={true}
						label={"Purchase No Ads"}
						onClick={handlePurchaseNoAds}
					/>
					<RectButton
						highlight={false}
						label={"Restore No Ads"}
						onClick={handleRestorePurchases}
					/>
				</div>
			</Menu>
		)
	}
}

interface RectButtonProps {
	onClick: React.MouseEventHandler<HTMLDivElement>
	label: string
	highlight?: boolean
}

export function RectButton(props: RectButtonProps) {
	return (
		<div
			style={{
				height: 70 * styles.scale,
				width: 200 * styles.scale,
				margin: `${20 * styles.scale}px auto`,
				borderRadius: 8 * styles.scale,
				background: props.highlight ? styles.blue : "white",
				border: props.highlight
					? undefined
					: `${2 * styles.scale}px solid black`,
				boxSizing: "border-box",
				display: "flex",
				alignItems: "center",
				textTransform: "uppercase",
				fontWeight: 600,
			}}
			onClick={props.onClick}
		>
			<div style={{ textAlign: "center", width: "100%" }}>{props.label}</div>
		</div>
	)
}

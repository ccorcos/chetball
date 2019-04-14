import * as React from "react"
import * as ReactDOM from "react-dom"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
import * as styles from "../styles"

const Fragment = React.Fragment

interface MenuProps {
	marginTop: string
	title?: React.ReactNode
}

export class Menu extends Component<MenuProps> {
	view() {
		return (
			<div
				id="menu"
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: "rgba(255,255,255,0.5)",
					display: "flex",
					flexDirection: "column",
					overflowY: "auto",
					WebkitOverflowScrolling: "touch",
					pointerEvents: "auto",
					fontSize: 16 * styles.scale,
				}}
			>
				<div
					style={{
						fontSize: 64 * styles.scale,
						textAlign: "center",
						marginTop: this.props.marginTop,
					}}
				>
					{this.props.title || (
						<Fragment>
							<strong>Chet</strong>Ball
						</Fragment>
					)}
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						maxWidth: 500,
						margin: "0 auto",
					}}
				>
					{this.props.children}
				</div>
			</div>
		)
	}
}

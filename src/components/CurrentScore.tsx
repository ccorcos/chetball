import * as React from "react"
import Component from "reactive-magic/component"
import { appState } from "../state"
import * as styles from "../styles"

export class CurrentScore extends Component {
	view() {
		return (
			<div
				style={{
					fontSize: 14 * styles.scale,
					fontWeight: 200,
					textAlign: "center",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					margin: 20 * styles.scale,
				}}
			>
				<div>
					{`Level ${appState.get().level} `}
					{appState.get().mode === "normal" ? "Area: " : "Iso: "}
					{appState.get().mode === "normal"
						? `${appState.get().percent}%`
						: `${appState.get().isolated}/${appState.get().level + 1}`}
				</div>
			</div>
		)
	}
}

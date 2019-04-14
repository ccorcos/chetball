import * as React from "react"
import { handleRestart } from "../actions"
import * as styles from "../styles"

export function RestartButton() {
	return (
		<div
			style={{
				padding: 10 * styles.scale,
				margin: "0 auto",
				fontWeight: 800,
				marginBottom: 30 * styles.scale,
				fontSize: 24 * styles.scale,
			}}
			onClick={handleRestart}
		>
			Restart
		</div>
	)
}

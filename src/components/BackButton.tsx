import * as React from "react"
import { routeToMain } from "../actions"
import * as styles from "../styles"

export function BackButton() {
	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				right: 0,
				margin: 14 * styles.scale,
				fontSize: 16 * styles.scale,
			}}
			onClick={routeToMain}
		>
			Back
		</div>
	)
}

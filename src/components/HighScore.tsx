import * as React from "react"
import Component from "reactive-magic/component"
import * as styles from "../styles"
import { appState } from "../state"

export class HighScore extends Component {
	view() {
		if (appState.get().newHighScore) {
			return (
				<p
					style={{
						textAlign: "center",
						fontSize: 18 * styles.scale,
						color: styles.red,
						fontWeight: 800,
					}}
				>
					New High Score: {appState.get().highScore}
				</p>
			)
		} else {
			return (
				<p
					style={{
						textAlign: "center",
						fontSize: 18 * styles.scale,
						color: styles.blue,
					}}
				>
					High Score: {appState.get().highScore}
				</p>
			)
		}
	}
}

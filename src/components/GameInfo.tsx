import * as React from "react"
import Component from "reactive-magic/component"
import { appState } from "../state"
import { handlePause } from "../actions"
import * as styles from "../styles"
import { MuteToggle } from "./MuteToggle"

export class Mute extends Component {
	view() {
		if (!appState.get().unlockSound) {
			return null
		}
		return <MuteToggle />
	}
}

class PauseButton extends Component {
	view() {
		if (appState.get().state !== "play") {
			return null
		}
		return (
			<div
				style={{
					margin: 4 * styles.scale,
					padding: 4 * styles.scale,
					background: appState.get().regionColor,
					borderRadius: 4 * styles.scale,
					color: "#ffffff",
					textAlign: "center",
					pointerEvents: "auto",
					fontSize: 16 * styles.scale,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: 40 * styles.scale,
					minWidth: 40 * styles.scale,
					maxWidth: 60 * styles.scale,
					flex: 1,
					textTransform: "uppercase",
					fontWeight: 300,
				}}
				onClick={handlePause}
			>
				Pause
			</div>
		)
	}
}

class Item extends Component<{ header: string; content: string }> {
	view() {
		return (
			<div
				style={{
					margin: 4 * styles.scale,
					padding: 4 * styles.scale,
					background: appState.get().regionColor,
					borderRadius: 4 * styles.scale,
					color: "#ffffff",
					textAlign: "center",
					pointerEvents: "auto",
					fontSize: 16 * styles.scale,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: 40 * styles.scale,
					minWidth: 40 * styles.scale,
					maxWidth: 60 * styles.scale,
					flex: 1,
				}}
			>
				<div style={{ textTransform: "uppercase", fontWeight: 300 }}>
					{this.props.header}
				</div>
				<div style={{ fontWeight: 800 }}>{this.props.content}</div>
			</div>
		)
	}
}

export class GameInfo extends Component {
	view() {
		if (appState.get().state === "start") {
			return null
		}

		let complete: React.ReactNode
		if (appState.get().mode === "normal") {
			complete = <Item header={"Area"} content={`${appState.get().percent}%`} />
		} else {
			complete = (
				<Item
					header={"Iso"}
					content={`${appState.get().isolated}/${appState.get().level + 1}`}
				/>
			)
		}
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div style={{ pointerEvents: "auto", position: "absolute", left: 18 }}>
					<Mute />
				</div>
				<Item header={"Level"} content={`${appState.get().level}`} />
				<Item header={"Lives"} content={`${appState.get().lives}`} />
				{complete}
			</div>
		)
	}
}

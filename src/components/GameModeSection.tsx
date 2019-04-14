import * as React from "react"
import * as ReactDOM from "react-dom"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
import { appState } from "../state"
import { setGameMode } from "../actions"
import * as styles from "../styles"

interface SelectButtonProps {
	selected: boolean
	title: string
	onClick: React.MouseEventHandler<HTMLDivElement>
}

function SelectButton(props: SelectButtonProps) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				pointer: "cursor",
				width: 180 * styles.scale,
				padding: 5 * styles.scale,
			}}
			onClick={props.onClick}
		>
			<div
				style={{
					height: 20 * styles.scale,
					width: 20 * styles.scale,
					borderRadius: 20 * styles.scale,
					borderStyle: "solid",
					borderWidth: 3 * styles.scale,
					borderColor: props.selected ? "black" : "grey",
					backgroundColor: props.selected ? "black" : "white",
				}}
			/>
			<div
				style={{
					marginLeft: 12 * styles.scale,
					fontWeight: props.selected ? 800 : 400,
					color: props.selected ? "black" : "grey",
				}}
			>
				{props.title}
			</div>
		</div>
	)
}

export type GameMode = "isolate" | "normal"

export class GameModeSection extends Component {
	view() {
		if (!appState.get().isolateMode) {
			return null
		}
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					marginTop: 10 * styles.scale,
				}}
			>
				<div
					style={{
						textTransform: "uppercase",
						fontSize: 16 * styles.scale,
						fontWeight: 200,
						padding: `${8 * styles.scale}px 0`,
					}}
				>
					Select a game mode
				</div>
				<SelectButton
					selected={appState.get().mode === "normal"}
					title={"Area Mode"}
					onClick={this.handleClickAreaMode}
				/>
				<SelectButton
					selected={appState.get().mode === "isolate"}
					title={"Isolation Mode"}
					onClick={this.handleClickIsolationMode}
				/>
			</div>
		)
	}

	private handleClickAreaMode = () => setGameMode("normal")
	private handleClickIsolationMode = () => setGameMode("isolate")
}

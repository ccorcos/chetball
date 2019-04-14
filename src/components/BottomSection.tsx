import * as React from "react"
import * as ReactDOM from "react-dom"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
import { appState } from "../state"
import { routeToAchievements, routeToInstructions } from "../actions"
import * as styles from "../styles"

export class BottomSection extends Component {
	view() {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					marginTop: 15 * styles.scale,
				}}
			>
				<AchievementsButton
					onClick={routeToAchievements}
					color={appState.get().recentUnlock.length > 0 ? "red" : "black"}
				/>
				<InstructionsButton onClick={routeToInstructions} />
			</div>
		)
	}
}

interface InstructionsButtonProps {
	onClick: React.MouseEventHandler<HTMLDivElement>
}

export function InstructionsButton(props: InstructionsButtonProps) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				margin: `${16 * styles.scale}px ${44 * styles.scale}px`,
			}}
			onClick={props.onClick}
		>
			<div
				style={{
					height: 40 * styles.scale,
					width: 40 * styles.scale,
					borderRadius: 40 * styles.scale,
					borderWidth: 2 * styles.scale,
					borderStyle: "solid",
					borderColor: "black",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: 24 * styles.scale,
					fontFamily: "monospace",
				}}
			>
				i
			</div>
			<div style={{ fontSize: 14 * styles.scale, marginTop: 5 * styles.scale }}>
				Instructions
			</div>
		</div>
	)
}

interface AchievementsButton {
	color: string
	onClick: React.MouseEventHandler<HTMLDivElement>
}

export function AchievementsButton(props: AchievementsButton) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				color: props.color,
				alignItems: "center",
				margin: `${20 * styles.scale}px ${30 * styles.scale}px`,
			}}
			onClick={props.onClick}
		>
			<svg
				width="68"
				height="79"
				viewBox="0 0 68 79"
				style={{ height: 40 * styles.scale }}
			>
				<path
					fill={props.color}
					d="M 66.363 10.222L 56.2889 10.222L 56.2889 1.64058C 56.2889 0.757188 55.5333 9.62815e-07 54.6519 9.62815e-07L 13.3481 9.62815e-07C 12.4667 9.62815e-07 11.7111 0.757188 11.7111 1.64058L 11.7111 10.222L 1.63704 10.222C 0.755555 10.222 -4.47379e-15 10.9792 -4.47379e-15 11.8626L -4.47379e-15 18.1725C -4.47379e-15 28.8994 5.41482 35.3355 14.9852 36.2189C 17.7556 43.4121 22.9185 49.3435 32.363 49.9744L 32.363 59.0607C 31.1037 61.7109 23.8 75.7188 9.6963 75.7188C 8.81482 75.7188 8.05926 76.476 8.05926 77.3594C 8.05926 78.2428 8.81482 79 9.6963 79L 34 79L 34.1259 79L 58.4296 79C 59.3111 79 60.0667 78.2428 60.0667 77.3594C 60.0667 76.476 59.3111 75.7188 58.4296 75.7188C 44.0741 75.7188 36.7704 61.2061 35.637 58.9345C 35.637 58.9345 35.637 58.9345 35.637 58.8083L 35.637 49.8482C 45.2074 49.2173 50.3704 43.2859 53.1407 36.0927C 62.5852 35.2093 68 28.647 68 18.0463L 68 11.7364C 68 10.853 67.2444 10.222 66.363 10.222ZM 3.27407 18.0463L 3.27407 13.377L 11.7111 13.377C 11.7111 17.7939 11.837 25.492 13.8519 32.6853C 5.16296 31.2971 3.27407 24.1038 3.27407 18.0463ZM 46.2148 75.7188L 34 75.7188L 21.7852 75.7188C 28.0815 72.1853 31.9852 66.3802 34 62.8466C 36.0148 66.3802 40.0444 72.0591 46.2148 75.7188ZM 34 46.6933C 29.2148 46.6933 14.9852 46.5671 14.9852 12.746L 14.9852 3.15495L 53.1407 3.15495L 53.1407 12.746C 53.1407 21.0751 53.1407 46.6933 34 46.6933ZM 64.7259 18.0463C 64.7259 24.1038 62.837 31.1709 54.1481 32.6853C 56.163 25.492 56.2889 17.7939 56.2889 13.377L 64.7259 13.377L 64.7259 18.0463Z"
				/>
			</svg>
			<div style={{ fontSize: 14 * styles.scale, marginTop: 5 * styles.scale }}>
				Achievements
			</div>
		</div>
	)
}

import * as React from "react"
import * as ReactDOM from "react-dom"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
import { Menu } from "./Menu"
import { MuteButton } from "./MuteButton"
import { UnmuteButton } from "./UnmuteButton"
import { appState, getUnlockLevel } from "../state"
import {
	routeToMain,
	handleChangeBallColor,
	handleChangeRegionColor,
	setUnmuted,
	setMuted,
	processSprite,
	handleSaveSpriteBall,
	handleUnlock,
	randomColor,
} from "../actions"
import { BackButton } from "./BackButton"
import { MuteToggle } from "./MuteToggle"
import * as styles from "../styles"

interface AchievementProps {
	header: string
	label: string
	unlocked: boolean
	onClick?: React.MouseEventHandler<HTMLDivElement>
	right?: React.ReactNode
	overlay?: React.ReactNode
	children?: React.ReactNode
}

function Achievement(props: AchievementProps) {
	return (
		<div
			style={{
				border: `${2 * styles.scale}px solid black`,
				borderColor: "black",
				borderRadius: 4 * styles.scale,
				display: "flex",
				flexDirection: "column",
				padding: `${6 * styles.scale}px ${8 * styles.scale}px`,
				marginBottom: 20 * styles.scale,
				width: 240 * styles.scale,
				position: "relative",
				color: "black",
				fontSize: 16 * styles.scale,
			}}
		>
			<div
				style={{ display: "flex", alignItems: "center" }}
				onClick={props.unlocked ? props.onClick : undefined}
			>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<div style={{ textTransform: "uppercase", fontWeight: 200 }}>
						{props.header}
					</div>
					<div style={{ fontWeight: 800 }}>{props.label}</div>
				</div>
				{!props.unlocked && (
					<div style={{ marginLeft: "auto" }}>
						<svg
							style={{ height: 40 * styles.scale, width: 40 * styles.scale }}
							viewBox="0 0 67 99"
						>
							<path
								fillRule="evenodd"
								d="M 33.473 98.9963C 51.959 98.9963 66.947 84.0103 66.947 65.5232C 66.947 56.2493 63.1752 47.8562 57.0823 41.7942L 57.0823 22.4341C 57.0823 14.8953 49.474 0 33.474 0C 17.474 0 9.86501 14.8953 9.86501 22.4341L 9.86501 41.7942C 3.772 47.8562 0 56.2493 0 65.5232C 0 84.0103 14.986 98.9963 33.473 98.9963ZM 34.1205 33.4788C 29.1391 33.4788 24.2933 34.9858 19.5832 38L 19.5832 20.0276C 21.4474 11.7644 26.2932 7.58618 34.1205 7.49243C 41.9478 7.39893 46.7935 11.5771 48.6577 20.0276L 48.6577 38C 43.9476 34.9858 39.1018 33.4788 34.1205 33.4788Z"
							/>
						</svg>
					</div>
				)}
				{props.unlocked && props.right}
			</div>
			{props.children}
			{props.unlocked && props.overlay}
		</div>
	)
}

interface ColorPickerProps {
	color: Value<string>
	onSubmit: (color: string, event: React.MouseEvent<HTMLElement>) => void
}

export class ColorPicker extends Component<ColorPickerProps> {
	view() {
		return (
			<div>
				<div
					style={{
						display: "inline-flex",
						flexWrap: "wrap",
						justifyContent: "space-between",
						margin: -2,
						padding: "4px 0px",
					}}
				>
					{styles.colors.map(color => (
						<Swatch
							key={color}
							style={{ margin: 3 }}
							color={color}
							onClick={() => this.props.color.set(color)}
						/>
					))}
					<Swatch
						key={"random"}
						style={{
							margin: 3,
							border: "1px solid black",
							fontSize: 24 * styles.scale,
						}}
						color={"white"}
						onClick={() => this.props.color.set(randomColor())}
					>
						{"?"}
					</Swatch>
				</div>
				<div style={{ display: "flex", margin: "0px -4px" }}>
					<Button
						onClick={event =>
							this.props.onSubmit(this.props.color.get(), event)
						}
						title={"Save"}
					/>
				</div>
			</div>
		)
	}
}

function Button(props: {
	title: string
	onClick: (event: React.MouseEvent<HTMLElement>) => void
}) {
	return (
		<div
			onClick={props.onClick}
			style={{
				backgroundColor: styles.blue,
				margin: "4px 4px",
				borderRadius: 6,
				textTransform: "uppercase",
				height: 40,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flex: 1,
			}}
		>
			{props.title}
		</div>
	)
}

export class BallColorAchievement extends Component {
	pickerOpen = new Value(false)
	color = new Value(appState.get().ballColor)

	view() {
		const recentUnlock =
			appState.get().recentUnlock.indexOf("changeBallColor") !== -1
		return (
			<Achievement
				header={`Level ${getUnlockLevel("changeBallColor")}`}
				label={"Change Ball Color"}
				unlocked={appState.get().changeBallColor}
				right={
					<Swatch style={{ marginLeft: "auto" }} color={this.color.get()} />
				}
				onClick={() => {
					this.pickerOpen.update(x => !x)
					this.color.set(appState.get().ballColor)
				}}
			>
				{recentUnlock && (
					<Button
						title={"Unlock"}
						onClick={() => handleUnlock("changeBallColor")}
					/>
				)}
				{this.pickerOpen.get() && (
					<ColorPicker
						color={this.color}
						onSubmit={(color, event) => {
							handleChangeBallColor(color)
							this.pickerOpen.set(false)
						}}
					/>
				)}
			</Achievement>
		)
	}
}

export class RegionColorAchievement extends Component {
	pickerOpen = new Value(false)
	color = new Value(appState.get().regionColor)
	view() {
		const recentUnlock =
			appState.get().recentUnlock.indexOf("changeRegionColor") !== -1
		return (
			<Achievement
				header={`Level ${getUnlockLevel("changeRegionColor")}`}
				label={"Change Region Color"}
				unlocked={appState.get().changeRegionColor}
				right={
					<Swatch style={{ marginLeft: "auto" }} color={this.color.get()} />
				}
				onClick={() => {
					this.pickerOpen.update(x => !x)
					this.color.set(appState.get().regionColor)
				}}
			>
				{recentUnlock && (
					<Button
						title={"Unlock"}
						onClick={() => handleUnlock("changeRegionColor")}
					/>
				)}
				{this.pickerOpen.get() && (
					<ColorPicker
						color={this.color}
						onSubmit={(color, event) => {
							handleChangeRegionColor(color)
							this.pickerOpen.set(false)
						}}
					/>
				)}
			</Achievement>
		)
	}
}

function Swatch(props: {
	style?: React.CSSProperties
	color: string
	onClick?: () => void
	children?: React.ReactNode
}) {
	return (
		<div
			onClick={props.onClick}
			style={{
				height: 40 * styles.scale,
				width: 40 * styles.scale,
				borderRadius: 8 * styles.scale,
				backgroundColor: props.color,
				...props.style,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{props.children}
		</div>
	)
}

export class SoundAchievement extends Component {
	view() {
		const recentUnlock =
			appState.get().recentUnlock.indexOf("unlockSound") !== -1
		return (
			<Achievement
				header={`Level ${getUnlockLevel("unlockSound")}`}
				label={"Bounce Sounds"}
				unlocked={appState.get().unlockSound}
			>
				{recentUnlock && (
					<Button
						title={"Unlock"}
						onClick={() => handleUnlock("unlockSound")}
					/>
				)}
			</Achievement>
		)
	}
}

export class FasterWallsAchievement extends Component {
	view() {
		const recentUnlock =
			appState.get().recentUnlock.indexOf("fasterWalls") !== -1
		return (
			<Achievement
				header={`Level ${getUnlockLevel("fasterWalls")}`}
				label={"Faster Walls"}
				unlocked={appState.get().fasterWalls}
			>
				{recentUnlock && (
					<Button
						title={"Unlock"}
						onClick={() => handleUnlock("fasterWalls")}
					/>
				)}
			</Achievement>
		)
	}
}

export class IsolationModeAchievement extends Component {
	view() {
		const recentUnlock =
			appState.get().recentUnlock.indexOf("isolateMode") !== -1
		return (
			<Achievement
				header={`Level ${getUnlockLevel("isolateMode")}`}
				label={"Isolation Mode"}
				unlocked={appState.get().isolateMode}
			>
				{recentUnlock && (
					<Button
						title={"Unlock"}
						onClick={() => handleUnlock("isolateMode")}
					/>
				)}
			</Achievement>
		)
	}
}

export class SpriteBallAchievement extends Component {
	spriteURI = new Value(appState.get().spriteBallURI)
	view() {
		const recentUnlock =
			appState.get().recentUnlock.indexOf("spriteBall") !== -1
		const spriteURI = this.spriteURI.get()
		const canSave = appState.get().spriteBallURI !== this.spriteURI.get()
		return (
			<Achievement
				header={`Level ${getUnlockLevel("spriteBall")}`}
				label={"Ball Sprite"}
				unlocked={appState.get().spriteBall}
				right={
					spriteURI ? (
						<img
							style={{
								height: 40 * styles.scale,
								width: 40 * styles.scale,
								marginLeft: "auto",
							}}
							src={spriteURI}
						/>
					) : (
						<div style={{ marginLeft: "auto" }}>Upload</div>
					)
				}
				overlay={
					<input
						type="file"
						accept="image/*"
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							opacity: 0,
						}}
						onChange={event => {
							if (event.target.files) {
								const file = event.target.files[0]
								if (file) {
									const result = processSprite(file)
									if (result) {
										this.spriteURI.set(result)
									}
								}
							}
						}}
					/>
				}
			>
				{recentUnlock && (
					<Button title={"Unlock"} onClick={() => handleUnlock("spriteBall")} />
				)}
				{canSave &&
					spriteURI && (
						<Button
							title={"Save"}
							onClick={() => handleSaveSpriteBall(spriteURI)}
						/>
					)}
			</Achievement>
		)
	}
}

export class AchievementsMenu extends Component {
	view() {
		return (
			<Menu marginTop={`10vh`}>
				<BackButton />
				<div style={{ margin: `${20 * styles.scale}px auto` }}>
					<BallColorAchievement />
					<RegionColorAchievement />
					<SoundAchievement />
					<FasterWallsAchievement />
					<IsolationModeAchievement />
					<SpriteBallAchievement />
				</div>
			</Menu>
		)
	}
}

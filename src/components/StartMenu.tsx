import * as React from "react"
import * as ReactDOM from "react-dom"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
import { Menu } from "./Menu"
import { MuteButton } from "./MuteButton"
import { UnmuteButton } from "./UnmuteButton"
import { CircleButton } from "./CircleButton"
import { GameModeSection, GameMode } from "./GameModeSection"
import { HighScore } from "./HighScore"
import { appState } from "../state"
import {
	setMuted,
	setUnmuted,
	routeToPurchase,
	handlePlay,
	routeToAchievements,
	routeToInstructions,
} from "../actions"
import { NoAdsButton } from "./NoAdsButton"
import { MuteHeaderToggle } from "./MuteHeaderToggle"
import { RestartButton } from "./RestartButton"
import { BottomSection } from "./BottomSection"
import * as styles from "../styles"

export class StartMenu extends Component {
	async didMount() {
		if (appState.get().level !== 1) {
			const node = ReactDOM.findDOMNode(this)
			if (node instanceof HTMLElement) {
				let opacity = 1
				await new Promise(resolve => setTimeout(resolve, 1000))

				while (opacity > 0) {
					await new Promise(resolve => setTimeout(resolve, 1000 / 60))
					opacity -= 0.02
					node.style.opacity = opacity.toString()
				}
				handlePlay()
			}
		}
	}

	view() {
		if (appState.get().level === 1) {
			return (
				<Menu marginTop={"20vh"}>
					<MuteHeaderToggle />
					<NoAdsButton />
					<HighScore />
					{appState.get().level === 1 && <GameModeSection />}
					<CircleButton
						onClick={handlePlay}
						header={`Level ${appState.get().level}`}
						label={"Start"}
					/>
					<BottomSection />
				</Menu>
			)
		} else {
			return (
				<Menu
					marginTop={"40vh"}
					title={
						<span
							style={{
								textTransform: "uppercase",
								fontSize: 44 * styles.scale,
								fontWeight: 800,
							}}
						>
							{`Level ${appState.get().level}`}
						</span>
					}
				>
					<HighScore />
				</Menu>
			)
		}
	}
}

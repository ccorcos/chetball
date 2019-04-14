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
	routeToPurchase,
	setUnmuted,
	setMuted,
	handleRestart,
	handlePlay,
	routeToAchievements,
	routeToInstructions,
	handleContinue,
} from "../actions"
import { NoAdsButton } from "./NoAdsButton"
import { MuteHeaderToggle } from "./MuteHeaderToggle"
import { CurrentScore } from "./CurrentScore"
import { RestartButton } from "./RestartButton"
import { BottomSection } from "./BottomSection"
import * as styles from "../styles"

export class GameOverMenu extends Component {
	view() {
		return (
			<Menu
				marginTop={`20vh`}
				title={
					<span
						style={{
							textTransform: "uppercase",
							fontSize: 44 * styles.scale,
							fontWeight: 800,
						}}
					>
						Game Over
					</span>
				}
			>
				<ContinueButton />
				<RestartButton />
			</Menu>
		)
	}
}

class ContinueButton extends Component {
	view() {
		if (appState.get().noAds) {
			return null
		}
		return (
			<div>
				<CircleButton onClick={handleContinue} header={`Continue?`} />
			</div>
		)
	}
}

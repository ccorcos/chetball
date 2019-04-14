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
	setUnmuted,
	setMuted,
	handleRestart,
	handlePlay,
	routeToAchievements,
	routeToInstructions,
	routeToPurchase,
} from "../actions"
import { NoAdsButton } from "./NoAdsButton"
import { MuteHeaderToggle } from "./MuteHeaderToggle"
import { RestartButton } from "./RestartButton"
import { CurrentScore } from "./CurrentScore"
import { BottomSection } from "./BottomSection"

export class PauseMenu extends Component {
	view() {
		return (
			<Menu marginTop={"20vh"}>
				<MuteHeaderToggle />
				<NoAdsButton />
				<HighScore />
				<CircleButton
					onClick={handlePlay}
					header={`Level ${appState.get().level}`}
					label={"Resume"}
				/>
				<RestartButton />
				<BottomSection />
			</Menu>
		)
	}
}

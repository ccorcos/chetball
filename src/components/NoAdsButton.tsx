import * as React from "react"
import Component from "reactive-magic/component"
import { appState } from "../state"
import { routeToPurchase } from "../actions"
import * as styles from "../styles"

export class NoAdsButton extends Component {
	view() {
		if (appState.get().noAds) {
			return null
		} else {
			return (
				<div
					style={{
						position: "absolute",
						top: 0,
						right: 0,
						fontWeight: 800,
						margin: 14 * styles.scale,
						fontSize: 16 * styles.scale,
					}}
					onClick={routeToPurchase}
				>
					No Ads
				</div>
			)
		}
	}
}

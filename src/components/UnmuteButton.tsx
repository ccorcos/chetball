import * as React from "react"
import * as styles from "../styles"

interface UnmuteButtonProps {
	onClick: React.MouseEventHandler<HTMLDivElement>
}

export function UnmuteButton(props: UnmuteButtonProps) {
	return (
		<div onClick={props.onClick}>
			<svg
				viewBox="0 0 68 76"
				style={{
					height: 30 * styles.scale,
					width: 30 * styles.scale,
					margin: 10 * styles.scale,
				}}
			>
				<path
					style={{
						transform: "translate(52px, 22px)",
						strokeWidth: 2,
						stroke: "black",
					}}
					d="M -1.83105e-06 28.14L -1.83105e-06 32.14C 4.26203 32.14 8.34949 30.4469 11.3632 27.4332C 14.3769 24.4195 16.07 20.332 16.07 16.07C 16.07 11.808 14.3769 7.7205 11.3632 4.7068C 8.34949 1.69309 4.26203 3.05176e-07 -1.83105e-06 3.05176e-07L -1.83105e-06 4C 3.20116 4 6.27122 5.27166 8.53478 7.53522C 10.7983 9.79879 12.07 12.8688 12.07 16.07C 12.07 19.2712 10.7983 22.3412 8.53478 24.6048C 6.27122 26.8683 3.20116 28.14 -1.83105e-06 28.14L -1.83105e-06 28.14Z"
				/>
				<path
					style={{
						strokeWidth: 2,
						stroke: "black",
					}}
					d="M 45.13 75.72L 45.13 3.43323e-07L 15.6 20.76L 2.28882e-07 20.76L 2.28882e-07 54.96L 15.6 54.96L 45.13 75.72ZM 4 24.72L 16.4 24.72C 16.7012 24.7174 16.998 24.6468 17.2681 24.5135C 17.5382 24.3802 17.7748 24.1875 17.96 23.95L 41.13 7.7L 41.13 68.02L 17.96 51.73C 17.7748 51.4925 17.5382 51.2998 17.2681 51.1665C 16.998 51.0332 16.7012 50.9626 16.4 50.96L 4 50.96L 4 24.72Z"
				/>
			</svg>
		</div>
	)
}

import Svg, { Path, type SvgProps } from "react-native-svg";

export const ProfileOutline = ({ color = "#212121", ...props }: SvgProps) => (
	<Svg width={20} height={20} fill="none" {...props}>
		<Path
			stroke={color}
			strokeLinejoin="round"
			strokeWidth={2}
			d="M.75 14.75a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4 2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2Z"
		/>
		<Path
			stroke={color}
			strokeWidth={2}
			d="M8.75 6.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
		/>
	</Svg>
);

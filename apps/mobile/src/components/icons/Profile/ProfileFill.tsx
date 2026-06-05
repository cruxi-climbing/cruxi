import Svg, { Path, type SvgProps } from "react-native-svg";

export const ProfileFill = ({ color = "#DC6955", ...props }: SvgProps) => (
	<Svg width={20} height={20} fill="none" {...props}>
		<Path
			fill={color}
			fillRule="evenodd"
			d="M5 4a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm0 6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5H5Z"
			clipRule="evenodd"
		/>
	</Svg>
);

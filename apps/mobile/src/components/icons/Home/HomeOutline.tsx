import Svg, { Path, type SvgProps } from "react-native-svg";
import { theme } from "@/theme/theme";

export const HomeOutline = ({
	color = theme.colors.black,
	...props
}: SvgProps) => (
	<Svg width={20} height={20} fill="none" {...props}>
		<Path
			fill={color}
			d="M2 15.5h3v-5c0-.283.096-.52.288-.712A.972.972 0 0 1 6 9.5h4c.283 0 .521.096.713.288.192.192.288.43.287.712v5h3v-9L8 2 2 6.5v9Zm-2 0v-9c0-.317.071-.617.213-.9.142-.283.338-.517.587-.7l6-4.5C7.15.133 7.55 0 8 0c.45 0 .85.133 1.2.4l6 4.5c.25.183.446.417.588.7.142.283.213.583.212.9v9c0 .55-.196 1.021-.588 1.413A1.922 1.922 0 0 1 14 17.5h-4a.965.965 0 0 1-.712-.288A.972.972 0 0 1 9 16.5v-5H7v5a.968.968 0 0 1-.288.713A.964.964 0 0 1 6 17.5H2c-.55 0-1.02-.196-1.412-.587A1.93 1.93 0 0 1 0 15.5Z"
		/>
	</Svg>
);

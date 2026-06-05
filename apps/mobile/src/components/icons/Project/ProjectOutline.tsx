import Svg, { Path, type SvgProps } from "react-native-svg";

export const ProjectOutline = ({ color = "#212121", ...props }: SvgProps) => (
	<Svg width={20} height={20} fill="none" {...props}>
		<Path
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="m.75.75 2.462 2.462.615 4.307 6.77 6.154.614 3.077H.75m11.692-8.615a1.846 1.846 0 1 0 0-3.693 1.846 1.846 0 0 0 0 3.693Zm3.693 6.154a.616.616 0 1 0 0-1.232.616.616 0 0 0 0 1.232ZM7.519 1.98a.615.615 0 1 0 0-1.231.615.615 0 0 0 0 1.23Z"
		/>
	</Svg>
);

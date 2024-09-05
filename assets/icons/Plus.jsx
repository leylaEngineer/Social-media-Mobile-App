import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg";

const Plus = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color="#000000" fill="none" {...props}>
    <Path d="M12 8V16M16 12H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
  </Svg>
);

export default Plus;

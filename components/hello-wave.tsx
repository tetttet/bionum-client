import Animated from 'react-native-reanimated';
import { fs, lh } from "@/constants/typography";

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: fs(28),
        lineHeight: lh(32),
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}>
      👋
    </Animated.Text>
  );
}

import { useMemo } from "react";
import { View } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import { arc, pie } from "d3-shape";

export default function PieChart({ data, size = 180 }) {
  const radius = size / 2;

  const paths = useMemo(() => {
    const total = data.reduce((sum, d) => sum + (d.value > 0 ? d.value : 0), 0);
    if (!total) return [];

    const makePie = pie().value((d) => d.value);
    const makeArc = arc().outerRadius(radius).innerRadius(radius * 0.55);
    return makePie(data.filter((d) => d.value > 0)).map((slice) => ({
      color: slice.data.color,
      d: makeArc(slice),
    }));
  }, [data, radius]);

  if (paths.length === 0) return null;

  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G x={radius} y={radius}>
          {paths.map((p, idx) => (
            <Path key={idx} d={p.d} fill={p.color} />
          ))}
        </G>
      </Svg>
    </View>
  );
}


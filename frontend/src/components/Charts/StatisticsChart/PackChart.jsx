import React from 'react';
import { Group } from '@visx/group';
import { Pack, hierarchy } from '@visx/hierarchy';
import { scaleQuantize } from '@visx/scale';
import { useTooltip, Tooltip, defaultStyles } from "@visx/tooltip";
import { Polygon } from '@visx/shape';


export default function PackChart({ width, height, data, polygonSides, polygonRotation, colorScheme }) {
    const pack = { children: data, name: 'root', radius: 0, distance: 0 };
    const colorScaleBlue = scaleQuantize({
      domain: extent(data, (d) => d.radius),
      range: ['#1F96A6', '#2C5459', '#29C4D9', '#1E8F9E', '#6DD2DF', '#BDD4D7', '#81D4DF', '#143059', '#2F6B9A', '#82a6c2'],
    });
    const colorScaleOrange = scaleQuantize({
      domain: extent(data, (d) => d.radius),
      range: ['#EB8F49', '#DFAE88', '#D98443', '#DFAC88', '#EB8155', '#DFAA93', '#D9784E'],
      });

    const root = hierarchy(pack).sum((d) => d.radius * d.radius).sort(
        (a, b) =>
        // sort by hierarchy, then distance
        (a?.data ? 1 : -1) - (b?.data ? 1 : -1) ||
        (a.children ? 1 : -1) - (b.children ? 1 : -1) ||
        (a.data.distance == null ? -1 : 1) - (b.data.distance == null ? -1 : 1) ||
        a.data.distance - b.data.distance,
    );

    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip
      } = useTooltip();
    
      const handleMouseOver = (event, datum) => {
        showTooltip({
          tooltipLeft: event.pageX,
          tooltipTop: event.pageY,
          tooltipData: datum,
          tooltipOpen: true
        });
      };
      
      const tooltipStyles = {
        ...defaultStyles,
        backgroundColor: "rgba(53,71,125,0.8)",
        color: "white",
        padding: 12
      };

      function extent(allData, value) {
        return [Math.min(...allData.map(value)), Math.max(...allData.map(value))];
      }

  return width < 10 ? null : (
    <div className="Pack" style={{ touchAction: 'none' }}>
        <svg width={width} height={height}>
        <Pack root={root} size={[width, height]}>
            {(packData) => {
            const circles = packData.descendants().slice(1);// skip outer hierarchy
            return (
                <Group width={width} height={height}>
                  {circles.map((circle, i) => (
                        <g><Polygon
                        sides={polygonSides}
                        center={{x: circle.x, y: circle.y}}
                        size={circle.r}
                        fill={colorScheme == 1 ? colorScaleBlue(circle.data.radius): colorScaleOrange(circle.data.radius)}
                        rotate={polygonRotation}
                        onMouseOver={(e) => {
                          if(circle.r <= 30) {
                              handleMouseOver(e, `${circle.data.name}: ${circle.data.radius} Vorkommnisse`);
                          } else {  handleMouseOver(e, `${circle.data.radius} Vorkommnisse`); }
                      }}
                      onMouseOut={hideTooltip}
                        ></Polygon>
                        {circle.r > 30 && <text x={circle.x} y={circle.y} text-anchor="middle" dy=".3em" font-size="14px">{circle.data.name}</text>}
                        </g>
                    ))}
                {/*circles.map((circle, i) => (
                    <g>
                    <circle
                    key={`circle-${i}`}
                    r={circle.r}
                    cx={circle.x}
                    cy={circle.y}
                    fill={colorScale(circle.data.radius)}
                    onMouseOver={(e) => {
                        if(circle.r <= 30) {
                            handleMouseOver(e, `${circle.data.name}: ${circle.data.radius} Vorkommnisse`);
                        } else {  handleMouseOver(e, `${circle.data.radius} Vorkommnisse`); }
                    }}
                    onMouseOut={hideTooltip}
                    />
                    {circle.r > 30 && <text x={circle.x} y={circle.y} text-anchor="middle" dy=".3em" font-size="14px">{circle.data.name}</text>}
                  </g>))*/}
                </Group>
            );
            }}
        </Pack>
        </svg>
        {tooltipOpen && (
            <Tooltip
              key={Math.random()}
              top={tooltipTop }
              left={tooltipLeft }
              style={tooltipStyles}
            >
              <strong>{tooltipData}</strong>
            </Tooltip>
          )}
    </div>
  );
}
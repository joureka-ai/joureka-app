import React from 'react';
import { BarStackHorizontal } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { useTooltip, Tooltip, defaultStyles } from "@visx/tooltip";
import ChartLegend from '../Legends/ChartLegends';

const defaultMargin = { top: 40, left: 80, right: 40, bottom: 100 };

const TopicStackedBarChart = ({width, height, margin = defaultMargin, words, topic }) => {
    // bounds
    const keys = Object.keys(words[0]).filter((d) => d !== 'name') ;

    const getMaxFrequency = (data) => {
        let max = 0;
        for(let i = 0; i < data.length; i++) {
            let f = data[i].frequency + data[i].reference;
            if (f > max) max = f;
        }
        return max
    }

    const getName = (d) => d.name;

    const frequencyScale = scaleLinear({
    domain: [0, getMaxFrequency(words)],
    nice: true,
    });
    const dateScale = scaleBand({
    domain: words.map(getName),
    padding: 0.2,
    });
    const colorScale = scaleOrdinal({
    domain: keys,
    range: ["#EB8F49", "#F5E8DF"],
    });

    const legendColorScale = scaleOrdinal({
        domain: ['Termhäufigkeit innerhalb des ausgewählten Themas','Gesamthäufigkeit' ],
        range: ['#EB8F49', '#F5E8DF'],
      });

    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

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

    frequencyScale.rangeRound([0, xMax]);
    dateScale.rangeRound([yMax, 0]);

    return width < 10 ? null : (
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div>Top-{words.length} relevantesten Begriffe für das Thema "{topic}"</div>
        <svg width={width} height={height - 50}>
          <Group top={margin.top} left={margin.left}>
            <BarStackHorizontal
              data={words}
              keys={keys}
              height={yMax}
              y={getName}
              xScale={frequencyScale}
              yScale={dateScale}
              color={colorScale}
            >
              {(barStacks) =>
                barStacks.map((barStack) =>
                  barStack.bars.map((bar) => (
                    <rect
                      key={`barstack-horizontal-${barStack.index}-${bar.index}`}
                      x={bar.x}
                      y={bar.y}
                      width={bar.width}
                      height={bar.height}
                      fill={bar.color}
                      onClick={() => {
                       alert(`clicked: ${JSON.stringify(bar)}`);
                      }}
                      onMouseOver={(e) => {
                        handleMouseOver(e, bar);
                     }}
                     onMouseOut={hideTooltip}
                    />
                  )),
                )
              }
            </BarStackHorizontal>
            <AxisLeft
              hideAxisLine
              hideTicks
              scale={dateScale}
              stroke={"#1E8F9E"}
              tickStroke={"#1E8F9E"}
              tickLabelProps={() => ({
                fill: "#1E8F9E",
                fontSize: 11,
                textAnchor: 'end',
                dy: '0.33em',
              })}
            />
            <AxisBottom
              top={yMax}
              scale={frequencyScale}
              stroke={"#1E8F9E"}
              tickStroke={"#1E8F9E"}
              tickLabelProps={() => ({
                fill: "#1E8F9E",
                fontSize: 11,
                textAnchor: 'middle',
              })}
            />
          </Group>
        </svg>
        <ChartLegend scale={legendColorScale} type={1} title={""}></ChartLegend>
        {tooltipOpen && (
            <Tooltip
              key={Math.random()}
              top={tooltipTop }
              left={tooltipLeft }
              style={tooltipStyles}
            >
              <strong>{tooltipData.bar.data[tooltipData.key]} Vorkommnisse</strong>
            </Tooltip>
          )}
      </div>
    );
  };

export default TopicStackedBarChart;

import React, { useState, useEffect } from 'react';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { GridRows, GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { Circle } from '@visx/shape';
import { useTooltip, Tooltip, defaultStyles } from "@visx/tooltip";
import { useRouter } from 'next/router';

const data = [
    {x: 10, y: 305, Topic: "topic 1", Words: ["word 1", "word 2", "word 3", "word 4", "word 5", "word 6", "word 7", "word 8", "word 9", "word 2"], Size: 10},
    {x: 104, y: 45, Topic: "topic 2", Words: ["word 1", "word 2", "word 1", "word 2", "word 1"], Size: 5}, 
    {x: 40, y: 145, Topic: "topic 3", Words: ["word 1", "word 2", "word 1", "word 2", "word 1", "word 2"], Size: 6},
    {x: 123, y: 315, Topic: "topic 4", Words: ["word 1", "word 2", "word 1", "word 2", "word 1", "word 2"], Size: 6},
    {x: 30, y: 50, Topic: "topic 5", Words: ["word 1", "word 2", "word 1", "word 2", "word 1"], Size: 5},
    {x: 100, y: 10, Topic: "topic 6", Words: ["word 1", "word 2", "word 1", "word 2", "word 1", "word 2", "word 1", "word 1", "word 2", "word 1"], Size: 9},
]

const IntertopicDistanceMap = ({ width, height, setSelectedTopic }) => {
    const router = useRouter();
    const { pid } = router.query;

    data.sort((firstEl, secondEl) => {
        return secondEl.Size - firstEl.Size
    })
    // margins
    const margin = { top: 10, right: 100, bottom: 50, left: 100 };


    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    // scales
    const xScale = scaleLinear({
        domain: [0, Math.max(...data.map((d) => d.x))],
        nice: true,
        range: [0, xMax]
    });
    const yScale = scaleLinear({
        domain: [
            0,
            Math.max(...data.map((d) => d.y)),
        ],
        nice: true,
        range: [yMax, 0]
    });
  

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

    useEffect(() => {

    }, [width, height]);

  
    return (
    <div className="Drag" style={{ touchAction: 'none' }}>
        <svg width={width} height={height}>
            <AxisBottom 
                left={margin.left} 
                top={yMax/2} 
                scale={xScale} 
                label="PC1"
                labelOffset={yMax/2}
                stroke="#1E8F9E"
                strokeWidth={2}
                numTicks={0} 
            />
            <AxisLeft 
                left={margin.left + xMax/2} 
                scale={yScale} 
                label="PC2"
                labelOffset={xMax/2}
                stroke="#1E8F9E"
                strokeWidth={2}
                numTicks={0} 
            />
            <GridRows 
                left={margin.left} 
                scale={yScale} 
                width={xMax} 
                height={yMax} 
                strokeDasharray="5"
                strokeOpacity={0.2}
                stroke="#1E8F9E" />
            <GridColumns 
                left={margin.left} 
                scale={xScale} 
                width={xMax} 
                height={yMax} 
                strokeDasharray="5"
                strokeOpacity={0.2}
                stroke="#1E8F9E"/>
            <Group left={margin.left}>
                {data.map((point, i) => (
                <g><Circle
                    key={`point-${point.Topic}-${i}`}
                    className="dot"
                    cx={xScale(point.x)}
                    cy={yScale(point.y)}
                    r={tooltipData && tooltipData.Topic === point.Topic ? point.Size*5.5 : point.Size*5}
                    filter={tooltipData && tooltipData.Topic === point.Topic ? "url(#f2)" : ""}
                    fill={tooltipData && tooltipData.Topic === point.Topic ? '#1E8F9E' : '#EB8F49'}
                    onMouseOver={(e) => {
                           handleMouseOver(e, point)
                    }}
                    onMouseOut={hideTooltip}
                    onClick={() => {
                        setSelectedTopic(2)
                    }}
                    opacity={0.7}
                />
                <text x={xScale(point.x)} y={yScale(point.y)} text-anchor="middle" dy=".3em" font-size="14px">{point.Topic}</text>
                <defs>
                    <filter id="f2" x="0" y="0" width="200%" height="200%">
                    <feOffset result="offOut" in="SourceGraphic" dx="5" dy="5" />
                    <feGaussianBlur result="blurOut" in="offOut" stdDeviation="5" />
                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                    </filter>
                </defs>
                <defs>
                    <filter id="shadow">
                        <feDropShadow dx="0.2" dy="0.4" stdDeviation="0.2" flood-color="#1E8F9E"/>
                    </filter>
                </defs>
                </g>))}
            </Group>
        </svg>
        {tooltipOpen && (
            <Tooltip
            key={Math.random()}
            top={tooltipTop }
            left={tooltipLeft }
            style={tooltipStyles}
            >
            <div><strong>{tooltipData.Topic}</strong> (Size: {tooltipData.Size})</div>
            <div className="py-2 lh-base">{tooltipData.Words.map((w) => <span> {w} |</span>)}</div>
            <div className="lh-base"><i>Klicken Sie auf den Kreis, um mehr über das Thema zu erfahren!</i></div>
            </Tooltip>
        )}
        <div className="d-flex flex-row justify-content-between pb-1">
        </div>
        <style jsx>{`
            .Drag {
            display: flex;
            flex-direction: column;
            user-select: none;
            }

            svg {
            margin: 1rem 0;
            }
            .deets {
            display: flex;
            flex-direction: row;
            font-size: 12px;
            }
            .deets > div {
            margin: 0.25rem;
            }
        `}</style>
    </div>
  );
}

export default IntertopicDistanceMap;
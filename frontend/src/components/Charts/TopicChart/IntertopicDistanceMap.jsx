import React, { useState, useEffect } from 'react';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { GridRows, GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { Circle } from '@visx/shape';
import { useTooltip, Tooltip, defaultStyles } from "@visx/tooltip";

const IntertopicDistanceMap = ({ width, height, topics, setSelectedTopic }) => {

    topics.sort((firstEl, secondEl) => {
        return secondEl.size - firstEl.size
    })
    // margins
    const margin = { top: 10, right: 100, bottom: 50, left: 100 };


    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    // scales
    const xScale = scaleLinear({
        domain: [
            Math.min(...topics.map((d) => d.x)) - 1, 
            Math.max(...topics.map((d) => d.x)) + 1,
        ],
        nice: true,
        range: [0, xMax]
    });
    const yScale = scaleLinear({
        domain: [
            Math.min(...topics.map((d) => d.y)) - 1,
            Math.max(...topics.map((d) => d.y)) + 1,
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
                {topics.map((point, i) => (
                <g key={i}><Circle
                    key={`point-${point.id}-${i}`}
                    className="dot"
                    cx={xScale(point.x)}
                    cy={yScale(point.y)}
                    r={tooltipData && tooltipData.label === point.label ? point.size*1.5 : point.size*1}
                    filter={tooltipData && tooltipData.label === point.label ? "url(#f2)" : ""}
                    fill={tooltipData && tooltipData.label === point.label ? '#1E8F9E' : '#EB8F49'}
                    onMouseOver={(e) => {
                           handleMouseOver(e, point)
                    }}
                    onMouseOut={hideTooltip}
                    onClick={() => {
                        setSelectedTopic(point)
                    }}
                    opacity={0.7}
                />
                <text x={xScale(point.x)} y={yScale(point.y)} textAnchor="middle" dy=".3em" fontSize="14px">{point.label}</text>
                <defs>
                    <filter id="f2" x="0" y="0" width="200%" height="200%">
                    <feOffset result="offOut" in="SourceGraphic" dx="5" dy="5" />
                    <feGaussianBlur result="blurOut" in="offOut" stdDeviation="5" />
                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                    </filter>
                </defs>
                <defs>
                    <filter id="shadow">
                        <feDropShadow dx="0.2" dy="0.4" stdDeviation="0.2" floodColor="#1E8F9E"/>
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
            <div><strong>{tooltipData.label}</strong> (Size: {tooltipData.size})</div>
            <div className="py-2 lh-base">{tooltipData.words.map((w, i) => <span key={i}> {w.word} |</span>)}</div>
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
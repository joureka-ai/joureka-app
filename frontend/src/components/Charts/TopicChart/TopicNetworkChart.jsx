import React, { useState } from 'react';
import { DefaultNode, Graph } from '@visx/network';
import { useTooltip, Tooltip, defaultStyles } from "@visx/tooltip";
import { scaleOrdinal } from '@visx/scale';
import ChartLegend from '../Legends/ChartLegends';

const TopicNetworkChart = ({ width, height, words, topic }) => {
    const [topicName, setTopicName] = useState(topic);
    const [editMode, setEditmode] = useState(false);
    height = height - 100

    const handleChange = (e) => {
        const {value} = e.target;
        setTopicName(value)
      };
    
    const ordinalColorScale = scaleOrdinal({
        domain: ['Gesamthäufigkeit', 'Termhäufigkeit innerhalb des ausgewählten Themas'],
        range: ['#F5E8DF', '#EB8F49'],
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

    const arrangeElementsInCircle = (elements, x, y, radius) => {
        let nodes = []
        for (var i = 0; i < elements.length; i++) {
            let r = radius + ((i % 2) * 20)
            nodes.push({
                color: "#F5E8DF",
                r: elements[i].reference,
                x: (x + r * Math.cos((2 * Math.PI) * i/elements.length) * 1.5),
                y: (y + r * Math.sin((2 * Math.PI) * i/elements.length)),
                name: elements[i].name,
            })
            nodes.push({
                color: "#EB8F49",
                r: elements[i].frequency,
                x: (x + r * Math.cos((2 * Math.PI) * i/elements.length) * 1.5),
                y: (y + r * Math.sin((2 * Math.PI) * i/elements.length)),
                name: elements[i].name,
            })
        }
        nodes.push({x: width/2, y: height/2, r: 50, color: '#1E8F9E', name: topic})
        return nodes;
    }

    const createLinks = (elements) => {
        let links = []
        for (var i = 0; i < elements.length - 1; i++) {
            if(i%2 != 0){
                links.push({ source: elements[elements.length - 1 ], target: elements[i] })
            }
        }
        return links
    }
    let nodes = arrangeElementsInCircle(words, (width/2), (height/2), (height/2 - 70));
    let links = createLinks(nodes)
    const graph = {
        nodes,
        links
    };

    return width < 10 ? null : (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <div>Relevante Begriffe für das Thema "{topic}"</div>
            <svg width={width} height={height}>
            <Graph
                graph={graph}
                width={width} 
                height={height}
                nodeComponent={({ node: { r, color, name, x, y } }) =>
                <g>
                    <DefaultNode 
                    fill={color} 
                    r={r}
                    onMouseOver={(e) => {
                        if(name != topic) {
                            if(r <= 10) {
                                handleMouseOver(e, `${name}: ${r} Vorkommnisse`);
                            } else {  handleMouseOver(e, `${r} Vorkommnisse`); }
                        } else {
                            handleMouseOver(e, "Doppelklicken zum Bearbeiten")
                        }}}
                    onMouseOut={hideTooltip}
                    />
                    {r > 10 && name == topic &&  
                    <foreignObject x="-45" y="-12" width="90" height="30">
                        <input readOnly={!editMode} id="network-input" autoFocus={editMode} class="network-chart-input" type="text" onDoubleClick={() => setEditmode(true)} onChange={handleChange} value={topicName}/>
                    </foreignObject>}
 
                    {r > 10 && name != topic && <text text-anchor="middle" font-size="12px" dy=".3em">{name}</text>}
                </g>}
                linkComponent={({ link: { source, target, dashed } }) => (
                <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    strokeWidth={2}
                    stroke="#999"
                    strokeOpacity={0.6}
                    strokeDasharray={dashed ? '8,4' : undefined}
                />
                )}
            />
            </svg>
            <ChartLegend scale={ordinalColorScale} type={1} title={""}></ChartLegend>
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
            {editMode &&
            <div className="custom-card-action">
                <div className="d-flex flex-column flex-md-row">
                    <button onClick={() => 
                    {
                        setEditmode(false)
                        setTopicName(topic)
                    }
                    } className="custom-button custom-button-sm custom-button-transparent mx-1">Abbrechen</button>
                    <button onClick={() => saveChanges()} className="custom-button custom-button-sm custom-button-blue">Änderungen speichern</button>
                    </div>
            </div>}
        </div>
    );
}

export default TopicNetworkChart;
import React, { useState, useEffect } from 'react';
import { scaleLinear } from '@visx/scale';
import { LinearGradient } from '@visx/gradient';
import { Drag, raise } from '@visx/drag';
import ChartLegend from '../Legends/ChartLegends';
import { useTooltip, Tooltip, defaultStyles } from "@visx/tooltip";
import { getSeededRandom } from '@visx/mock-data';
import { useRouter } from 'next/router';
import { projectService } from '../../../services';

const tresholdHeight = 100;

const generateCircles = (data, width, height) => {

  const circles = []
  data.forEach(d => {
      circles.push( {
        id: d.name,
        radius: d.frequency * 5,
        frequency: d.frequency,
        x: Math.round(Math.random(1) * (width - d.frequency * 2) + d.frequency),
        y: Math.round(Math.random(1) * (height - d.frequency * 2) + d.frequency),
        recordingsIds: d.recordings
      })
  })

  return circles
};

const BubbleChart = ({ width, height, pins, topics, setSelectedAnnotation }) => {
  const router = useRouter();
  const { pid } = router.query;
  const [draggingItemsTopics, setDraggingItemsTopics] = useState([]);
  const [draggingItemsPins, setDraggingItemsPins] = useState([]);

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
    if (width > 10 && height > 10) {
        setDraggingItemsTopics(generateCircles(topics, width, (height-tresholdHeight) ));
        setDraggingItemsPins(generateCircles(pins, width, (height-tresholdHeight)));
    }
  }, [width, height]);

  const colorScaleTopics = scaleLinear({
    range: ['#BDD4D7', '#1E8F9E'],
    domain: [0, Math.max(...topics.map((t) => t.frequency))],
  })

  const colorScalePins = scaleLinear({
    range: ['#F5E8DF', '#EB8F49'],
    domain: [0, Math.max(...pins.map((p) => p.frequency))],
  })

  if (draggingItemsTopics.length === 0  && draggingItemsPins.length === 0 || width < 10) return null;

  function getAnnotationDocuments(annot) {
    projectService.getAllDocuments(pid).then(docs => {
      let d = docs.filter(doc => annot.recordingsIds.includes(doc.id))
      setSelectedAnnotation({text: annot.id, documents: d})
    })
  }

  return (
    <div className="Drag" style={{ touchAction: 'none' }}>
        <svg width={width} height={height-tresholdHeight}>
        <LinearGradient id="stroke" from="#1E8F9E" to="#EB8F49" />
        {draggingItemsPins.map((d, i) => (
          <Drag
            key={`drag-${d.id}`}
            width={width}
            height={height-tresholdHeight}
            x={d.x}
            y={d.y}
            onDragStart={() => {
              setDraggingItemsPins(raise(draggingItemsPins, i));
            }}
          >
            {({ dragStart, dragEnd, dragMove, isDragging, x, y, dx, dy }) => (
              <circle
                onMouseOver={(e) => {
                    handleMouseOver(e, `${d.id}: ${d.frequency} Vorkommnisse`);
                }}
                onMouseOut={hideTooltip}
                key={`dot-${d.id}`}
                cx={x}
                cy={y}
                r={isDragging ? d.radius + 4 : d.radius}
                fill={isDragging ? 'url(#stroke)' : colorScalePins(d.frequency)}
                transform={`translate(${dx}, ${dy})`}
                fillOpacity={0.9}
                stroke={isDragging ? 'white' : 'transparent'}
                strokeWidth={2}
                onMouseMove={dragMove}
                onMouseUp={dragEnd}
                onMouseDown={dragStart}
                onTouchStart={dragStart}
                onTouchMove={dragMove}
                onTouchEnd={dragEnd}
                onClick={() => {
                  getAnnotationDocuments(d)
                }}
              />
            )}
          </Drag>
        ))}
        
        {draggingItemsTopics.map((d, i) => (
          <Drag
            key={`drag-${d.id}`}
            width={width}
            height={height-tresholdHeight}
            x={d.x}
            y={d.y}
            onDragStart={() => {
              setDraggingItemsTopics(raise(draggingItemsTopics, i));
            }}
          >
            {({ dragStart, dragEnd, dragMove, isDragging, x, y, dx, dy }) => (
              <circle
                key={`dot-${d.id}`}
                cx={x}
                cy={y}
                r={isDragging ? d.radius + 4 : d.radius}
                fill={isDragging ? 'url(#stroke)' : colorScaleTopics(d.frequency)}
                transform={`translate(${dx}, ${dy})`}
                fillOpacity={0.9}
                stroke={isDragging ? 'white' : 'transparent'}
                strokeWidth={2}
                onMouseMove={dragMove}
                onMouseUp={dragEnd}
                onMouseDown={dragStart}
                onTouchStart={dragStart}
                onTouchMove={dragMove}
                onTouchEnd={dragEnd}
                onMouseOver={(e) => {
                  handleMouseOver(e, `${d.id}: ${d.frequency} Vorkommnisse`);
                }}
                onMouseOut={hideTooltip}
                onClick={() => {
                  getAnnotationDocuments(d)
                }}
              />
            )}
          </Drag>
        ))}
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
      <div className="d-flex flex-column flex-md-row justify-content-between pb-1">
        <ChartLegend scale={colorScaleTopics} type={0} title={"Themen"}></ChartLegend>
        <ChartLegend scale={colorScalePins} type={0} title={"Pins"}></ChartLegend>
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

export default BubbleChart;
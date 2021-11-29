import React from 'react';
import { scaleLinear, scaleOrdinal, scaleThreshold, scaleQuantile } from '@visx/scale';
import { GlyphStar, GlyphWye, GlyphTriangle, GlyphDiamond } from '@visx/glyph';
import {
  Legend,
  LegendLinear,
  LegendQuantile,
  LegendOrdinal,
  LegendSize,
  LegendThreshold,
  LegendItem,
  LegendLabel,
} from '@visx/legend';


const legendGlyphSize = 15;

export default function ChartLegend({ scale, title, type, events = false }) {
  return (
      <LegendDemo title={title}>
        {type == 0 && <LegendLinear
          scale={scale}
          labelFormat={(d, i) => (i % 2 === 0 ? d : '')}
        >
          {(labels) => (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
            { labels.map((label, i) => (
              <LegendItem
                key={`legend-quantile-${i}`}
                margin="0 5px"
                onClick={() => {
                  if (events) alert(`clicked: ${JSON.stringify(label)}`);
                }}
              >
                <svg width={legendGlyphSize} height={legendGlyphSize} style={{ margin: '2px 0' }}>
                  <circle
                    fill={label.value}
                    r={legendGlyphSize / 2}
                    cx={legendGlyphSize / 2}
                    cy={legendGlyphSize / 2}
                  />
                </svg>
                <LegendLabel align="bottom" margin="0 0 0 0 4px">
                  {label.text}
                </LegendLabel>
              </LegendItem>
            ))}
            </div>
          )}
        </LegendLinear>}
        {type == 1 && <LegendOrdinal 
        scale={scale} 
        labelFormat={(label) => `${label}`}>
          {(labels) => (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {labels.map((label, i) => (
                <LegendItem
                  key={`legend-quantile-${i}`}
                  margin="0 5px"
                  onClick={() => {
                    if (events) alert(`clicked: ${JSON.stringify(label)}`);
                  }}
                >
                  <svg width={legendGlyphSize} height={legendGlyphSize}>
                    <rect fill={label.value} width={legendGlyphSize} height={legendGlyphSize} />
                  </svg>
                  <LegendLabel align="left" margin="0 0 0 4px">
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              ))}
            </div>
          )}
        </LegendOrdinal>}
        <style jsx>{`
        .legends {
          font-family: arial;
          font-weight: 900;
          background-color: black;
          border-radius: 14px;
          padding: 24px 24px 24px 32px;
          overflow-y: auto;
          flex-grow: 1;
        }
        .chart h2 {
          margin-left: 10px;
        }
      `}</style>
      </LegendDemo>

      
  );
}

function LegendDemo({ title, children }) {
  return (
    <div className="legend">
      <div className="title">{title}</div>
      {children}
      <style jsx>{`
        .legend {
          line-height: 0.9em;
          color: black;
          font-size: 10px;
          font-family: arial;
          padding: 10px 10px;
          float: left;
          border: none;
          margin: 0;
        }
        .title {
          font-size: 10px;
          margin-bottom: 0.5rem;
          font-weight: 100;
        }
      `}</style>
    </div>
  );
}
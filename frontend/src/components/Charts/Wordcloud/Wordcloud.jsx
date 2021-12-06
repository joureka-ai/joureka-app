import React, { useState } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import { Wordcloud } from "@visx/wordcloud";
import { useTooltip, Tooltip, defaultStyles } from "@visx/tooltip";

const colors = ['#143059', '#2F6B9A', '#82a6c2', '#1E8F9E', '#EB8F49'];

const CustomWordcloud = ({ width, height, words, setRecordingsList, showControls }) => {
  const [spiralType, setSpiralType] = useState('archimedean');
  const [withRotation, setWithRotation] = useState(false);

  const fontScale = scaleLog({
    domain: [Math.min(...words.map((w) => w.frequency)), Math.max(...words.map((w) => w.frequency))],
    range: [10, 100],
  });

  const fontSizeSetter = (datum) => fontScale(datum.value);

  const fixedValueGenerator = () => 0.5;

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

  function formattedWords(words){
    return words.map((word) => ({ text: word.word, value: word.frequency, recordingsIds: word.recordings }));
  }
  
  
  function getRotationDegree() {
    const rand = Math.random();
    const degree = rand > 0.5 ? 60 : -60;
    return rand * degree;
  }
  
  return (
    <div className="wordcloud">
        <Wordcloud
            words={formattedWords(words)}
            width={width}
            height={height-10}
            fontSize={fontSizeSetter}
            font={'Impact'}
            padding={2}
            spiral={spiralType}
            rotate={withRotation ? getRotationDegree : 0}
            random={fixedValueGenerator}
        >
            {(cloudWords) =>
            cloudWords.map((w, i) => (
                <Text
                key={w.text}
                fill={colors[i % colors.length]}
                textAnchor={'middle'}
                transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                fontSize={w.size}
                fontFamily={w.font}
                onMouseOver={(e) => {
                  handleMouseOver(e, `${w.text}: ${w.value} Vorkommnisse`);
                }}
                onMouseOut={hideTooltip}
                onClick={() => {
                  setRecordingsList(w)
                }}
                >
                {w.text}
                </Text>
            ))
            }
        </Wordcloud>
        {showControls && (
            <div className="mt-1">
            <label>
                Spiral type &nbsp;
                <select
                onChange={(e) => setSpiralType(e.target.value)}
                value={spiralType}
                >
                <option key={'archimedean'} value={'archimedean'}>
                    archimedean
                </option>
                <option key={'rectangular'} value={'rectangular'}>
                    rectangular
                </option>
                </select>
            </label>
            <label>
                With rotation &nbsp;
                <input
                type="checkbox"
                checked={withRotation}
                onChange={() => setWithRotation(!withRotation)}
                />
            </label>
            <br />
            </div>
        )}
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
        <style jsx>{`
            .wordcloud {
            display: flex;
            flex-direction: column;
            user-select: none;
            }
            .wordcloud svg {
            margin: 1rem 0;
            cursor: pointer;
            }

            .wordcloud label {
            display: inline-flex;
            align-items: center;
            font-size: 14px;
            margin-right: 8px;
            }
            .wordcloud textarea {
            min-height: 100px;
            }
        `}</style>
    </div>
  );
}

export default CustomWordcloud;

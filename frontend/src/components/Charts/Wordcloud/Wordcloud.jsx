import React, { useState } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import { Wordcloud } from "@visx/wordcloud";
import { useTooltip, Tooltip, defaultStyles } from "@visx/tooltip";
import { localPoint } from '@visx/event';

const colors = ['#143059', '#2F6B9A', '#82a6c2', '#1E8F9E', '#EB8F49'];
const totoAfricaLyrics = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tempus mauris nec felis maximus, et tincidunt mauris aliquet. Nullam gravida ipsum ut lacus hendrerit, sed volutpat erat interdum. Praesent sodales facilisis eros, a efficitur tortor malesuada a. Duis quis dolor eu mi suscipit fermentum. Nullam euismod erat purus, tempor fringilla eros tempus quis. Fusce a feugiat mauris, et imperdiet lorem. Maecenas quis gravida dui. Etiam scelerisque sagittis turpis id accumsan. Suspendisse aliquam posuere sem sit amet condimentum. Nunc consequat finibus ante, nec tincidunt diam maximus at. Donec vulputate ullamcorper sollicitudin. Donec consequat at neque et aliquet.

Vestibulum purus elit, fringilla sit amet pellentesque quis, pulvinar sit amet lectus. Proin porttitor ut elit vel dignissim. Mauris tincidunt faucibus odio in vestibulum. Aenean pharetra justo id justo auctor, eu vehicula mauris sagittis. Nulla in tellus velit. Nunc vitae nisl in purus sollicitudin egestas quis ut turpis. Pellentesque pretium dolor at nunc molestie, fermentum consectetur tellus efficitur. Integer rutrum ex et lorem lobortis, nec egestas libero accumsan. Nunc dapibus vulputate elit, nec tincidunt magna congue pulvinar. Donec vel suscipit eros. Nulla fermentum et arcu a ullamcorper. Praesent nulla ante, varius sodales viverra vel, elementum vel justo.

Donec maximus justo dolor, sit amet consequat sem vestibulum et. Nullam egestas sollicitudin nibh. Maecenas condimentum dapibus elit sed laoreet. Maecenas placerat porta risus ut euismod. Curabitur maximus nulla at ligula pellentesque consectetur. Integer tristique est egestas, fermentum turpis a, ornare purus. Vestibulum nec lobortis nunc. Nullam rutrum ex at ante efficitur dapibus. Phasellus eu ipsum vitae felis mollis commodo sit amet et purus. Suspendisse et neque neque. Mauris vestibulum massa libero, iaculis pellentesque magna sollicitudin sit amet. Fusce accumsan libero dapibus arcu lobortis, vel porttitor ligula iaculis. Maecenas semper non massa quis facilisis. In bibendum enim ut pellentesque porttitor. Vivamus sit amet tempus justo. Praesent at blandit lectus, a ultricies elit.

Nullam interdum augue tellus, non efficitur tellus dapibus eu. Donec hendrerit, est sit amet porta dignissim, felis enim rutrum tortor, quis porta tellus erat vel eros. Pellentesque vulputate mauris quis lacinia placerat. Duis tristique ante in tristique finibus. Nulla maximus elementum elit, at dignissim sem fringilla nec. Vestibulum auctor ex placerat fermentum dapibus. Nulla quis vulputate purus. Suspendisse laoreet in nulla vitae efficitur. Suspendisse bibendum leo sed odio varius vulputate sed eget nulla. Nullam vitae hendrerit mi. In hac habitasse platea dictumst. Pellentesque bibendum eros eget metus dapibus lobortis. In id rhoncus lectus. Donec vehicula viverra ante in volutpat. Aliquam quis feugiat metus, a pellentesque libero. Curabitur mollis erat ut purus sollicitudin, vitae ultricies metus suscipit.

Etiam vulputate feugiat velit non finibus. Nam risus velit, rhoncus quis neque sit amet, aliquet venenatis leo. Mauris sed dictum quam. Donec fringilla sagittis dolor, quis aliquam urna tristique quis. Cras pretium quis massa sed egestas. Etiam a neque at ex laoreet tempus ac quis sem. Ut sit amet ligula quis nunc vehicula condimentum eu sit amet tortor. Praesent rhoncus diam ac urna iaculis, nec consequat velit condimentum. Cras mi augue, accumsan non vehicula quis, dictum rhoncus neque. Sed gravida lobortis erat, nec placerat dolor tincidunt at. Mauris pulvinar euismod blandit. Aliquam aliquet scelerisque elit, at vehicula libero sollicitudin sed. Aliquam dictum ultrices urna, ac consectetur nunc tempus ac. Mauris a leo leo. Quisque efficitur leo dui, eget rhoncus magna sodales ut.`;

function wordFreq(text){
  const words = text.replace(/\./g, '').split(/\s/);
  const freqMap = {};

  for (const w of words) {
    if (!freqMap[w]) freqMap[w] = 0;
    freqMap[w] += 1;
  }
  return Object.keys(freqMap).map((word) => ({ text: word, value: freqMap[word] }));
}

function getRotationDegree() {
  const rand = Math.random();
  const degree = rand > 0.5 ? 60 : -60;
  return rand * degree;
}

const words = wordFreq(totoAfricaLyrics);

const fontScale = scaleLog({
  domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
  range: [10, 100],
});
const fontSizeSetter = (datum) => fontScale(datum.value);

const fixedValueGenerator = () => 0.5;

//type SpiralType = 'archimedean' | 'rectangular';

export default function Example({ width, height, showControls }) {
  const [spiralType, setSpiralType] = useState('archimedean');
  const [withRotation, setWithRotation] = useState(false);

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

  return (
    <div className="wordcloud">
        <Wordcloud
            words={words}
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
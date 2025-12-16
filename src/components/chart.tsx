import { createChart, ColorType, AreaSeries } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

interface ChartProps {
    csvData?: string;
    data?: any[];
    symbol?: string;
    onRangeChange?: (range: string) => void;
    onIntervalChange?: (interval: string) => void;
    selectedRange?: string;
    selectedInterval?: string;
}



function Chart({ csvData, data: propData, onRangeChange, onIntervalChange, selectedRange: propSelectedRange, selectedInterval: propSelectedInterval }: ChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [selectedRange, setSelectedRange] = useState(propSelectedRange || '1d');
    const [selectedInterval, setSelectedInterval] = useState(propSelectedInterval || '15m');

    // Update local state when props change
    useEffect(() => {
        if (propSelectedRange) setSelectedRange(propSelectedRange);
    }, [propSelectedRange]);

    useEffect(() => {
        if (propSelectedInterval) setSelectedInterval(propSelectedInterval);
    }, [propSelectedInterval]);
    
    const timeRanges = [
        { label: '1D', value: '1d' },
        { label: '5D', value: '5d' },
        { label: '1M', value: '1mo' },
        { label: '3M', value: '3mo' },
        { label: '6M', value: '6mo' },
        { label: '1Y', value: '1y' }
    ];
    
    const intervals = [
        { label: '1m', value: '1m' },
        { label: '2m', value: '2m' },
        { label: '5m', value: '5m' },
        { label: '15m', value: '15m' },
        { label: '30m', value: '30m' },
        { label: '1h', value: '1h' },
        { label: '1d', value: '1d' }
    ];
    
    const handleRangeClick = (range: string) => {
        setSelectedRange(range);
        if (onRangeChange) {
            onRangeChange(range);
        }
    };
    
    const handleIntervalClick = (interval: string) => {
        setSelectedInterval(interval);
        if (onIntervalChange) {
            onIntervalChange(interval);
        }
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#d1d5db',
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
            grid: {
                vertLines: { color: '#374151' },
                horzLines: { color: '#374151' },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });
            
        const areaSeries = chart.addSeries(AreaSeries, { lineColor: '#2962FF', topColor: '#2962FF', bottomColor: 'rgba(41, 98, 255, 0.28)' });


        let data = propData || [{ value: 0, time: '2022-01-17' }, { value: 8, time: '2022-01-18' }, { value: 10, time: '2022-01-19' }, { value: 20, time: '2022-01-20' }, { value: 3, time: '2022-01-21' }, { value: 43, time: '2022-01-22' }, { value: 41, time: '2022-01-23' }, { value: 43, time: '2022-01-24' }, { value: 56, time: '2022-01-25' }, { value: 46, time: '2022-01-26' }];

        console.log('Chart received data points:', data.length);
        console.log('First 3 items:', data.slice(0, 3));
        
        data = data.map(item => {
            // Check if it's a number (timestamp)
            if (typeof item.time === 'number' || !isNaN(Number(item.time))) {
                const timestamp = typeof item.time === 'number' ? item.time : Number(item.time);
                // Use timestamp directly for intraday data (lightweight-charts accepts Unix timestamps)
                return {
                    ...item,
                    time: timestamp
                };
            } else {
                // Keep date strings as-is
                return item;
            }
        }).filter(item => item.value != null && !isNaN(item.value)); 

        // Remove duplicates and sort by time
        const uniqueData = new Map();
        data.forEach(item => {
            if (!uniqueData.has(item.time)) {
                uniqueData.set(item.time, item);
            }
        });
        data = Array.from(uniqueData.values()).sort((a, b) => {
            return a.time > b.time ? 1 : -1;
        });

        console.log('Chart after processing:', data.length, 'data points');
        console.log('First 3 processed:', data.slice(0, 3));
        
        if (csvData) {
            const lines = csvData.trim().split('\n');
           
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            
            const timeIndex = headers.findIndex(h => h === 'time' || h === 'date');
            const valueIndex = headers.findIndex(h => h === 'value' || h === 'price' || h === 'close');
            
            if (timeIndex !== -1 && valueIndex !== -1) {
                data = lines.slice(1).map(line => {
                    const values = line.split(',');
                    const timeValue = values[timeIndex].trim();
                    return {
                        time: isNaN(Number(timeValue)) ? timeValue : Number(timeValue),
                        value: parseFloat(values[valueIndex].trim())
                    };
                }).filter(d => d.time && !isNaN(d.value));
            }
        }

        areaSeries.setData(data as any);

        chart.timeScale().fitContent();

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [csvData, propData]);

    return (
        <div>
            {/* Time Range Selector */}
            {onRangeChange && (
                <div className="flex gap-2 mb-4">
                    {timeRanges.map(range => (
                        <button
                            key={range.value}
                            onClick={() => handleRangeClick(range.value)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                selectedRange === range.value
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            )}
            
            {/* Interval Selector */}
            {onIntervalChange && (
                <div className="flex gap-2 mb-4">
                    <span className="text-gray-300 self-center mr-2">Interval:</span>
                    {intervals.map(interval => (
                        <button
                            key={interval.value}
                            onClick={() => handleIntervalClick(interval.value)}
                            className={`px-3 py-1 rounded-lg font-medium text-sm transition-colors ${
                                selectedInterval === interval.value
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {interval.label}
                        </button>
                    ))}
                </div>
            )}
            
            <div ref={chartContainerRef} />
        </div>
    );
}

export default Chart;
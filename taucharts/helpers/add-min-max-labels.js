export default function (data, measure, formatFunction) {
    const minMax = data.reduce((extrema, d, i, arr) => {
        if (d[measure] > arr[extrema.maxIndex][measure])
            return { minIndex: extrema.minIndex, maxIndex: i };
        else if (d[measure] < arr[extrema.minIndex][measure])
            return { minIndex: i, maxIndex: extrema.maxIndex };
        else
            return { minIndex: extrema.minIndex, maxIndex: extrema.maxIndex };
    }, { minIndex: 0, maxIndex: 0 });

    const dataLabeled = data.slice();
    Object.keys(minMax).forEach(k => {
        const index = minMax[k];
        dataLabeled[index].label = formatFunction(dataLabeled[index][measure]);
    });

    return dataLabeled;
};

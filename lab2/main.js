import { quickSort } from "./quick_sort.js";
import { mergeSort } from "./merge_sort.js";
import { heapSort } from "./heap_sort.js";
import { stalinSort } from "./stalin_sort.js";

let chart;

// sorted
function Arr(size, min, max) {
    return Array.from({ length: size }, (_, i) =>
        Math.floor(min + (i / (size - 1)) * (max - min))
    );
}

// random
function randArr(size, min, max) {
    return Array.from({ length: size }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

// nearly sorted
function nearArr(size, min, max, disorder=0.1) {
    const arr = Arr(size, min, max);

    const shuffleCount = Math.floor(size * disorder);
    for (let i = 0; i < shuffleCount; i++) {
        const idx1 = Math.floor(Math.random() * size);
        const idx2 = Math.floor(Math.random() * size);
        [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
    }
    return arr;
}

// get time for sorting 1 arr
function test(arr, sort){
    const start = performance.now();
    sort(arr);
    const end = performance.now();
    return end - start;
}

// get time for each algo
function trial(sizes, min, max, arrOfType) {
    let quick_sort_times = []
    let merge_sort_times = []
    let heap_sort_times = []
    let stalin_sort_times = []
    let arr = []

    sizes.forEach(size => {
        arr = arrOfType(size, min, max);
        quick_sort_times.push(test(arr, quickSort))

        arr = arrOfType(size, min, max);
        merge_sort_times.push(test(arr, mergeSort))

        arr = arrOfType(size, min, max);
        heap_sort_times.push(test(arr, heapSort))

        arr = arrOfType(size, min, max);
        stalin_sort_times.push(test(arr, stalinSort))
    })

    return [quick_sort_times, merge_sort_times, heap_sort_times, stalin_sort_times]
}

function plot(x, q, m, h, s) {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (chart) chart.destroy()
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: x,
            datasets: [
                {
                    label: 'Quick Sort',
                    data: q,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    borderWidth: 4
                },
                {
                    label: 'Merge Sort',
                    data: m,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    borderWidth: 4
                },
                {
                    label: 'Heap Sort',
                    data: h,
                    borderColor: 'red',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    borderWidth: 4
                },
                {
                    label: 'Stalin Sort',
                    data: s,
                    borderColor: 'orange',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    borderWidth: 4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Time needed to sort an array',
                    font: {
                        size: 26
                    }
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toString();
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 20
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Array Size',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        font: {
                            size: 20
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Time (in ms)',
                        font: {
                            size: 20
                        }
                    },
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toString();
                        },
                        font: {
                            size: 20
                        }
                    }
                }
            }
        }
    });
}

let sizes = [10, 100, 500, 2500, 10000, 50000, 100000, 200000, 300000, 500000]
let min = -1000
let max = 1000

document.getElementById("r").addEventListener("click", () => {
    const [q, m, h, s] = trial(sizes, min, max, randArr)
    plot(sizes, q, m, h, s)
})

document.getElementById("s").addEventListener("click", () => {
    const [q, m, h, s] = trial(sizes, min, max, Arr)
    plot(sizes, q, m, h, s)
})

document.getElementById("n").addEventListener("click", () => {
    const [q, m, h, s] = trial(sizes, min, max, nearArr)
    plot(sizes, q, m, h, s)
})
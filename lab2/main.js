// import { quickSort } from "./quick_sort.js";
// import { mergeSort } from "./merge_sort.js";
// import { heapSort } from "./heap_sort.js";

let arr = []
let alg = 'quick'

function genArr(len, min, max) {
    return Array.from({length: len}, () => {
        return Math.random() * (max - min) + min;
    });
}

function newArr(len=20, min=-100, max=100) {
    arr = genArr(len, min, max);
    update();
}

// const butt = document.getElementById("button")
// const elem = document.getElementById("test");
//
// butt.addEventListener("click", () => {
//     let arr = genArr(10, -10, 10);
//     elem.innerText = arr.toString();
// })

function update() {
    const container = document.getElementById('bars');
    container.innerHTML = '';
    const maxVal = Math.max(...arr);

    arr.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(value / maxVal) * 100}%`;
        container.appendChild(bar);
    });
}

function setAlg(){
    alg = document.getElementById('algorithm').value;
}

function sort(){
    document.querySelectorAll('button, select').forEach(el => el.disabled = true)
    quickSort(arr, 0, arr.length - 1);
    document.querySelectorAll('button, select').forEach(el => el.disabled = false)
}

function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
        // If current element is smaller than the pivot
        if (arr[j] < pivot) {
            // Increment index of smaller element
            i++;
            // Swap elements
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    // Swap pivot to its correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1; // Return the partition index
}

function quickSort(arr, low, high) {
    if (low >= high) return;
    let pi = partition(arr, low, high);

    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
}

// let arr = genArr(15, -10000, 10000)

// quickSort(arr, 0, arr.length - 1);
// mergeSort(arr, 0, arr.length - 1);
// heapSort(arr);
//
// console.log("Sorted array: " + arr);
let arr = [];
let alg = 'quick';
let timeout = 0;
let len = 0;
let min = 0;
let max = 1000;

function genArr(len, min, max) {
    return Array.from({ length: len }, () => Math.random() * (max - min) + min);
}

function newArr() {
    len = parseInt(document.getElementById('length').value);
    // min = parseInt(document.getElementById('min').value);
    // max = parseInt(document.getElementById('max').value);
    timeout = parseInt(document.getElementById('timeout').value);

    arr = genArr(len, min, max);
    update();
}

function update() {
    const container = document.getElementById('bars');
    container.innerHTML = '';
    const maxVal = Math.max(...arr);

    arr.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(value / maxVal) * 100}%`;
        bar.style.width = `calc(100% / ${arr.length} + 5px)`; // Spread evenly
        container.appendChild(bar);
    });
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function setAlg() {
    alg = document.getElementById('algorithm').value;
}

async function sort() {
    switch (alg) {
        case 'quick': await quickSort(arr, 0, arr.length - 1); break;
        case 'merge': await mergeSort(arr, 0, arr.length - 1); break;
        case 'heap': await heapSort(arr); break;
        case 'Stalin': await stalinSort(arr); break;
    }

    update();
}

async function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;

    await sleep(timeout);
    update();

    for (let j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

async function quickSort(arr, low, high) {
    if (low >= high) return;
    let pi = await partition(arr, low, high);

    await sleep(timeout);
    update();

    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
}

async function merge(arr, left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;

    const L = new Array(n1);
    const R = new Array(n2);

    update();

    for (let i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (let j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];

    let i = 0, j = 0;
    let k = left;

    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    await sleep(timeout);
    update();

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

async function mergeSort(arr, left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    await mergeSort(arr, left, mid);
    await mergeSort(arr, mid + 1, right);
    await merge(arr, left, mid, right);

    update();
}

async function heapify(arr, n, i) {
    let largest = i;

    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n && arr[l] > arr[largest]) {
        largest = l;
    }

    if (r < n && arr[r] > arr[largest]) {
        largest = r;
    }

    if (largest !== i) {
        let temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;

        await sleep(timeout);
        update();

        await heapify(arr, n, largest);
    }
}

async function heapSort(arr) {
    let n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        let temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;

        await heapify(arr, i, 0);
    }
    update();
}

async function stalinSort(arr) {
    if (arr.length === 0) return;
    let index = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] >= arr[index]) {
            index++;
            arr[index] = arr[i];
        }
        update();
        await sleep(timeout);
    }

    arr.length = index + 1;
    update();
}

newArr();
import { quickSort } from "./quick_sort.js";
import { mergeSort } from "./merge_sort.js";
import { heapSort } from "./heap_sort.js";

let arr = [1547851324.6646, -4555.2, 0, 5, 4152, -5899, 777777777]

quickSort(arr, 0, arr.length - 1);
mergeSort(arr, 0, arr.length - 1);
heapSort(arr);

console.log("Sorted array: " + arr);
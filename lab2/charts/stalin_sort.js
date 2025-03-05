export function stalinSort(arr) {
    if (arr.length === 0) return;
    let index = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] >= arr[index]) {
            index++;
            arr[index] = arr[i];
        }
    }

    arr.length = index + 1;
}
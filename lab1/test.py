import time as t
import matplotlib.pyplot as plt
import sys

from recursion import fib as recursive
from memoization import fib as memoization
from dynamic import fib as dynamic
from matrix_exponentiation import fib as matrix
from binet import fib as binet
from iterative_space_optimized import fib as iterative

sys.setrecursionlimit(100000)

def trial(f, n, runs=10):
    total_time = 0
    for _ in range(runs):
        start = t.perf_counter()
        f(n)
        end = t.perf_counter()
        total_time += end - start
    return total_time / runs

def test(f, nums, label):
    times = [trial(f, n) for n in nums]
    plt.plot(nums, times)
    plt.title(label)
    plt.xlabel("n-th Fibonacci number")
    plt.ylabel("time (s)")
    plt.show()

def test_all(fs, nums):
    colors = ['r', 'g', 'b', 'y', 'm']
    labels = ['dynamic', 'matrix', 'binet', 'memoization', 'iterative']

    for f, c, l in zip(fs, colors, labels):
        times = [trial(f, n) for n in nums]
        plt.plot(nums, times, color=c, label=l)

    plt.xlabel("n-th Fibonacci number")
    plt.ylabel("time (s)")
    plt.ylim(0, 0.007)
    plt.legend(loc='upper left')
    plt.show()

interval1 = [5, 7, 10, 12, 15, 17, 20, 22, 25, 27, 30, 32, 35, 37, 40, 42, 45]
interval2 = [501, 631, 794, 1000, 1259, 1585, 1995, 2512, 3162, 3981, 5012, 6310, 7943, 10000, 12589, 15849]

# test(recursive, interval1, 'Recursion')
# test(dynamic, interval2, 'Dynamic')
# test(matrix, interval2, 'Matrix exponentiation')
# test(binet, interval2, 'Binet\'s formula')
# test(memoization, interval2, 'Memoization')
# test(iterative, interval2, 'Iterative space-optimized method')

test_all([dynamic, matrix, binet, memoization, iterative], interval2)
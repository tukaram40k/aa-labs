import time as t
import matplotlib.pyplot as plt

from recursion import fib as recursive
from memoization import fib as memoization
from dynamic import fib as dynamic

def trial(f, n):
    start = t.time()
    f(n)
    end = t.time()
    return end - start

def test(f, nums):
    times = [trial(f, n) for n in nums]
    plt.plot(nums, times)
    plt.xlabel("n-th Fibonacci number")
    plt.ylabel("time (s)")
    plt.show()

interval1 = [5, 7, 10, 12, 15, 17, 20, 22, 25, 27, 30, 32, 35, 37, 40, 42, 45]
interval2 = [501, 631, 794, 1000, 1259, 1585, 1995, 2512, 3162, 3981, 5012, 6310, 7943, 10000, 12589, 15849]

test(dynamic, interval2)
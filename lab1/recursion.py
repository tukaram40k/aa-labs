import time as t
import matplotlib.pyplot as plt
import prettytable as pt

def fib(n):
    if n <= 0:
        return 1
    else:
        return fib(n-1) + fib(n-2)

def trial(n):
    start = t.time()
    fib(n)
    end = t.time()
    return end - start

nums = [5, 7, 10, 12, 15, 17, 20, 22, 25, 27, 30, 32, 35, 37, 40, 42, 45]
times = [trial(n) for n in nums[:14]]

plt.plot(nums[:14], times)
plt.plot(nums[:14], times, 'bo')
plt.xlabel("n-th Fibonacci number")
plt.ylabel("time (s)")
plt.title("Recursive Fibonacci")
plt.show()
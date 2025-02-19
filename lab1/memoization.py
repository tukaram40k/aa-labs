import time as t
import matplotlib.pyplot as plt

def fib(n, memo={0: 0, 1: 1}):
    if n in memo:
        return memo[n]
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]

def trial(n):
    start = t.time()
    fib(n)
    end = t.time()
    return end - start

nums = [i for i in range(1, 100000)]
times = [trial(n) for n in nums]
print(times)

plt.plot(nums, times)
plt.xlabel("n-th Fibonacci number")
plt.ylabel("time (s)")
plt.title("Memoization Fibonacci")
plt.show()
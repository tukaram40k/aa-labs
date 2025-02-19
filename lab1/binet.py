import math

def fib(n):
    phi = (1 + math.sqrt(5)) / 2
    return round(math.pow(phi, n) / math.sqrt(5))
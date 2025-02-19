from decimal import Decimal, getcontext

def fib(n):
    getcontext().prec = 5000
    phi = (1 + 5 ** .5) / 2
    psi = (1 - 5 ** .5) / 2
    return (Decimal(phi) ** Decimal(n) - Decimal(psi) ** Decimal(n)) / Decimal(5 ** .5)

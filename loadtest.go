package main

import (
	"fmt"
	"time"
)

func fibonacci(n int) int {
	if n <= 1 {
		return n
	}
	return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
	num := 80000
	start := time.Now()
	for i := 0; i < num; i++ {
		_ = fibonacci(i)
	}
	elapsed := time.Since(start).Seconds()
	fmt.Printf("Time taken to calculate first %d Fibonacci numbers: %.2f seconds\n", num, elapsed)
}

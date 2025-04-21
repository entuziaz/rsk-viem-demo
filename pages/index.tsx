'use client'

import { useEffect, useState } from 'react'
import { borrow } from '../utils/viem'

import { fetchBorrowRatePerBlock, 
    fetchTotalSupply,
    fetchTotalBorrows,
    fetchSymbol,
 } from '../utils/viem'

export default function Page() {
    const [borrowRate, setBorrowRate] = useState<string>('...')
    const [totalSupply, setTotalSupply] = useState<string>('...')
    const [totalBorrows, setTotalBorrows] = useState<string>('...')
    const [symbol, setSymbol] = useState<string>('...')
  
    useEffect(() => {
      async function load() {
        try {
          const rate = await fetchBorrowRatePerBlock()
          setBorrowRate(rate.toString())

          const supply = await fetchTotalSupply()
          setTotalSupply(supply.toString())

          const totalBorrows = await fetchTotalBorrows()
          setTotalBorrows(totalBorrows.toString())

          const symbol = await fetchSymbol()
          setSymbol(symbol.toString())

        } catch (error) {
          console.error('Failed to fetch borrow rate:', error)
          setBorrowRate('Error')
        }
      }
  
      load()
    }, [])
  
    return (
      <main className="p-4">
        <h1 className="text-xl font-bold">RSK Contract Interaction</h1>
        <p>Borrow Rate per Block: {borrowRate}</p>
        <p>Total Supply: {totalSupply}</p>
        <p>Total Borrows: {totalBorrows}</p>
        <p>Symbol: {symbol}</p>

        <button
          className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          onClick={async () => {
            try {
              const txHash = await borrow(BigInt("100000000000000000"))
              alert(`Borrow transaction sent! Tx Hash: \n${txHash}`)
            } catch (err) {
              console.error('Borrow failed', err)
              alert('Borrow failed. See console for details.')
            }
          }}
        >
          Borrow Token
        </button>
      </main>
    )
  }

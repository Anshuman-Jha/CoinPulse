"use client"

import * as React from "react"
import { SearchIcon, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { searchCoins } from "@/lib/coingecko.actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function Search() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchCoin[]>([])
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 1) {
                setLoading(true)
                try {
                    const coins = await searchCoins(query)
                    setResults(coins)
                } catch (error) {
                    console.error(error)
                    setResults([])
                } finally {
                    setLoading(false)
                }
            } else {
                setResults([])
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [query])

    const handleSelect = (coinId: string) => {
        setOpen(false)
        router.push(`/coins/${coinId}`)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg border border-input bg-background/50 px-4 py-2 text-sm text-muted-foreground w-full md:w-[200px] lg:w-[300px] hover:bg-accent hover:text-accent-foreground transition-colors">
                    <SearchIcon className="h-4 w-4" />
                    <span>Search coins...</span>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] top-[20%] translate-y-[-20%] gap-0 p-0 overflow-hidden">
                <DialogHeader className="px-4 py-3 border-b">
                    <DialogTitle className="sr-only">Search Coins</DialogTitle>
                    <div className="flex items-center gap-2">
                        <SearchIcon className="h-4 w-4 text-muted-foreground" />
                        <input
                            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Type to search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    </div>
                </DialogHeader>
                <div className="max-h-[300px] overflow-y-auto p-2">
                    {results.length === 0 && query.length > 1 && !loading ? (
                        <p className="text-sm text-muted-foreground text-center py-6">No results found.</p>
                    ) : (
                        <div className="space-y-1">
                            {results.map((coin) => (
                                <button
                                    key={coin.id}
                                    onClick={() => handleSelect(coin.id)}
                                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors group"
                                >
                                    <div className="relative h-6 w-6 overflow-hidden rounded-full">
                                        {coin.thumb ? (
                                            <Image
                                                src={coin.thumb}
                                                alt={coin.name}
                                                fill
                                                className="object-cover"
                                                sizes="24px"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-secondary" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{coin.name}</span>
                                        <span className="text-xs text-muted-foreground group-hover:text-accent-foreground/70">
                                            {coin.symbol}
                                        </span>
                                    </div>
                                    {coin.market_cap_rank && (
                                        <span className="ml-auto text-xs text-muted-foreground">#{coin.market_cap_rank}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                    {query.length <= 1 && (
                        <p className="text-sm text-muted-foreground text-center py-6">Type at least 2 characters to search.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

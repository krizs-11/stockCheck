import { useEffect, useState } from "react";


export function useDebounce({ value, delay }: { value: string, delay: number }) {
    const [debounceValue, setDebounceValue] = useState('')

    useEffect(() => {
        const searchDebounce = setTimeout(() => {
            setDebounceValue(value)
        }, delay)
        return () => clearTimeout(searchDebounce)
    }, [value, delay])

    return debounceValue
}
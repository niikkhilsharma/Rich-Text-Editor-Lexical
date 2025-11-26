import { useCallback, useRef, useEffect } from 'react'
import { debounce } from 'lodash-es'

export function useDebounce(fn, ms, maxWait) {
	const funcRef = useRef(fn)
	const debouncedRef = useRef(null)

	useEffect(() => {
		funcRef.current = fn
	}, [fn])

	useEffect(() => {
		debouncedRef.current = debounce(
			(...args) => {
				funcRef.current?.(...args)
			},
			ms,
			{ maxWait }
		)
	}, [ms, maxWait])

	return useCallback((...args) => {
		debouncedRef.current?.(...args)
	}, [])
}

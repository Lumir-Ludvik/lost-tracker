import {useCallback} from "react";
import {TableDataType} from "../common/types";

export const useLocalStorage = () => {
    const saveToStorage = useCallback((key: string, value: TableDataType) => {
        const data = JSON.stringify(value);

        window.localStorage.setItem(key, data);
    }, [])

    const getFromStorage = useCallback((key: string) => window.localStorage.getItem(key), [])

    const removeFromStorage = useCallback((key: string) => window.localStorage.removeItem(key), []);

    const clearStorage = useCallback(() => window.localStorage.clear(), []);


    return {
        saveToStorage,
        getFromStorage,
        removeFromStorage,
        clearStorage
    }
}

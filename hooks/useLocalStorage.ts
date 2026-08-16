import { useEffect, useState } from "react";

/**
 * localStorage ile senkron çalışan bir state hook'u.
 * Pages Router'da sayfalar önce server'da render edildiği için
 * localStorage build sırasında mevcut değildir; bu yüzden ilk render'da
 * hep `initialValue` döner ve gerçek değer client'ta mount olduktan sonra okunur.
 */
export default function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      }
    } catch (error) {
      console.warn(`useLocalStorage: "${key}" okunamadı`, error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setStoredValue = (next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = next instanceof Function ? next(prev) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch (error) {
        console.warn(`useLocalStorage: "${key}" yazılamadı`, error);
      }
      return resolved;
    });
  };

  return [value, setStoredValue] as const;
}

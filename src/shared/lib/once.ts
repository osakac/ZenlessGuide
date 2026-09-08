/**
 * Мемоизация функции без аргументов: тело выполняется один раз за жизнь процесса.
 * Используется для разбора и валидации статических данных.
 */
export function once<T>(fn: () => T): () => T {
  let cached: { value: T } | undefined;

  return () => {
    cached ??= { value: fn() };
    return cached.value;
  };
}

// Временная заглушка: главная страница собирается на этапе вёрстки страниц
// и переедет в src/views/home.
export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">ZenlessGuide</h1>
      <p className="mt-3 text-muted-foreground">
        Каркас проекта готов. Страницы появятся на следующем этапе.
      </p>
    </main>
  );
}

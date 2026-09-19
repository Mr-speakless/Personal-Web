export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full px-[30px] pb-[30px] pt-9 md:px-0">
      <div className="mx-auto w-full max-w-[1000px] text-center text-xs [font-family:var(--font-sans-en)]">
        © ShuoyueWu {year}
      </div>
    </footer>
  )
}

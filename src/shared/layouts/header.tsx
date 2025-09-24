export default function Header() {
  return (
    <header
      className='sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60'
      role='banner'
    >
      <div className='mx-auto flex h-14 w-full max-w-[43rem] items-center px-4'>
        <h1 className='text-base font-semibold'>BookLink</h1>
        <div className='ml-auto flex items-center gap-3'>
          <button className='text-sm'>알림</button>
          <button className='text-sm'>설정</button>
        </div>
      </div>
    </header>
  );
}

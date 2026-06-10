const Fallback = () => {
  return (
    <div className='h-screen flex items-center justify-center flex-col'>
      <p className="text-[50px] google-sans">Aaaah! Something went wrong</p>
      <p className="text-gray-500">Brace yourself till we get the error fixed.</p>
      <p className="text-gray-500">You may also refresh the page or try again later.</p>
    </div>
  )
}

export default Fallback

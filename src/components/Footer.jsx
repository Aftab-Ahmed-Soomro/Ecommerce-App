import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-slate-200 fixed bottom-0 w-full'>
      <div className='container mx-auto p-4'>
        <p className='text-center font-bold' title="Soomro Group">
          &copy; {new Date().getFullYear()} Soomro Group. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer

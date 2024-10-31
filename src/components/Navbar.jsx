import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";


const Navbar = () => {
  return (
    <header className='bg-slate-900 text-white py-3 px-12 text-center w-full flex items-center justify-between'>
        <div className='text-2xl'>&lt;Pass<span className='text-green-500 font-bold'>Wiz</span> /&gt;</div>
        <nav>
            <a href="https://github.com/rameez-sidd/password-manager" target="_blank" className='bg-green-500 flex items-center gap-2 px-2 py-1 rounded-full gitHub-btn'>
              <span className='grid place-items-center'><FontAwesomeIcon style={{fontSize:'20px'}} icon={faGithub} /></span>
              <span className='font-semibold'>GitHub</span>
            </a>
        </nav>
        
    </header>
  )
}

export default Navbar

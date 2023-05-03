import Head from 'next/head';
import NavBar from './NavBar';
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className='w-screen h-screen flex flex-col bg-dokuso-white'>
      <Head>
        <title>Dokuso</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="" />
      </Head>
      <NavBar/>
      <div className='flex flex-col flex-auto p-0 m-0'>
        <main>{children}</main>
      </div>
      {/* Footer */}
    </div>
  )
}

export default Layout;
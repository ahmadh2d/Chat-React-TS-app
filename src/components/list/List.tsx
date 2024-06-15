import React from 'react'
import UserInfo from './UserInfo'
import ChatList from './ChatList'

const List = () => {
  return (
    <section className='flex-[1] py-4'>
      <div className='flex flex-col gap-10'>
        <UserInfo />
        <ChatList />
      </div>
    </section>
  )
}

export default List
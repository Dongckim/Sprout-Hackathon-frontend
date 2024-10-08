import { useEffect, useState } from 'react';
import ChatlogCard from '../components/chatlog/ChatlogCard';
import { useQuery } from '@tanstack/react-query';
import { getChatRoomList } from '../api/chats';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';
import { getKoreanDate } from '../utils/getKoreanDate';

const ChatLog = () => {
  const [date, setDate] = useState(getKoreanDate());
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className='-mb-20 flex h-dvh flex-col pb-20'>
      <h1 className='mb-2 whitespace-pre-line px-5 pt-5 text-3xl font-bold'>
        챗봇 대화 내역
      </h1>
      <h5 className='mb-3 px-5 text-sm text-blue'>
        챗봇과의 대화 내역을 다시 볼 수 있어요.
      </h5>
      <hr />
      {/* <p className='px-5 pb-0 pt-3 text-lg font-bold'>2024.07.18.</p> */}
      <input
        type='date'
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className='mx-5 my-4 text-lg font-bold hover:cursor-pointer focus:outline-none'
      />
      <ListContainer date={date} />
    </div>
  );
};

const ListContainer = ({ date }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['chatroomList', date],
    queryFn: () => getChatRoomList(date),
  });

  console.log(date);

  if (isLoading)
    return (
      <ul className='flex grow p-5 pt-0'>
        <Spinner className='m-auto' />
      </ul>
    );
  if (isError)
    return <ul className='grow p-5 pt-0'>대화 내역 불러오기에 실패했어요</ul>;

  if (data.length === 0)
    return <p className='mx-5'>해당 날짜에 나눈 대화가 존재하지 않아요</p>;

  return (
    <ul className='flex grow flex-col gap-4 overflow-y-auto p-5 pt-0'>
      {data.map((item) => (
        <ChatlogCard key={item.chatRoomId} data={item} />
      ))}
    </ul>
  );
};

export default ChatLog;

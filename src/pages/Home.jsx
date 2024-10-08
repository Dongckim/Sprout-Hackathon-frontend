import { useQuery } from '@tanstack/react-query';
import InfoCard from '../components/Home/InfoCard';
import TagContainer from '../components/Home/TagContainer';
import useRegionStore from '../store/region';
import { getRecruitmentList } from '../api/recruitments';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';
import spinner from '../assets/spinner.svg';
import Spinner from '../components/common/Spinner';

const Home = () => {
  const { region } = useRegionStore();
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const { data, isPending, isError } = useQuery({
    queryKey: ['recruitmentList', region],
    queryFn: () => getRecruitmentList(region, 0, 100),
  });
  // TODO: 필요 시 무한스크롤 구현

  return (
    <div className='-mb-20 h-dvh overflow-y-auto pb-20'>
      <h1 className='mb-2 whitespace-pre-line px-5 pt-5 text-3xl font-bold'>
        반가워요,
        <br />
        서비스에 오신 걸 환영해요!
      </h1>
      <h5 className='mb-3 px-5 text-sm text-blue'>
        전국의 요양보호사 관련 소식을 한 번에 확인해보세요.
      </h5>
      <hr />
      <h3 className='px-5 py-4 text-2xl font-bold'>내 근처 찾아보기</h3>
      <TagContainer />
      <ListContainer isPending={isPending} isError={isError} data={data} />
    </div>
  );
};

const ListContainer = ({ isPending, isError, data }) => {
  if (isPending) return <Spinner className='mx-auto mt-28' />;
  if (isError) return <p className='p-5'>공고 목록을 불러오는 데 실패했어요</p>;

  if (data.content.length === 0)
    return <p className='p-5'>해당 지역의 공고가 없어요</p>;

  return (
    <ul className='flex flex-col gap-3 p-5'>
      {data.content.map((data, index) => (
        <InfoCard key={index} data={data} />
      ))}
    </ul>
  );
};

export default Home;

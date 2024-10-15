import { FC } from 'react';
import './titleHeader.scss';

interface TitleHeaderProps {
    title: string;
}

const TitleHeader:FC<TitleHeaderProps> = ({title}) => {
  return (
    <div className='TitleHeader'>
        <h1>{title}</h1>
    </div>
  )
}

export default TitleHeader
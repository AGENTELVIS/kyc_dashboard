import React from 'react';
import CategoriesCard from './CategoriesCard';
import SolicitedCard from './SolicitedCard';

const DashboardRighSection = () => {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <CategoriesCard />
      <SolicitedCard />
    </div>
  );
};

export default DashboardRighSection;

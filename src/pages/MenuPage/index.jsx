import React from 'react';
import MenuList from '../../components/MenuList';

const MenuPageContent = () => {
  return (
    <div className="container">
      <h1 className="page-title">Our Menu</h1>
      <MenuList />
    </div>
  );
};

const MenuPage = React.memo(MenuPageContent);

export default MenuPage;
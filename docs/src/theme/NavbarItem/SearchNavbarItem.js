import React from 'react';
import SearchBar from '@theme/SearchBar';
import NavbarSearch from '@theme/Navbar/Search';
export default function SearchNavbarItem({mobile}) {
  if (mobile) {
    return null;
  }

  return (
    <NavbarSearch>
      <SearchBar />
    </NavbarSearch>
  );
}

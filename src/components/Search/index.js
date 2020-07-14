import React, { useState, useCallback, useEffect } from 'react';

import api from '../../service/api';

function Search() {
  const [searchData, setSearchData] = useState();
  console.log(searchData);

  const handleChange = useCallback(async event => {
    // setSearchData(event.target.value);
  }, []);

  const loadData = useCallback(async () => {
    const { username, cpf, phone } = await api.get('auth/list');
    setSearchData({ username, cpf, phone });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Search"
        value={searchData}
        onChange={handleChange}
      />
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </div>
  );
}

export default Search;

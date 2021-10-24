import React from 'react';

const Dropdown = (props) => {
  const languagesOption = props.languagesOption.map((language) => {
    return <option value={language._id}>{language.name}</option>;
  });

  return (
    <select class='ui dropdown'>
      <option value=''>Select language</option>
      {languagesOption}
    </select>
  );
};

export default Dropdown;

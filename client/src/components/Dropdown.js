import React, { useState } from 'react';

const Dropdown = (props) => {
  // hooks useState
  // const [selectedNativeLangs, setSelectedNativeLangs] = useState([]);
  // ここでstateを作ってしまうのはよくないわ。親でstateを作っておいて、それを渡す方法が一番いいや。多分。
  // とりあえず、まずは一個でいいや。まずは。

  const languagesOption = props.languagesOption.map((language) => {
    return (
      <option key={language._id} value={language._id}>
        {language.name}
      </option>
    );
  });

  return (
    <select
      onChange={(event) => {
        props.setLang(event.target.value);
      }}
      className='ui dropdown'
    >
      <option value=''>{props.label}</option>
      {languagesOption}
    </select>
  );
};

export default Dropdown;

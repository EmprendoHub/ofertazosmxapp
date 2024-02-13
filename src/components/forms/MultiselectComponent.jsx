import React from 'react';
import Select from 'react-select';

const MultiselectComponent = ({ options, handleAddSizeField, values }) => {
  return (
    <Select
      value={values}
      options={options}
      className="block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
      name="sizes"
      onChange={handleAddSizeField}
    />
  );
};

export default MultiselectComponent;

import { Select } from "antd";
import { getServiceProviderSkillTags } from "config/queries/serviceProvider";
import { useEffect, useState } from "react";
import { useQuery } from "react-apollo";

const { Option } = Select;

const TagsDropDown = ({ onTagChange, tags }) => {
  // const [newValue, setNewValue] = useState("");
  const [options, setOptions] = useState([]);

  const { data, loading } = useQuery(getServiceProviderSkillTags);

  const children = [];

  useEffect(() => {
    if (data) {
      data.getServiceProviderSkillTags.map((data, i) => children.push(<Option key={data}>{data}</Option>))
    };
    setOptions(children)

    //eslint-disable-next-line
  }, [data]);

  // const handleAddItem = () => {
  //   setOptions([...options, newValue]);
  //   setNewValue("");
  // };


  return (
    <Select mode="tags" loading={loading} style={{ width: '100%' }} placeholder="Tags Mode" value={tags} onChange={(value) => onTagChange(value)}>
      {options}
    </Select>
  );
};

export default TagsDropDown;

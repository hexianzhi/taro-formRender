/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/sort-comp */
import { Button, View } from "@tarojs/components";
import { set } from "lodash";
import cloneDeep from "lodash.clonedeep";
import React, { useRef, useState } from "react";
import FormRender from "../../compoments/formRender";
import { getFormData } from "./formData.tsx";
import "./index.scss";

const Index = (props) => {
  const formRef = useRef<any>();
  const [formValue, setformValue] = useState({});

  // 改变某个数据源数据
  const changeSingleFormData = (key, newData, name, childName) => {
    const _formSchema = cloneDeep(formSchema);
    const item = _formSchema.find((i) => i.key === key);
    if (!item) return;
    set(item, `${name}.${childName}`, newData);
    setformSchema(_formSchema);
  };

  const [formSchema, setformSchema] = useState(() =>
    getFormData(changeSingleFormData)
  );

  const onChange = (newValue) => {
    console.log('newValue: ', newValue);
    setformValue(newValue);
  };
  const onSubmit = () => {
    const isValid = formRef.current.validate();
    console.log("isValid: ", isValid);
  };

  return (
    <View className="index">
      <FormRender
        ref={formRef}
        formValue={formValue}
        formSchema={formSchema}
        onChange={onChange}
      ></FormRender>
      <Button onClick={onSubmit}>提交</Button>
    </View>
  );
};

export default Index;
 
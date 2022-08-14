import React, {useState} from 'react';
import {Box, Newline, render, Text} from 'ink';
import SelectInput from 'ink-select-input';
import {UncontrolledTextInput} from 'ink-text-input';
import dayjs from "dayjs";

interface CodeUpItem {
  label: string;
  value: string;
}

interface CodeUp extends CodeUpItem {
  branch: CodeUpItem[];
}

const codeUp: CodeUp[] = [
  {
    label: 'vue3-vite',
    value: 'git',
    branch: [
      {label: '基础模版(ts)', value: 'master'},
      {label: '基础模版(js)', value: 'master-js'},
      {label: 'ant-design-js', value: 'master-js-admin'},
      {label: 'element-plus-ts', value: 'element-plus-ts'},
    ]
  },
  {
    label: 'vue3-cli',
    value: 'git:',
    branch: [
      {label: 'js', value: 'master'},
      {label: 'ant-design-js', value: 'pc'},
      {label: 'vant-js', value: 'mobile'},
      {label: 'element-plus-js', value: 'main/adminTemplate'},
    ]
  }
]

const Counter = () => {
  const [formData, setFormData]  = useState<{label: string; value:Partial<CodeUpItem>}[]>([
    {label: '请选择框架', value: {}},
    {label: '请选择模版', value: {}},
    {label: '请输入名称', value: {}},
  ])
  const [step, setStep] = useState(0)
  const [selector, setSelector] = useState<CodeUpItem[]>(codeUp.map(({branch, ...v}) => v))
  const handleSelect = (item: CodeUpItem) => {
    const branch = codeUp.find(v => v.value === item.value)?.branch
    setStep(step + 1)
    setFormData(formData.slice(0, step).concat([{...formData[step], value: item}]).concat(formData.slice(step + 1)))
    setSelector(branch || [])
  }
  return <Box flexDirection="column">
    <Text>
      {formData.slice(0, step + 1).map((v, i) => <Text key={v.label} color={'green'}><Text>{formData[i].label}: {formData[i].value.label}</Text>{formData[i].value.label && <Newline />}</Text>)}
    </Text>
    {
      selector.length !== 0 ?
        <SelectInput items={selector} onSelect={handleSelect} /> :
        <UncontrolledTextInput placeholder={'默认为当前时间'} onSubmit={text => {
          const value = text || dayjs().format('YYYY-MM-DD-HH-mm-ss')
          setFormData(formData.slice(0, step).concat([{...formData[step], value: {label:value,value}}]).concat(formData.slice(step + 1)))}
        }/>
    }
  </Box>
};

render(<Counter />);
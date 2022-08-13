import React, {useState} from 'react';
import {Box, render} from 'ink';
import SelectInput from 'ink-select-input';

interface CodeUpItem {
  label: string;
  value: string;
}

interface CodeUp extends CodeUpItem {
  branch: CodeUpItem[];
}

const Counter = () => {
  const codeUp: CodeUp[] = [
    {
      label: 'vue3-vite',
      value: 'git',
      branch: [{label: 'ts', value: 'master'}, {label: 'js', value: 'master-js'}, {label: 'ant-design-js', value: 'master-js-admin'}, {label: 'element-plus-ts', value: 'element-plus-ts'}]
    },
    {
      label: 'vue3-cli',
      value: 'git:',
      branch: [{label: 'js', value: 'master'}, {label: 'ant-design-js', value: 'pc'}, {label: 'vant-js', value: 'mobile'}, {label: 'element-plus-js', value: 'main/adminTemplate'}]
    }
  ]

  const [selector, setSelector] = useState<CodeUpItem[]>(codeUp.map(({branch, ...v}) => v))
  const handleSelect = (item: CodeUpItem) => {
    setSelector(codeUp.find(v => v.value === item.value)!.branch)
  }
  return <Box>
    <SelectInput items={selector} onSelect={handleSelect} />
  </Box>
};

render(<Counter />);
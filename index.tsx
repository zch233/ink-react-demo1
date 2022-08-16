import React, {useCallback, useEffect, useState} from 'react';
import {Box, Newline, render, Text, useApp} from 'ink';
import SelectInput from 'ink-select-input';
import {UncontrolledTextInput} from 'ink-text-input';
import dayjs from "dayjs";
import Spinner from 'ink-spinner';
import {spawnSync} from 'child_process';
import rimraf from "rimraf";

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
    value: 'git@codeup.aliyun.com:gupo/gupo-dev/fe/vue3-vite-template.git',
    branch: [
      {label: '基础模版(ts)', value: 'master'},
      {label: '基础模版(js)', value: 'master-js'},
      {label: 'ant-design后台模板(js)', value: 'master-js-admin'},
      {label: 'element-plus后台模板(ts)', value: 'element-plus-ts'},
    ]
  },
  {
    label: 'vue3-cli',
    value: 'git@codeup.aliyun.com:gupo/gupo-dev/fe/vue3-cli5-template.git',
    branch: [
      {label: '基础模版(js)', value: 'master'},
      {label: 'ant-design后台模板(js)', value: 'pc'},
      {label: 'vant移动端模板(js)', value: 'mobile'},
      {label: 'element-plus后台模板(js)', value: 'main/adminTemplate'},
    ]
  },
  {
    label: 'vue3-vite-screen',
    value: 'git@codeup.aliyun.com:gupo/gupo-dev/fe/vue3-vite-ts-screen-templte.git',
    branch: [
      {label: '基础模版(ts)', value: 'master'},
    ]
  },
  {
    label: 'vue3-cli-screen',
    value: 'git@codeup.aliyun.com:gupo/gupo-dev/fe/vue3-screen-template.git',
    branch: [
      {label: '用户中心版(js)', value: 'master'},
      {label: '基础模版(js)', value: 'feature/v1'},
    ]
  },
  {
    label: 'vue3-vite-taro',
    value: 'git@codeup.aliyun.com:gupo/gupo-dev/fe/vue3-taroMP-template.git',
    branch: [
      {label: 'nut(ts)', value: 'master'},
    ]
  },
  {
    label: 'vue2-cli-pc',
    value: 'git@codeup.aliyun.com:gupo/gupo-dev/fe/vue2_eslint_prettier.git',
    branch: [
      {label: 'element(js)', value: 'master'},
      {label: '大屏(js)', value: 'screen-template'},
    ]
  },
  {
    label: 'vue2-cli-phone',
    value: 'git@codeup.aliyun.com:gupo/gupo-dev/fe/vue2_eslint_prettier_phone.git',
    branch: [
      {label: 'vant(js)', value: 'master'},
    ]
  },
]

const Counter = () => {
  const [formData, setFormData]  = useState<{label: string; value:Partial<CodeUpItem>}[]>([
    {label: '请选择框架', value: {}},
    {label: '请选择模版', value: {}},
    {label: '请输入名称', value: {}},
  ])
  const [loading, setLoading] = useState(false)
  const [finish, setFinish] = useState(false)
  const [step, setStep] = useState(0)
  const [selector, setSelector] = useState<CodeUpItem[]>(codeUp.map(({branch, ...v}) => v))
  const handleSelect = (item: CodeUpItem) => {
    const branch = codeUp.find(v => v.value === item.value)?.branch
    setStep(step + 1)
    setFormData(formData.slice(0, step).concat([{...formData[step], value: item}]).concat(formData.slice(step + 1)))
    setSelector(branch || [])
  }
  const cloneProjectToLocal = async (value: string) => {
    spawnSync('git', ['clone', '-b', formData[1].value.value!, formData[0].value.value!, value])
    rimraf.sync(`./${value}/.git`)
    spawnSync('git', ['init'], { cwd: `./${value}` })
    spawnSync('git', ['add', '.'], { cwd: `./${value}` })
    spawnSync('git', ['commit', '-m', '"feat: init"', '-n'], { cwd: `./${value}` })
    setFinish(true)
    process.exit()
  }
  return <Box flexDirection="column">
    <Text>
      {formData.slice(0, step + 1).map((v, i) => <Text key={v.label} color={'green'}><Text>{formData[i].label}: {formData[i].value.label}</Text>{formData[i].value.label && <Newline />}</Text>)}
    </Text>
    {
      finish ? <Text>
          <Text>Done. Now run:</Text>
          <Newline />
          <Newline />
          <Text>  cd {formData[2].value.value}</Text>
          <Newline />
          <Text>  yarn</Text>
          <Newline />
          <Text>  yarn serve</Text>
        </Text> :
        loading ? <Text><Text color="green"><Spinner type="dots" /></Text>{' Loading'}</Text> :
          selector.length !== 0 ?
            <SelectInput items={selector} onSelect={handleSelect} /> :
            <UncontrolledTextInput placeholder={'默认为当前时间'} onSubmit={text => {
              setLoading(true);
              const value = text || dayjs().format('YYYY-MM-DD-HH-mm-ss');
              setFormData(formData.slice(0, step).concat([{...formData[step], value: {label:value,value}}]).concat(formData.slice(step + 1)));
              cloneProjectToLocal(value);
            }}/>
    }
  </Box>
};

render(<Counter />);
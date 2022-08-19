import React, {useState} from 'react';
import {Box, Newline, render, Text} from 'ink';
import SelectInput from 'ink-select-input';
import {UncontrolledTextInput} from 'ink-text-input';
import dayjs from "dayjs";
import Spinner from 'ink-spinner';
import {spawnSync, execSync} from 'child_process';
import rimraf from "rimraf";
import {UncontrolledConfirmInput} from 'ink-confirm-input2';

interface CodeUpItem {
  label: string;
  value: string | boolean;
}

interface FormItem {
  label: string;
  value: Partial<CodeUpItem>;
  type: 'select' | 'input' | 'inputConfirm';
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
  const [formData, setFormData]  = useState<FormItem[]>([
    {label: '请选择框架', value: {}, type: 'select'},
    {label: '请选择模版', value: {}, type: 'select'},
    {label: '请输入名称', value: {}, type: 'input'},
    {label: '要帮你自动启动项目马', value: {}, type: 'inputConfirm'},
  ])
  const updateFormData = (item: CodeUpItem) => {
    setFormData(formData.slice(0, step).concat([{...formData[step], value: item}]).concat(formData.slice(step + 1)))
  }
  const [loading, setLoading] = useState(false)
  const [finish, setFinish] = useState(false)
  const [step, setStep] = useState(0)
  const [selector, setSelector] = useState<CodeUpItem[]>(codeUp.map(({branch, ...v}) => v))
  const handleSelect = (item: CodeUpItem) => {
    const branch = codeUp.find(v => v.value === item.value)?.branch
    setStep(step + 1)
    updateFormData(item)
    setSelector(branch || [])
  }
  const cloneProjectToLocal = async (autoStart: boolean) => {
    spawnSync('git', ['clone', '-b', formData[1].value.value as string, formData[0].value.value as string, formData[2].value.value as string])
    const cwd = `./${formData[2].value.value!}`
    rimraf.sync(`${cwd}/.git`)
    execSync('node -v > .nvmrc', { cwd })
    spawnSync('git', ['init'], { cwd })
    spawnSync('git', ['add', '.'], { cwd })
    spawnSync('git', ['commit', '-m', '"feat: init"', '-n'], { cwd })
    if (autoStart) {
      execSync('start .', { cwd })
      execSync('code .', { cwd })
      execSync('yarn', { cwd })
      execSync('yarn serve', { cwd })
      return
    }
    setFinish(true)
    process.exit()
  }
  return <Box flexDirection="column">
    <Text>Do you like unicorns? (Y/n)</Text>
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
          ({
            select: <SelectInput items={selector} onSelect={handleSelect} />,
            input: <UncontrolledTextInput placeholder={'默认为当前时间'} onSubmit={text => {
              setStep(step + 1)
              const value = text || dayjs().format('YYYY-MM-DD-HH-mm-ss')
              updateFormData({label: value, value})
            }}/>,
            inputConfirm: <UncontrolledConfirmInput
              placeholder={'不需要(n)'}
              onSubmit={(value:boolean) => {
                updateFormData({label:value ? '需要': '不需要', value})
                setLoading(true);
                setTimeout(() => cloneProjectToLocal(value), 1000)
              }}
            />
          })[formData[step].type]
    }
  </Box>
};

render(<Counter />);
interface IOptionsValidateString {
  min?: number
  max?: number
  required?: boolean
  regex?: RegExp
  message?: string
  validator?: (_rule: any, value: any, callback: any) => void
}

interface IOptionsValidateNumber {
  min?: number
  max?: number
  required?: boolean
  validator?: (_rule: any, value: any, callback: any) => void
}

export const useValidateEmail = (key: string): any => {
  return {
    [key]: [
      {
        type: 'email',
        message: '正しいメール形式を入力してください。',
        trigger: ['blur', 'change'],
      },
      {
        required: true,
        message: 'メールアドレスを入力してください',
        trigger: ['blur', 'change'],
      },
    ],
  }
}

export const useValidateArray = (key: string, label: string) => {
  return {
    [key]: [
      {
        type: 'array',
        required: true,
        message: `${label}を選択してください`,
        trigger: ['blur', 'change'],
      },
    ],
  }
}

export const useValidateString = (
  key: string,
  label: string,
  option?: IOptionsValidateString
): any => {
  const conditions: any[] = [
    {
      required: option?.required !== undefined ? option.required : false,
      message: `${label}を入力してください`,
      trigger: ['blur', 'change'],
    },
    {
      ...(option?.min !== undefined && {
        min: option?.min || 0,
      }),
      max: option?.max || 1000,
      message:
        option?.min !== undefined
          ? `長さは${option?.min || 1}から${
              option?.max || 1000
            }まででなければなりません`
          : `最大${option?.max || 1000}文字まで入力してください`,
      trigger: ['blur', 'change'],
    },
  ]

  if (option && option.validator)
    conditions.push({
      validator: option.validator,
      trigger: ['blur', 'change'],
    })

  if (option && option.regex)
    conditions.push({
      validator: (_rule: any, value: string, callback: any): any => {
        if (!value) return true

        if (option?.regex === undefined) return true

        const val = new RegExp(option.regex)
        if (!val.test(value)) {
          label === 'メールアドレス'
            ? callback(
                new Error(`
          メール形式が正しくない`)
              )
            : callback(new Error(`${option?.message || 'error'}`))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    })

  return {
    [key]: conditions,
  }
}

export const useValidateNumber = (
  key: string,
  label: string,
  option?: IOptionsValidateNumber
): any => {
  const conditions: any[] = [
    {
      required: option?.required !== undefined ? option.required : false,
      message: `${label}を入力してください`,
      trigger: ['blur', 'change'],
    },
    {
      type: 'number',
      message: '数値を入力してください',
    },
  ]

  if (option && option?.validator)
    conditions.push({
      validator: option.validator,
      trigger: ['blur', 'change'],
    })

  if (option && option.min !== undefined && option.max !== undefined) {
    conditions.push({
      validator: (_rule: any, value: number, callback: any): any => {
        if (!value) return true

        const minValue = option.min || 0
        const maxValue = option.max || 1000000000

        if (value < minValue || value > maxValue) {
          callback(
            new Error(`${minValue}以上${maxValue}以下の数値を入力してください`)
          )
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    })
  } else if (option && option.min !== undefined) {
    conditions.push({
      validator: (_rule: any, value: number, callback: any): any => {
        if (!value) return true

        const minValue = option.min || 0
        if (value < minValue) {
          callback(new Error(`${minValue}以上の数値を入力してください`))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    })
  } else if (option && option.max !== undefined) {
    conditions.push({
      validator: (_rule: any, value: number, callback: any): any => {
        if (!value) return true

        const maxValue = option.max || 1000000000
        if (value > maxValue) {
          callback(new Error(`${maxValue}以下の数値を入力してください`))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    })
  }

  return {
    [key]: conditions,
  }
}

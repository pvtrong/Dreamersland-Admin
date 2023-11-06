/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(str)
}

export function validEmail(str) {
  return /\S+@\S+\.\S+/.test(str)
}


function checkValidPhoneNumber(rule, value, callback) {
  if (!value) {
    callback(new Error('Vui lòng nhập số điện thoại'))
  } else {
    if (!validUsername(value)) {
      callback(new Error('Số điện thoại không hợp lệ'))
    } else {
      callback()
    }
  }
}

function checkValidEmail(rule, value, callback) {
  if (!value) {
    callback()
  } else {
    if (!validEmail(value)) {
      callback(new Error('Email không hợp lệ'))
    } else {
      callback()
    }
  }
}

export const rules = {
  email: {
    type: 'string',
    required: false,
    trigger: ['blur', 'change'],
    validator: checkValidEmail,
  },
  first_name: {
    type: 'string',
    required: true,
    trigger: ['blur', 'change'],
    message: 'Vui lòng nhập tên',
  },
  last_name: {
    type: 'string',
    required: true,
    trigger: ['blur', 'change'],
    message: 'Vui lòng nhập họ',
  },
  password: {
    type: 'string',
    required: true,
    trigger: ['blur', 'change'],
    message: 'Vui lòng nhập mật khẩu',
  },
  phone_number: {
    type: 'string',
    required: true,
    trigger: ['blur', 'change'],
    validator: checkValidPhoneNumber
  },
  rank_name: {
    type: 'string',
    required: true,
    trigger: ['blur', 'change'],
    message: 'Vui lòng nhập tên danh hiệu',
  },
  order: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: 'Vui lòng nhập số thứ tự',
  },
  target_day: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: 'Vui lòng nhập mục tiêu ngày',
  },
  season_name: {
    type: 'string',
    required: true,
    trigger: ['blur', 'change'],
    message: 'Vui lòng nhập tên mùa giải',
  },
  start_date: {
    type: 'date',
    required: true,
    trigger: ['blur', 'change'],
    message: 'Vui lòng nhập ngày bắt đầu',
  },
  end_date: {
    type: 'date',
    required: true,
    trigger: ['blur', 'change'],
    message: 'Vui lòng nhập ngày kết thúc',
  },
  date_time: {
    type: 'date',
    required: true,
    trigger: ['blur', 'change'],
    message: 'Vui lòng nhập ngày',
  },
  season_id: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: 'Vui lòng chọn mùa giải',
  },
  amount: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: 'Vui lòng nhập số tiền',
  }
}

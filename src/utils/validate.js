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

export const rules = {
  email: {
    type: 'string',
    required: true,
    trigger: ['blur', 'change'],
    message: 'Vui lòng nhập email',
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
  phone: {
    type: 'string',
    required: true,
    trigger: ['blur', 'change'],
    message: 'Vui lòng nhập số điện thoại',
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
}

import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function createUser() {
  return request({
    url: '/user',
    method: 'post'
  })
}

export function getUsers(params) {
  return request({
    url: '/admin/list_user',
    method: 'get',
    params
  })
}
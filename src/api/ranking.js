import request from '@/utils/request'

export function createRanking(data) {
  return request({
    url: '/rank',
    method: 'post',
    data
  })
}

export function updateRanking(data) {
  return request({
    url: '/rank',
    method: 'put',
    data
  })
}

export function getRankings(params) {
  return request({
    url: '/rank/search',
    method: 'get',
    params
  })
}

export function deleteRanking(id) {
  return request({
    url: '/rank/' + id,
    method: 'delete',
  })
}
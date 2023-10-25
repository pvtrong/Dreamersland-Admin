import request from '@/utils/request'

export function createSeason(data) {
  return request({
    url: '/season',
    method: 'post',
    data
  })
}

export function updateSeason(data) {
  return request({
    url: '/season',
    method: 'put',
    data
  })
}

export function getSeasons(params) {
  return request({
    url: '/season',
    method: 'get',
    params
  })
}

export function deleteSeason(id) {
  return request({
    url: '/season/' + id,
    method: 'delete',
  })
}
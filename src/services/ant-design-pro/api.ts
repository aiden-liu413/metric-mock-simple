// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {

  return {
    "name":"admin",
    "userid":"admin"
  }
  /*return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });*/
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return null;
  /*return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });*/
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  /*return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });*/
  return {
    status: "ok",
    type: "admin",
    currentAuthority: ""
  }
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'update',
      ...(options || {}),
    }
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data:{
      method: 'delete',
      ...(options || {}),
    }
  });
}

export async function ciList(
  modelId: string,
  data: { [key: string]: any },
  headers: {
    /** 数据中心id */
    dataCenterId?: string;
    /** 租户id */
    accountId?: string;
    /** 用户id */
    userId?: string;
  },
  options?: { [key: string]: any },
) {
  return request(`/api/dcim/v1/cmdb/ci/list/${modelId}`, {
    method: 'POST',
    data: {
      ...(data || {}),
    },
    headers: {
      ...headers,
    },
    ...(options || {}),
  });
}

  export async function alarmMock(
    params: {
      /** 当前的页码 */
      roomIdList: string;
      /** 页面的容量 */
      topic: string;
    },
    headers: {
      /** 数据中心id */
      dataCenterId?: string;
      /** 租户id */
      accountId?: string;
      /** 用户id */
      userId?: string;
    },
    options?: { [key: string]: any },
  ) {
    return request(`/api/dcim/v1/visual/alarm/mock`, {
      method: 'GET',
      params: {
        ...params,
      },
      headers: {
        ...headers,
      },
      ...(options || {}),
    });
  }


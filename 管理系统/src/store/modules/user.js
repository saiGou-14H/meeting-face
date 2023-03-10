import {
  searchOneUser,
  login
} from '@/api/user';
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken
} from '@/utils/accessToken';

import {
  setting
} from '@/config/setting';
const {
  title,
  tokenName
} = setting;
import {
  resetRouter
} from '@/router';

import i18n from '@/locales';
const {
  global
} = i18n;

import {
  ElMessage,
  ElNotification
} from 'element-plus';
import { netConfig } from '@/config/net.config.js';

const state = {
  accessToken: getAccessToken(),
  username: '',
  //头像
  // avatar: 'http://localhost:8089/src/assets/avatar.jpg',
  avatar:'',
  faceUrl:'',
  //权限
  permissions: [],
  // permissions:['admin']
};

const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
};
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
    setAccessToken(accessToken);
  },
  setUsername(state, username) {
    state.username = username;
  },
  setAvatar(state, avatar) {
    state.avatar = avatar;
  },
  setFaceUrl(state, faceUrl) {
    state.faceUrl = faceUrl;
  },
  setPermissions(state, permissions) {
    state.permissions = permissions;
  },
};
const actions = {
  setPermissions({
    commit
  }, permissions) {
    commit('setPermissions', permissions);
  },
  async login({
    commit
  }, userInfo) {
    // console.log("1235")
    const data = await login(userInfo);
    // const accessToken = data[tokenName];
    // console.log(data.data.token)
    let accessToken = data.data.token
    setAccessToken(accessToken);

    // console.log(accessToken)
    // console.log(data)

    // const accessToken =data.tokenName;

    if (accessToken) {
      commit('setAccessToken', accessToken);
      const hour = new Date().getHours();
      const thisTime =
        hour < 8 ?
        global.t('sayHi.early') :
        hour <= 11 ?
        global.t('sayHi.morning') :
        hour <= 13 ?
        global.t('sayHi.noon') :
        hour < 18 ?
        global.t('sayHi.afternoon') :
        global.t('sayHi.evening');
      ElNotification({
        title: `${thisTime}！`,
        message: `${global.t('notice.msg')}${title}!`,
        type: 'success',
      });
    } else {
      ElMessage.error(`登录接口异常，未正确返回${tokenName}...`);
    }
  },


  // 信息
  async getUserInfo({
    commit,
    state
  }) {
    // console.log('getUserInfo')
    // const {
    //   data
    // } = await getUserInfo(state.accessToken);

    const {
      data
    } = await searchOneUser();
    // console.log(data)




    // if (!data) {
    //   ElMessage.error('验证失败，请重新登录...');
    //   return false;
    // }

    //   let {
    //     permissions,
    //     username,
    //     avatar
    //   } = data;
    //   if (permissions && username && Array.isArray(permissions)) {


    //     commit('setPermissions', permissions);

    // commit('setUsername', username);
    // commit('setAvatar', avatar);
    //     return permissions;



    //   } else {
    //     ElMessage.error('用户信息接口异常');
    //     return false;
    //   }

    let {
      power,
      username,
      faceUrl,
      // email
      headUrl
    } = data[0];
    // if (power && username && Array.isArray(power)) {

    let permissions = []

    permissions.push(power)
    // console.log("permissions", permissions)

    commit('setPermissions', permissions);

    commit('setUsername', username);
    commit('setAvatar', netConfig.baseURL+headUrl);
    commit('setFaceUrl', faceUrl);
    // console.log(faceUrl)

    return permissions;



    // } else {
    //   ElMessage.error('用户信息接口异常');
    //   return false;
    // }


  },




  // 
  async logout({
    dispatch
  }) {
    // await logout(state.accessToken);
    await dispatch('resetAccessToken');
    await resetRouter();
  },

  resetAccessToken({
    commit
  }) {
    commit('setPermissions', []);
    commit('setAccessToken', '');
    removeAccessToken();
  },
};
export default {
  state,
  getters,
  mutations,
  actions
};

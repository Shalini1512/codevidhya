import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
  currentContextMenuFilePath: "",
  currentContextMenuItemType: "",
  contextMenuIsForRoot: false,
  tabs: [],
  editOption: [],
  tabCounter: 0,
  tabToActivate: "",
  userId: null,
  auth: {
    isLoggedIn: false
  },
  userProfile: null
};

const mutations = {
  SET_CONTEXT_MENU_FILE_PATH(state, payload) {
    state.currentContextMenuFilePath = payload;
  },
  SET_CONTEXT_MENU_ITEM_TYPE(state, payload) {
    state.currentContextMenuItemType = payload;
  },
  SET_CONTEXT_MENU_IS_FOR_ROOT(state, payload) {
    state.contextMenuIsForRoot = payload;
  },
  ADD_TAB(state, payload) {
    var fileAlreadyOpen = false;
    state.tabs.forEach(function(tab) {
      if (tab.dir_path != payload.dir_path) {
        tab.active = false;
      } else {
        fileAlreadyOpen = true;
        tab.active = true;
      }
    });
    if (!fileAlreadyOpen) {
      state.tabCounter++;
      payload.index = state.tabCounter;
      payload.active = true;
      state.tabs.push(payload);
    }
  },
  REMOVE_TAB(state, tabIndex) {
    /*for(var i = 0; i<state.tabs.length; i++) {
      if(state.tabs[i].index == tabIndex) {
        state.tabs.splice(i, 1);
        if(i>0){ 
          state.tabToActivate = i-1;
        }else{
          state.tabToActivate = i+1;
        } 
        break;
      }
    }*/

    var previousTab;
    var removedTab;

    state.tabs.forEach(function(tab) {
      if (tab.index == tabIndex) {
        if (previousTab && tab.active && state.tabs.length > 1) {
          previousTab.active = true;
        }
        removedTab = tab;
      }
      previousTab = tab;
    });
    if (removedTab) {
      state.tabs.splice(state.tabs.indexOf(removedTab), 1);
    }
  },
  ADD_OPTION(state, payload) {
    state.editOption = [];
    state.editOption.push(payload);
  },
  SET_TAB_SELECTED(state, index) {
    state.tabs.forEach(function(tab) {
      if (tab.index == index) {
        tab.active = true;
      } else {
        tab.active = false;
      }
    });
  },
  ADD_USER(state, payload) {
    state.userData = [];
    state.userData.push(payload);
  },
  SET_USER_ID(state, payload) {
    state.userId = payload;
  },
  SET_AUTH_DATA(state, payload) {
    state.auth = payload;
  },
  SET_PROFILE_DATA(state, payload) {
    state.userProfile = payload;
  }
};

const actions = {
  setContextMenuFilePath(context, path) {
    context.commit("SET_CONTEXT_MENU_FILE_PATH", path);
  },
  setContextMenuItemType(context, type) {
    context.commit("SET_CONTEXT_MENU_ITEM_TYPE", type);
  },
  setContextMenuIsForRoot(context, isRoot) {
    context.commit("SET_CONTEXT_MENU_IS_FOR_ROOT", isRoot);
  },
  addTab(context, tab) {
    context.commit("ADD_TAB", tab);
  },
  removeTab(context, tabIndex) {
    context.commit("REMOVE_TAB", tabIndex);
  },
  addOption(context, options) {
    context.commit("ADD_OPTION", options);
  },
  setTabSelected(context, tabIndex) {
    context.commit("SET_TAB_SELECTED", tabIndex);
  },
  addUser(context, options) {
    context.commit("ADD_USER", options);
  },
  setUserId(context, id) {
    context.commit("SET_USER_ID", id);
  },
  setAuthData(context, options) {
    context.commit("SET_AUTH_DATA", options);
  },
  setProfileData(context, options) {
    context.commit("SET_PROFILE_DATA", options);
  }
};

const getters = {
  getContextMenuFilePath(state) {
    return state.currentContextMenuFilePath;
  },
  getContextMenuItemType(state) {
    return state.currentContextMenuItemType;
  },
  getContextMenuIsForRoot(state) {
    return state.contextMenuIsForRoot;
  },
  getTabs(state) {
    return state.tabs;
  },
  getEditOptions(state) {
    return state.editOption;
  },
  getActiveTab(state) {
    for (var i = 0; i < state.tabs.length; i++) {
      if (state.tabs[i].active) return state.tabs[i];
    }
    return null;
  },
  getUserData(state) {
    return state.userData;
  },
  getUserId(state) {
    return state.userId;
  },
  getAuthData(state) {
    return state.auth;
  },
  getTabToActivate(state) {
    return state.tabToActivate;
  },
  getProfileData(state) {
    return state.userProfile;
  }
};

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
  modules: {}
});

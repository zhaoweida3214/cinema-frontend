import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    id: Number(localStorage.getItem("userId")) || 0,
    username: localStorage.getItem("username") || "",
    name: localStorage.getItem("name") || "",
    token: localStorage.getItem("token") || "",
  }),
  actions: {
    setUserInfo(info: {
      id: number;
      username: string;
      name: string;
      token: string;
    }) {
      this.id = info.id;
      this.username = info.username;
      this.name = info.name;
      this.token = info.token;

      localStorage.setItem("userId", String(info.id));
      localStorage.setItem("username", info.username);
      localStorage.setItem("name", info.name);
      localStorage.setItem("token", info.token);
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    logout() {
      this.$reset();
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("name");
      localStorage.removeItem("token");
    },
  },
});

// ✅ 必须导出默认，否则 import 会报错
export default useUserStore;

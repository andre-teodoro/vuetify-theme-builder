// Utilities
import { defineStore } from 'pinia'
import {
  vuetifyThemeFromColor,
  vuetifyThemeFromHex,
  vuetifyColorsFromHex,
  vuetifyThemeFromColors
} from '@/plugins/vuetifyM3ThemeGenerator';

export const useAppStore = defineStore('app', {
  state: () => ({
    palette: [
      {
        key: "primary",
        title: "Primary",
        color: "#0F5AE8",
      },
      {
        key: "secondary",
        title: "Secondary",
        color: "#0D337F",
      },
      {
        key: "tertiary",
        title: "Tertiary",
        color: "#3DCA9A",
      },
      {
        key: "error",
        title: "Error",
        color: "#C01031",
      },
      {
        key: "warning",
        title: "Warning",
        color: "#FFE145",
      },
      {
        key: "success",
        title: "Success",
        color: "#22800B",
      },
      {
        key: "info",
        title: "Info",
        color: "#5846BC",
      },
      {
        key: "background",
        title: "Background",
        color: "#ffffff",
      },
      {
        key: "surface",
        title: "Surface",
        color: "#F8FCFF",
      },
    ],
    contrast: [
      {
        value: 0.0,
        title: "Default contrast",
      },
      {
        value: 0.5,
        title: "Higher contrast",
      },
      {
        value: 1.0,
        title: "Highest contrast",
      },
      {
        value: -1.0,
        title: "Reduced contrast",
      },
    ],
    lightTheme: vuetifyThemeFromColors({
      primary: "#0F5AE8",
      secondary: "#0D337F",
      tertiary: "#3DCA9A",
      error: "#C01031",
      warning: "#FFE145",
      success: "#22800B",
      info: "#5846BC",
      background: "#ffffff",
      surface: "#F8FCFF",
    }, false),
    darkTheme: vuetifyThemeFromColor(0x0F5AE8, true),
    vuetify_keys: ['background', 'surface', 'surface-bright', 'surface-light', 'surface-variant', 'on-surface-variant', 'primary', 'primary-darken-1', 'secondary',
      'secondary-darken-1', 'error', 'info', 'success', 'warning', 'tertiary'],
  }),
  persist: {
    storage: sessionStorage
  },
  getters: {

  },
  actions: {

    setThemesByColor(contrast) {
      const prim = this.palette[0]
      const sec = this.palette[1]
      const ter = this.palette[2]

      this.lightTheme = vuetifyThemeFromColors(prim.color, sec.color, ter.color, false, contrast);
      this.darkTheme = vuetifyThemeFromColors(prim.color, sec.color, ter.color, true, contrast);
    },
  }
})

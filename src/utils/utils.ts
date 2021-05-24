import chroma from "chroma-js";

export const refreshTokenSetup = (res: any) => {
  let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;
  const refreshToken = async () => {
    const newAuthRes = await res.reloadAuthResponse();
    refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;

    setTimeout(refreshToken, refreshTiming);
  };
  setTimeout(refreshToken, refreshTiming);
};
export const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
export const getLastRescan = (rescanTime: Date) => {
  const now = new Date();
  var diff = (now.getTime() - rescanTime?.getTime()) / 1000;
  const h = diff / 3600;
  const m = (diff % 3600) / 60;
  const s = (diff % 3600) % 60;
  let time = s;
  let hrs = " few seconds";
  if (m >= 1) {
    time = m;
    hrs = m < 2 ? " minute" : " minutes";
  }
  if (h >= 1) {
    time = h;
    hrs = h < 2 ? " hour" : " hours";
  }
  return m < 1 ? "a few seconds ago" : time.toFixed(0) + hrs + " ago";
};
export const uiColors = [
  // '#F6ADDB',
  // '#8878C9',
  // '#7DC4E0',
  // '#FFD278',
  // '#7DC4E0',
  // 'F6ADDB',
  // '#D67BC5',
  // '#515CD2',

  "#F6ADDB",
  "#8878C9",
  "#7DC4E0",
  "#FFD278",
  "#D67BC5",
  "#42CF9C",
  "#64b5f6",
  "#aed581",
  "#bcaaa4",
  "#b0bec5",
];

export const selectColourStyles = {
  option: (styles: any, { isDisabled, isFocused, isSelected }: any) => {
    const baseColor = "#bbdefb";
    const color = chroma(baseColor);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? baseColor
        : isFocused
        ? color.alpha(0.3).css()
        : null,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : "black",
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor:
          !isDisabled && (isSelected ? baseColor : color.alpha(0.3).css()),
      },
    };
  },
};

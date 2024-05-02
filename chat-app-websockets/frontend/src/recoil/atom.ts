import { atom } from "recoil";

export const nameAtom = atom({
  key: "name",
  default: "",
});

export const lobbyCodeAtom = atom({
  key: "lobbyCode",
  default: "",
});

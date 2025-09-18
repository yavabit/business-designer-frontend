import { useHotkeys } from "react-hotkeys-hook";
import type { Hotkey } from "react-hotkeys-hook/packages/react-hotkeys-hook/dist/types";

const ListHotkeys = [
  {
    key: "ctrl+c",
    name: "Копировать",
  },
  {
    key: "ctrl+v",
    name: "Вставить",
  },
];

const listKeys = ListHotkeys.map((item) => item.key);

export const Hotkeys = () => {

  useHotkeys(listKeys, (e: KeyboardEvent, b: Hotkey) => {
    console.log(e, b);
    const hotkey = ListHotkeys.find((item) => item.key === e.code);

    if (!hotkey) return;
  });

  return <></>;
};

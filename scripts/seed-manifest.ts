import type { LocalizedText } from "../src/lib/registry/text";

export type SeedEntry = {
  slug: string;
  source: { repo: string; path: string; sha: string };
  license: "MIT";
  /** Copyright holder named in the source repository's LICENSE file. */
  holder: string;
  author: { name: string; github: string };
  description: LocalizedText;
  tags: string[];
  /** The palette this theme is based on, when it is a port. */
  palette?: { name: string; url: string };
};

const LIVLIGN = {
  repo: "livlign/ccthemes",
  sha: "a4f752801f803f422e29076d19702a0420f1a2a0",
  holder: "ccthemes contributors",
  author: { name: "livlign", github: "livlign" },
} as const;

function livlign(
  slug: string,
  description: LocalizedText,
  tags: string[],
  palette?: { name: string; url: string },
): SeedEntry {
  return {
    slug,
    source: {
      repo: LIVLIGN.repo,
      path: `plugins/theme-gallery/themes/${slug}.json`,
      sha: LIVLIGN.sha,
    },
    license: "MIT",
    holder: LIVLIGN.holder,
    author: LIVLIGN.author,
    description,
    tags,
    ...(palette ? { palette } : {}),
  };
}

export const CLI_SEED: SeedEntry[] = [
  {
    slug: "dracula",
    source: {
      repo: "dracula/claude-code-cli",
      path: "Dracula.json",
      sha: "5e7044877a25296e7f4fc8ec9a4bd0ea5a8cafb8",
    },
    license: "MIT",
    holder: "2026 Dracula Theme",
    author: { name: "Dracula Theme", github: "dracula" },
    description: {
      en: "The official Dracula theme for Claude Code. It uses the ANSI base, so it follows the Dracula palette set in your terminal.",
      zh: "Claude Code 的官方 Dracula 主题。它基于 ANSI 预设,颜色跟随终端里设置的 Dracula 调色板。",
    },
    tags: ["dracula", "ansi", "official"],
    palette: { name: "Dracula", url: "https://draculatheme.com" },
  },
  livlign(
    "nord",
    {
      en: "Cool arctic blues and muted frost tones on a dark base, ported from the Nord palette.",
      zh: "来自 Nord 配色的北极蓝和柔和的霜色,基于深色底。",
    },
    ["nord", "blue", "dark"],
    { name: "Nord", url: "https://github.com/nordtheme/nord" },
  ),
  livlign(
    "catppuccin-mocha",
    {
      en: "The darkest Catppuccin flavor: a pastel blue accent with soft green, red, and yellow status colors.",
      zh: "Catppuccin 最深的一款:粉彩蓝色强调色,搭配柔和的绿、红、黄状态色。",
    },
    ["catppuccin", "pastel", "dark"],
    { name: "Catppuccin", url: "https://github.com/catppuccin/catppuccin" },
  ),
  livlign(
    "catppuccin-latte",
    {
      en: "The light Catppuccin flavor, with pastel accents tuned for a white terminal.",
      zh: "Catppuccin 的浅色版本,粉彩色针对白色终端调整过。",
    },
    ["catppuccin", "pastel", "light"],
    { name: "Catppuccin", url: "https://github.com/catppuccin/catppuccin" },
  ),
  livlign(
    "gruvbox",
    {
      en: "A muted aqua accent with warm retro red, green, and mustard status colors, based on the Gruvbox palette.",
      zh: "基于 Gruvbox 配色:低饱和的水绿色强调色,搭配暖调复古的红、绿、芥末黄状态色。",
    },
    ["gruvbox", "retro", "dark"],
    { name: "Gruvbox", url: "https://github.com/morhetz/gruvbox" },
  ),
  livlign(
    "tokyo-night",
    {
      en: "A soft blue accent with green success and pink-red error colors, from the Tokyo Night palette.",
      zh: "来自 Tokyo Night 配色:柔和的蓝色强调色,成功为绿色,错误为粉红色。",
    },
    ["tokyo-night", "blue", "dark"],
    {
      name: "Tokyo Night",
      url: "https://github.com/enkia/tokyo-night-vscode-theme",
    },
  ),
  livlign(
    "solarized-dark",
    {
      en: "A blue accent with muted green, red, and yellow status colors from the Solarized palette, tuned for low contrast.",
      zh: "来自 Solarized 配色:蓝色强调色,搭配低饱和的绿、红、黄状态色,整体对比度较低。",
    },
    ["solarized", "teal", "dark"],
    { name: "Solarized", url: "https://ethanschoonover.com/solarized/" },
  ),
  livlign(
    "solarized-light",
    {
      en: "The light Solarized theme: a warm cream feel with carefully balanced accent colors.",
      zh: "Solarized 的浅色版本:偏暖的奶油色调,强调色经过仔细平衡。",
    },
    ["solarized", "cream", "light"],
    { name: "Solarized", url: "https://ethanschoonover.com/solarized/" },
  ),
  livlign(
    "rose-pine",
    {
      en: "A soft foam-blue accent with rose and gold status colors, from the Rosé Pine palette.",
      zh: "来自 Rosé Pine 配色:柔和的泡沫蓝强调色,搭配玫瑰色和金色状态色。",
    },
    ["rose-pine", "muted", "dark"],
    {
      name: "Rosé Pine",
      url: "https://github.com/rose-pine/rose-pine-theme",
    },
  ),
  livlign(
    "rose-pine-dawn",
    {
      en: "The light Rosé Pine variant: soft warm paper tones with muted rose and pine accents.",
      zh: "Rosé Pine 的浅色版本:柔和的暖纸色,搭配低饱和的玫瑰色和松绿。",
    },
    ["rose-pine", "muted", "light"],
    {
      name: "Rosé Pine",
      url: "https://github.com/rose-pine/rose-pine-theme",
    },
  ),
  livlign(
    "everforest",
    {
      en: "A soft aqua accent with gentle green, red, and sand status colors from the Everforest palette.",
      zh: "来自 Everforest 配色:柔和的水绿色强调色,搭配温和的绿、红、沙色状态色。",
    },
    ["everforest", "green", "dark"],
    { name: "Everforest", url: "https://github.com/sainnhe/everforest" },
  ),
  livlign(
    "kanagawa",
    {
      en: "Muted ink-blue and wave colors inspired by Hokusai's The Great Wave off Kanagawa.",
      zh: "灵感来自北斋《神奈川冲浪里》的低饱和墨色与海浪色。",
    },
    ["kanagawa", "muted", "dark"],
    { name: "Kanagawa", url: "https://github.com/rebelot/kanagawa.nvim" },
  ),
  livlign(
    "ayu-dark",
    {
      en: "A sky-blue accent with lime success and orange warning colors, based on the Ayu palette.",
      zh: "基于 Ayu 配色:天蓝色强调色,成功为青柠绿,警告为橙色。",
    },
    ["ayu", "orange", "dark"],
    { name: "Ayu", url: "https://github.com/ayu-theme/ayu-colors" },
  ),
  livlign(
    "github-dark",
    {
      en: "A blue accent with green success and coral error colors, from the GitHub dark palette.",
      zh: "来自 GitHub 深色配色:蓝色强调色,成功为绿色,错误为珊瑚红。",
    },
    ["github", "neutral", "dark"],
    {
      name: "GitHub Primer",
      url: "https://github.com/primer/github-vscode-theme",
    },
  ),
  livlign(
    "github-light",
    {
      en: "The GitHub light palette, with the familiar blue accent and readable status colors on white.",
      zh: "GitHub 浅色配色:熟悉的蓝色强调色,白底上状态色清晰易读。",
    },
    ["github", "neutral", "light"],
    {
      name: "GitHub Primer",
      url: "https://github.com/primer/github-vscode-theme",
    },
  ),
  livlign(
    "acid-lime",
    {
      en: "Electric lime and mint accents with a hot red for errors. High energy, high saturation.",
      zh: "电光青柠和薄荷绿强调色,错误用鲜红表示。高饱和,高能量。",
    },
    ["neon", "green", "dark"],
  ),
  livlign(
    "amber-crt",
    {
      en: "A monochrome amber phosphor look, like an old CRT terminal. Almost every color is a shade of amber.",
      zh: "单色琥珀荧光的老式 CRT 终端风格,几乎所有颜色都是琥珀色的深浅变化。",
    },
    ["retro", "amber", "dark"],
  ),
  livlign(
    "aubade",
    {
      en: "A light theme with an indigo accent and soft warm text, named for a morning song.",
      zh: "靛蓝强调色配柔和暖色文字的浅色主题,名字取自晨曲。",
    },
    ["indigo", "soft", "light"],
  ),
  livlign(
    "citrus-ink",
    {
      en: "A bright lime accent with warm coral errors and a pale citrus plan-mode color.",
      zh: "明亮的青柠强调色,错误用暖珊瑚色,计划模式用淡柑橘色。",
    },
    ["lime", "coral", "dark"],
  ),
  livlign(
    "daybreak",
    {
      en: "A light theme with a calm teal accent and earthy status colors, easy on the eyes in daylight.",
      zh: "浅色主题,青色强调色搭配大地色调的状态色,白天使用不刺眼。",
    },
    ["teal", "earthy", "light"],
  ),
  livlign(
    "letterpress",
    {
      en: "A printed-page light theme: ink blue accent, warm paper text, and restrained olive and brick status colors.",
      zh: "印刷纸张风格的浅色主题:墨蓝强调色、暖纸色文字,状态色克制,为橄榄绿和砖红。",
    },
    ["paper", "blue", "light"],
  ),
  livlign(
    "matcha-zen",
    {
      en: "A calm light theme in teal and green with warm text, inspired by matcha and quiet tea rooms.",
      zh: "平静的浅色主题,青绿色调搭配暖色文字,灵感来自抹茶和安静的茶室。",
    },
    ["green", "calm", "light"],
  ),
  livlign(
    "porcelain",
    {
      en: "A clean light theme with a strong blue accent and cool gray text, like glazed white ceramic.",
      zh: "干净的浅色主题,醒目的蓝色强调色搭配冷灰色文字,像上过釉的白瓷。",
    },
    ["blue", "clean", "light"],
  ),
  livlign(
    "frostbyte",
    {
      en: "A light theme in icy blues with a slate text color and cool, readable status colors.",
      zh: "冰蓝色调的浅色主题,石板灰文字,状态色偏冷但清晰易读。",
    },
    ["blue", "cool", "light"],
  ),
  livlign(
    "high-contrast",
    {
      en: "Pure white text and bright, saturated accents on the dark preset, for maximum readability.",
      zh: "在深色预设上使用纯白文字和明亮饱和的强调色,可读性优先。",
    },
    ["high-contrast", "accessibility", "dark"],
  ),
];

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
  /** Replaces the `name` in the source file when that label is unclear. */
  name?: string;
};

type Palette = { name: string; url: string };

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

const TINTED = {
  repo: "tinted-theming/tinted-claude-code",
  sha: "d63ab0364b036693750dab0f0c7a27f0057a1d32",
  holder: "2026 Bez Hermoso",
  author: { name: "Tinted Theming", github: "tinted-theming" },
} as const;

const BABAYAGA = {
  repo: "TheBabaYaga/claude-themes",
  sha: "48936234e93030b2403c0f62c0e4ad83edb50b8b",
  holder: "2026 Kevin T'Syen",
  author: { name: "TheBabaYaga", github: "TheBabaYaga" },
} as const;

/** A theme from tinted-claude-code, built from a Base16 scheme. */
function tinted(
  slug: string,
  file: string,
  name: string | undefined,
  description: LocalizedText,
  tags: string[],
  palette: Palette,
): SeedEntry {
  return {
    slug,
    source: {
      repo: TINTED.repo,
      path: `themes/base16-${file}.json`,
      sha: TINTED.sha,
    },
    license: "MIT",
    holder: TINTED.holder,
    author: TINTED.author,
    description,
    tags,
    palette,
    ...(name ? { name } : {}),
  };
}

function babayaga(
  slug: string,
  description: LocalizedText,
  tags: string[],
  palette?: Palette,
): SeedEntry {
  return {
    slug,
    source: {
      repo: BABAYAGA.repo,
      path: `themes/${slug}.json`,
      sha: BABAYAGA.sha,
    },
    license: "MIT",
    holder: BABAYAGA.holder,
    author: BABAYAGA.author,
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
  livlign(
    "synthwave",
    {
      en: "Electric cyan accents with hot pink-red errors and neon yellow warnings, in the style of Synthwave '84.",
      zh: "电光青色强调色,搭配玫红色错误和霓虹黄色警告,风格来自 Synthwave '84。",
    },
    ["synthwave", "neon", "retro", "dark"],
    {
      name: "Synthwave '84",
      url: "https://github.com/robb0wen/synthwave-vscode",
    },
  ),
  livlign(
    "one-dark",
    {
      en: "The familiar Atom One Dark colors: a soft blue accent with green, red, and amber status colors.",
      zh: "熟悉的 Atom One Dark 配色:柔和的蓝色强调色,搭配绿、红、琥珀色状态色。",
    },
    ["one-dark", "blue", "dark"],
    {
      name: "One Dark",
      url: "https://github.com/atom/one-dark-syntax",
    },
  ),
  livlign(
    "night-owl",
    {
      en: "A deep blue theme with a periwinkle accent and green success, based on Night Owl.",
      zh: "深蓝色主题,长春花蓝强调色搭配绿色成功色,基于 Night Owl。",
    },
    ["night-owl", "blue", "dark"],
    {
      name: "Night Owl",
      url: "https://github.com/sdras/night-owl-vscode-theme",
    },
  ),
  livlign(
    "horizon",
    {
      en: "A cyan accent with coral-pink errors and peach warnings on a dark base, based on Horizon.",
      zh: "青色强调色,搭配珊瑚粉色错误和蜜桃色警告,基于 Horizon 的深色版本。",
    },
    ["horizon", "cyan", "dark"],
    {
      name: "Horizon",
      url: "https://github.com/jolaleye/horizon-theme-vscode",
    },
  ),
  livlign(
    "oxocarbon",
    {
      en: "IBM Carbon-style colors: a bright blue accent, mint green success, and pink errors on a dark base.",
      zh: "IBM Carbon 风格配色:亮蓝色强调色,薄荷绿成功色和粉色错误色,基于深色底。",
    },
    ["oxocarbon", "blue", "dark"],
    {
      name: "Oxocarbon",
      url: "https://github.com/nyoom-engineering/oxocarbon",
    },
  ),
  livlign(
    "halcyon",
    {
      en: "A soft periwinkle accent with muted pink errors and sage success colors, based on Halcyon.",
      zh: "柔和的长春花蓝强调色,搭配淡粉色错误和鼠尾草绿成功色,基于 Halcyon。",
    },
    ["halcyon", "purple", "soft", "dark"],
    {
      name: "Halcyon",
      url: "https://github.com/bchiang7/halcyon-vscode",
    },
  ),
  livlign(
    "campbell",
    {
      en: "The Campbell color scheme from Windows Terminal: a royal blue accent with the classic ANSI green, red, and yellow.",
      zh: "来自 Windows Terminal 的 Campbell 配色:宝蓝色强调色,搭配经典 ANSI 绿、红、黄。",
    },
    ["campbell", "windows-terminal", "blue", "dark"],
    { name: "Campbell", url: "https://github.com/microsoft/terminal" },
  ),
  livlign(
    "cyberpunk",
    {
      en: "A cyan accent with acid green success, magenta errors, and yellow warnings on a deep navy base.",
      zh: "青色强调色,搭配酸性绿成功色、品红错误色和黄色警告,基于深海军蓝底。",
    },
    ["cyberpunk", "neon", "dark"],
  ),
  livlign(
    "miami-heat",
    {
      en: "Hot pink errors, aqua accents, and a pale pink text color, inspired by 1980s Miami.",
      zh: "玫红色错误、水蓝色强调色和淡粉色文字,灵感来自 80 年代的迈阿密。",
    },
    ["neon", "retro", "pink", "dark"],
  ),
  livlign(
    "green-phosphor",
    {
      en: "A monochrome green phosphor look, like a classic CRT terminal. Almost every color is a shade of green.",
      zh: "单色绿色荧光屏效果,像经典 CRT 终端。几乎所有颜色都是绿色的深浅变化。",
    },
    ["retro", "crt", "green", "dark"],
  ),
  livlign(
    "nebula-drift",
    {
      en: "A periwinkle accent with pink-red errors and mint success, on a deep indigo base.",
      zh: "长春花蓝强调色,搭配粉红色错误和薄荷绿成功色,基于深靛蓝底。",
    },
    ["space", "indigo", "dark"],
  ),
  livlign(
    "eclipse",
    {
      en: "A calm sky-blue accent with teal plan-mode borders and clear green, red, and amber status colors.",
      zh: "平静的天蓝色强调色,计划模式边框用青绿色,绿、红、琥珀色状态色清晰易辨。",
    },
    ["blue", "calm", "dark"],
  ),
  livlign(
    "prism",
    {
      en: "A bright blue accent with cyan plan mode and well-separated pink, mint, and yellow status colors.",
      zh: "明亮的蓝色强调色,计划模式用青色,粉、薄荷绿、黄色状态色区分明显。",
    },
    ["blue", "vivid", "dark"],
  ),
  livlign(
    "opaline",
    {
      en: "A pearly blue accent with soft mint success and peach warnings on a muted indigo base.",
      zh: "珍珠蓝强调色,搭配柔和的薄荷绿成功色和蜜桃色警告,基于低饱和靛蓝底。",
    },
    ["blue", "soft", "pastel", "dark"],
  ),
  livlign(
    "velvet-court",
    {
      en: "A lavender accent with rose pink text and plum backgrounds, like a velvet curtain.",
      zh: "薰衣草紫强调色,搭配玫瑰粉文字和李子紫背景,像天鹅绒幕布。",
    },
    ["purple", "plum", "dark"],
  ),
  livlign(
    "oxblood",
    {
      en: "A burnt orange accent with warm pink-white text on a dark red-brown base.",
      zh: "焦橙色强调色,搭配暖粉白色文字,基于深红棕色底。",
    },
    ["red", "warm", "dark"],
  ),
  livlign(
    "forge-ember",
    {
      en: "Glowing amber and orange accents with a cream text color, like embers in a forge.",
      zh: "炽热的琥珀色和橙色强调色,搭配奶油色文字,像锻炉里的余烬。",
    },
    ["orange", "warm", "dark"],
  ),
  livlign(
    "bong",
    {
      en: "A warm sand accent with sage green success and teal plan mode, on a dark brown base.",
      zh: "暖沙色强调色,搭配鼠尾草绿成功色和青绿色计划模式,基于深棕色底。",
    },
    ["sand", "warm", "dark"],
  ),
  livlign(
    "driftwood",
    {
      en: "A muted teal accent with soft cream text, like weathered wood and sea glass.",
      zh: "低饱和的青绿色强调色,搭配柔和的奶油色文字,像风化的浮木和海玻璃。",
    },
    ["teal", "muted", "dark"],
  ),
  livlign(
    "graphite",
    {
      en: "A restrained steel-blue accent on a neutral gray base with desaturated status colors.",
      zh: "克制的钢蓝色强调色,基于中性灰色底,状态色饱和度较低。",
    },
    ["gray", "minimal", "muted", "dark"],
  ),
  livlign(
    "patina",
    {
      en: "A copper-green accent with sage success and a deep green-gray base, like oxidized bronze.",
      zh: "铜绿色强调色,搭配鼠尾草绿成功色,基于深绿灰色底,像氧化的青铜。",
    },
    ["green", "teal", "dark"],
  ),
  livlign(
    "verdigris",
    {
      en: "A blue-green accent with parchment text on a dark forest base.",
      zh: "蓝绿色强调色,搭配羊皮纸色文字,基于深森林绿底。",
    },
    ["green", "teal", "dark"],
  ),
  babayaga(
    "neon",
    {
      en: "An original high-contrast neon palette: orange accent, neon green text and success, and bright red errors over near-black.",
      zh: "原创的高对比度霓虹配色:橙色强调色,霓虹绿文字和成功色,亮红色错误,基于近黑底。",
    },
    ["neon", "high-contrast", "dark"],
  ),
  babayaga(
    "gruvbox-dark-hard",
    {
      en: "The hard-contrast Gruvbox Dark variant: a yellow accent with bright green, red, and cream text on a very dark base.",
      zh: "Gruvbox Dark 的 hard 对比度版本:黄色强调色,搭配亮绿色、红色和奶油色文字,基于很深的底色。",
    },
    ["gruvbox", "yellow", "dark"],
    { name: "Gruvbox", url: "https://github.com/morhetz/gruvbox" },
  ),
  tinted(
    "flexoki-dark",
    "flexoki-dark",
    "Flexoki Dark",
    {
      en: "Flexoki's dark scheme: warm paper-like text, a blue accent, and inky status colors.",
      zh: "Flexoki 的深色方案:温暖的纸张色文字,蓝色强调色,墨水般的状态色。",
    },
    ["flexoki", "warm", "dark"],
    { name: "Flexoki", url: "https://github.com/kepano/flexoki" },
  ),
  tinted(
    "flexoki-light",
    "flexoki-light",
    "Flexoki Light",
    {
      en: "Flexoki's light scheme: ink-colored text on warm paper, with a deep blue accent.",
      zh: "Flexoki 的浅色方案:暖纸色背景上的墨色文字,深蓝色强调色。",
    },
    ["flexoki", "warm", "light"],
    { name: "Flexoki", url: "https://github.com/kepano/flexoki" },
  ),
  tinted(
    "rose-pine-moon",
    "rose-pine-moon",
    undefined,
    {
      en: "The Moon variant of Rosé Pine: a soft iris accent with rose errors on a dusky purple base.",
      zh: "Rosé Pine 的 Moon 版本:柔和的鸢尾紫强调色,玫瑰色错误,基于暮色紫底。",
    },
    ["rose-pine", "purple", "dark"],
    {
      name: "Rosé Pine",
      url: "https://github.com/rose-pine/rose-pine-theme",
    },
  ),
  tinted(
    "kanagawa-dragon",
    "kanagawa-dragon",
    undefined,
    {
      en: "The darker Dragon variant of Kanagawa, with a pale blue-gray accent and muted earthy status colors.",
      zh: "Kanagawa 更暗的 Dragon 版本,淡蓝灰色强调色,状态色偏大地色且低饱和。",
    },
    ["kanagawa", "muted", "dark"],
    { name: "Kanagawa", url: "https://github.com/rebelot/kanagawa.nvim" },
  ),
  tinted(
    "nightfox",
    "nightfox",
    "Nightfox",
    {
      en: "The Nightfox scheme: a steady blue accent with soft green, rose, and gold status colors.",
      zh: "Nightfox 配色:沉稳的蓝色强调色,搭配柔和的绿、玫红、金色状态色。",
    },
    ["nightfox", "blue", "dark"],
    { name: "Nightfox", url: "https://github.com/EdenEast/nightfox.nvim" },
  ),
  tinted(
    "dawnfox",
    "dawnfox",
    "Dawnfox",
    {
      en: "The light Dawnfox scheme: a teal-blue accent and plum text on a warm pink-beige background.",
      zh: "浅色的 Dawnfox 配色:青蓝色强调色,梅子色文字,暖粉米色背景。",
    },
    ["nightfox", "light", "warm"],
    { name: "Nightfox", url: "https://github.com/EdenEast/nightfox.nvim" },
  ),
  tinted(
    "carbonfox",
    "carbonfox",
    "Carbonfox",
    {
      en: "The Carbonfox scheme: a bright blue accent with pink errors and near-black neutral backgrounds.",
      zh: "Carbonfox 配色:亮蓝色强调色,粉色错误,中性的近黑背景。",
    },
    ["nightfox", "blue", "dark"],
    { name: "Nightfox", url: "https://github.com/EdenEast/nightfox.nvim" },
  ),
  tinted(
    "terafox",
    "terafox",
    "Terafox",
    {
      en: "The Terafox scheme: a muted teal-blue accent with coral errors on a deep green-teal base.",
      zh: "Terafox 配色:低饱和的青蓝色强调色,珊瑚色错误,基于深青绿底。",
    },
    ["nightfox", "teal", "dark"],
    { name: "Nightfox", url: "https://github.com/EdenEast/nightfox.nvim" },
  ),
  tinted(
    "catppuccin-frappe",
    "catppuccin-frappe",
    "Catppuccin Frappé",
    {
      en: "The Frappé flavor of Catppuccin: a pastel blue accent on a mid-tone blue-gray base.",
      zh: "Catppuccin 的 Frappé 版本:粉彩蓝色强调色,基于中等明度的蓝灰色底。",
    },
    ["catppuccin", "pastel", "dark"],
    { name: "Catppuccin", url: "https://github.com/catppuccin/catppuccin" },
  ),
  tinted(
    "catppuccin-macchiato",
    "catppuccin-macchiato",
    "Catppuccin Macchiato",
    {
      en: "The Macchiato flavor of Catppuccin: a pastel blue accent, between Frappé and Mocha in darkness.",
      zh: "Catppuccin 的 Macchiato 版本:粉彩蓝色强调色,深浅介于 Frappé 和 Mocha 之间。",
    },
    ["catppuccin", "pastel", "dark"],
    { name: "Catppuccin", url: "https://github.com/catppuccin/catppuccin" },
  ),
  tinted(
    "ayu-mirage",
    "ayu-mirage",
    undefined,
    {
      en: "The medium-dark Ayu Mirage variant: a light blue accent with lime success and coral errors.",
      zh: "明度居中的 Ayu Mirage 版本:浅蓝色强调色,搭配青柠色成功色和珊瑚色错误。",
    },
    ["ayu", "blue", "dark"],
    { name: "Ayu", url: "https://github.com/ayu-theme/ayu-colors" },
  ),
  tinted(
    "ayu-light",
    "ayu-light",
    undefined,
    {
      en: "The Ayu Light variant: a clear blue accent with green success and soft red errors on a light base.",
      zh: "Ayu Light 版本:清爽的蓝色强调色,搭配绿色成功色和柔和的红色错误,基于浅色底。",
    },
    ["ayu", "blue", "light"],
    { name: "Ayu", url: "https://github.com/ayu-theme/ayu-colors" },
  ),
  tinted(
    "selenized-dark",
    "selenized-dark",
    "Selenized Dark",
    {
      en: "Selenized Dark: a blue accent on a teal-tinted base, with colors designed for even perceived contrast.",
      zh: "Selenized Dark:蓝色强调色,基于带青色调的深底,配色按感知对比度均衡设计。",
    },
    ["selenized", "blue", "dark"],
    { name: "Selenized", url: "https://github.com/jan-warchol/selenized" },
  ),
  tinted(
    "selenized-light",
    "selenized-light",
    "Selenized Light",
    {
      en: "Selenized Light: a blue accent and slate text on a warm cream background.",
      zh: "Selenized Light:蓝色强调色,石板灰文字,暖奶油色背景。",
    },
    ["selenized", "blue", "light"],
    { name: "Selenized", url: "https://github.com/jan-warchol/selenized" },
  ),
  tinted(
    "gruvbox-material-dark",
    "gruvbox-material-dark-medium",
    "Gruvbox Material Dark",
    {
      en: "A softer take on Gruvbox with an aqua accent, sage green success, and warm cream text.",
      zh: "更柔和的 Gruvbox 变体:水绿色强调色,鼠尾草绿成功色,暖奶油色文字。",
    },
    ["gruvbox", "soft", "dark"],
    {
      name: "Gruvbox Material",
      url: "https://github.com/sainnhe/gruvbox-material",
    },
  ),
  tinted(
    "gruvbox-material-light",
    "gruvbox-material-light-medium",
    "Gruvbox Material Light",
    {
      en: "The light Gruvbox Material scheme: a teal accent and brown text on a warm cream background.",
      zh: "浅色的 Gruvbox Material 配色:青绿色强调色,棕色文字,暖奶油色背景。",
    },
    ["gruvbox", "soft", "light"],
    {
      name: "Gruvbox Material",
      url: "https://github.com/sainnhe/gruvbox-material",
    },
  ),
  tinted(
    "github-dark-dimmed",
    "github-dark-dimmed",
    "GitHub Dark Dimmed",
    {
      en: "GitHub's dimmed dark scheme: a softer blue accent and lower contrast than GitHub Dark.",
      zh: "GitHub 的 Dimmed 深色方案:蓝色更柔和,对比度比 GitHub Dark 更低。",
    },
    ["github", "blue", "dark"],
    {
      name: "GitHub Primer",
      url: "https://github.com/primer/github-vscode-theme",
    },
  ),
  tinted(
    "github-dark-colorblind",
    "github-dark-colorblind",
    "GitHub Dark Colorblind",
    {
      en: "GitHub's colorblind-friendly dark scheme: blue for success and orange for errors instead of green and red.",
      zh: "GitHub 面向色盲用户的深色方案:用蓝色表示成功、橙色表示错误,代替绿色和红色。",
    },
    ["github", "accessibility", "colorblind", "dark"],
    {
      name: "GitHub Primer",
      url: "https://github.com/primer/github-vscode-theme",
    },
  ),
  tinted(
    "github-dark-high-contrast",
    "github-dark-high-contrast",
    "GitHub Dark High Contrast",
    {
      en: "GitHub's high-contrast dark scheme: brighter blue, green, red, and yellow for readability.",
      zh: "GitHub 的高对比度深色方案:更亮的蓝、绿、红、黄,可读性优先。",
    },
    ["github", "high-contrast", "accessibility", "dark"],
    {
      name: "GitHub Primer",
      url: "https://github.com/primer/github-vscode-theme",
    },
  ),
  tinted(
    "everforest-light",
    "everforest-light-medium",
    "Everforest Light",
    {
      en: "The light Everforest scheme: a sky-blue accent and slate text on a soft cream-green background.",
      zh: "浅色的 Everforest 配色:天蓝色强调色,石板灰文字,柔和的奶油绿背景。",
    },
    ["everforest", "green", "light"],
    { name: "Everforest", url: "https://github.com/sainnhe/everforest" },
  ),
  tinted(
    "oxocarbon-light",
    "oxocarbon-light",
    "Oxocarbon Light",
    {
      en: "The light Oxocarbon scheme: a vivid IBM blue accent with slate text on a cool gray background.",
      zh: "浅色的 Oxocarbon 配色:鲜明的 IBM 蓝强调色,石板灰文字,冷灰色背景。",
    },
    ["oxocarbon", "blue", "light"],
    {
      name: "Oxocarbon",
      url: "https://github.com/nyoom-engineering/oxocarbon",
    },
  ),
  tinted(
    "vesper",
    "vesper",
    undefined,
    {
      en: "Vesper: a muted sage accent with peach warnings and gray text on a near-black base.",
      zh: "Vesper:低饱和的鼠尾草绿强调色,蜜桃色警告,灰色文字,基于近黑底。",
    },
    ["vesper", "minimal", "dark"],
    { name: "Vesper", url: "https://github.com/raunofreiberg/vesper" },
  ),
  tinted(
    "eldritch",
    "eldritch",
    undefined,
    {
      en: "Eldritch: a bright cyan accent with neon green success and yellow warnings on a dark purple-gray base.",
      zh: "Eldritch:亮青色强调色,搭配霓虹绿成功色和黄色警告,基于深紫灰底。",
    },
    ["eldritch", "cyan", "dark"],
    { name: "Eldritch", url: "https://github.com/eldritch-theme/eldritch" },
  ),
];

import { expect, test } from "@playwright/test";

test.describe("home", () => {
  test("renders the heading, navigation, and marketplace command", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Claude Code themes",
    );
    await expect(
      page.getByRole("navigation", { name: "Main" }).getByRole("link", {
        name: "Desktop themes",
      }),
    ).toBeVisible();
    await expect(
      page.getByText("/plugin marketplace add LinXiaoTao/themecc"),
    ).toBeVisible();
  });

  test("does not load analytics without a measurement id", async ({ page }) => {
    await page.goto("/");
    const scripts = await page
      .locator("script[src*='googletagmanager']")
      .count();
    expect(scripts).toBe(0);
  });

  test("has no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("i18n", () => {
  test("switches to Chinese and keeps the path", async ({ page }) => {
    await page.goto("/cli");
    await page
      .getByRole("navigation", { name: "Language" })
      .getByRole("link", { name: "中文" })
      .click();
    await expect(page).toHaveURL(/\/zh\/cli$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("CLI");
  });

  test("does not link to the redirecting /en prefix", async ({ page }) => {
    for (const path of ["/", "/zh", "/cli", "/themes/nord"]) {
      await page.goto(path);
      const hrefs = await page
        .locator("a[href]")
        .evaluateAll((links) =>
          links.map((link) => link.getAttribute("href") ?? ""),
        );
      const prefixed = hrefs.filter(
        (href) => href === "/en" || href.startsWith("/en/"),
      );
      expect(prefixed, path).toEqual([]);
    }
  });

  test("declares hreflang alternates and a canonical URL", async ({ page }) => {
    await page.goto("/zh/guides");
    const alternates = await page
      .locator("link[rel='alternate'][hreflang]")
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("hreflang")),
      );
    expect(alternates).toEqual(
      expect.arrayContaining(["en", "zh-Hans", "x-default"]),
    );
    await expect(page.locator("link[rel='canonical']")).toHaveAttribute(
      "href",
      /\/zh\/guides$/,
    );
  });

  test("keeps MDX links inside the current language", async ({ page }) => {
    await page.goto("/zh/guides/install-themes");
    const link = page.locator(".prose-content a[href*='mod-security']");
    await expect(link.first()).toHaveAttribute(
      "href",
      "/zh/guides/mod-security",
    );
  });
});

test.describe("themes", () => {
  test("filters the CLI list by appearance", async ({ page }) => {
    await page.goto("/cli");
    const results = page.locator("p[aria-live='polite']");
    const all = await results.textContent();
    await page.getByRole("button", { name: "Light", exact: true }).click();
    const light = await results.textContent();
    expect(light).not.toEqual(all);
    await expect(page.getByText("Catppuccin Latte").first()).toBeVisible();
    await expect(page.getByText("Catppuccin Mocha")).toHaveCount(0);
  });

  test("copies the install command from a CLI theme page", async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "clipboard permissions are Chromium only",
    );
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/themes/nord");
    const row = page
      .locator("code", { hasText: "/plugin install cli-nord@themecc" })
      .locator("..");
    await row.getByRole("button", { name: "Copy" }).click();
    await expect(row.getByRole("button", { name: "Copied" })).toBeVisible();
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toBe("/plugin install cli-nord@themecc");
  });

  test("shows the preview, permissions, and pinned commit for a desktop theme", async ({
    page,
  }) => {
    await page.goto("/themes/rainy-window");
    await expect(
      page.getByRole("heading", { name: "Permissions" }),
    ).toBeVisible();
    await expect(
      page.getByText("Not yet reviewed by a maintainer"),
    ).toBeVisible();
    await page.getByRole("button", { name: /Play preview/ }).click();
    await expect(page.locator("video")).toBeVisible();
  });

  for (const path of [
    "/themes/nord",
    "/zh/themes/rainy-window",
    "/cli",
    "/desktop",
    "/submit",
    "/guides/desktop-themes",
  ]) {
    test(`has no horizontal overflow on ${path}`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("emits valid JSON-LD on a theme page", async ({ page }) => {
    await page.goto("/themes/nord");
    const blocks = await page
      .locator("script[type='application/ld+json']")
      .allTextContents();
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) {
      expect(() => JSON.parse(block)).not.toThrow();
    }
  });
});

test.describe("site files", () => {
  test("serves a sitemap with every theme in both languages", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);
    const xml = await response.text();
    expect(xml).toContain("/themes/nord");
    expect(xml).toContain("/zh/themes/nord");
    expect(xml).toContain("hreflang");
  });

  test("declares an Open Graph image that resolves", async ({
    page,
    request,
  }) => {
    for (const path of ["/", "/zh", "/cli", "/themes/nord"]) {
      await page.goto(path);
      const content = await page
        .locator("meta[property='og:image']")
        .first()
        .getAttribute("content");
      expect(content, path).toContain("/og.png");
    }
    const image = await request.get("/og.png");
    expect(image.ok()).toBe(true);
    expect(image.headers()["content-type"]).toBe("image/png");
  });

  test("serves robots.txt that points at the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain("sitemap.xml");
  });

  test("returns 404 with a localized page for unknown paths", async ({
    page,
  }) => {
    const response = await page.goto("/zh/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "页面不存在",
    );
  });
});

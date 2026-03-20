import { expect, test, type Page } from "@playwright/test"

const desktopViewport = { width: 1440, height: 1200 }
const mobileViewport = { width: 390, height: 844 }

const routeCases = [
  {
    name: "home",
    path: "/",
    waitFor: async (page: Page) => {
      await page.getByRole("heading", { name: "John Munn", level: 1 }).waitFor()
    },
  },
  {
    name: "writing",
    path: "/writing",
    waitFor: async (page: Page) => {
      const loading = page.getByText("Loading...", { exact: true })
      if (await loading.isVisible().catch(() => false)) {
        await loading.waitFor({ state: "hidden" })
      }
      await page.getByRole("heading", { name: "Writing", level: 1 }).waitFor()
      await page.getByRole("list").first().waitFor()
    },
  },
  {
    name: "projects",
    path: "/projects",
    waitFor: async (page: Page) => {
      const loading = page.getByText("Loading projects...", { exact: true })
      if (await loading.isVisible().catch(() => false)) {
        await loading.waitFor({ state: "hidden" })
      }
      await page.getByRole("heading", { name: "Projects", level: 1 }).waitFor()
    },
  },
  {
    name: "series",
    path: "/series",
    waitFor: async (page: Page) => {
      await page.getByRole("heading", { name: "Series", level: 1 }).waitFor()
    },
  },
]

async function preparePage(page: Page, path: string, waitFor?: (page: Page) => Promise<void>) {
  await page.goto(path, { waitUntil: "domcontentloaded" })
  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }

      [data-next-badge-root],
      nextjs-portal,
      #__next-build-watcher,
      button[aria-label="Open Next.js Dev Tools"] {
        display: none !important;
      }
    `,
  })
  await page.evaluate(async () => {
    if ("fonts" in document) {
      await document.fonts.ready
    }
  })
  if (waitFor) {
    await waitFor(page)
  }
}

for (const viewport of [
  { label: "desktop", size: desktopViewport },
  { label: "mobile", size: mobileViewport },
]) {
  test.describe(`${viewport.label} routes`, () => {
    for (const routeCase of routeCases) {
      test(`${routeCase.name}`, async ({ page }) => {
        await page.setViewportSize(viewport.size)
        await preparePage(page, routeCase.path, routeCase.waitFor)
        await expect(page).toHaveScreenshot(`${routeCase.name}-${viewport.label}.png`, {
          fullPage: true,
          animations: "disabled",
        })
      })
    }
  })
}

test("home mobile menu", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await preparePage(page, "/", routeCases[0].waitFor)
  await page.getByRole("button", { name: "Toggle menu" }).click()
  await page.getByRole("dialog", { name: "Navigation Menu" }).waitFor()
  await expect(page).toHaveScreenshot("home-mobile-menu.png", {
    fullPage: true,
    animations: "disabled",
  })
})

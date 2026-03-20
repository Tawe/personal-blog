import { chromium, devices } from "playwright"

const baseUrl = "http://127.0.0.1:3000/interactive/scalar-vector-matrix-tensor"

function parseDimension(text) {
  const match = text.match(/([0-9]+(?:\.[0-9]+)?)D/)
  return match ? Number(match[1]) : null
}

async function sampleSlider(page) {
  const slider = page.locator('[aria-label="Dimensionality"]').first()
  await slider.scrollIntoViewIfNeeded()
  const box = await slider.boundingBox()
  if (!box) throw new Error("No bounding box for primary slider")

  const samples = []
  const y = box.y + box.height / 2
  const starts = [0.1, 0.25, 0.5, 0.75, 0.9]

  for (const ratio of starts) {
    const x = box.x + box.width * ratio
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 1, y, { steps: 8 })
    await page.mouse.up()
    const text = await page.getByText(/[0-9]+\.[0-9]D/, { exact: false }).first().textContent()
    samples.push({
      ratio,
      text,
      value: text ? parseDimension(text) : null,
      aria: await slider.inputValue(),
    })
  }

  return samples
}

async function runDesktop() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } })
  page.setDefaultTimeout(10000)

  const errors = []
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console:${msg.text()}`)
  })
  page.on("pageerror", (err) => errors.push(`pageerror:${err.message}`))

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" })
  await page.getByRole("heading", { name: /Scalar, vector, matrix, tensor/i }).waitFor()

  const sliderSamples = await sampleSlider(page)
  const tabs = ["Scalar", "Vector", "Matrix", "Tensor"]
  const tabStates = []

  for (const tab of tabs) {
    await page.getByRole("tab", { name: tab }).click()
    const activeModeText = await page.locator("text=/scalar|vector|matrix|tensor/i").nth(1).textContent().catch(() => null)
    tabStates.push({ tab, activeModeText })
  }

  const viewToggleText = await page.getByRole("button", { name: /show structure|show values/i }).first().textContent().catch(() => null)
  if (viewToggleText) {
    await page.getByRole("button", { name: /show structure|show values/i }).first().click()
  }

  const liveShape = await page.locator("text=/Live shape:/").textContent().catch(() => null)

  await browser.close()

  return {
    errors,
    sliderSamples,
    tabStates,
    liveShape,
    viewToggleText,
  }
}

async function runMobile() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({
    ...devices["iPhone 13"],
  })
  page.setDefaultTimeout(10000)

  const errors = []
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console:${msg.text()}`)
  })
  page.on("pageerror", (err) => errors.push(`pageerror:${err.message}`))

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" })
  await page.getByRole("heading", { name: /Scalar, vector, matrix, tensor/i }).waitFor()

  const sliderSamples = await sampleSlider(page)
  const viewportHeight = page.viewportSize()?.height ?? 0
  const toggleCount = await page.getByRole("button", { name: /show structure|show values/i }).count()
  const realWorldVisible = await page.getByText("Real-world mapping").isVisible().catch(() => false)
  const bottomCardVisible = await page.getByText("You don't learn new structures.").isVisible().catch(() => false)

  await browser.close()

  return {
    errors,
    sliderSamples,
    toggleCount,
    viewportHeight,
    realWorldVisible,
    bottomCardVisible,
  }
}

const desktop = await runDesktop()
const mobile = await runMobile()

console.log(JSON.stringify({ desktop, mobile }, null, 2))

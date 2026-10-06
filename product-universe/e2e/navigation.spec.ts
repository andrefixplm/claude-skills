import { expect, test } from "@playwright/test";

// Fluxos do TEST_PLAN.md. Navegação pelo equivalente HTML (independe do WebGL).
test("Universe → SOLIDWORKS → Design → Premium → Demo", async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Transforme ideias");

  if (isMobile) await page.getByRole("link", { name: /Explorar SOLIDWORKS/ }).click();
  else await page.getByRole("list", { name: "Ecossistemas" }).getByRole("link", { name: /SOLIDWORKS/ }).click();
  await expect(page).toHaveURL(/\/solutions\/solidworks$/);

  await page.getByRole("link", { name: /^Design/ }).click();
  await expect(page).toHaveURL(/\/solutions\/solidworks\/design$/);

  await page.getByRole("link", { name: /SOLIDWORKS Design Premium/ }).click();
  await expect(page).toHaveURL(/\/solutions\/solidworks\/design\/premium$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("SOLIDWORKS Design Premium");
  await expect(page).toHaveTitle(/SOLIDWORKS Design Premium/);

  await page.getByRole("complementary").getByRole("button", { name: "Solicitar demonstração" }).click();
  await expect(page.getByRole("dialog", { name: "Solicitar demonstração" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("Back: Esc e breadcrumb sobem níveis; deep link direto funciona", async ({ page }) => {
  await page.goto("/solutions/3dexperience/governance");
  await expect(page.getByText("Change", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/solutions\/3dexperience$/);
  await page.getByRole("link", { name: /Voltar ao universo/ }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("fallback 2D sem WebGL mantém a navegação", async ({ page }) => {
  await page.goto("/solutions/solidworks?webgl=0");
  await expect(page.getByTestId("fallback-2d")).toBeVisible();
  await expect(page.getByRole("link", { name: /^Design/ })).toBeVisible();
});

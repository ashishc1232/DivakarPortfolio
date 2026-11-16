import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { App } from "@/App";

it("renders the full portfolio with all five film sequences and provider links", () => {
  const html = renderToStaticMarkup(<App />);
  const doc = new DOMParser().parseFromString(html, "text/html");
  expect(doc.querySelectorAll(".cinema")).toHaveLength(5);
  expect(doc.querySelector("#contact")).toBeTruthy();
  expect(new Set([...doc.querySelectorAll(".cinema .film-source")].map((a) => a.getAttribute("href"))).size).toBe(10);
});

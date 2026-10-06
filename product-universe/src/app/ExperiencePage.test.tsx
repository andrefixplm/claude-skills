import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useUniverse } from "../store/universe";
import { AppRoutes } from "./App";

// jsdom não possui WebGL: a página deve renderizar o fallback 2D com o mesmo conteúdo.
const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );

beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
  HTMLCanvasElement.prototype.getContext = (() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

afterEach(() => useUniverse.setState({ lead: null }));

describe("ExperiencePage", () => {
  it("universo: hero e os três ecossistemas como links HTML (equivalente acessível)", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Transforme ideias");
    const list = screen.getByRole("list", { name: "Ecossistemas" });
    const links = within(list).getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/solutions/solidworks",
      "/solutions/3dexperience",
      "/solutions/delmia",
    ]);
    expect(screen.getByTestId("fallback-2d")).toBeInTheDocument();
  });

  it("deep link de produto: painel, breadcrumb e aviso de validação", () => {
    renderAt("/solutions/solidworks/design/premium");
    expect(screen.getByRole("heading", { level: 1, name: "SOLIDWORKS Design Premium" })).toBeInTheDocument();
    const crumbs = screen.getByRole("navigation", { name: "Navegação estrutural" });
    expect(within(crumbs).getByText("Premium")).toHaveAttribute("aria-current", "page");
    expect(within(crumbs).getByRole("link", { name: "Design" })).toHaveAttribute("href", "/solutions/solidworks/design");
    expect(screen.getByRole("note")).toHaveTextContent("Conteúdo em validação");
    expect(screen.getByRole("link", { name: "SOLIDWORKS Design Ultimate" })).toBeInTheDocument();
  });

  it("domínio sem produtos mostra capacidades e estado de curadoria", () => {
    renderAt("/solutions/3dexperience/governance");
    expect(screen.getByText(/em curadoria/)).toBeInTheDocument();
    expect(screen.getByText("Change")).toBeInTheDocument();
  });

  it("slug inválido redireciona para o nível válido", () => {
    renderAt("/solutions/solidworks/nao-existe");
    expect(screen.getByRole("heading", { level: 1, name: "SOLIDWORKS" })).toBeInTheDocument();
  });

  it("CTA de demonstração abre o formulário com validação", () => {
    renderAt("/solutions/solidworks/design/premium");
    fireEvent.click(screen.getAllByRole("button", { name: "Solicitar demonstração" })[0]!);
    const dialog = screen.getByRole("dialog", { name: "Solicitar demonstração" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Enviar solicitação" }));
    expect(within(dialog).getByText("Informe um e-mail válido.")).toBeInTheDocument();
  });
});

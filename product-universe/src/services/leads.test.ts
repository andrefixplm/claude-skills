import { readUtm, validateLead } from "./leads";

describe("lead", () => {
  const valid = { name: "Ana", company: "ACME", email: "ana@acme.com", phone: "", interest: "Design" };

  it("aceita o formulário mínimo (telefone opcional)", () => {
    expect(validateLead(valid)).toEqual({});
  });

  it("rejeita campos obrigatórios inválidos", () => {
    const errors = validateLead({ name: "", company: "", email: "x", phone: "abc", interest: "" });
    expect(Object.keys(errors).sort()).toEqual(["company", "email", "interest", "name", "phone"]);
  });

  it("extrai apenas parâmetros utm_*", () => {
    expect(readUtm("?utm_source=linkedin&foo=1&utm_campaign=sw")).toEqual({ utm_source: "linkedin", utm_campaign: "sw" });
  });
});

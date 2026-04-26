import { useState } from "react";

const initialState = {
  nome: "",
  nascimento: "",
  telefone: "",
  posicao: "linha",
  ativo: true,
  senha: "",
  foto_url: "",
};

export default function PlayerForm({ onSubmit, editingPlayer, onCancel, mode = "admin" }) {
  const isSelfEdit = mode === "self";
  const [form, setForm] = useState(
    editingPlayer
      ? {
          nome: editingPlayer.nome,
          nascimento: editingPlayer.nascimento || "",
          telefone: editingPlayer.telefone || "",
          posicao: editingPlayer.posicao,
          ativo: editingPlayer.ativo,
          senha: "",
          foto_url: editingPlayer.foto || "",
        }
      : initialState
  );

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "senha" && !value) {
        return;
      }
      payload.append(key, String(value));
    });
    await onSubmit(payload);
    setForm(initialState);
  }

  return (
    <form onSubmit={handleSubmit} className="panel grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
      <input className="field" placeholder="Nome" value={form.nome} onChange={(e) => update("nome", e.target.value)} required />
      <input className="field" type="date" value={form.nascimento} onChange={(e) => update("nascimento", e.target.value)} />
      <input className="field" placeholder="Telefone" value={form.telefone} onChange={(e) => update("telefone", e.target.value)} />
      {!isSelfEdit ? (
        <select className="field" value={form.posicao} onChange={(e) => update("posicao", e.target.value)}>
          <option value="linha">Linha</option>
          <option value="goleiro">Goleiro</option>
        </select>
      ) : null}
      {!isSelfEdit ? (
        <select className="field" value={String(form.ativo)} onChange={(e) => update("ativo", e.target.value === "true")}>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      ) : null}
      <input
        className="field"
        type="password"
        placeholder={editingPlayer ? "Nova senha de acesso (opcional)" : "Senha de acesso"}
        value={form.senha}
        onChange={(e) => update("senha", e.target.value)}
      />
      <input
        className="field"
        type="url"
        placeholder="URL da foto (opcional)"
        value={form.foto_url}
        onChange={(e) => update("foto_url", e.target.value)}
      />
      <div className="flex gap-3 md:col-span-2 xl:col-span-3">
        <button className="button-primary" type="submit">
          {editingPlayer ? (isSelfEdit ? "Salvar meus dados" : "Salvar jogador") : "Cadastrar jogador"}
        </button>
        {editingPlayer ? (
          <button type="button" className="button-secondary" onClick={onCancel}>
            Cancelar edição
          </button>
        ) : null}
      </div>
    </form>
  );
}

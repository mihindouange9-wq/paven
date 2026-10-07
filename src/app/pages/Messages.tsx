import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Send } from "lucide-react";
import { Country, Label, Monogram } from "../../components/ui";
import { companyById, CONVERSATIONS, USER } from "../../data/mock";
import type { Conversation, Message } from "../../data/types";

export function Component() {
  const [params] = useSearchParams();
  const avec = params.get("avec");
  const initial = CONVERSATIONS.find((c) => c.with === avec) ?? CONVERSATIONS[0];
  const [convos, setConvos] = useState<Conversation[]>(() => {
    if (avec && !CONVERSATIONS.find((c) => c.with === avec)) {
      const c = companyById(avec);
      return [{ id: `c-${avec}`, with: avec, subject: `Nouvelle conversation avec ${c.name}`, messages: [], unread: 0 }, ...CONVERSATIONS];
    }
    return CONVERSATIONS;
  });
  const [currentId, setCurrentId] = useState(avec && !CONVERSATIONS.find((c) => c.with === avec) ? `c-${avec}` : initial.id);
  const [draft, setDraft] = useState("");
  const current = useMemo(() => convos.find((c) => c.id === currentId)!, [convos, currentId]);
  const other = companyById(current.with);

  const send = () => {
    if (!draft.trim()) return;
    const msg: Message = { id: String(Date.now()), from: USER.company, text: draft.trim(), at: new Date().toISOString().slice(0, 16) };
    setConvos((all) => all.map((c) => (c.id === current.id ? { ...c, messages: [...c.messages, msg], unread: 0 } : c)));
    setDraft("");
  };
  const when = (at: string) => new Date(at).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <header className="page-head"><h1>Messages</h1><p>Des conversations privées entre deux entreprises. Un Deal Room se crée dès qu'un échange avance.</p></header>
      <div className="two-col" style={{ gridTemplateColumns: undefined }}>
        <section className="panel" aria-label="Conversation">
          <div className="panel__head">
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}><Monogram company={other} /><div><strong style={{ fontFamily: "var(--font-ui)" }}>{other.name}</strong><br /><span className="company-row__meta"><Country code={other.country} /> · {current.subject}</span></div></div>
          </div>
          <div className="panel__body">
            <div className="thread" aria-live="polite">
              {current.messages.length ? current.messages.map((m) => (
                <div key={m.id} className={`msg ${m.from === USER.company ? "msg--me" : ""}`}>
                  <span className="msg__meta">{m.from === USER.company ? USER.name : other.name} · {when(m.at)}</span>
                  <p className="msg__text">{m.text}</p>
                </div>
              )) : <p className="pipeline__empty">Aucun message encore. Présentez votre entreprise et ce que vous cherchez : c'est ce que {other.name} lira en premier.</p>}
            </div>
            <form className="compose" onSubmit={(e) => { e.preventDefault(); send(); }}>
              <input className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`Écrire à ${other.name}`} aria-label="Votre message" />
              <button type="submit" className="btn btn--primary" aria-label="Envoyer"><Send size={16} /></button>
            </form>
          </div>
        </section>
        <aside className="panel" aria-label="Conversations">
          <div className="panel__head"><Label strong>Conversations</Label><span className="label tabular">{convos.length}</span></div>
          <div className="convo-list">
            {convos.map((c) => { const k = companyById(c.with); return (
              <button key={c.id} type="button" className={`convo ${c.id === currentId ? "is-on" : ""}`} onClick={() => setCurrentId(c.id)} aria-current={c.id === currentId ? "true" : undefined}>
                <strong>{k.name}</strong><span>{c.subject}</span>{c.unread && c.id !== currentId ? <span className="convo__unread">{c.unread} non lu{c.unread > 1 ? "s" : ""}</span> : null}
              </button>
            ); })}
          </div>
        </aside>
      </div>
    </>
  );
}

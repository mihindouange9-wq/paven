import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Country, Field, Label, Monogram, Stamp, Button } from "../../components/ui";
import { STAGES } from "../../content/fr";
import { companyById, CONVERSATIONS, DEAL_ROOMS, USER } from "../../data/mock";
import type { DealStage } from "../../data/types";
import { Stages } from "./DealRooms";

const ORDER: DealStage[] = ["discovery", "conversation", "evaluation", "negotiation", "partnership"];

export function Component() {
  const { id } = useParams();
  const room = DEAL_ROOMS.find((d) => d.id === id) ?? DEAL_ROOMS[0];
  const partner = companyById(room.companies[1]);
  const [stage, setStage] = useState<DealStage>(room.stage);
  const [tasks, setTasks] = useState(room.tasks);
  const [notes, setNotes] = useState(room.notes);
  const [note, setNote] = useState("");
  const convo = CONVERSATIONS.find((c) => c.id === room.conversation);
  const next = ORDER[Math.min(ORDER.indexOf(stage) + 1, ORDER.length - 1)];

  return (
    <>
      <header className="page-head">
        <Link to="/app/deal-rooms" className="label">← Deal Rooms</Link>
        <div className="page-head__row">
          <div className="profile-head">
            <Monogram company={partner} large />
            <div>
              <h1>{room.objective}</h1>
              <p className="profile-head__meta">Deal Room avec {partner.name} · <Country code={partner.country} /> · ouvert le {new Date(room.opened).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</p>
            </div>
          </div>
          <div style={{ display: "grid", justifyItems: "end", gap: "0.5rem" }}>
            <Stamp solid>{STAGES[stage]}</Stamp>
            {stage !== "partnership" ? <Button small onClick={() => setStage(next)}>Passer à « {STAGES[next]} »</Button> : null}
          </div>
        </div>
        <Stages stage={stage} />
      </header>

      <div className="two-col">
        <div style={{ display: "grid", gap: "1.75rem" }}>
          <section className="panel">
            <div className="panel__head"><Label strong>Tâches</Label><span className="label tabular">{tasks.filter((t) => t.done).length} / {tasks.length}</span></div>
            <div className="panel__body"><ul className="tasks">
              {tasks.map((t) => (
                <li key={t.id} className={`task ${t.done ? "is-done" : ""}`}>
                  <input type="checkbox" id={t.id} checked={t.done} onChange={() => setTasks((all) => all.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))} />
                  <label htmlFor={t.id} className="task__label">{t.label}</label>
                  <span className="task__meta">{companyById(t.owner).monogram}{t.due ? ` · ${new Date(t.due).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}` : ""}</span>
                </li>
              ))}
            </ul></div>
          </section>
          <section className="panel">
            <div className="panel__head"><Label strong>Conversation</Label>{convo ? <Link to={`/app/messages?avec=${partner.id}`} className="label">Ouvrir</Link> : null}</div>
            <div className="panel__body"><div className="thread">
              {convo?.messages.slice(-3).map((m) => (
                <div key={m.id} className={`msg ${m.from === USER.company ? "msg--me" : ""}`}><span className="msg__meta">{m.from === USER.company ? USER.name : partner.name}</span><p className="msg__text">{m.text}</p></div>
              ))}
            </div></div>
          </section>
        </div>
        <div style={{ display: "grid", gap: "1.75rem" }}>
          <section className="panel">
            <div className="panel__head"><Label strong>Documents</Label><span className="label tabular">{room.documents.length}</span></div>
            <div className="panel__body"><ul>
              {room.documents.map((d) => (
                <li key={d.id} className="doc"><span className="doc__kind">{d.kind}</span><div><strong>{d.name}</strong><span>{companyById(d.by)?.name ?? d.by} · {d.size} · {new Date(d.at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span></div>{d.signed ? <Stamp>Signé</Stamp> : <span className="label">—</span>}</li>
              ))}
            </ul></div>
          </section>
          <section className="panel">
            <div className="panel__head"><Label strong>Calendrier</Label></div>
            <div className="panel__body">
              {room.calendar.length ? room.calendar.map((c) => <Field key={c.date} label={new Date(c.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} value={c.label} />) : <p className="pipeline__empty">Aucun rendez-vous planifié.</p>}
            </div>
          </section>
          <section className="panel panel--dark">
            <div className="panel__head"><Label strong>Notes</Label></div>
            <div className="panel__body">
              <ul className="list-plain" style={{ marginBottom: "0.75rem" }}>{notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
              <form className="compose" onSubmit={(e) => { e.preventDefault(); if (note.trim()) { setNotes([...notes, note.trim()]); setNote(""); } }}>
                <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ajouter une note" aria-label="Nouvelle note" />
                <button type="submit" className="btn btn--light btn--small">Ajouter</button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

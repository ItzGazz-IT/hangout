import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, updateDoc, doc, limit, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PageHeader } from '../../components/layout/PageHeader';

type PendingHost = { uid: string; displayName: string; email: string; hostStatus?: string };
type PendingEvent = { id: string; title: string; city: string; status: string; venueName: string };

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [hosts, setHosts] = useState<PendingHost[]>([]);
  const [events, setEvents] = useState<PendingEvent[]>([]);

  async function loadData() {
    setLoading(true);
    try {
      const hostsQ = query(collection(db, 'users'), where('hostStatus', '==', 'pending'), limit(30));
      const hostSnap = await getDocs(hostsQ);
      setHosts(hostSnap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) })));

      const eventsQ = query(collection(db, 'events'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'), limit(30));
      const eventsSnap = await getDocs(eventsQ);
      setEvents(eventsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  async function approveHost(uid: string, approved: boolean) {
    await updateDoc(doc(db, 'users', uid), { hostStatus: approved ? 'approved' : 'rejected', role: approved ? 'host' : 'user' });
    await loadData();
  }

  async function approveEvent(id: string, approved: boolean) {
    await updateDoc(doc(db, 'events', id), { status: approved ? 'published' : 'rejected' });
    await loadData();
  }

  return (
    <div>
      <PageHeader title="Admin Dashboard" />
      <div className="px-4 py-4 flex flex-col gap-6">
        {loading ? (
          <p className="text-text-secondary text-center py-10">Loading…</p>
        ) : (
          <>
            <section>
              <h2 className="text-text-primary font-black text-base mb-3">Pending Hosts ({hosts.length})</h2>
              {hosts.length === 0 ? (
                <p className="text-text-muted text-sm">No pending host requests.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {hosts.map((host) => (
                    <div key={host.uid} className="bg-card border border-app-border rounded-xl p-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-text-primary font-bold text-sm">{host.displayName}</p>
                        <p className="text-text-secondary text-xs">{host.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => approveHost(host.uid, true)} className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg text-xs font-bold">Approve</button>
                        <button onClick={() => approveHost(host.uid, false)} className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-text-primary font-black text-base mb-3">Pending Events ({events.length})</h2>
              {events.length === 0 ? (
                <p className="text-text-muted text-sm">No pending events.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {events.map((event) => (
                    <div key={event.id} className="bg-card border border-app-border rounded-xl p-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-text-primary font-bold text-sm">{event.title}</p>
                        <p className="text-text-secondary text-xs">{event.venueName} · {event.city}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => approveEvent(event.id, true)} className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg text-xs font-bold">Approve</button>
                        <button onClick={() => approveEvent(event.id, false)} className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

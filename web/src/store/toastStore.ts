import { create } from 'zustand';
type ToastKind = 'success' | 'info' | 'error';
interface ToastState { message: string; kind: ToastKind; show: (message: string, kind?: ToastKind) => void; clear: () => void; }
export const useToastStore = create<ToastState>((set) => ({ message: '', kind: 'info', show: (message, kind='info') => { set({message,kind}); window.setTimeout(()=>set({message:''}),2800); }, clear:()=>set({message:''}) }));

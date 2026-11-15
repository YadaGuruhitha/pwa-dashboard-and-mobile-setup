'use client';

import { useCallback, useEffect, useState } from 'react';

export interface Farmer {
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  acres?: number;
  language?: string;
}

/** Shown when nobody is signed in, and for the demo login. */
export const DEMO_FARMER: Farmer = {
  name: 'Ramesh Gowda',
  phone: '9876543210',
  village: 'Rampur',
  district: 'Mandya',
  state: 'Karnataka',
  acres: 8.8,
};
export const DEMO_PASSWORD = 'krishi123';

const USERS_KEY = 'krishi-users';     // { [phone]: { farmer, hash } } - this browser only
const SESSION_KEY = 'krishi-session'; // phone of the signed-in farmer
const CHANGE_EVENT = 'krishi-session-change';

type UserMap = Record<string, { farmer: Farmer; hash: string }>;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export async function hashPassword(phone: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(`${phone}:${password}`);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return btoa(`${phone}:${password}`); // very old/insecure-context fallback
}

const normPhone = (p: string) => p.replace(/\D/g, '').slice(-10);

function notify() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Save a new account on this device and sign it in. */
export async function registerLocal(farmer: Farmer, password: string) {
  const phone = normPhone(farmer.phone);
  const users = read<UserMap>(USERS_KEY, {});
  users[phone] = { farmer: { ...farmer, phone }, hash: await hashPassword(phone, password) };
  write(USERS_KEY, users);
  write(SESSION_KEY, phone);
  notify();
}

/** Returns the farmer on success, or null if phone/password don't match anything. */
export async function loginLocal(rawPhone: string, password: string): Promise<Farmer | null> {
  const phone = normPhone(rawPhone);
  const users = read<UserMap>(USERS_KEY, {});
  const hash = await hashPassword(phone, password);
  let farmer: Farmer | null = null;
  if (users[phone] && users[phone].hash === hash) farmer = users[phone].farmer;
  else if (phone === DEMO_FARMER.phone && password === DEMO_PASSWORD) farmer = DEMO_FARMER;
  if (!farmer) return null;
  write(SESSION_KEY, phone);
  notify();
  return farmer;
}

export function logout() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
  notify();
}

export function updateFarmer(patch: Partial<Farmer>) {
  const phone = read<string | null>(SESSION_KEY, null);
  if (!phone) return;
  const users = read<UserMap>(USERS_KEY, {});
  if (users[phone]) {
    users[phone].farmer = { ...users[phone].farmer, ...patch };
    write(USERS_KEY, users);
    notify();
  }
}

export function getFarmer(): Farmer {
  if (typeof window === 'undefined') return DEMO_FARMER;
  const phone = read<string | null>(SESSION_KEY, null);
  if (!phone) return DEMO_FARMER;
  const users = read<UserMap>(USERS_KEY, {});
  return users[phone]?.farmer || (phone === DEMO_FARMER.phone ? DEMO_FARMER : DEMO_FARMER);
}

export function isSignedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!read<string | null>(SESSION_KEY, null);
}

/** Current farmer for components. Starts as demo on first render (avoids hydration mismatch), then loads the saved one. */
export function useFarmer() {
  const [farmer, setFarmer] = useState<Farmer>(DEMO_FARMER);
  const [signedIn, setSignedIn] = useState(false);
  const refresh = useCallback(() => { setFarmer(getFarmer()); setSignedIn(isSignedIn()); }, []);
  useEffect(() => {
    refresh();
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener(CHANGE_EVENT, refresh); window.removeEventListener('storage', refresh); };
  }, [refresh]);
  const first = farmer.name.trim().split(/\s+/)[0] || farmer.name;
  const initials = farmer.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || 'KJ';
  return { farmer, signedIn, firstName: first, initials };
}

/**
 * The translated greeting is "<hello>, Ramesh Gowda" in every language.
 * Keep the translated hello and swap in the signed-in farmer's name.
 */
export function personalGreeting(template: string, name: string): string {
  const i = Math.max(template.lastIndexOf(','), template.lastIndexOf('،'));
  return i === -1 ? `${template} ${name}` : `${template.slice(0, i + 1)} ${name}`;
}

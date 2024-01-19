import { DEFAULT_HOST, DEFAULT_PORT } from '@/data';
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

type Body = {
  dbName: string;
  login: string;
  password: string;
  port: number;
  host: string;
};

export async function POST(req: Request) {
  const { dbName, login, password, port, host }: Body = await req.json();

  const pool = new Pool({
    host: host ?? DEFAULT_HOST,
    database: dbName,
    port: port ?? DEFAULT_PORT,
    user: login,
    password: password,
  });

  console.log({ dbName });
  try {
    const client = await pool.connect();
    client.release();

    return NextResponse.json(
      { message: 'Połączenie z bazą danych zostało nawiązane!' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: 'Błąd połączenia z bazą danych' }, { status: 500 });
  } finally {
    await pool.end();
  }
}

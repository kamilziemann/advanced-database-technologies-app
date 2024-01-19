'use client';

import { Input } from '@/app/components';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { DEFAULT_HOST, DEFAULT_PORT } from '@/data';

type DbConnectForm = {
  host: string;
  dbName: string;
  login: string;
  password: string;
  port: string;
};

const TIME_TO_RESET_MUTATION = 5 * 1000;

export default function Home() {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const { register, handleSubmit } = useForm<DbConnectForm>({
    defaultValues: { host: DEFAULT_HOST, port: DEFAULT_PORT },
  });

  const mutation = useMutation({
    mutationFn: (body: DbConnectForm) => axios.post('/api/dbconnect', body),
  });

  const onSubmit: SubmitHandler<DbConnectForm> = (body) => mutation.mutate(body);

  useEffect(() => {
    if (mutation.isError || mutation.isSuccess) {
      timeoutId.current = setTimeout(() => {
        mutation.reset();
      }, TIME_TO_RESET_MUTATION);
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutation.isError, mutation.isSuccess]);

  return (
    <main className="bg-slate-800 min-h-screen flex justify-center items-start p-24">
      <form className="w-full max-w-xl  flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Host" {...register('host', { required: true })} required />
        <Input label="Nazwa bazy danych" {...register('dbName', { required: true })} required />
        <Input label="Numer portu" {...register('port', { required: true })} required />
        <Input label="Login" {...register('login', { required: true })} required />
        <Input
          label="Hasło"
          type="password"
          {...register('password', { required: true })}
          required
        />

        <div className="w-full self-end max-w-[200px] mt-4">
          {mutation.isPending ? (
            <button className="btn w-full">
              <span className="loading loading-spinner"></span>
              Łączenie...
            </button>
          ) : (
            <button type="submit" className="btn w-full">
              Połącz
            </button>
          )}
        </div>
        <div className="w-full mt-6">
          {mutation.isSuccess ? (
            <div role="alert" className="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Poprawnie połączona z bazą danych</span>
            </div>
          ) : null}
          {mutation.isError ? (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Wystąpił błąd podczas łączenia z bazą danych</span>
            </div>
          ) : null}
        </div>
      </form>
    </main>
  );
}

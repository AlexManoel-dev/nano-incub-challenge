import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Wallet } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />

            <main className="flex min-h-screen items-center justify-center bg-[#F5F7F8] px-6 py-16">
                <div className="w-full max-w-sm">
                    <div className="mb-6 flex flex-col items-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0E7C66]/10">
                            <Wallet className="h-6 w-6 text-[#0E7C66]" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-[#12161C]">Criar conta</h1>
                        <p className="mt-1 text-sm text-[#5B6472]">Preencha os dados abaixo para se cadastrar.</p>
                    </div>

                    <form onSubmit={submit} className="rounded-2xl border border-[#E3E7EA] bg-white p-6 shadow-sm">
                        <div className="mb-4">
                            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[#12161C]">
                                Nome
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Nome completo"
                                className="w-full rounded-lg border border-[#D6DAE0] px-3 py-2.5 text-sm text-[#12161C] placeholder:text-[#A2A9B2] focus:border-[#0E7C66] focus:ring-2 focus:ring-[#0E7C66]/20 focus:outline-none"
                            />
                            {errors.name && <p className="mt-1.5 text-sm text-[#B3261E]">{errors.name}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#12161C]">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="voce@empresa.com"
                                className="w-full rounded-lg border border-[#D6DAE0] px-3 py-2.5 text-sm text-[#12161C] placeholder:text-[#A2A9B2] focus:border-[#0E7C66] focus:ring-2 focus:ring-[#0E7C66]/20 focus:outline-none"
                            />
                            {errors.email && <p className="mt-1.5 text-sm text-[#B3261E]">{errors.email}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#12161C]">
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Senha"
                                className="w-full rounded-lg border border-[#D6DAE0] px-3 py-2.5 text-sm text-[#12161C] placeholder:text-[#A2A9B2] focus:border-[#0E7C66] focus:ring-2 focus:ring-[#0E7C66]/20 focus:outline-none"
                            />
                            {errors.password && <p className="mt-1.5 text-sm text-[#B3261E]">{errors.password}</p>}
                        </div>

                        <div className="mb-5">
                            <label htmlFor="password_confirmation" className="mb-1.5 block text-sm font-medium text-[#12161C]">
                                Confirmar senha
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirme a senha"
                                className="w-full rounded-lg border border-[#D6DAE0] px-3 py-2.5 text-sm text-[#12161C] placeholder:text-[#A2A9B2] focus:border-[#0E7C66] focus:ring-2 focus:ring-[#0E7C66]/20 focus:outline-none"
                            />
                            {errors.password_confirmation && <p className="mt-1.5 text-sm text-[#B3261E]">{errors.password_confirmation}</p>}
                        </div>

                        <button
                            type="submit"
                            tabIndex={5}
                            disabled={processing}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0E7C66] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B6553] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Criar conta
                        </button>
                    </form>

                    <p className="mt-5 text-center text-sm text-[#5B6472]">
                        Já tem uma conta?{' '}
                        <TextLink href={route('login')} tabIndex={6} className="font-semibold text-[#0E7C66] hover:underline">
                            Entrar
                        </TextLink>
                    </p>
                </div>
            </main>
        </>
    );
}